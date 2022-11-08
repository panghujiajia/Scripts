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
        $.log(`Error：\n${JSON.stringify(error)}`);
        $.notify(`Cookie刷新失败！`, JSON.stringify(error));
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
        $.log(`Error：\n${JSON.stringify(error)}`);
        $.notify(`Cookie刷新失败！`, JSON.stringify(error));
        return $.done();
    }
}

// prettier-ignore
function Tool(t){return new class{constructor(t){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",n=e||o;this.ENV=n,this.title=t||"📣📣📣",this.log(`脚本应用：${this.title}\n脚本环境：${n}`)}request(t){return this[`_${this.ENV}`]().request(t)}done(){return this[`_${this.ENV}`]().done()}notify(t,e){return this[`_${this.ENV}`]().notify([t,e])}getStore(t){return this[`_${this.ENV}`]().store.get(t)}setStore(t,e){return this[`_${this.ENV}`]().store.set(t,e)}log(t){console.log("\n📔📔📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔📔📔\n");try{console.log(`\n日志内容类型：${typeof t}`),"string"!=typeof t&&"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}catch(e){console.log("\n================LOG ERROR================\n"),console.log(`\n${e}`),console.log("\n"),console.log(t)}console.log("\n📔📔📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔📔📔\n")}_node(){let{localStorage:t,fetch:e,log:o,title:n}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o,this.localStorage=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t,this.fetch=e}return{request:async t=>{try{const{url:n,...r}=t,s=await e(n,r),{status:i}=s,l=await s.json();return o(`接口请求参数：${JSON.stringify(t)}\n\n                            接口响应结果：${JSON.stringify(l)}`),200!==i?Promise.reject(l):Promise.resolve(l)}catch(t){return o(`接口响应错误：${JSON.stringify(t)}`),Promise.reject(t)}},notify:t=>{t.filter(t=>!!t),o(`${n}\n${t.join("\n")}`)},store:{get:e=>{let o=t.getItem(e);try{o=JSON.parse(o)}catch(t){}return o},set:(e,o)=>{"object"==typeof o&&(o=JSON.stringify(o)),t.setItem(e,o)}},done:()=>{o("Node done")}}}_quanx(){let{log:t,title:e}=this;return{request:async e=>{try{const o=await $task.fetch(e),{statusCode:n,body:r}=o;return t(`接口请求参数：${JSON.stringify(e)}\n\n                            接口响应结果：${JSON.stringify(o)}`),200!==n?Promise.reject(o):Promise.resolve(r)}catch(e){return t(`接口响应错误：${JSON.stringify(e)}`),Promise.reject(e)}},notify:t=>{switch(t.length){case 1:$notify(e,t[0]);break;case 2:$notify(e,t[0],t[1])}},store:{get:t=>{let e=$prefs.valueForKey(t);try{e=JSON.parse(e)}catch(t){}return e},set:(t,e)=>{"object"==typeof e&&(e=JSON.stringify(e)),$prefs.setValueForKey(e,t)}},done:()=>{t("Quanx done"),$done()}}}}(t)}

