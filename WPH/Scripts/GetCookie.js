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
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",n="undefined"!=typeof $httpClient&&"surge",o=e||s||n;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),r=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:n}=i(e);return 200!==s?(this.log(`响应错误：\n\n${n}\n\n${JSON.stringify(n)}`),Promise.reject(e)):(this.log("status：",s),this.log("body：",n),Promise.resolve(n))}catch(t){return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),Promise.reject(t)}if(n)return new Promise((e,s)=>{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:n}=t;$httpClient[n.toLowerCase()](t,(t,n,o)=>{if(t)return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),s(t);const{status:r}=i(n);return 200!==r?(this.log(`响应错误：\n\n${o}\n\n${JSON.stringify(o)}`),s(n)):e(o)})});if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:n,...o}=t,r=await s(n,o),{status:h}=i(r),a=o.headers.contentType,g="text/html"===a?await r.text():await r.json();return 200!==h?(this.log(`响应错误：\n\n${g}\n\n${JSON.stringify(g)}`),Promise.reject(g)):Promise.resolve(g)}catch(t){return this.log(`网络错误：\n\n${t}\n\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||n)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",o="")=>{s&&$notify(this.title,t,o),n&&$notification.post(this.title,t,o),e&&this.log(`${this.title}\n${t}\n${o}`)}),this.getStore=(t=>{if(s)return r(t,$prefs.valueForKey(t));if(n)return r(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let n=e.getItem(t);return r(t,n)}}),this.setStore=((t,o)=>{if("object"==typeof o&&(o=JSON.stringify(o)),s&&$prefs.setValueForKey(o,t),n&&$persistentStore.write(o,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,o)}}),this.log(`脚本应用：${this.title}\n脚本环境：${o}`)}
