// prettier-ignore
class Tool{constructor(title){const isNode='undefined'!==typeof module&&!!module.exports&&'node';const isQuanX='undefined'!==typeof $task&&'quanx';const ENV=isNode||isQuanX;this.ENV=ENV;this.title=title||'📣📣📣';this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`)}request(options){return this[`_${this.ENV}`]().request(options)}done(){return this[`_${this.ENV}`]().done()}notify(subTitle,detail){return this[`_${this.ENV}`]().notify([subTitle,detail])}getStore(key){return this[`_${this.ENV}`]().store.get(key)}setStore(key,value){return this[`_${this.ENV}`]().store.set(key,value)}log(value){console.log(`\n📔📔📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔📔📔\n`);try{console.log(`\n日志内容类型：${typeof value}`);if(typeof value!=='string'){if(typeof value==='object'){console.log(`\n${JSON.stringify(value)}`)}else{console.log(`\n${value}`)}}else{console.log(`\n${value}`)}}catch(error){console.log('\n================LOG ERROR================\n');console.log(`\n${error}`);console.log('\n');console.log(value)}console.log(`\n📔📔📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔📔📔\n`)}_node(){let{localStorage,axios,log,title}=this;if(!localStorage){let LocalStorage=require('node-localstorage').LocalStorage;const local=new LocalStorage('./store');localStorage=local;this.localStorage=local}if(!axios){const ax=require('axios');axios=ax;this.axios=ax}return{request:async options=>{try{const response=await axios(options);const{status,data}=response;log(`接口请求参数：${JSON.stringify(options)}\n接口响应结果：${JSON.stringify(response)}`);if(status!==200){return Promise.reject(response)}return Promise.resolve(data)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{options.filter(item=>!!item);log(`${title}\n${options.join('\n')}`)},store:{get:key=>{let value=localStorage.getItem(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}localStorage.setItem(key,value)}},done:()=>{log('Node done')}}}_quanx(){let{log,title}=this;return{request:async options=>{try{const response=await $task.fetch(options);const{statusCode,body}=response;log(`接口请求参数：${JSON.stringify(options)}\n接口响应结果：${JSON.stringify(response)}`);if(statusCode!==200){return Promise.reject(response)}return Promise.resolve(body)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{switch(options.length){case 1:$notify(title,options[0]);break;case 2:$notify(title,options[0],options[1]);break;default:break}},store:{get:key=>{let value=$prefs.valueForKey(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}$prefs.setValueForKey(value,key)}},done:()=>{log('Quanx done');$done()}}}}

const $ = new Tool('安吉星');

const AJX_COOKIE = $.getStore('AJX_COOKIE');
const AJX_TOKEN = $.getStore('AJX_TOKEN');

if (!AJX_COOKIE || !AJX_TOKEN) {
    $.notify(
        `Cookie读取失败！`,
        `请先打开重写，进入APP-我的-今日签到获取Cookie`
    );
    return $.done();
}

const method = 'POST';
const baseUrl = 'https://www.onstar.com.cn/mssos/sos/credit/v1/';
const headers = {
    Connection: `keep-alive`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Content-Type': `application/json`,
    Origin: `https://www.onstar.com.cn`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
    Authorization: AJX_TOKEN,
    Cookie: AJX_COOKIE,
    Host: `www.onstar.com.cn`,
    Referer: `https://www.onstar.com.cn/mweb/ma80/sharedProjects/index.html`,
    'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
    Accept: `*/*`
};

getSigninInfo();

// 签到方法
async function getSignin() {
    try {
        const url = `${baseUrl}/userSignIn`;
        const reqBody = {};
        const myRequest = {
            url,
            method,
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
        const { bizCode, bizMsg } = JSON.parse(res);
        if (bizCode !== 'E0000') {
            $.notify(`签到失败！`, `失败原因：${bizMsg}`);
        } else {
            await getSigninInfo(true);
        }
        return $.done();
    } catch (error) {
        $.log(`Error：\n${error}`);
        return $.done();
    }
}

// 获取签到信息
async function getSigninInfo(success) {
    try {
        const url = `${baseUrl}/getUserSignInit`;
        const reqBody = {};
        const myRequest = {
            url,
            method: 'GET',
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
        const {
            data: {
                currentSign,
                continueDays,
                signRanKing,
                currentYear,
                currentMonth,
                currentDay
            }
        } = JSON.parse(res);
        if (!currentSign) {
            await getSignin();
        } else {
            $.log(`${currentYear}-${currentMonth}-${currentDay}`);
            if (success) {
                $.notify(
                    `签到成功！`,
                    `已连续签到${continueDays}天，今日签到排名${signRanKing}`
                );
            } else {
                $.notify(
                    `今日已签到！`,
                    `已连续签到${continueDays}天，今日签到排名${signRanKing}`
                );
            }
            return $.done();
        }
    } catch (error) {
        $.log(`Error：\n${error}`);
        return $.done();
    }
}
