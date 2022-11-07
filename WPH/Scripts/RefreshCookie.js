// prettier-ignore
class Tool{constructor(title){const isNode='undefined'!==typeof module&&!!module.exports&&'node';const isQuanX='undefined'!==typeof $task&&'quanx';const ENV=isNode||isQuanX;this.ENV=ENV;this.title=title||'📣📣📣';this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`)}request(options){return this[`_${this.ENV}`]().request(options)}done(){return this[`_${this.ENV}`]().done()}notify(subTitle,detail){return this[`_${this.ENV}`]().notify([subTitle,detail])}getStore(key){return this[`_${this.ENV}`]().store.get(key)}setStore(key,value){return this[`_${this.ENV}`]().store.set(key,value)}log(value){console.log(`\n📔📔📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔📔📔\n`);try{console.log(`\n日志内容类型：${typeof value}`);if(typeof value!=='string'){if(typeof value==='object'){console.log(`\n${JSON.stringify(value)}`)}else{console.log(`\n${value}`)}}else{console.log(`\n${value}`)}}catch(error){console.log('\n================LOG ERROR================\n');console.log(`\n${error}`);console.log('\n');console.log(value)}console.log(`\n📔📔📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔📔📔\n`)}_node(){let{localStorage,axios,log,title}=this;if(!localStorage){let LocalStorage=require('node-localstorage').LocalStorage;const local=new LocalStorage('./store');localStorage=local;this.localStorage=local}if(!axios){const ax=require('axios');axios=ax;this.axios=ax}return{request:async options=>{try{const response=await axios(options);const{status,data}=response;log(`接口请求参数：${JSON.stringify(options)}\n接口响应结果：${JSON.stringify(response)}`);if(status!==200){return Promise.reject(response)}return Promise.resolve(data)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{options.filter(item=>!!item);log(`${title}\n${options.join('\n')}`)},store:{get:key=>{let value=localStorage.getItem(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}localStorage.setItem(key,value)}},done:()=>{log('Node done')}}}_quanx(){let{log,title}=this;return{request:async options=>{try{const response=await $task.fetch(options);const{statusCode,body}=response;log(`接口请求参数：${JSON.stringify(options)}\n接口响应结果：${JSON.stringify(response)}`);if(statusCode!==200){return Promise.reject(response)}return Promise.resolve(body)}catch(error){log(`接口响应错误：${JSON.stringify(error)}`);return Promise.reject(error)}},notify:options=>{switch(options.length){case 1:$notify(title,options[0]);break;case 2:$notify(title,options[0],options[1]);break;default:break}},store:{get:key=>{let value=$prefs.valueForKey(key);try{value=JSON.parse(value)}catch(error){}return value},set:(key,value)=>{if(typeof value==='object'){value=JSON.stringify(value)}$prefs.setValueForKey(value,key)}},done:()=>{log('Quanx done');$done()}}}}

const $ = new Tool('唯品会');

const WPH_URL = $.getStore('WPH_URL');
const WPH_BODY = $.getStore('WPH_BODY');
const WPH_HEADERS = $.getStore('WPH_HEADERS');

if (!WPH_URL || !WPH_BODY || !WPH_HEADERS) {
    $.notify(`Cookie读取失败！`, `请先打开重写，进入唯品会获取Cookie`);
    return $.done();
}

/**
 * 附上唯品会的OAuth api_sign签名方法，大佬解了麻烦告诉我，我签名几天了一直{ msg: 'not authorized', code: 11001 }
 */
// var sign = {
//     data: {
//         secret: 'qyrohlf5sjazleru',
//         enString: {
//             '70f71280d5d547b2a7bb370a529aeea1':
//                 'U2FsdGVkX197SM3Eh62XyjAwTXznW9DdALdNR1gKNsewAg3fzwA0x/+UQldlbi3oYBn8eFHgTtBUcGneYPCjIA==',
//             '8cec5243ade04ed3a02c5972bcda0d3f':
//                 'U2FsdGVkX1+ZmG8rT/n9qDbrWBnK0K3G0gsoPo0N6/6qx8AklnZmXLyulj0KAy07ixFAu6oMKmOY0+VH3DjQ2Q==',
//             'adf779847ac641dd9590ccc5674e25d2':
//                 'U2FsdGVkX1/VI+95aRUsSZCDB3rmMe2DPSUO+rSH7U/tlNnA5u9anTM3oHI+XgIeHWA5XDAo0Z19ddwzFeHFXA=='
//         }
//     },
//     getSign: function (url, param, cookie) {
//         var rs = '';
//         var _this = this;
//         var api = _this.replaceHost(url);
//         var hashParam = _this.hashParam(param, url);
//         var cid = _this.getCookie('mars_cid')
//             ? _this.getCookie('mars_cid')
//             : '';
//         var sid = _this.getCookie('mars_sid')
//             ? _this.getCookie('mars_sid')
//             : '';
//         var secret = _this.getSecret(param);
//         rs = this.sha1(api + hashParam + sid + cid + secret);
//         rs = 'OAuth api_sign=' + rs;
//         return rs;
//     },
//     replaceHost: function (url) {
//         if (url) {
//             url = url.replace(/^http:\/\/[^\/]*/, '');
//             url = url.replace(/^https:\/\/[^\/]*/, '');
//             url = url.replace(/^\/\/[^\/]*/, '');
//         }
//         return url;
//     },
//     hashParam: function (param, url) {
//         var rs = '';
//         var keyAry = [];
//         if (url && url.indexOf('?') != -1) {
//             url = url.split('?')[1];
//             if (url.indexOf('#') != -1) url = url.split('#')[0];
//             var aryUrl = url.split('&');
//             for (var i in aryUrl) {
//                 var arySplit = aryUrl[i].split('=');
//                 param[arySplit[0]] = arySplit[1] ? arySplit[1] : '';
//             }
//         }
//         for (var i in param) keyAry.push(i);
//         keyAry = keyAry.sort();
//         for (var j in keyAry) {
//             if (keyAry[j] == 'api_key') continue;
//             rs +=
//                 '&' +
//                 keyAry[j] +
//                 '=' +
//                 (param[keyAry[j]] !== undefined && param[keyAry[j]] !== null
//                     ? param[keyAry[j]]
//                     : '');
//         }
//         if (rs.length > 0) rs = rs.substring(1);
//         rs = this.sha1(rs);
//         return rs;
//     },
//     getSecret: function (param) {
//         var rs = '';
//         var _this = this;
//         var enString =
//             param.api_key && _this.data.enString[param.api_key]
//                 ? _this.data.enString[param.api_key]
//                 : '';
//         return _this.aesDecrypt(enString, _this.data.secret);
//     },
//     aesEncrypt: function (msg, secret) {
//         return CryptoJS.AES.encrypt(msg, secret).toString();
//     },
//     aesDecrypt: function (msg, secret) {
//         var bytes = CryptoJS.AES.decrypt(msg, secret);
//         return bytes.toString(CryptoJS.enc.Utf8);
//     },
//     sha1: function (msg) {
//         return CryptoJS.SHA1(msg).toString();
//     },
//     getCookie: function (name) {
//         var arr,
//             reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
//         if ((arr = cookie.match(reg))) if (arr[2]) return unescape(arr[2]);
//         return '';
//     }
// };

refreshAppToken();

async function refreshAppToken() {
    try {
        const method = `POST`;
        const myRequest = {
            url: WPH_URL,
            method: method,
            headers: WPH_HEADERS,
            body: WPH_BODY
        };
        const res = await $.request(myRequest);
        const { code } = JSON.parse(res);
        if (code !== 1) {
            $.notify(`Cookie刷新失败！`, res);
        }
        return $.done();
    } catch (error) {
        $.log(`Error：\n${JSON.stringify(error)}`);
        return $.done();
    }
}
