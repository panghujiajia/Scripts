const $ = new Tool('凯迪拉克');

const KDLK_APP_COOKIE = $.getStore('KDLK_APP_COOKIE');
const KDLK_APP_HEARDERS = $.getStore('KDLK_APP_HEARDERS');
const KDLK_APP_ACCESS_TOKEN = $.getStore('KDLK_APP_ACCESS_TOKEN');
const KDLK_APP_REFRESH_ACCESS_TOKEN = $.getStore(
    'KDLK_APP_REFRESH_ACCESS_TOKEN'
);
let KDLK_STORE_HEADERS = $.getStore('KDLK_STORE_HEADERS');

!(async () => {
    if (
        !KDLK_STORE_HEADERS ||
        !KDLK_APP_COOKIE ||
        !KDLK_APP_HEARDERS ||
        !KDLK_APP_ACCESS_TOKEN ||
        !KDLK_APP_REFRESH_ACCESS_TOKEN
    ) {
        $.notify(`Cookie读取失败！`, `请先打开重写，进入APP获取Cookie`);
    } else {
        await refreshAppTokenNew();
    }
})()
    .catch(error => $.log(`Error：\n\n${error}\n${JSON.stringify(error)}`))
    .finally(() => $.done());

// async function refreshAppToken() {
//     const url = `https://app.sgmlink.com:443/service/mycadillacv3/rest/api/public/auth/v3/refreshToken`;
//     const { idpUserId, deviceId, client_id, phone } = KDLK_APP_HEARDERS;
//
//     const headers = {
//         Connection: `keep-alive`,
//         'Accept-Encoding': `gzip, deflate, br`,
//         app_version: `6.2.0`,
//         'Content-Type': `application/json; charset=utf-8`,
//         appId: `MyCadillac`,
//         uuId: deviceId,
//         deviceId,
//         'X-Tingyun-Id': `4Nl_NnGbjwY;c=2;r=8936987;u=35e02d1754b727796a15156a1ad53435::BD4E4C616020FB61`,
//         'User-Agent': `MyCadillac_Mycadillac_IOS_V.6.2.0__release/6.2.0 (iPhone; iOS 16.0.3; Scale/3.00)`,
//         Cookie: KDLK_APP_COOKIE,
//         Host: `app.sgmlink.com:443`,
//         'Accept-Language': `zh-Hans-CN;q=1`,
//         Accept: `*/*`,
//         'X-Tingyun': `c=A|HYFIoSexPMs`
//     };
//     const body = {
//         permToken: KDLK_APP_REFRESH_ACCESS_TOKEN,
//         userName: idpUserId
//     };
//     const myRequest = {
//         url: url,
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(body)
//     };
//     const res = await $.request(myRequest);
//     if (!res) {
//         $.notify(`AppCookie刷新失败！`, res);
//         return $.done();
//     }
//     const {
//         resultCode,
//         data: { accessToken }
//     } = JSON.parse(res);
//     if (resultCode !== '0000') {
//         $.notify(`AppCookie刷新失败！`, res);
//     } else {
//         $.setStore('KDLK_APP_ACCESS_TOKEN', accessToken);
//     }
//     await getExchangeTicket();
// }

// 新的刷新cookie方法
async function refreshAppTokenNew() {
    const url = `https://cocm.mall.sgmsonline.com/api/bkm/auth/refreshToken`;
    const { idpUserId, deviceId, access_token } = KDLK_APP_HEARDERS;

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
        Host: `cocm.mall.sgmsonline.com`,
        'Accept-Language': `zh-Hans-CN;q=1`,
        Accept: `*/*`,
        'X-Tingyun': `c=A|HYFIoSexPMs`,
        access_token,
        Authorization: `Bearer ${KDLK_APP_REFRESH_ACCESS_TOKEN}`
    };
    const body = {};
    const myRequest = {
        url: url,
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    };
    const res = await $.request(myRequest);
    if (!res) {
        $.notify(`AppCookie刷新失败！`, res);
        return $.done();
    }
    const {
        statusCode,
        data: { userAccessToken, accessToken }
    } = JSON.parse(res);
    if (statusCode !== 200) {
        $.notify(`AppCookie刷新失败！`, res);
    } else {
        $.setStore('KDLK_APP_ACCESS_TOKEN', userAccessToken);
        $.setStore('KDLK_APP_REFRESH_ACCESS_TOKEN', accessToken);
    }
    await getExchangeTicket();
}

