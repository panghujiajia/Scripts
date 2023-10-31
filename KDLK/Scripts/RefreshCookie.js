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
    $.done();
}

refreshAppToken();
async function refreshAppToken() {
    try {
        const url = `https://app.sgmlink.com:443/service/mycadillacv3/rest/api/public/auth/v3/refreshToken`;
        const method = `POST`;
        const { idpUserId, deviceId, client_id, phone } =
            JSON.parse(KDLK_APP_HEARDERS);

        $.log(KDLK_APP_HEARDERS);
        $.log(idpUserId);
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
            userName: idpUserId
        };
        $.log(body);
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
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        $.done();
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
        $.done();
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        $.done();
    }
}

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",s="undefined"!=typeof $httpClient&&"surge",r=e||o||s;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=t=>{try{return JSON.parse(t)}catch(e){return t}},a=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}),this.request=(async t=>{if(o)try{const e=await $task.fetch(t),{status:o,body:s}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(s)return new Promise((e,o)=>{const{method:s}=t;$httpClient[s.toLowerCase()](t,(t,s,r)=>{if(t)return o(t);const{status:n}=i(s);return 200!==n?o(s):e(r)})});if(e){const{localStorage:e,fetch:o}=a();try{const{url:e,...s}=t,r=await o(e,s),{status:n}=i(r),a=s.headers.contentType,c="text/html"===a?await r.text():await r.json();return 200!==n?Promise.reject(c):Promise.resolve(c)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}}),this.done=(t=>{(o||s)&&$done({res:t}),e&&this.log({res:t})}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{o&&$notify(this.title,t,r),s&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(o&&n($prefs.valueForKey(t)),s&&n($persistentStore.read(t)),e){const{localStorage:e,fetch:o}=a();let s=e.getItem(t);return n(s)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),o&&$prefs.setValueForKey(r,t),s&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:o}=a();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
