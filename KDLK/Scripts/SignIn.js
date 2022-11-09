const $ = new Tool('凯迪拉克');

const KDLK_STORE_COOKIE = $.getStore('KDLK_STORE_COOKIE');

if (!KDLK_STORE_COOKIE) {
    $.notify(`Cookie读取失败！`, `请先打开重写，进入APP-商城页面获取Cookie`);
    return $.done();
}

const method = 'POST';
const baseUrl = 'https://cadillac-club.mysgm.com.cn/touch/control';
const headers = {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    Cookie: KDLK_STORE_COOKIE,
    Referer: 'https://cadillac-club.mysgm.com.cn/touch/control/signin',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
};

getSigninInfo();

// 签到方法
async function getSignin() {
    try {
        const url = `${baseUrl}/signinAsync`;
        const reqBody = {};
        const myRequest = {
            url,
            method,
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
        const { code, msg } = JSON.parse(res);
        if (code === '200') {
            await getSigninInfo(true);
        } else {
            $.notify(`签到失败！`, `失败原因：${msg}`);
        }
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        return $.done();
    }
}

// 获取签到信息
async function getSigninInfo(success) {
    try {
        const url = `${baseUrl}/checkSigninShowIndex`;
        const reqBody = {};
        const myRequest = {
            url,
            method,
            headers,
            body: JSON.stringify(reqBody)
        };
        const res = await $.request(myRequest);
        const {
            signinData: { continuousDay, signCount, signDatePoint },
            signin
        } = JSON.parse(res);
        if (signin === 'Y') {
            await getSignin();
        } else {
            const date = new Date();
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const d = date.getDate();
            $.log(`${y}-${m}-${d}`);
            let last = Object.values(signDatePoint).pop();

            if (success) {
                $.notify(
                    `签到成功！`,
                    `本次签到获得${last}积分，累计签到${signCount}天，已连续签到${continuousDay}天`
                );
            } else {
                $.notify(
                    `今日已签到！`,
                    `累计签到${signCount}天，已连续签到${continuousDay}天`
                );
            }
            return $.done();
        }
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        return $.done();
    }
}

// prettier-ignore
function Tool(t){return new class{constructor(t){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",n=e||o;this.ENV=n,this.title=t||"📣📣📣",this.log(`脚本应用：${this.title}\n脚本环境：${n}`)}request(t){return this[`_${this.ENV}`]().request(t)}done(){return this[`_${this.ENV}`]().done()}notify(t,e){return this[`_${this.ENV}`]().notify([t,e])}getStore(t){return this[`_${this.ENV}`]().store.get(t)}setStore(t,e){return this[`_${this.ENV}`]().store.set(t,e)}log(t){console.log("\n📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔\n");try{console.log(`\n日志内容类型：${typeof t}`),"string"!=typeof t&&"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}catch(e){console.log("\n================LOG ERROR================\n"),console.log(`\n${e}`),console.log("\n"),console.log(t)}console.log("\n📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔\n")}_node(){let{localStorage:t,fetch:e,log:o,title:n}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o,this.localStorage=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t,this.fetch=e}return{request:async t=>{try{const{url:n,...r}=t,s=await e(n,r),{status:i}=s,l=await s.json();return o(`接口请求参数：${JSON.stringify(t)}\n\n                            接口响应结果：${JSON.stringify(l)}`),200!==i?Promise.reject(l):Promise.resolve(l)}catch(t){return o(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}},notify:t=>{t.filter(t=>!!t),o(`${n}\n${t.join("\n")}`)},store:{get:e=>{let o=t.getItem(e);try{o=JSON.parse(o)}catch(t){}return o},set:(e,o)=>{"object"==typeof o&&(o=JSON.stringify(o)),t.setItem(e,o)}},done:()=>{o("Node done")}}}_quanx(){let{log:t,title:e}=this;return{request:async e=>{try{const o=await $task.fetch(e),{statusCode:n,body:r}=o;return t(`接口请求参数：${JSON.stringify(e)}\n\n                            接口响应结果：${JSON.stringify(o)}`),200!==n?Promise.reject(o):Promise.resolve(r)}catch(e){return t(`接口响应错误：\n${e}\n${JSON.stringify(e)}`),Promise.reject(e)}},notify:t=>{switch(t.length){case 1:$notify(e,t[0]);break;case 2:$notify(e,t[0],t[1])}},store:{get:t=>{let e=$prefs.valueForKey(t);try{e=JSON.parse(e)}catch(t){}return e},set:(t,e)=>{"object"==typeof e&&(e=JSON.stringify(e)),$prefs.setValueForKey(e,t)}},done:()=>{t("Quanx done"),$done()}}}}(t)}

