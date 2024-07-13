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

// 获取今日日期，格式为YYYY-MM-DD
function getTodayDate() {
    // 获取当前日期
    const currentDate = new Date();
    // 格式化日期为YYYY-MM-DD
    const formatDate = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    return formatDate(currentDate);
}

// 获取签到信息
async function getSigninInfo(success) {
    const { startDate, endDate } = getCurrentMonthDates();
    const url = `${baseUrl}/signInfo?startDate=${startDate}&endDate=${endDate}&isLoading=no`;
    const myRequest = {
        url,
        method: 'GET',
        headers
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
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",o="undefined"!=typeof $httpClient&&"surge",r=e||s||o;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:o}=i(e);return 200!==s?Promise.reject(e):(this.log("status：",s),this.log("body：",o),Promise.resolve(o))}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(o)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:e}=t;$httpClient[e.toLowerCase()](t,(t,e,s)=>{if(t)return Promise.reject(t);const{status:o}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)})}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:o,...r}=t,n=await s(o,r),{status:a}=i(n),h=r.headers.contentType,c="text/html"===h?await n.text():await n.json();return 200!==a?Promise.reject(c):Promise.resolve(c)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||o)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{s&&$notify(this.title,t,r),o&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(s)return n(t,$prefs.valueForKey(t));if(o)return n(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let o=e.getItem(t);return n(t,o)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),s&&$prefs.setValueForKey(r,t),o&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
