const $ = new Tool('唯品会');

try {
    const { headers, method, url, body } = $request;
    const { Cookie, Authorization } = headers;
    if (method === 'POST') {
        // 刷新Cookie过期时间的接口
        if (url.includes('mapi.appvipshop.com')) {
            if (!Authorization) {
                $.log(`获取Cookie失败：${JSON.stringify(headers)}`);
                $.notify(`Cookie获取失败！`);
            } else {
                $.setStore('WPH_URL_REFRESH', url);
                $.setStore('WPH_BODY_REFRESH', body);
                $.setStore('WPH_HEADERS_REFRESH', headers);
                $.log(
                    `headers：${JSON.stringify(
                        headers
                    )}\nurl：${url}\nbody：${body}`
                );
            }
        } else {
            if (!Cookie || !Authorization) {
                $.log(`获取Cookie失败：${JSON.stringify(headers)}`);
                $.notify(`Cookie获取失败！`);
            } else {
                const bodyArr = decodeURIComponent(body).split('&');
                const params = {};
                for (let i = 0; i < bodyArr.length; i++) {
                    const item = bodyArr[i];
                    const keyVal = item.split('=');
                    params[keyVal[0]] = keyVal[1];
                }
                $.setStore('WPH_URL', url);
                $.setStore('WPH_BODY', params);
                $.setStore('WPH_HEADERS', headers);
                $.log(
                    `headers：${JSON.stringify(
                        headers
                    )}\nurl：${url}\nparams：${JSON.stringify(params)}`
                );
            }
        }
        let WPH_URL = $.getStore('WPH_URL');
        let WPH_BODY = $.getStore('WPH_BODY');
        let WPH_HEADERS = $.getStore('WPH_HEADERS');
        let WPH_URL_REFRESH = $.getStore('WPH_URL_REFRESH');
        let WPH_BODY_REFRESH = $.getStore('WPH_BODY_REFRESH');
        let WPH_HEADERS_REFRESH = $.getStore('WPH_HEADERS_REFRESH');
        if (
            WPH_URL &&
            WPH_BODY &&
            WPH_HEADERS &&
            WPH_URL_REFRESH &&
            WPH_BODY_REFRESH &&
            WPH_HEADERS_REFRESH
        ) {
            $.notify(`Cookie写入成功！`);
        }
    }
} catch (error) {
    $.log(
        `Error：\n${typeof error === 'object' ? JSON.stringify(error) : error}`
    );
}
$.done();

// prettier-ignore
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",o="undefined"!=typeof $httpClient&&"surge",n=e||s||o;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),r=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:o}=i(e);return 200!==s?Promise.reject(e):(this.log("status：",s),this.log("body：",o),Promise.resolve(o))}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(o)return new Promise((e,s)=>{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:o}=t;$httpClient[o.toLowerCase()](t,(t,o,n)=>{if(t)return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),s(t);const{status:r}=i(o);return 200!==r?s(o):e(n)})});if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:o,...n}=t,r=await s(o,n),{status:a}=i(r),h=n.headers.contentType,c="text/html"===h?await r.text():await r.json();return 200!==a?Promise.reject(c):Promise.resolve(c)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||o)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",n="")=>{s&&$notify(this.title,t,n),o&&$notification.post(this.title,t,n),e&&this.log(`${this.title}\n${t}\n${n}`)}),this.getStore=(t=>{if(s)return r(t,$prefs.valueForKey(t));if(o)return r(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let o=e.getItem(t);return r(t,o)}}),this.setStore=((t,n)=>{if("object"==typeof n&&(n=JSON.stringify(n)),s&&$prefs.setValueForKey(n,t),o&&$persistentStore.write(n,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,n)}}),this.log(`脚本应用：${this.title}\n脚本环境：${n}`)}
