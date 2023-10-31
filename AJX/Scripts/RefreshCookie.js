const $ = new Tool('安吉星');

const AJX_COOKIE = $.getStore('AJX_COOKIE');
const AJX_TOKEN = $.getStore('AJX_TOKEN');

if (!AJX_COOKIE || !AJX_TOKEN) {
    $.notify(
        `Cookie读取失败！`,
        `请先打开重写，进入APP-我的-今日签到获取Cookie`
    );
    $.done();
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
        $.done();
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        $.notify(`Cookie刷新失败！`, JSON.stringify(error));
        $.done();
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
            $.done();
        } else {
            await refreshAppCookie();
        }
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        $.notify(`Cookie刷新失败！`, JSON.stringify(error));
        $.done();
    }
}

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",s="undefined"!=typeof $httpClient&&"surge",r=e||o||s;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=t=>{$.log(t);try{t=JSON.parse(t)}catch(e){return t}},a=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}),this.request=(async t=>{if(o)try{const e=await $task.fetch(t),{status:o,body:s}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(s)return new Promise((e,o)=>{const{method:s}=t;$httpClient[s.toLowerCase()](t,(t,s,r)=>{if(t)return o(t);const{status:n}=i(s);return 200!==n?o(s):e(r)})});if(e){const{localStorage:e,fetch:o}=a();try{const{url:e,...s}=t,r=await o(e,s),{status:n}=i(r),a=s.headers.contentType,l="text/html"===a?await r.text():await r.json();return 200!==n?Promise.reject(l):Promise.resolve(l)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}}),this.done=(t=>{(o||s)&&$done({res:t}),e&&this.log({res:t})}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{o&&$notify(this.title,t,r),s&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(o)return n($prefs.valueForKey(t));if(s)return n($persistentStore.read(t));if(e){const{localStorage:e,fetch:o}=a();let s=e.getItem(t);return n(s)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),o&&$prefs.setValueForKey(r,t),s&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:o}=a();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
