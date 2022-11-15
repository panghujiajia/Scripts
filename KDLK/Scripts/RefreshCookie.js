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
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
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
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        return $.done();
    }
}

// prettier-ignore
function Tool(t){return new class{constructor(t){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",n=e||o;this.ENV=n,this.title=t||"📣📣📣",this.log(`脚本应用：${this.title}\n脚本环境：${n}`)}request(t){return this[`_${this.ENV}`]().request(t)}done(){return this[`_${this.ENV}`]().done()}wait(t){return new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})}notify(t,e){return this[`_${this.ENV}`]().notify([t,e])}getStore(t){return this[`_${this.ENV}`]().store.get(t)}setStore(t,e){return this[`_${this.ENV}`]().store.set(t,e)}log(t){console.log("\n📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔\n");try{console.log(`\n日志内容类型：${typeof t}`),"string"!=typeof t&&"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}catch(e){console.log("\n================LOG ERROR================\n"),console.log(`\n${e}`),console.log("\n"),console.log(t)}console.log("\n📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔\n")}_node(){let{localStorage:t,fetch:e,log:o,title:n}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o,this.localStorage=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t,this.fetch=e}return{request:async t=>{try{const{url:n,...r}=t,s=await e(n,r),{status:i}=s,l=await s.json();return o(`接口请求参数：${JSON.stringify(t)}\n\n                            接口响应结果：${JSON.stringify(l)}`),200!==i?Promise.reject(l):Promise.resolve(l)}catch(t){return o(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}},notify:t=>{t.filter(t=>!!t),o(`${n}\n${t.join("\n")}`)},store:{get:e=>{let o=t.getItem(e);try{o=JSON.parse(o)}catch(t){}return o},set:(e,o)=>{"object"==typeof o&&(o=JSON.stringify(o)),t.setItem(e,o)}},done:()=>{o("Node done")}}}_quanx(){let{log:t,title:e}=this;return{request:async e=>{try{const o=await $task.fetch(e),{statusCode:n,body:r}=o;return t(`接口请求参数：${JSON.stringify(e)}\n\n                            接口响应结果：${JSON.stringify(o)}`),200!==n?Promise.reject(o):Promise.resolve(r)}catch(e){return t(`接口响应错误：\n${e}\n${JSON.stringify(e)}`),Promise.reject(e)}},notify:t=>{switch(t.length){case 1:$notify(e,t[0]);break;case 2:$notify(e,t[0],t[1])}},store:{get:t=>{let e=$prefs.valueForKey(t);try{e=JSON.parse(e)}catch(t){}return e},set:(t,e)=>{"object"==typeof e&&(e=JSON.stringify(e)),$prefs.setValueForKey(e,t)}},done:()=>{t("Quanx done"),$done()}}}}(t)}

