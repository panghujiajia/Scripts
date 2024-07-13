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
        await refreshAppToken();
    }
})()
    .catch(error => $.log(`Error：\n\n${error}\n${JSON.stringify(error)}`))
    .finally(() => $.done());

async function refreshAppToken() {
    const url = `https://app.sgmlink.com:443/service/mycadillacv3/rest/api/public/auth/v3/refreshToken`;
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
        userName: idpUserId
    };
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
        resultCode,
        data: { accessToken }
    } = JSON.parse(res);
    if (resultCode !== '0000') {
        $.notify(`AppCookie刷新失败！`, res);
    } else {
        $.setStore('KDLK_APP_ACCESS_TOKEN', accessToken);
    }
    await getExchangeTicket();
}

// 获取ticket
async function getExchangeTicket() {
    const url = `https://mycadillac.apps.sgmsonline.com/service/mycadillacv3/rest/api/private/vehicleMarket/getExchangeTicket`;
    const { idpUserId, deviceId, client_id, phone } = KDLK_APP_HEARDERS;

    const headers = {
        'user-agent': 'Dart/2.19 (dart:io)',
        appid: 'MyCadillac',
        app_version: '7.5.2',
        'accept-encoding': 'gzip',
        uuid: 'C34D5C99-87CB-42B2-B26D-ABBACCD661DB',
        mobile_os: 'IOS: 17.4',
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
    console.log(res);
    // const {
    //     resultCode,
    //     data: { accessToken }
    // } = JSON.parse(res);
}

async function refreshStoreCookie() {
    const url = `https://cocm.mall.sgmsonline.com/api/bkm/auth/refreshToken`;
    const { Cookie, Authorization, access_token } = KDLK_STORE_HEADERS;
    const headers = {
        Host: 'cocm.mall.sgmsonline.com',
        Cookie,
        'User-Agent':
            'mycadillac_app_new Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        Referer: 'https://cocm.mall.sgmsonline.com/mycenter/pages/index/sign',
        'channel-code': 'COCM',
        Origin: 'https://cocm.mall.sgmsonline.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Site': 'same-origin',
        'Content-Length': '18',
        'X-Tingyun': KDLK_STORE_HEADERS['X-Tingyun'],
        Connection: 'keep-alive',
        Authorization,
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        client_id:
            '19La8WErZHWGrSGT36cABf31N2v92yQ5tXHEkyOFU9qJo43byM3EUIsl349',
        idpUserId: 'MYCDL013650309',
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        access_token,
        'Accept-Encoding': 'gzip, deflate, br',
        'Sec-Fetch-Mode': 'cors'
    };
    const body = {
        isLoading: 'no'
    };
    const myRequest = {
        url: url,
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
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
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",o="undefined"!=typeof $httpClient&&"surge",r=e||s||o;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:o}=i(e);return 200!==s?Promise.reject(e):(this.log("status：",s),this.log("body：",o),Promise.resolve(o))}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(o)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:e}=t;$httpClient[e.toLowerCase()](t,(t,e,s)=>{if(t)return Promise.reject(t);const{status:o}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)})}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:o,...r}=t,n=await s(o,r),{status:a}=i(n),h=r.headers.contentType,c="text/html"===h?await n.text():await n.json();return 200!==a?Promise.reject(c):Promise.resolve(c)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||o)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{s&&$notify(this.title,t,r),o&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(s)return n(t,$prefs.valueForKey(t));if(o)return n(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let o=e.getItem(t);return n(t,o)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),s&&$prefs.setValueForKey(r,t),o&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
