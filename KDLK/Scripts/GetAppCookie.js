const $ = new Tool('凯迪拉克');

try {
    const { url, headers } = $request;
    const { Cookie, access_token, idpUserId, deviceId, client_id } = headers;
    const { body } = $response;
    const { data } = JSON.parse(body);
    if (url.includes('baseInfo')) {
        const phone = data.profileInfo.phone;
        $.setStore('KDLK_APP_HEARDERS', {
            idpUserId,
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
    $.done();
} catch (error) {
    $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
    $.done();
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

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",o="undefined"!=typeof $httpClient&&"surge",r=e||s||o;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}),this.request=(async t=>{if(s)try{const e=await $task.fetch(t),{status:s,body:o}=i(e);return 200!==s?Promise.reject(e):Promise.resolve(o)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(o)return new Promise((e,s)=>{const{method:o}=t,r={POST:(t,e)=>{$httpClient.post(t,(t,s,o)=>{e(t,i(s),o)})},GET:(t,e)=>{$httpClient.get(t,(t,s,o)=>{e(t,i(s),o)})}};r[o](t,(t,o,r)=>{if(t)return s(t);const{status:i}=o;return 200!==i?s(o):e(r)})});if(e){const{localStorage:e,fetch:s}=n();try{const{url:e,...o}=t,r=await s(e,o),{status:n}=i(r),a=o.headers.contentType,l="text/html"===a?await r.text():await r.json();return 200!==n?Promise.reject(l):Promise.resolve(l)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}}),this.done=(t=>{(s||o)&&$done({res:t}),e&&this.log({res:t})}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{s&&$notify(this.title,t,r),o&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(s)return $prefs.valueForKey(t);if(o)return $persistentStore.read(t);if(e){const{localStorage:e,fetch:s}=n();let o=e.getItem(t);try{o=JSON.parse(o)}catch(t){}return o}}),this.setStore=((t,r)=>{if(s&&$prefs.setValueForKey(r,t),o&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:s}=n();"object"==typeof r&&(r=JSON.stringify(r)),e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