// 获取ticket
async function getExchangeTicket() {
    const url = `https://mycadillac.apps.sgmsonline.com/service/mycadillacv3/rest/api/private/vehicleMarket/getExchangeTicket`;
    const { idpUserId, deviceId, client_id, phone } = KDLK_APP_HEARDERS;
    const KDLK_APP_ACCESS_TOKEN = $.getStore('KDLK_APP_ACCESS_TOKEN');
    const headers = {
        'user-agent': 'Dart/2.19 (dart:io)',
        appid: 'MyCadillac',
        app_version: '7.5.2',
        'accept-encoding': 'gzip',
        uuid: 'C34D5C99-87CB-42B2-B26D-ABBACCD661DB', // 还不知道怎么来的，但是能用
        mobile_os: 'IOS:17.4',
        'content-type': 'application/json; charset=utf-8',
        tag: 'IOS',
        buid: idpUserId,
        mobile_model: 'iPhone15,3',
        client_id,
        access_token: KDLK_APP_ACCESS_TOKEN,
        'content-length': '2',
        host: 'mycadillac.apps.sgmsonline.com',
        mobile_brand: 'iPhone',
        idpuserid: idpUserId
    };
    const body = {};
    const myRequest = {
        url: url,
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    };
    const res = await $.request(myRequest);
    const {
        resultCode,
        data: { ticket }
    } = JSON.parse(res);
    if (resultCode !== '0000') {
        $.notify(`商城Cookie刷新失败！`, res);
    } else {
        $.setStore('KDLK_STORE_TICKET', ticket);
        await refreshStoreCookie();
    }
}

async function refreshStoreCookie() {
    const KDLK_STORE_TICKET = $.getStore('KDLK_STORE_TICKET');
    const { idpUserId, deviceId, phone } = KDLK_APP_HEARDERS;
    const url = `https://cocm.mall.sgmsonline.com/api/bkm/auth/login/ticket?idpUserId=${idpUserId}&ticket=${KDLK_STORE_TICKET}&b2cgw=1`;
    const { Cookie, Authorization, access_token, client_id } =
        KDLK_STORE_HEADERS;
    const headers = {
        Host: 'cocm.mall.sgmsonline.com',
        Cookie,
        Connection: 'keep-alive',
        Accept: 'application/json, text/plain, */*',
        Authorization,
        'Sec-Fetch-Site': 'same-origin',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Sec-Fetch-Mode': 'cors',
        access_token,
        Origin: 'https://cocm.mall.sgmsonline.com',
        'User-Agent':
            'mycadillac_app_new Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        client_id: client_id,
        'channel-code': 'COCM',
        Referer: `https://cocm.mall.sgmsonline.com/?hideTitleBar=1&hideBar=1&idpUserId=${idpUserId}&ticket=${KDLK_STORE_TICKET}&clientCode=MycadillacApp`,
        'Content-Length': '0',
        idpUserId: idpUserId,
        'Sec-Fetch-Dest': 'empty'
    };
    const myRequest = {
        url: url,
        method: 'POST',
        headers: headers
    };
    const res = await $.request(myRequest);
    const {
        statusCode,
        data: { userAccessToken, accessToken }
    } = JSON.parse(res);
    if (statusCode !== 200) {
        $.notify(`商城Cookie刷新失败！`, res);
    } else {
        KDLK_STORE_HEADERS.access_token = userAccessToken;
        KDLK_STORE_HEADERS.Authorization = `Bearer ${accessToken}`;
        $.setStore('KDLK_STORE_HEADERS', KDLK_STORE_HEADERS);
    }
}

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",n="undefined"!=typeof $httpClient&&"surge",o=e||s||n;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),r=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:n}=i(e);return 200!==s?(this.log(`响应错误：\n\n${n}\n\n${JSON.stringify(n)}`),Promise.reject(e)):(this.log("status：",s),this.log("body：",n),Promise.resolve(n))}catch(t){return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),Promise.reject(t)}if(n)return new Promise((e,s)=>{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:n}=t;$httpClient[n.toLowerCase()](t,(t,n,o)=>{if(t)return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),s(t);const{status:r}=i(n);return 200!==r?(this.log(`响应错误：\n\n${o}\n\n${JSON.stringify(o)}`),s(n)):e(o)})});if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:n,...o}=t,r=await s(n,o),{status:h}=i(r),a=o.headers.contentType,g="text/html"===a?await r.text():await r.json();return 200!==h?(this.log(`响应错误：\n\n${g}\n\n${JSON.stringify(g)}`),Promise.reject(g)):Promise.resolve(g)}catch(t){return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||n)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",o="")=>{s&&$notify(this.title,t,o),n&&$notification.post(this.title,t,o),e&&this.log(`${this.title}\n${t}\n${o}`)}),this.getStore=(t=>{if(s)return r(t,$prefs.valueForKey(t));if(n)return r(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let n=e.getItem(t);return r(t,n)}}),this.setStore=((t,o)=>{if("object"==typeof o&&(o=JSON.stringify(o)),s&&$prefs.setValueForKey(o,t),n&&$persistentStore.write(o,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,o)}}),this.log(`脚本应用：${this.title}\n脚本环境：${o}`)}
