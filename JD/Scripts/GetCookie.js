// prettier-ignore
class Tool{constructor(title){const isNode='undefined'!==typeof module&&!!module.exports&&'node';const isQuanX='undefined'!==typeof $task&&'quanx';const ENV=isNode||isQuanX;this.ENV=ENV;this.title=title||'📣📣📣';this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`)}request(options){return this[`_${this.ENV}`]().request(options)}done(){return this[`_${this.ENV}`]().done()}notify(subTitle,detail){return this[`_${this.ENV}`]().notify([subTitle,detail])}getStore(key){return this[`_${this.ENV}`]().store.get(key)}setStore(key,value){return this[`_${this.ENV}`]().store.set(key,value)}log(value){console.log(`\n📔📔📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔📔📔\n`);try{console.log(`\n日志内容类型：${typeof value}`);if(typeof value!=='string'){if(typeof value==='object'){console.log(`\n${JSON.stringify(value)}`)}else{console.log(`\n${value}`)}}else{console.log(`\n${value}`)}}catch(error){console.log('\n================LOG ERROR================\n');console.log(`\n${error}`);console.log('\n');console.log(value)}console.log(`\n📔📔📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔📔📔\n`)}_node(){let{localStorage,axios,log,title}=this;if(!localStorage){let LocalStorage=require('node-localstorage').LocalStorage;const local=new LocalStorage('./store');localStorage=local;this.localStorage=local}if(!axios){const ax=require('axios');axios=ax;this.axios=ax}return{request:async options=>{try{const response=await axios(options);const{status,data}=response;log(`接口请求参数：${JSON.stringify(options)}\n接口响应结果：${JSON.stringify(response)}`);if(status!==200){return Promise.reject(response)}return Promise.resolve(data)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{options.filter(item=>!!item);log(`${title}\n${options.join('\n')}`)},store:{get:key=>{let value=localStorage.getItem(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}localStorage.setItem(key,value)}},done:()=>{log('Node done')}}}_quanx(){let{log,title}=this;return{request:async options=>{try{const response=await $task.fetch(options);const{statusCode,body}=response;log(`接口请求参数：${JSON.stringify(options)}\n接口响应结果：${JSON.stringify(response)}`);if(statusCode!==200){return Promise.reject(response)}return Promise.resolve(body)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{switch(options.length){case 1:$notify(title,options[0]);break;case 2:$notify(title,options[0],options[1]);break;default:break}},store:{get:key=>{let value=$prefs.valueForKey(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}$prefs.setValueForKey(value,key)}},done:()=>{log('Quanx done');$done()}}}}

const $ = new Tool('京东');

try {
    const { headers, url } = $request;
    const { Cookie } = headers;
    if (!Cookie) {
        $.log(`获取Cookie失败：${JSON.stringify(headers)}`);
        $.notify(`Cookie获取失败！`);
        return $.done();
    }
    $.setStore('JD_URL', url);
    $.setStore('JD_HEADERS', headers);
    $.log(`headers：${JSON.stringify(headers)}\nurl：${url}`);
    $.notify(`Cookie写入成功！`);
    return $.done();
} catch (err) {
    $.log(`Error：\n${JSON.stringify(error)}`);
    return $.done();
}
