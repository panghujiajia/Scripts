const $ = new Tool('V2EX');

const V2EX_COOKIE = $.getStore('V2EX_COOKIE');

let method = 'GET';
let baseUrl = 'https://www.v2ex.com/mission/daily';
let headers = {
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

!(async () => {
    if (!V2EX_COOKIE) {
        $.notify(`Cookie读取失败！`, `请先打开重写，进入V2EX获取Cookie`);
    } else {
        await getSigninInfo();
    }
})()
    .catch(error => $.log(`Error：\n${error}\n${JSON.stringify(error)}`))
    .finally(() => $.done());

// 签到方法
async function getSignin(code) {
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
        $.notify(`❗️❗️❗️签到失败！`, `今天已签到`);
    }
}

// 获取签到信息
async function getSigninInfo(success) {
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
            $.notify(`🎉🎉🎉签到成功！`, `已连续签到${continueDays}天`);
        } else {
            $.notify(`❗️❗️❗️今日已签到！`, `已连续签到${continueDays}天`);
        }
    }
}

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",o="undefined"!=typeof $httpClient&&"surge",n=e||s||o;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),r=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:o}=i(e);return 200!==s?Promise.reject(e):(this.log("status：",s),this.log("body：",o),Promise.resolve(o))}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(o)return new Promise((e,s)=>{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:o}=t;$httpClient[o.toLowerCase()](t,(t,o,n)=>{if(t)return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),s(t);const{status:r}=i(o);return 200!==r?s(o):e(n)})});if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:o,...n}=t,r=await s(o,n),{status:a}=i(r),h=n.headers.contentType,c="text/html"===h?await r.text():await r.json();return 200!==a?Promise.reject(c):Promise.resolve(c)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||o)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",n="")=>{s&&$notify(this.title,t,n),o&&$notification.post(this.title,t,n),e&&this.log(`${this.title}\n${t}\n${n}`)}),this.getStore=(t=>{if(s)return r(t,$prefs.valueForKey(t));if(o)return r(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let o=e.getItem(t);return r(t,o)}}),this.setStore=((t,n)=>{if("object"==typeof n&&(n=JSON.stringify(n)),s&&$prefs.setValueForKey(n,t),o&&$persistentStore.write(n,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,n)}}),this.log(`脚本应用：${this.title}\n脚本环境：${n}`)}
