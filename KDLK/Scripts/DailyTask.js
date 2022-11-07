// prettier-ignore
class Tool{constructor(title){const isNode='undefined'!==typeof module&&!!module.exports&&'node';const isQuanX='undefined'!==typeof $task&&'quanx';const ENV=isNode||isQuanX;this.ENV=ENV;this.title=title||'📣📣📣';this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`)}request(options){return this[`_${this.ENV}`]().request(options)}done(){return this[`_${this.ENV}`]().done()}notify(subTitle,detail){return this[`_${this.ENV}`]().notify([subTitle,detail])}getStore(key){return this[`_${this.ENV}`]().store.get(key)}setStore(key,value){return this[`_${this.ENV}`]().store.set(key,value)}log(value){console.log(`\n📔📔📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔📔📔\n`);try{console.log(`\n日志内容类型：${typeof value}`);if(typeof value!=='string'){if(typeof value==='object'){console.log(`\n${JSON.stringify(value)}`)}else{console.log(`\n${value}`)}}else{console.log(`\n${value}`)}}catch(error){console.log('\n================LOG ERROR================\n');console.log(`\n${error}`);console.log('\n');console.log(value)}console.log(`\n📔📔📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔📔📔\n`)}_node(){let{localStorage,axios,log,title}=this;if(!localStorage){let LocalStorage=require('node-localstorage').LocalStorage;const local=new LocalStorage('./store');localStorage=local;this.localStorage=local}if(!axios){const ax=require('axios');axios=ax;this.axios=ax}return{request:async options=>{try{const response=await axios(options);const{status,data}=response;log(`接口请求参数：${JSON.stringify(options)}\n接口响应结果：${JSON.stringify(response)}`);if(status!==200){return Promise.reject(response)}return Promise.resolve(data)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{options.filter(item=>!!item);log(`${title}\n${options.join('\n')}`)},store:{get:key=>{let value=localStorage.getItem(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}localStorage.setItem(key,value)}},done:()=>{log('Node done')}}}_quanx(){let{log,title}=this;return{request:async options=>{try{const response=await $task.fetch(options);const{statusCode,body}=response;log(`接口请求参数：${JSON.stringify(options)}\n接口响应结果：${JSON.stringify(response)}`);if(statusCode!==200){return Promise.reject(response)}return Promise.resolve(body)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{switch(options.length){case 1:$notify(title,options[0]);break;case 2:$notify(title,options[0],options[1]);break;default:break}},store:{get:key=>{let value=$prefs.valueForKey(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}$prefs.setValueForKey(value,key)}},done:()=>{log('Quanx done');$done()}}}}

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
                    $.notify(`任务失败！`, `今日任务已做完！`);
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
        $.log(`Error：\n${JSON.stringify(error)}`);
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
        const url = `${baseUrl}/public/newCommunity/article/v4/getArticles`;
        const reqBody = {
            limit: '10',
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
        $.log(`Error：\n${JSON.stringify(error)}`);
        return $.done();
    }
}

async function like(item, type) {
    try {
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
        $.log(`Error：\n${JSON.stringify(error)}`);
        return $.done();
    }
}

async function read(item) {
    try {
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
        $.log(`Error：\n${JSON.stringify(error)}`);
        return $.done();
    }
}

async function forward(item) {
    try {
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
        $.log(`Error：\n${JSON.stringify(error)}`);
        return $.done();
    }
}

async function getPrize(type) {
    try {
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
            $.notify(`${text}任务失败！`, `${message}`);
        } else {
            $.notify(`${text}任务成功！`);
        }
    } catch (error) {
        $.log(`Error：\n${JSON.stringify(error)}`);
        return $.done();
    }
}
