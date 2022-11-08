const $ = new Tool('唯品会');

try {
    const { headers, method, url, body } = $request;
    const { Cookie, Authorization } = headers;
    if (method !== 'POST') {
        return $.done();
    }
    if (!Cookie || !Authorization) {
        $.log(`获取Cookie失败：${JSON.stringify(headers)}`);
        $.notify(`Cookie获取失败！`);
        return $.done();
    }
    const bodyArr = body.split('&');
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
    $.notify(`Cookie写入成功！`);
    return $.done();
} catch (err) {
    $.log(
        `Error：\n${typeof error === 'object' ? JSON.stringify(error) : error}`
    );
    return $.done();
}

// prettier-ignore
function Tool(t){return new class{constructor(t){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",n=e||o;this.ENV=n,this.title=t||"📣📣📣",this.log(`脚本应用：${this.title}\n脚本环境：${n}`)}request(t){return this[`_${this.ENV}`]().request(t)}done(){return this[`_${this.ENV}`]().done()}notify(t,e){return this[`_${this.ENV}`]().notify([t,e])}getStore(t){return this[`_${this.ENV}`]().store.get(t)}setStore(t,e){return this[`_${this.ENV}`]().store.set(t,e)}log(t){console.log("\n📔📔📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔📔📔\n");try{console.log(`\n日志内容类型：${typeof t}`),"string"!=typeof t&&"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}catch(e){console.log("\n================LOG ERROR================\n"),console.log(`\n${e}`),console.log("\n"),console.log(t)}console.log("\n📔📔📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔📔📔\n")}_node(){let{localStorage:t,fetch:e,log:o,title:n}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o,this.localStorage=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t,this.fetch=e}return{request:async t=>{try{const{url:n,...r}=t,s=await e(n,r),{status:i}=s,l=await s.json();return o(`接口请求参数：${JSON.stringify(t)}\n\n                            接口响应结果：${JSON.stringify(l)}`),200!==i?Promise.reject(l):Promise.resolve(l)}catch(t){return o(`接口响应错误：${JSON.stringify(t)}`),Promise.reject(t)}},notify:t=>{t.filter(t=>!!t),o(`${n}\n${t.join("\n")}`)},store:{get:e=>{let o=t.getItem(e);try{o=JSON.parse(o)}catch(t){}return o},set:(e,o)=>{"object"==typeof o&&(o=JSON.stringify(o)),t.setItem(e,o)}},done:()=>{o("Node done")}}}_quanx(){let{log:t,title:e}=this;return{request:async e=>{try{const o=await $task.fetch(e),{statusCode:n,body:r}=o;return t(`接口请求参数：${JSON.stringify(e)}\n\n                            接口响应结果：${JSON.stringify(o)}`),200!==n?Promise.reject(o):Promise.resolve(r)}catch(e){return t(`接口响应错误：${JSON.stringify(e)}`),Promise.reject(e)}},notify:t=>{switch(t.length){case 1:$notify(e,t[0]);break;case 2:$notify(e,t[0],t[1])}},store:{get:t=>{let e=$prefs.valueForKey(t);try{e=JSON.parse(e)}catch(t){}return e},set:(t,e)=>{"object"==typeof e&&(e=JSON.stringify(e)),$prefs.setValueForKey(e,t)}},done:()=>{t("Quanx done"),$done()}}}}(t)}
