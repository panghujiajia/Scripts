// prettier-ignore
class Tool{constructor(title){const isNode='undefined'!==typeof module&&!!module.exports&&'node';const isQuanX='undefined'!==typeof $task&&'quanx';const ENV=isNode||isQuanX;this.ENV=ENV;this.title=title||'📣📣📣';this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`)}request(options){return this[`_${this.ENV}`]().request(options)}done(){return this[`_${this.ENV}`]().done()}notify(subTitle,detail){return this[`_${this.ENV}`]().notify([subTitle,detail])}getStore(key){return this[`_${this.ENV}`]().store.get(key)}setStore(key,value){return this[`_${this.ENV}`]().store.set(key,value)}log(value){console.log(`\n📔📔📔Log Start📔📔📔\n`);try{console.log(`日志内容类型：${typeof value}`);if(typeof value!=='string'){if(typeof value==='object'){console.log(JSON.stringify(value))}else{console.log(value)}}else{console.log(value)}}catch(error){console.log('\n================LOG ERROR================\n');console.log(error);console.log('\n');console.log(value)}console.log(`\n📔📔📔Log End📔📔📔\n`)}_node(){let{localStorage,axios,log,title}=this;if(!localStorage){let LocalStorage=require('node-localstorage').LocalStorage;const local=new LocalStorage('./store');localStorage=local;this.localStorage=local}if(!axios){const ax=require('axios');axios=ax;this.axios=ax}return{request:async options=>{try{log(`接口请求参数：${JSON.stringify(options)}`);const response=await axios(options);const{status,data}=response;log(`接口响应结果：${JSON.stringify(response)}`);if(status!==200){return Promise.reject(response)}return Promise.resolve(data)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{options.filter(item=>!!item);log(`${title}\n${options.join('\n')}`)},store:{get:key=>{let value=localStorage.getItem(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}localStorage.setItem(key,value)}},done:()=>{log('Node done')}}}_quanx(){let{log,title}=this;return{request:async options=>{try{log(`接口请求参数：${JSON.stringify(options)}`);const response=await $task.fetch(options);const{statusCode,body}=response;log(`接口响应结果：${JSON.stringify(response)}`);if(statusCode!==200){return Promise.reject(response)}return Promise.resolve(body)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{switch(options.length){case 1:$notify(title,options[0]);break;case 2:$notify(title,options[0],options[1]);break;default:break}},store:{get:key=>{let value=$prefs.valueForKey(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}$prefs.setValueForKey(value,key)}},done:()=>{log('Quanx done');$done()}}}}

const $ = new Tool('凯迪拉克');

const KDLK_STORE_COOKIE = $.getStore('KDLK_STORE_COOKIE');

const KDLK_APP_COOKIE = $.getStore('KDLK_APP_COOKIE');
const KDLK_APP_HEARDERS = $.getStore('KDLK_APP_HEARDERS');
const KDLK_APP_ACCESS_TOKEN = $.getStore('KDLK_APP_ACCESS_TOKEN');
const KDLK_APP_REFRESH_ACCESS_TOKEN = $.getStore(
    'KDLK_APP_REFRESH_ACCESS_TOKEN'
);

if (
    !KDLK_STORE_COOKIE ||
    !KDLK_APP_COOKIE ||
    !KDLK_APP_HEARDERS ||
    !KDLK_APP_ACCESS_TOKEN ||
    !KDLK_APP_REFRESH_ACCESS_TOKEN
) {
    $.notify(`Cookie读取失败！`, `请先打开重写，进入APP获取Cookie`);
    return $.done();
}

refreshAppToken();
async function refreshAppToken() {
    try {
        const url = `https://app.sgmlink.com:443/service/mycadillacv3/rest/api/public/auth/v3/refreshToken`;
        const method = `POST`;
        const { idpUserId, deviceId, client_id, phone } = KDLK_APP_HEARDERS;
        const headers = {
            Connection: `keep-alive`,
            'Accept-Encoding': `gzip, deflate, br`,
            app_version: `6.2.0`,
            'Content-Type': `application/json; charset=utf-8`,
            appId: `MyCadillac`,
            uuId: deviceId,
            deviceId,
            'X-Tingyun-Id': `4Nl_NnGbjwY;c=2;r=8936987;u=35e02d1754b727796a15156a1ad53435::BD4E4C616020FB61`,
            'User-Agent': `MyCadillac_Mycadillac_IOS_V.6.2.0__release/6.2.0 (iPhone; iOS 16.0.3; Scale/3.00)`,
            Cookie: KDLK_APP_COOKIE,
            Host: `app.sgmlink.com:443`,
            'Accept-Language': `zh-Hans-CN;q=1`,
            Accept: `*/*`,
            'X-Tingyun': `c=A|HYFIoSexPMs`
        };
        const body = {
            permToken: KDLK_APP_REFRESH_ACCESS_TOKEN,
            userName: phone
        };
        const myRequest = {
            url: url,
            method: method,
            headers: headers,
            body: JSON.stringify(body)
        };
        const res = await $.request(myRequest);
        const {
            resultCode,
            data: { accessToken }
        } = JSON.parse(res);
        if (resultCode !== '0000') {
            $.notify(`AppCookie刷新失败！`, res);
        } else {
            $.setStore('KDLK_APP_ACCESS_TOKEN', accessToken);
        }
        await refreshStoreCookie();
    } catch (error) {
        $.log(`Error：\n${error}`);
        return $.done();
    }
}

async function refreshStoreCookie() {
    try {
        const url = `https://cadillac-club.mysgm.com.cn/touch/control/checkUserLogin`;
        const method = `POST`;
        const headers = {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
            Cookie: KDLK_STORE_COOKIE,
            Referer: 'https://cadillac-club.mysgm.com.cn/touchs/index.html',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        };
        const body = {};
        const myRequest = {
            url: url,
            method: method,
            headers: headers,
            body: JSON.stringify(body)
        };
        const res = await $.request(myRequest);
        const { IS_LOGIN } = JSON.parse(res);
        if (!IS_LOGIN || IS_LOGIN !== 'Y') {
            $.notify(`商城Cookie刷新失败！`, res);
        }
        return $.done();
    } catch (error) {
        $.log(`Error：\n${error}`);
        return $.done();
    }
}
