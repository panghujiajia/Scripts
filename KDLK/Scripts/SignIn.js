// prettier-ignore
class Tool{constructor(title){const isNode='undefined'!==typeof module&&!!module.exports&&'node';const isQuanX='undefined'!==typeof $task&&'quanx';const ENV=isNode||isQuanX;this.ENV=ENV;this.title=title||'📣📣📣';this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`)}request(options){return this[`_${this.ENV}`]().request(options)}done(){return this[`_${this.ENV}`]().done()}notify(subTitle,detail){return this[`_${this.ENV}`]().notify([subTitle,detail])}getStore(key){return this[`_${this.ENV}`]().store.get(key)}setStore(key,value){return this[`_${this.ENV}`]().store.set(key,value)}log(value){console.log(`\n📔📔📔Log Start📔📔📔\n`);try{console.log(`日志内容类型：${typeof value}`);if(typeof value!=='string'){if(typeof value==='object'){console.log(JSON.stringify(value))}else{console.log(value)}}else{console.log(value)}}catch(error){console.log('\n================LOG ERROR================\n');console.log(error);console.log('\n');console.log(value)}console.log(`\n📔📔📔Log End📔📔📔\n`)}_node(){let{localStorage,axios,log,title}=this;if(!localStorage){let LocalStorage=require('node-localstorage').LocalStorage;const local=new LocalStorage('./store');localStorage=local;this.localStorage=local}if(!axios){const ax=require('axios');axios=ax;this.axios=ax}return{request:async options=>{try{log(`接口请求参数：${JSON.stringify(options)}`);const response=await axios(options);const{status,data}=response;log(`接口响应结果：${JSON.stringify(response)}`);if(status!==200){return Promise.reject(response)}return Promise.resolve(data)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{options.filter(item=>!!item);log(`${title}\n${options.join('\n')}`)},store:{get:key=>{let value=localStorage.getItem(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}localStorage.setItem(key,value)}},done:()=>{log('Node done')}}}_quanx(){let{log,title}=this;return{request:async options=>{try{log(`接口请求参数：${JSON.stringify(options)}`);const response=await $task.fetch(options);const{statusCode,body}=response;log(`接口响应结果：${JSON.stringify(response)}`);if(statusCode!==200){return Promise.reject(response)}return Promise.resolve(body)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{switch(options.length){case 1:$notify(title,options[0]);break;case 2:$notify(title,options[0],options[1]);break;default:break}},store:{get:key=>{let value=$prefs.valueForKey(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}$prefs.setValueForKey(value,key)}},done:()=>{log('Quanx done');$done()}}}}

const $ = new Tool('凯迪拉克');

const KDLK_STORE_COOKIE = $.getStore('KDLK_STORE_COOKIE');

if (!KDLK_STORE_COOKIE) {
    $.notify(`Cookie读取失败！`, `请先打开重写，进入APP-商城页面获取Cookie`);
    return $.done();
}

const method = 'POST';
const baseUrl = 'https://cadillac-club.mysgm.com.cn/touch/control';
const headers = {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    Cookie: KDLK_STORE_COOKIE,
    Referer: 'https://cadillac-club.mysgm.com.cn/touch/control/signin',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
};

getSigninInfo();

// 签到方法
async function getSignin() {
    try {
        const url = `${baseUrl}/signinAsync`;
        const reqBody = {};
        const myRequest = {
            url,
            method,
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
        const { code, msg } = JSON.parse(res);
        if (code === '200') {
            await getSigninInfo(true);
        } else {
            $.notify(`签到失败！`, `失败原因：${msg}`);
        }
    } catch (error) {
        $.log(`Error：\n${error}`);
        return $.done();
    }
}

// 获取签到信息
async function getSigninInfo(success) {
    try {
        const url = `${baseUrl}/checkSigninShowIndex`;
        const reqBody = {};
        const myRequest = {
            url,
            method,
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
        const {
            signinData: { continuousDay, signCount, signDatePoint },
            signin
        } = JSON.parse(res);
        if (signin === 'Y') {
            await getSignin();
        } else {
            const date = new Date();
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const d = date.getDate();
            $.log(`${y}-${m}-${d}`);
            let last = Object.values(signDatePoint).pop();

            if (success) {
                $.notify(
                    `签到成功！`,
                    `本次签到获得${last}积分，累计签到${signCount}天，已连续签到${continuousDay}天`
                );
            } else {
                $.notify(
                    `今日已签到！`,
                    `累计签到${signCount}天，已连续签到${continuousDay}天`
                );
            }
            return $.done();
        }
    } catch (error) {
        $.log(`Error：\n${error}`);
        return $.done();
    }
}
