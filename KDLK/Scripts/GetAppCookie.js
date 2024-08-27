const $ = new Tool('凯迪拉克');

try {
    const { url, headers } = $request;
    const { Cookie, access_token, Authorization } = headers;
    const { body } = $response;
    const { data } = JSON.parse(body);
    if (url.includes('baseInfo')) {
        $.setStore('KDLK_APP_HEADERS', {
            ...headers
        });
    } else {
        const { accessToken, refreshToken } = data.auth;
        if (accessToken || access_token) {
            $.setStore('KDLK_APP_ACCESS_TOKEN', accessToken || access_token);
        }
        if (refreshToken) {
            $.setStore('KDLK_APP_REFRESH_ACCESS_TOKEN', refreshToken);
        }
    }
    if (url.includes('getMemberInfo')) {
        $.setStore('KDLK_APP_HEADERS', {
            ...$.getStore('KDLK_APP_HEADERS'),
            Authorization
        });
    }
    if (Cookie) {
        $.setStore('KDLK_APP_COOKIE', Cookie);
    }
    notify();
} catch (error) {
    $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
}

function notify() {
    const KDLK_APP_COOKIE = $.getStore('KDLK_APP_COOKIE');
    const KDLK_APP_HEADERS = $.getStore('KDLK_APP_HEADERS');
    const KDLK_APP_ACCESS_TOKEN = $.getStore('KDLK_APP_ACCESS_TOKEN');
    const KDLK_APP_REFRESH_ACCESS_TOKEN = $.getStore(
        'KDLK_APP_REFRESH_ACCESS_TOKEN'
    );
    $.log(
        `Cookie：${KDLK_APP_COOKIE}\nAccessToken：${KDLK_APP_ACCESS_TOKEN}\nRefreshToken：${KDLK_APP_REFRESH_ACCESS_TOKEN}`
    );
    if (
        KDLK_APP_COOKIE &&
        KDLK_APP_HEADERS &&
        KDLK_APP_ACCESS_TOKEN &&
        KDLK_APP_REFRESH_ACCESS_TOKEN
    ) {
        $.notify(`Cookie写入成功！`);
    }
}
$.done();

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",n="undefined"!=typeof $httpClient&&"surge",o=e||s||n;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),r=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:n}=i(e);return 200!==s?(this.log(`响应错误：\n\n${n}\n\n${JSON.stringify(n)}`),Promise.reject(e)):(this.log("status：",s),this.log("body：",n),Promise.resolve(n))}catch(t){return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),Promise.reject(t)}if(n)return new Promise((e,s)=>{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:n}=t;$httpClient[n.toLowerCase()](t,(t,n,o)=>{if(t)return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),s(t);const{status:r}=i(n);return 200!==r?(this.log(`响应错误：\n\n${o}\n\n${JSON.stringify(o)}`),s(n)):e(o)})});if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:n,...o}=t,r=await s(n,o),{status:h}=i(r),a=o.headers.contentType,g="text/html"===a?await r.text():await r.json();return 200!==h?(this.log(`响应错误：\n\n${g}\n\n${JSON.stringify(g)}`),Promise.reject(g)):Promise.resolve(g)}catch(t){return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||n)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",o="")=>{s&&$notify(this.title,t,o),n&&$notification.post(this.title,t,o),e&&this.log(`${this.title}\n${t}\n${o}`)}),this.getStore=(t=>{if(s)return r(t,$prefs.valueForKey(t));if(n)return r(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let n=e.getItem(t);return r(t,n)}}),this.setStore=((t,o)=>{if("object"==typeof o&&(o=JSON.stringify(o)),s&&$prefs.setValueForKey(o,t),n&&$persistentStore.write(o,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,o)}}),this.log(`脚本应用：${this.title}\n脚本环境：${o}`)}
