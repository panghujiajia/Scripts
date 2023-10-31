const $ = new Tool('V2EX');

const V2EX_COOKIE = $.getStore('V2EX_COOKIE');

if (!V2EX_COOKIE) {
    $.notify(`Cookie读取失败！`, `请先打开重写，进入V2EX获取Cookie`);
    $.done();
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
            $.notify(`❗️❗️❗️签到失败！`, `今天已签到`);
        }
        $.done();
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        $.done();
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
                $.notify(`🎉🎉🎉签到成功！`, `已连续签到${continueDays}天`);
            } else {
                $.notify(
                    `❗️❗️❗️今日已签到！`,
                    `已连续签到${continueDays}天`
                );
            }
            $.done();
        }
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        $.done();
    }
}

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",s="undefined"!=typeof $httpClient&&"surge",r=e||o||s;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=t=>{$.log(t);try{t=JSON.parse(t)}catch(e){return t}},a=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}),this.request=(async t=>{if(o)try{const e=await $task.fetch(t),{status:o,body:s}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(s)return new Promise((e,o)=>{const{method:s}=t;$httpClient[s.toLowerCase()](t,(t,s,r)=>{if(t)return o(t);const{status:n}=i(s);return 200!==n?o(s):e(r)})});if(e){const{localStorage:e,fetch:o}=a();try{const{url:e,...s}=t,r=await o(e,s),{status:n}=i(r),a=s.headers.contentType,l="text/html"===a?await r.text():await r.json();return 200!==n?Promise.reject(l):Promise.resolve(l)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}}),this.done=(t=>{(o||s)&&$done({res:t}),e&&this.log({res:t})}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{o&&$notify(this.title,t,r),s&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(o)return n($prefs.valueForKey(t));if(s)return n($persistentStore.read(t));if(e){const{localStorage:e,fetch:o}=a();let s=e.getItem(t);return n(s)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),o&&$prefs.setValueForKey(r,t),s&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:o}=a();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
