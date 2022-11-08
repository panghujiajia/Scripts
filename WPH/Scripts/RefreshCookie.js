const $ = new Tool('唯品会');

const WPH_URL = $.getStore('WPH_URL');
const WPH_BODY = $.getStore('WPH_BODY');
const WPH_COOKIE = $.getStore('WPH_COOKIE');

if (!WPH_URL || !WPH_BODY || !WPH_COOKIE) {
    $.notify(`Cookie读取失败！`, `请先打开重写，进入唯品会获取Cookie`);
    return $.done();
}

$.log(WPH_URL);
$.log(WPH_BODY);
$.log(WPH_COOKIE);

refreshAppToken();

async function refreshAppToken() {
    try {
        const method = `POST`;
        const Authorization = sign.getSign(
            WPH_URL.split('?')[0],
            WPH_BODY,
            WPH_COOKIE
        );
        const myRequest = {
            url: WPH_URL,
            method: method,
            headers: {
                Connection: `keep-alive`,
                'Accept-Encoding': `gzip, deflate, br`,
                'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`,
                Origin: `https://mst-gd15-ct.vip.com`,
                'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 VIPSHOP/7.81.1 (iphone; 2.0.0; 4ebacdc8fa8581b4de693d82e5879e0f7aef9046)`,
                Authorization,
                Cookie: WPH_COOKIE,
                Host: `act-ug.vip.com`,
                Referer: `https://mst-gd15-ct.vip.com/`,
                'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
                Accept: `*/*`
            },
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

// 唯品会api_sign签名方法
// prettier-ignore
const sign = {
    data: {
        secret: 'qyrohlf5sjazleru',
        enString: {
            '70f71280d5d547b2a7bb370a529aeea1':
                'U2FsdGVkX197SM3Eh62XyjAwTXznW9DdALdNR1gKNsewAg3fzwA0x/+UQldlbi3oYBn8eFHgTtBUcGneYPCjIA==',
            '8cec5243ade04ed3a02c5972bcda0d3f':
                'U2FsdGVkX1+ZmG8rT/n9qDbrWBnK0K3G0gsoPo0N6/6qx8AklnZmXLyulj0KAy07ixFAu6oMKmOY0+VH3DjQ2Q==',
            'adf779847ac641dd9590ccc5674e25d2':
                'U2FsdGVkX1/VI+95aRUsSZCDB3rmMe2DPSUO+rSH7U/tlNnA5u9anTM3oHI+XgIeHWA5XDAo0Z19ddwzFeHFXA=='
        }
    },
    getSign: function (url, param, cookie) {
        var rs = '';
        var _this = this;
        var api = _this.replaceHost(url);
        var hashParam = _this.hashParam(param, url);
        var cid = _this.getCookie('mars_cid', cookie)
            ? _this.getCookie('mars_cid', cookie)
            : '';
        var sid = _this.getCookie('mars_sid', cookie)
            ? _this.getCookie('mars_sid', cookie)
            : '';
        var secret = _this.getSecret(param);
        rs = this.sha1(api + hashParam + cid + sid + secret);
        rs = 'OAuth api_sign=' + rs;
        return rs;
    },
    replaceHost: function (url) {
        if (url) {
            url = url.replace(/^http:\/\/[^\/]*/, '');
            url = url.replace(/^https:\/\/[^\/]*/, '');
            url = url.replace(/^\/\/[^\/]*/, '');
        }
        return url;
    },
    hashParam: function (param, url) {
        var rs = '';
        var keyAry = [];
        if (url && url.indexOf('?') != -1) {
            url = url.split('?')[1];
            if (url.indexOf('#') != -1) url = url.split('#')[0];
            var aryUrl = url.split('&');
            for (var i in aryUrl) {
                var arySplit = aryUrl[i].split('=');
                param[arySplit[0]] = arySplit[1] ? arySplit[1] : '';
            }
        }
        for (var i in param) keyAry.push(i);
        keyAry = keyAry.sort();
        for (var j in keyAry) {
            if (keyAry[j] == 'api_key') continue;
            rs +=
                '&' +
                keyAry[j] +
                '=' +
                (param[keyAry[j]] !== undefined && param[keyAry[j]] !== null
                    ? param[keyAry[j]]
                    : '');
        }
        if (rs.length > 0) rs = rs.substring(1);
        rs = this.sha1(rs);
        return rs;
    },
    getSecret: function (param) {
        var rs = '';
        var _this = this;
        var enString =
            param.api_key && _this.data.enString[param.api_key]
                ? _this.data.enString[param.api_key]
                : '';
        return _this.aesDecrypt(enString, _this.data.secret);
    },
    aesEncrypt: function (msg, secret) {
        return CryptoJS.AES.encrypt(msg, secret).toString();
    },
    aesDecrypt: function (msg, secret) {
        var bytes = CryptoJS.AES.decrypt(msg, secret);
        return bytes.toString(CryptoJS.enc.Utf8);
    },
    sha1: function (msg) {
        return CryptoJS.SHA1(msg).toString();
    },
    getCookie: function (name, cookie) {
        var arr,
            reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if ((arr = cookie.match(reg))) if (arr[2]) return unescape(arr[2]);
        return '';
    }
};

// prettier-ignore
function Tool(t){return new class{constructor(t){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",n=e||o;this.ENV=n,this.title=t||"📣📣📣",this.log(`脚本应用：${this.title}\n脚本环境：${n}`)}request(t){return this[`_${this.ENV}`]().request(t)}done(){return this[`_${this.ENV}`]().done()}notify(t,e){return this[`_${this.ENV}`]().notify([t,e])}getStore(t){return this[`_${this.ENV}`]().store.get(t)}setStore(t,e){return this[`_${this.ENV}`]().store.set(t,e)}log(t){console.log("\n📔📔📔📔📔📔📔📔📔Log Start📔📔📔📔📔📔📔📔📔\n");try{console.log(`\n日志内容类型：${typeof t}`),"string"!=typeof t&&"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}catch(e){console.log("\n================LOG ERROR================\n"),console.log(`\n${e}`),console.log("\n"),console.log(t)}console.log("\n📔📔📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔📔📔\n")}_node(){let{localStorage:t,fetch:e,log:o,title:n}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o,this.localStorage=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t,this.fetch=e}return{request:async t=>{try{const{url:n,...r}=t,s=await e(n,r),{status:i}=s,l=await s.json();return o(`接口请求参数：${JSON.stringify(t)}\n\n                            接口响应结果：${JSON.stringify(l)}`),200!==i?Promise.reject(l):Promise.resolve(l)}catch(t){return o(`接口响应错误：${JSON.stringify(t)}`),Promise.reject(t)}},notify:t=>{t.filter(t=>!!t),o(`${n}\n${t.join("\n")}`)},store:{get:e=>{let o=t.getItem(e);try{o=JSON.parse(o)}catch(t){}return o},set:(e,o)=>{"object"==typeof o&&(o=JSON.stringify(o)),t.setItem(e,o)}},done:()=>{o("Node done")}}}_quanx(){let{log:t,title:e}=this;return{request:async e=>{try{const o=await $task.fetch(e),{statusCode:n,body:r}=o;return t(`接口请求参数：${JSON.stringify(e)}\n\n                            接口响应结果：${JSON.stringify(o)}`),200!==n?Promise.reject(o):Promise.resolve(r)}catch(e){return t(`接口响应错误：${JSON.stringify(e)}`),Promise.reject(e)}},notify:t=>{switch(t.length){case 1:$notify(e,t[0]);break;case 2:$notify(e,t[0],t[1])}},store:{get:t=>{let e=$prefs.valueForKey(t);try{e=JSON.parse(e)}catch(t){}return e},set:(t,e)=>{"object"==typeof e&&(e=JSON.stringify(e)),$prefs.setValueForKey(e,t)}},done:()=>{t("Quanx done"),$done()}}}}(t)}

