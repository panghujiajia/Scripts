const $ = new Tool('凯迪拉克');

const KDLK_APP_COOKIE = $.getStore('KDLK_APP_COOKIE');
const KDLK_APP_HEARDERS = $.getStore('KDLK_APP_HEARDERS');
const KDLK_APP_ACCESS_TOKEN = $.getStore('KDLK_APP_ACCESS_TOKEN');

const { idpUserId, deviceId, client_id } = KDLK_APP_HEARDERS;

let method = 'POST';
let baseUrl =
    'https://mycadillac.apps.sgmsonline.com/service/mycadillacv3/rest/api';
let headers = {
    'Accept-Encoding': `gzip, deflate, br`,
    Host: `app.sgmlink.com:443`,
    idpUserId,
    deviceId,
    'X-Tingyun-Id': `4Nl_NnGbjwY;c=2;r=1662739668;u=35e02d1754b727796a15156a1ad53435::BD4E4C616020FB61`,
    app_version: `6.2.0`,
    mobile_model: `iPhone14,3`,
    Connection: `keep-alive`,
    mobile_brand: `ios`,
    uuId: deviceId,
    'User-Agent': `MyCadillac_Mycadillac_IOS_V.6.2.0__release/6.2.0 (iPhone; iOS 16.0.3; Scale/3.00)`,
    tag: `ios`,
    'Accept-Language': `zh-Hans-CN;q=1`,
    'Content-Type': `application/json; charset=utf-8`,
    'X-Tingyun': `c=A|HYFIoSexPMs`,
    mobile_OS: `16.0.3`,
    Accept: `*/*`,
    buId: idpUserId,
    appId: `MyCadillac`,
    client_id,
    Cookie: KDLK_APP_COOKIE,
    access_token: KDLK_APP_ACCESS_TOKEN
};

!(async () => {
    if (!KDLK_APP_COOKIE || !KDLK_APP_HEARDERS || !KDLK_APP_ACCESS_TOKEN) {
        $.notify(
            `Cookie读取失败！`,
            `请先打开重写，进入APP-我的页面和商城页面获取Cookie`
        );
    } else {
        await getTask();
    }
})()
    .catch(error => $.log(`Error：\n${error}\n${JSON.stringify(error)}`))
    .finally(() => $.done());

async function getTask() {
    const url = `${baseUrl}/private/task/v4/getTasks`;
    const reqBody = {};

    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    const res = await $.request(myRequest);
    const { data, resultCode, message } = JSON.parse(res);
    if (resultCode === '0000') {
        const { taskGroups } = data;
        const task = taskGroups.find(item => item.taskGroup === 'DAY');
        if (task) {
            // FINISHED 完成任务但没领奖
            // RECEIVED 完成任务并已领奖
            // UNFINISHED 没有完成
            const list = task.tasks.filter(i => i.status !== 'RECEIVED');
            const len = list.length;
            if (!len) {
                $.notify(`❗️❗️❗️任务失败！`, `今日任务已做完！`);
            } else {
                for (let i = 0; i < len; i++) {
                    const item = list[i];
                    await doTask(item);
                }
            }
        }
    } else if (resultCode === '401') {
        $.notify(message, `请重新获取`);
    }
}

async function doTask(item) {
    const { id, status } = item;
    if (status === 'FINISHED') {
        await getPrize(id);
    } else {
        await getList(id);
    }
}

async function getList(type) {
    await $.wait();
    const url = `${baseUrl}/public/newCommunity/article/v4/getArticles`;
    const reqBody = {
        limit: '4',
        scope: 'ALL',
        idpUserId,
        category: 'RECOMMEND',
        skip: '0'
    };
    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    const res = await $.request(myRequest);
    const { data } = JSON.parse(res);
    if (data.length) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (type === 'KD_FORWARD') {
                await forward(item);
            }
            if (type === 'KD_BROWSE') {
                await read(item);
            }
            if (type === 'KD_PRAISE') {
                await like(item, 'CANCEL');
                await like(item, 'PRAISED');
            }
        }
        await getPrize(type);
    }
}

async function like(item, type) {
    await $.wait();
    const url = `${baseUrl}/private/newCommunity/article/v1/praise`;
    const reqBody = { articleId: item.id, praiseType: type };
    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    await $.request(myRequest);
}

async function read(item) {
    await $.wait();
    const url = `${baseUrl}/public/newCommunity/article/v1/read`;
    const reqBody = { articleId: item.id };
    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    await $.request(myRequest);
}

async function forward(item) {
    await $.wait();
    const url = `${baseUrl}/public/newCommunity/article/v1/forward`;
    const reqBody = { articleId: item.id, idpUserId };
    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    await $.request(myRequest);
}

async function getPrize(type) {
    await $.wait();
    const url = `${baseUrl}/private/task/loop/v2/receiveReward`;
    const reqBody = { id: type };
    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    const res = await $.request(myRequest);
    const { resultCode, message } = JSON.parse(res);
    const textObj = {
        KD_BROWSE: '浏览文章',
        KD_PRAISE: '点赞文章',
        KD_FORWARD: '转发文章'
    };
    const text = textObj[type];
    if (resultCode !== '0000') {
        $.notify(`❗️❗️❗️${text}任务失败！`, `${message}`);
    } else {
        $.notify(`🎉🎉🎉${text}任务成功！`);
    }
}

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",n="undefined"!=typeof $httpClient&&"surge",o=e||s||n;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),r=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:n}=i(e);return 200!==s?(this.log(`响应错误：\n\n${n}\n\n${JSON.stringify(n)}`),Promise.reject(e)):(this.log("status：",s),this.log("body：",n),Promise.resolve(n))}catch(t){return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),Promise.reject(t)}if(n)return new Promise((e,s)=>{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:n}=t;$httpClient[n.toLowerCase()](t,(t,n,o)=>{if(t)return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),s(t);const{status:r}=i(n);return 200!==r?(this.log(`响应错误：\n\n${o}\n\n${JSON.stringify(o)}`),s(n)):e(o)})});if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:n,...o}=t,r=await s(n,o),{status:h}=i(r),a=o.headers.contentType,g="text/html"===a?await r.text():await r.json();return 200!==h?(this.log(`响应错误：\n\n${g}\n\n${JSON.stringify(g)}`),Promise.reject(g)):Promise.resolve(g)}catch(t){return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||n)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",o="")=>{s&&$notify(this.title,t,o),n&&$notification.post(this.title,t,o),e&&this.log(`${this.title}\n${t}\n${o}`)}),this.getStore=(t=>{if(s)return r(t,$prefs.valueForKey(t));if(n)return r(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let n=e.getItem(t);return r(t,n)}}),this.setStore=((t,o)=>{if("object"==typeof o&&(o=JSON.stringify(o)),s&&$prefs.setValueForKey(o,t),n&&$persistentStore.write(o,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,o)}}),this.log(`脚本应用：${this.title}\n脚本环境：${o}`)}
