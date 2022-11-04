// prettier-ignore
class Tool{constructor(title){const isNode='undefined'!==typeof module&&!!module.exports&&'node';const isQuanX='undefined'!==typeof $task&&'quanx';const ENV=isNode||isQuanX;this.ENV=ENV;this.title=title||'📣📣📣';this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`)}request(options){return this[`_${this.ENV}`]().request(options)}done(){return this[`_${this.ENV}`]().done()}notify(subTitle,detail){return this[`_${this.ENV}`]().notify([subTitle,detail])}getStore(key){return this[`_${this.ENV}`]().store.get(key)}setStore(key,value){return this[`_${this.ENV}`]().store.set(key,value)}log(value){console.log(`\n📔📔📔Log Start📔📔📔\n`);try{console.log(`日志内容类型：${typeof value}`);if(typeof value!=='string'){if(typeof value==='object'){console.log(JSON.stringify(value))}else{console.log(value)}}else{console.log(value)}}catch(error){console.log('\n================LOG ERROR================\n');console.log(error);console.log('\n');console.log(value)}console.log(`\n📔📔📔Log End📔📔📔\n`)}_node(){let{localStorage,axios,log,title}=this;if(!localStorage){let LocalStorage=require('node-localstorage').LocalStorage;const local=new LocalStorage('./store');localStorage=local;this.localStorage=local}if(!axios){const ax=require('axios');axios=ax;this.axios=ax}return{request:async options=>{try{log(`接口请求参数：${JSON.stringify(options)}`);const response=await axios(options);const{status,data}=response;log(`接口响应结果：${JSON.stringify(response)}`);if(status!==200){return Promise.reject(response)}return Promise.resolve(data)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{options.filter(item=>!!item);log(`${title}\n${options.join('\n')}`)},store:{get:key=>{let value=localStorage.getItem(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}localStorage.setItem(key,value)}},done:()=>{log('Node done')}}}_quanx(){let{log,title}=this;return{request:async options=>{try{log(`接口请求参数：${JSON.stringify(options)}`);const response=await $task.fetch(options);const{statusCode,body}=response;log(`接口响应结果：${JSON.stringify(response)}`);if(statusCode!==200){return Promise.reject(response)}return Promise.resolve(body)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{switch(options.length){case 1:$notify(title,options[0]);break;case 2:$notify(title,options[0],options[1]);break;default:break}},store:{get:key=>{let value=$prefs.valueForKey(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}$prefs.setValueForKey(value,key)}},done:()=>{log('Quanx done');$done()}}}}

const $ = new Tool('唯品会');

const WPH_URL = $.getStore('WPH_URL');
const WPH_BODY = $.getStore('WPH_BODY');
const WPH_HEADERS = $.getStore('WPH_HEADERS');

if (!WPH_URL || !WPH_BODY || !WPH_HEADERS) {
    $.notify(`Cookie读取失败！`, `请先打开重写，进入唯品会获取Cookie`);
    return $.done();
}

const method = 'POST';

getSignin();

// 签到方法
async function getSignin() {
    try {
        const url = WPH_URL.replace('info', 'exec');
        const myRequest = {
            url,
            method,
            headers: WPH_HEADERS,
            body: WPH_BODY
        };
        const res = await $.request(myRequest);
        const { code, msg } = JSON.parse(res);
        if (code === 1) {
            await getSigninInfo(true);
        } else {
            $.notify(`签到失败！`, `${msg}`);
        }
        return $.done();
    } catch (error) {
        $.log(`Error：\n${error}`);
        return $.done();
    }
}

// 获取签到信息
async function getSigninInfo(success) {
    try {
        const url = WPH_URL;
        const myRequest = {
            url,
            method,
            headers: WPH_HEADERS,
            body: WPH_BODY
        };
        const res = await $.request(myRequest);
        const {
            data: {
                signInInfo: { todaySinged, cycleDays }
            }
        } = JSON.parse(res);
        if (todaySinged !== 1) {
            await getSignin();
        } else {
            if (success) {
                $.notify(`签到成功！`, `已连续签到${cycleDays}天`);
            } else {
                $.notify(`今日已签到！`, `已连续签到${cycleDays}天`);
            }
        }
    } catch (error) {
        $.log(`Error：\n${error}`);
        return $.done();
    }
}
