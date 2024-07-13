const $ = new Tool('凯迪拉克');

try {
    const { url, headers } = $request;
    const { Cookie, access_token, idpuserid, deviceId, client_id } = headers;
    const { body } = $response;
    const { data } = JSON.parse(body);
    if (url.includes('baseInfo')) {
        const phone = data.profileInfo.phone;
        $.setStore('KDLK_APP_HEARDERS', {
            idpUserId: idpuserid,
            deviceId,
            client_id,
            phone
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
    if (Cookie) {
        $.setStore('KDLK_APP_COOKIE', Cookie);
    }
    notify();
} catch (error) {
    $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
}

function notify() {
    const KDLK_APP_COOKIE = $.getStore('KDLK_APP_COOKIE');
    const KDLK_APP_HEARDERS = $.getStore('KDLK_APP_HEARDERS');
    const KDLK_APP_ACCESS_TOKEN = $.getStore('KDLK_APP_ACCESS_TOKEN');
    const KDLK_APP_REFRESH_ACCESS_TOKEN = $.getStore(
        'KDLK_APP_REFRESH_ACCESS_TOKEN'
    );
    $.log(
        `Cookie：${KDLK_APP_COOKIE}\nAccessToken：${KDLK_APP_ACCESS_TOKEN}\nRefreshToken：${KDLK_APP_REFRESH_ACCESS_TOKEN}`
    );
    if (
        KDLK_APP_COOKIE &&
        KDLK_APP_HEARDERS &&
        KDLK_APP_ACCESS_TOKEN &&
        KDLK_APP_REFRESH_ACCESS_TOKEN
    ) {
        $.notify(`Cookie写入成功！`);
    }
}
$.done();

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",o="undefined"!=typeof $httpClient&&"surge",r=e||s||o;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:o}=i(e);return 200!==s?Promise.reject(e):(this.log("status：",s),this.log("body：",o),Promise.resolve(o))}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(o)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:e}=t;$httpClient[e.toLowerCase()](t,(t,e,s)=>{if(t)return Promise.reject(t);const{status:o}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)})}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:o,...r}=t,n=await s(o,r),{status:a}=i(n),h=r.headers.contentType,c="text/html"===h?await n.text():await n.json();return 200!==a?Promise.reject(c):Promise.resolve(c)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||o)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{s&&$notify(this.title,t,r),o&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(s)return n(t,$prefs.valueForKey(t));if(o)return n(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let o=e.getItem(t);return n(t,o)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),s&&$prefs.setValueForKey(r,t),o&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
