const $ = new Tool('凯迪拉克');

const KDLK_APP_COOKIE = $.getStore('KDLK_APP_COOKIE');
const KDLK_APP_HEARDERS = $.getStore('KDLK_APP_HEARDERS');
const KDLK_APP_ACCESS_TOKEN = $.getStore('KDLK_APP_ACCESS_TOKEN');
const KDLK_APP_REFRESH_ACCESS_TOKEN = $.getStore(
    'KDLK_APP_REFRESH_ACCESS_TOKEN'
);
let headers = $.getStore('KDLK_STORE_HEADERS');

!(async () => {
    if (
        !headers ||
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
    .catch(error => $.log(`Error：\n${error}\n${JSON.stringify(error)}`))
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
}

// 获取当月起止日期，格式为YYYY-MM-DD
function getCurrentMonthDates() {
    // 获取当前日期
    const currentDate = new Date();
    // 获取当前月的第一天
    const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    // 获取下个月的第一天，然后减去一天得到本月的最后一天
    const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    );
    // 格式化日期为YYYY-MM-DD
    const formatDate = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const startDateStr = formatDate(startOfMonth);
    const endDateStr = formatDate(endOfMonth);
    return { startDate: startDateStr, endDate: endDateStr };
}

async function refreshStoreCookie() {
    const { startDate, endDate } = getCurrentMonthDates();
    const url = `https://cocm.mall.sgmsonline.com/api/bkm/sign/signInfo?startDate=${startDate}&endDate=${endDate}&isLoading=no`;
    const myRequest = {
        url,
        method: 'GET',
        headers
    };
    const res = await $.request(myRequest);
    const { statusCode } = JSON.parse(res);
    if (statusCode !== 200) {
        $.notify(`商城Cookie刷新失败！`, res);
    }
}

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",s="undefined"!=typeof $httpClient&&"surge",r=e||o||s;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=(t,e)=>{$.log(`${t}：${e}`);try{e=JSON.parse(e)}catch(t){}return e},a=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}),this.request=(async t=>{if(o)try{const e=await $task.fetch(t),{status:o,body:s}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(s)return new Promise((e,o)=>{const{method:s}=t;$httpClient[s.toLowerCase()](t,(t,s,r)=>{if(t)return o(t);const{status:n}=i(s);return 200!==n?o(s):e(r)})});if(e){const{localStorage:e,fetch:o}=a();try{const{url:e,...s}=t,r=await o(e,s),{status:n}=i(r),a=s.headers.contentType,l="text/html"===a?await r.text():await r.json();return 200!==n?Promise.reject(l):Promise.resolve(l)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}}),this.done=((t={})=>{(o||s)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{o&&$notify(this.title,t,r),s&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(o)return n(t,$prefs.valueForKey(t));if(s)return n(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:o}=a();let s=e.getItem(t);return n(t,s)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),o&&$prefs.setValueForKey(r,t),s&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:o}=a();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
