const $ = new Tool('安吉星');

const AJX_COOKIE = $.getStore('AJX_COOKIE');
const AJX_TOKEN = $.getStore('AJX_TOKEN');

if (!AJX_COOKIE || !AJX_TOKEN) {
    $.notify(
        `Cookie读取失败！`,
        `请先打开重写，进入APP-我的-今日签到获取Cookie`
    );
} else {
    const method = 'POST';
    const baseUrl = 'https://www.onstar.com.cn/mssos/sos/credit/v1/';
    const headers = {
        Connection: `keep-alive`,
        'Accept-Encoding': `gzip, deflate, br`,
        'Content-Type': `application/json`,
        Origin: `https://www.onstar.com.cn`,
        'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
        Authorization: AJX_TOKEN,
        Cookie: AJX_COOKIE,
        Host: `www.onstar.com.cn`,
        Referer: `https://www.onstar.com.cn/mweb/ma80/sharedProjects/index.html`,
        'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
        Accept: `*/*`
    };

    getSigninInfo();

    // 签到方法
    async function getSignin() {
        try {
            const url = `${baseUrl}/userSignIn`;
            const reqBody = {};
            const myRequest = {
                url,
                method,
                headers,
                body: JSON.stringify(reqBody)
            };
            const res = await $.request(myRequest);
            const { bizCode, bizMsg } = JSON.parse(res);
            if (bizCode !== 'E0000') {
                $.notify(`❗️❗️❗️签到失败！`, `失败原因：${bizMsg}`);
            } else {
                await getSigninInfo(true);
            }
        } catch (error) {
            $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        }
    }

    // 获取签到信息
    async function getSigninInfo(success) {
        try {
            const url = `${baseUrl}/getUserSignInit`;
            const reqBody = {};
            const myRequest = {
                url,
                method: 'GET',
                headers,
                body: JSON.stringify(reqBody)
            };
            const res = await $.request(myRequest);
            const {
                data: {
                    currentSign,
                    continueDays,
                    signRanKing,
                    currentYear,
                    currentMonth,
                    currentDay
                }
            } = JSON.parse(res);
            if (!currentSign) {
                await getSignin();
            } else {
                $.log(`${currentYear}-${currentMonth}-${currentDay}`);
                if (success) {
                    $.notify(
                        `🎉🎉🎉签到成功！`,
                        `已连续签到${continueDays}天，今日签到排名${signRanKing}`
                    );
                } else {
                    $.notify(
                        `❗️❗️❗️今日已签到！`,
                        `已连续签到${continueDays}天，今日签到排名${signRanKing}`
                    );
                }
            }
        } catch (error) {
            $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        }
    }
}
$.done();

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",s="undefined"!=typeof $httpClient&&"surge",r=e||o||s;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=(t,e)=>{$.log(`${t}：${e}`);try{e=JSON.parse(e)}catch(t){}return e},a=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}),this.request=(async t=>{if(o)try{const e=await $task.fetch(t),{status:o,body:s}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(s)return new Promise((e,o)=>{const{method:s}=t;$httpClient[s.toLowerCase()](t,(t,s,r)=>{if(t)return o(t);const{status:n}=i(s);return 200!==n?o(s):e(r)})});if(e){const{localStorage:e,fetch:o}=a();try{const{url:e,...s}=t,r=await o(e,s),{status:n}=i(r),a=s.headers.contentType,l="text/html"===a?await r.text():await r.json();return 200!==n?Promise.reject(l):Promise.resolve(l)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}}),this.done=((t={})=>{(o||s)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{o&&$notify(this.title,t,r),s&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(o)return n(t,$prefs.valueForKey(t));if(s)return n(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:o}=a();let s=e.getItem(t);return n(t,s)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),o&&$prefs.setValueForKey(r,t),s&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:o}=a();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
