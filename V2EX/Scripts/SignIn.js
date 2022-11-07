// prettier-ignore
class Tool{constructor(title){const isNode='undefined'!==typeof module&&!!module.exports&&'node';const isQuanX='undefined'!==typeof $task&&'quanx';const ENV=isNode||isQuanX;this.ENV=ENV;this.title=title||'📣📣📣';this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`)}request(options){return this[`_${this.ENV}`]().request(options)}done(){return this[`_${this.ENV}`]().done()}notify(subTitle,detail){return this[`_${this.ENV}`]().notify([subTitle,detail])}getStore(key){return this[`_${this.ENV}`]().store.get(key)}setStore(key,value){return this[`_${this.ENV}`]().store.set(key,value)}log(value){console.log(`\n📔📔📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔📔📔\n`);try{console.log(`\n日志内容类型：${typeof value}`);if(typeof value!=='string'){if(typeof value==='object'){console.log(`\n${JSON.stringify(value)}`)}else{console.log(`\n${value}`)}}else{console.log(`\n${value}`)}}catch(error){console.log('\n================LOG ERROR================\n');console.log(`\n${error}`);console.log('\n');console.log(value)}console.log(`\n📔📔📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔📔📔\n`)}_node(){let{localStorage,axios,log,title}=this;if(!localStorage){let LocalStorage=require('node-localstorage').LocalStorage;const local=new LocalStorage('./store');localStorage=local;this.localStorage=local}if(!axios){const ax=require('axios');axios=ax;this.axios=ax}return{request:async options=>{try{const response=await axios(options);const{status,data}=response;log(`接口请求参数：${JSON.stringify(options)}\n接口响应结果：${JSON.stringify(response)}`);if(status!==200){return Promise.reject(response)}return Promise.resolve(data)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{options.filter(item=>!!item);log(`${title}\n${options.join('\n')}`)},store:{get:key=>{let value=localStorage.getItem(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}localStorage.setItem(key,value)}},done:()=>{log('Node done')}}}_quanx(){let{log,title}=this;return{request:async options=>{try{const response=await $task.fetch(options);const{statusCode,body}=response;log(`接口请求参数：${JSON.stringify(options)}\n接口响应结果：${JSON.stringify(response)}`);if(statusCode!==200){return Promise.reject(response)}return Promise.resolve(body)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{switch(options.length){case 1:$notify(title,options[0]);break;case 2:$notify(title,options[0],options[1]);break;default:break}},store:{get:key=>{let value=$prefs.valueForKey(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}$prefs.setValueForKey(value,key)}},done:()=>{log('Quanx done');$done()}}}}

const $ = new Tool('V2EX');

const V2EX_COOKIE = $.getStore('V2EX_COOKIE');

if (!V2EX_COOKIE) {
    $.notify(`Cookie读取失败！`, `请先打开重写，进入V2EX获取Cookie`);
    return $.done();
}

const method = 'GET';
const baseUrl = 'https://www.v2ex.com/mission/daily';
const headers = {
    'Accept-Encoding': `gzip, deflate, br`,
    Cookie: V2EX_COOKIE,
    Connection: `keep-alive`,
    Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
    Host: `www.v2ex.com`,
    'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
    Referer: 'https://www.v2ex.com/mission/daily',
    'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
};

getSigninInfo();

// 签到方法
async function getSignin(code) {
    try {
        const url = `${baseUrl}/redeem?once=${code}`;
        const reqBody = {};
        const myRequest = {
            url,
            method,
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
        if (res.indexOf('每日登录奖励已领取') > -1) {
            await getSigninInfo(true);
        } else {
            $.notify(`签到失败！`, `今天已签到`);
        }
        return $.done();
    } catch (error) {
        $.log(`Error：\n${JSON.stringify(error)}`);
        return $.done();
    }
}

// 获取签到信息
async function getSigninInfo(success) {
    try {
        const url = baseUrl;
        const reqBody = {};
        const myRequest = {
            url,
            method: 'GET',
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
        if (res.indexOf('每日登录奖励已领取') < 0) {
            const code = res.match(
                /<input[^>]*\/mission\/daily\/redeem\?once=(\d+)[^>]*>/
            )[1];
            await getSignin(code);
        } else {
            let continueDays = res.match(/已连续登录 (\d+?) 天/)[1];
            if (success) {
                $.notify(`签到成功！`, `已连续签到${continueDays}天`);
            } else {
                $.notify(`今日已签到！`, `已连续签到${continueDays}天`);
            }
            return $.done();
        }
    } catch (error) {
        $.log(`Error：\n${JSON.stringify(error)}`);
        return $.done();
    }
}
