const $ = new Tool('凯迪拉克');

let method = 'POST';
let baseUrl = 'https://cocm.mall.sgmsonline.com/api/bkm/sign';
let headers = $.getStore('KDLK_STORE_HEADERS');

!(async () => {
    if (!headers) {
        $.notify(
            `Cookie读取失败！`,
            `请先打开重写，进入APP-商城每日签到页面获取Cookie`
        );
    } else {
        await getSigninInfo();
    }
})()
    .catch(error => $.log(`Error：\n${error}\n${JSON.stringify(error)}`))
    .finally(() => $.done());

// 签到方法
async function getSignin() {
    const url = `${baseUrl}`;
    const reqBody = {};
    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    const res = await $.request(myRequest);
    const { statusCode, data } = JSON.parse(res);
    if (statusCode === 200 && data === '签到成功') {
        await getSigninInfo(true);
    } else {
        $.notify(`❗️❗️❗️签到失败！`, `失败原因：${data}`);
    }
}

// 获取当月起止日期，格式为YYYY-MM-DD
function getMonthDate() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const startDate = `${y}-${m}-01`;
    const endDate = `${y}-${m}-${d}`;
    return { startDate, endDate };
}

// 获取今日日期，格式为YYYY-MM-DD
function getTodayDate() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${m}-${d}`;
}

// 获取签到信息
async function getSigninInfo(success) {
    const { startDate, endDate } = getMonthDate();
    const url = `${baseUrl}/signInfo?startDate=${startDate}&endDate=${endDate}&isLoading=no`;
    const reqBody = {};
    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    const res = await $.request(myRequest);
    const {
        data: { count, continuous, signPoints },
        statusCode
    } = JSON.parse(res);
    if (statusCode === 200) {
        const today = getTodayDate();
        const signed = signPoints.findIndex(
            item => item.signDate === today && item.checkFlag === '1'
        );
        if (signed === -1) {
            await getSignin();
        } else {
            if (success) {
                $.notify(
                    `🎉🎉🎉签到成功！`,
                    `本次签到获得${signPoints[signed].signPoints}积分，累计签到${count}天，已连续签到${continuous}天`
                );
            } else {
                $.notify(
                    `❗️❗️❗️今日已签到！`,
                    `累计签到${count}天，已连续签到${continuous}天`
                );
            }
        }
    } else {
        $.notify(`签到信息获取失败`);
    }
}

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",s="undefined"!=typeof $httpClient&&"surge",r=e||o||s;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=(t,e)=>{$.log(`${t}：${e}`);try{e=JSON.parse(e)}catch(t){}return e},a=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}),this.request=(async t=>{if(o)try{const e=await $task.fetch(t),{status:o,body:s}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(s)return new Promise((e,o)=>{const{method:s}=t;$httpClient[s.toLowerCase()](t,(t,s,r)=>{if(t)return o(t);const{status:n}=i(s);return 200!==n?o(s):e(r)})});if(e){const{localStorage:e,fetch:o}=a();try{const{url:e,...s}=t,r=await o(e,s),{status:n}=i(r),a=s.headers.contentType,l="text/html"===a?await r.text():await r.json();return 200!==n?Promise.reject(l):Promise.resolve(l)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}}),this.done=((t={})=>{(o||s)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{o&&$notify(this.title,t,r),s&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(o)return n(t,$prefs.valueForKey(t));if(s)return n(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:o}=a();let s=e.getItem(t);return n(t,s)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),o&&$prefs.setValueForKey(r,t),s&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:o}=a();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
