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

refreshAppToken();

async function refreshAppCookie() {
    try {
        const url = `https://www.onstar.com.cn/mssos/sos/credit/v1/getUserSignInit`;
        const method = `GET`;
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
        const body = ``;
        const myRequest = {
            url: url,
            method: method,
            headers: headers,
            body: JSON.stringify(body)
        };
        const res = await $.request(myRequest);
        const { bizCode } = JSON.parse(res);
        if (!bizCode || bizCode !== 'E0000') {
            $.notify(`Cookie刷新失败！`, res);
        }
        return $.done();
    } catch (error) {
        $.log(`Error：\n${error}`);
        return $.done();
    }
}
async function refreshAppToken() {
    try {
        const url = `https://api.shanghaionstar.com/sos/mobileuser/v1/public/greetings/OWNER`;
        const method = `GET`;
        const headers = {
            'client-info': `IPHONE_LARGE_16.1_100100_zh-CN_iPhone14,3_w9tZVO22q9XO8uHzOgqKyQ==`,
            accept: `application/json`,
            authorization: `Bearer ${AJX_TOKEN}`,
            'x-b3-traceid': `ad643423c5e4b6d4`,
            'x-b3-spanid': `ad643423c5e4b6d4`,
            'accept-language': `zh-CN`,
            'accept-encoding': `gzip`,
            host: `api.shanghaionstar.com`,
            'user-agent': `Dart/2.13 (dart:io)`,
            'client-trace-id': `bbfd52e0-5b3c-11ed-a6df-1d9338d3d9fb|MYCDL013650309|1843C130F0E`,
            'x-b3-parentspanid': `ad643423c5e4b6d4`,
            'x-b3-sampled': `1`
        };
        const body = ``;
        const myRequest = {
            url: url,
            method: method,
            headers: headers,
            body: JSON.stringify(body)
        };
        const res = await $.request(myRequest);
        if (res.indexOf('车况') < 0) {
            $.notify(`Cookie刷新失败！`, res);
            return $.done();
        } else {
            await refreshAppCookie();
        }
    } catch (error) {
        $.log(`Error：\n${error}`);
        return $.done();
    }
}
