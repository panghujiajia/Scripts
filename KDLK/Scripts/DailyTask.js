const $ = new Tool('凯迪拉克');

const KDLK_APP_COOKIE = $.getStore('KDLK_APP_COOKIE');
const KDLK_APP_HEARDERS = $.getStore('KDLK_APP_HEARDERS');
const KDLK_APP_ACCESS_TOKEN = $.getStore('KDLK_APP_ACCESS_TOKEN');

if (!KDLK_APP_COOKIE || !KDLK_APP_HEARDERS || !KDLK_APP_ACCESS_TOKEN) {
    $.notify(
        `Cookie读取失败！`,
        `请先打开重写，进入APP-我的页面和商城页面获取Cookie`
    );
    return $.done();
}

const { idpUserId, deviceId, client_id } = KDLK_APP_HEARDERS;

const method = 'POST';
const baseUrl = 'https://app.sgmlink.com:443/service/mycadillacv3/rest/api';
const headers = {
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

getTask();

async function getTask() {
    try {
        const url = `${baseUrl}/private/task/v4/getTasks`;
        const reqBody = {};

        const myRequest = {
            url,
            method,
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
        const { data, resultCode } = JSON.parse(res);

        const { taskGroups } = data;
        if (resultCode === '0000') {
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
        }
        return $.done();
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        return $.done();
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
    try {
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
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        return $.done();
    }
}

async function like(item, type) {
    try {
        await $.wait();
        const url = `${baseUrl}/private/newCommunity/article/v1/praise`;
        const reqBody = { articleId: item.id, praiseType: type };
        const myRequest = {
            url,
            method,
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        return $.done();
    }
}

async function read(item) {
    try {
        await $.wait();
        const url = `${baseUrl}/public/newCommunity/article/v1/read`;
        const reqBody = { articleId: item.id };
        const myRequest = {
            url,
            method,
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        return $.done();
    }
}

async function forward(item) {
    try {
        await $.wait();
        const url = `${baseUrl}/public/newCommunity/article/v1/forward`;
        const reqBody = { articleId: item.id, idpUserId };
        const myRequest = {
            url,
            method,
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        return $.done();
    }
}

async function getPrize(type) {
    try {
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
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        return $.done();
    }
}

// prettier-ignore
function Tool(t){return new class{constructor(t){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",n=e||o;this.ENV=n,this.title=t||"📣📣📣",this.log(`脚本应用：${this.title}\n脚本环境：${n}`)}request(t){return this[`_${this.ENV}`]().request(t)}done(){return this[`_${this.ENV}`]().done()}wait(t){return new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})}notify(t,e){return this[`_${this.ENV}`]().notify([t,e])}getStore(t){return this[`_${this.ENV}`]().store.get(t)}setStore(t,e){return this[`_${this.ENV}`]().store.set(t,e)}log(t){console.log("\n📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔\n");try{console.log(`\n日志内容类型：${typeof t}`),"string"!=typeof t&&"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}catch(e){console.log("\n================LOG ERROR================\n"),console.log(`\n${e}`),console.log("\n"),console.log(t)}console.log("\n📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔\n")}_node(){let{localStorage:t,fetch:e,log:o,title:n}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o,this.localStorage=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t,this.fetch=e}return{request:async t=>{try{const{url:n,...r}=t,s=await e(n,r),{status:i}=s,l=await s.json();return o(`接口请求参数：${JSON.stringify(t)}\n\n                            接口响应结果：${JSON.stringify(l)}`),200!==i?Promise.reject(l):Promise.resolve(l)}catch(t){return o(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}},notify:t=>{t.filter(t=>!!t),o(`${n}\n${t.join("\n")}`)},store:{get:e=>{let o=t.getItem(e);try{o=JSON.parse(o)}catch(t){}return o},set:(e,o)=>{"object"==typeof o&&(o=JSON.stringify(o)),t.setItem(e,o)}},done:()=>{o("Node done")}}}_quanx(){let{log:t,title:e}=this;return{request:async e=>{try{const o=await $task.fetch(e),{statusCode:n,body:r}=o;return t(`接口请求参数：${JSON.stringify(e)}\n\n                            接口响应结果：${JSON.stringify(o)}`),200!==n?Promise.reject(o):Promise.resolve(r)}catch(e){return t(`接口响应错误：\n${e}\n${JSON.stringify(e)}`),Promise.reject(e)}},notify:t=>{switch(t.length){case 1:$notify(e,t[0]);break;case 2:$notify(e,t[0],t[1])}},store:{get:t=>{let e=$prefs.valueForKey(t);try{e=JSON.parse(e)}catch(t){}return e},set:(t,e)=>{"object"==typeof e&&(e=JSON.stringify(e)),$prefs.setValueForKey(e,t)}},done:()=>{t("Quanx done"),$done()}}}}(t)}
