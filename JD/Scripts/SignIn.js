const $ = new Tool('京东');

const JD_URL = $.getStore('JD_URL');
const JD_HEADERS = $.getStore('JD_HEADERS');

if (!JD_HEADERS || !JD_URL) {
    $.notify(`Cookie读取失败！`, `请先打开重写，进入APP手动签到一次获取Cookie`);
    $.done();
}

getSignin();

// 签到方法
async function getSignin() {
    try {
        const myRequest = {
            url: JD_URL,
            method: 'GET',
            headers: JD_HEADERS
        };
        const res = await $.request(myRequest);
        if (res.indexOf('"code":"0"') > -1) {
            let beanCount = res.match(/[.]*"beanCount":"(\d+)"[.]*/)[1];
            if (
                res.indexOf('签到成功') > -1 ||
                res.indexOf('恭喜您获得连签奖励') > -1
            ) {
                $.notify(`🎉🎉🎉签到成功！`, `本次签到获得${beanCount}京豆`);
            }
            if (res.indexOf('今天已签到') > -1) {
                $.notify(`❗️❗️❗️签到失败！`, `今天已签到`);
            }
        } else {
            $.notify(`❗️❗️❗️签到失败！`, `${res}`);
        }
        $.done();
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        $.done();
    }
}

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",s="undefined"!=typeof $httpClient&&"surge",r=e||o||s;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=t=>{try{return JSON.parse(t)}catch(e){return t}},a=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}),this.request=(async t=>{if(o)try{const e=await $task.fetch(t),{status:o,body:s}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(s)return new Promise((e,o)=>{const{method:s}=t;$httpClient[s.toLowerCase()](t,(t,s,r)=>{if(t)return o(t);const{status:n}=i(s);return 200!==n?o(s):e(r)})});if(e){const{localStorage:e,fetch:o}=a();try{const{url:e,...s}=t,r=await o(e,s),{status:n}=i(r),a=s.headers.contentType,c="text/html"===a?await r.text():await r.json();return 200!==n?Promise.reject(c):Promise.resolve(c)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}}),this.done=(t=>{(o||s)&&$done({res:t}),e&&this.log({res:t})}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{o&&$notify(this.title,t,r),s&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(o&&n($prefs.valueForKey(t)),s&&n($persistentStore.read(t)),e){const{localStorage:e,fetch:o}=a();let s=e.getItem(t);return n(s)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),o&&$prefs.setValueForKey(r,t),s&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:o}=a();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
