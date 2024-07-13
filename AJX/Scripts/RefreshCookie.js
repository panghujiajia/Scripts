const $ = new Tool('安吉星');

const AJX_COOKIE = $.getStore('AJX_COOKIE');
const AJX_TOKEN = $.getStore('AJX_TOKEN');

!(async () => {
    if (!AJX_COOKIE || !AJX_TOKEN) {
        $.notify(
            `Cookie读取失败！`,
            `请先打开重写，进入APP-我的-今日签到获取Cookie`
        );
    } else {
        await refreshAppToken();
    }
})()
    .catch(error => $.log(`Error：\n${error}\n${JSON.stringify(error)}`))
    .finally(() => $.done());

async function refreshAppCookie() {
    const url = `https://www.onstar.com.cn/mssos/sos/credit/v1/getUserSignInit`;
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
        method: 'GET',
        headers: headers,
        body: JSON.stringify(body)
    };
    const res = await $.request(myRequest);
    const { bizCode } = JSON.parse(res);
    if (!bizCode || bizCode !== 'E0000') {
        $.notify(`Cookie刷新失败！`, res);
    }
}
async function refreshAppToken() {
    const url = `https://api.shanghaionstar.com/sos/mobileuser/v1/public/greetings/OWNER`;
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
        method: 'GET',
        headers: headers,
        body: JSON.stringify(body)
    };
    const res = await $.request(myRequest);
    if (res.indexOf('车况') < 0) {
        $.notify(`Cookie刷新失败！`, res);
    } else {
        await refreshAppCookie();
    }
}

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",n="undefined"!=typeof $httpClient&&"surge",o=e||s||n;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),r=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:n}=i(e);return 200!==s?(this.log(`响应错误：\n\n${n}\n\n${JSON.stringify(n)}`),Promise.reject(e)):(this.log("status：",s),this.log("body：",n),Promise.resolve(n))}catch(t){return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),Promise.reject(t)}if(n)return new Promise((e,s)=>{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:n}=t;$httpClient[n.toLowerCase()](t,(t,n,o)=>{if(t)return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),s(t);const{status:r}=i(n);return 200!==r?(this.log(`响应错误：\n\n${o}\n\n${JSON.stringify(o)}`),s(n)):e(o)})});if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:n,...o}=t,r=await s(n,o),{status:h}=i(r),a=o.headers.contentType,g="text/html"===a?await r.text():await r.json();return 200!==h?(this.log(`响应错误：\n\n${g}\n\n${JSON.stringify(g)}`),Promise.reject(g)):Promise.resolve(g)}catch(t){return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||n)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",o="")=>{s&&$notify(this.title,t,o),n&&$notification.post(this.title,t,o),e&&this.log(`${this.title}\n${t}\n${o}`)}),this.getStore=(t=>{if(s)return r(t,$prefs.valueForKey(t));if(n)return r(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let n=e.getItem(t);return r(t,n)}}),this.setStore=((t,o)=>{if("object"==typeof o&&(o=JSON.stringify(o)),s&&$prefs.setValueForKey(o,t),n&&$persistentStore.write(o,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,o)}}),this.log(`脚本应用：${this.title}\n脚本环境：${o}`)}
