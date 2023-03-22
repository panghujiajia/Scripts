const $ = new Tool('Ibox');

const IBOX_NOTICE_NUMBER = $.getStore('IBOX_NOTICE_NUMBER');

$.log(IBOX_NOTICE_NUMBER)
getNotice();

async function getNotice() {
    try {
        const url = `https://notice.ibox.art/html/notice/notice.html`;
        const method = `GET`;
        const headers = {
            'Sec-Fetch-Dest': `document`,
            contentType: 'text/html',
            Connection: `keep-alive`,
            'Accept-Encoding': `gzip, deflate, br`,
            'sec-ch-ua': `"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"`,
            'Upgrade-Insecure-Requests': `1`,
            'sec-ch-ua-mobile': `?0`,
            'Sec-Fetch-Site': `none`,
            'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36`,
            'Sec-Fetch-Mode': `navigate`,
            'Sec-Fetch-User': `?1`,
            Host: `notice.ibox.art`,
            'sec-ch-ua-platform': `"macOS"`,
            'Accept-Language': `zh-CN,zh;q=0.9`,
            Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`
        };

        const myRequest = {
            url: url,
            method: method,
            headers: headers
        };
        const res = await $.request(myRequest);

        const regex = /window.__json4fe=(.*?);window/;
        res.replace(/\s/g, '').replace(regex, '');
        let { allList, byClassList, tabList } = evalJsString(RegExp.$1);
        $.log(allList.length)
        $.setStore('IBOX_NOTICE_NUMBER', allList.length);
        let newNoticeNum = allList.length - IBOX_NOTICE_NUMBER;
        // 有新公告
        if (newNoticeNum >= 0) {
            let newNotice = allList.filter((item, index) => index < 2);
            for (let i = 0; i < newNotice.length; i++) {
                const item = newNotice[i];
                $.notify('公告通知', `${item.noticeName}`);
            }
        }
        return $.done();
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        return $.done();
    }
}
function evalJsString(str) {
    let a = null;
    try {
        eval('a = ' + str);
    } catch (err) {
        console.error(err);
    }
    if (typeof a === 'object') return a;
    else return null;
}

// prettier-ignore
function Tool(t){return new class{constructor(t){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",n=e||o;this.ENV=n,this.title=t||"📣📣📣",this.log(`脚本应用：${this.title}\n脚本环境：${n}`)}request(t){return this[`_${this.ENV}`]().request(t)}done(){return this[`_${this.ENV}`]().done()}wait(t){return new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})}notify(t,e){return this[`_${this.ENV}`]().notify([t,e])}getStore(t){return this[`_${this.ENV}`]().store.get(t)}setStore(t,e){return this[`_${this.ENV}`]().store.set(t,e)}log(t){try{"string"!=typeof t&&"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}catch(e){console.log("\n================LOG ERROR================\n"),console.log(`\n${e}`),console.log("\n"),console.log(t)}console.log("\n📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔\n")}_node(){let{localStorage:t,fetch:e,log:o,title:n}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o,this.localStorage=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t,this.fetch=e}return{request:async t=>{try{const{url:n,...r}=t,s=await e(n,r),{status:i}=s,c=r.headers.contentType,l="text/html"===c?await s.text():await s.json();return o(`接口请求参数：${JSON.stringify(t)}\n\n                            接口响应结果：${JSON.stringify(l)}`),200!==i?Promise.reject(l):Promise.resolve(l)}catch(t){return o(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}},notify:t=>{t.filter(t=>!!t),o(`${n}\n${t.join("\n")}`)},store:{get:e=>{let o=t.getItem(e);try{o=JSON.parse(o)}catch(t){}return o},set:(e,o)=>{"object"==typeof o&&(o=JSON.stringify(o)),t.setItem(e,o)}},done:()=>{o("Node done")}}}_quanx(){let{log:t,title:e}=this;return{request:async e=>{try{const o=await $task.fetch(e),{statusCode:n,body:r}=o;return t(`接口请求参数：${JSON.stringify(e)}\n\n                            接口响应结果：${JSON.stringify(o)}`),200!==n?Promise.reject(o):Promise.resolve(r)}catch(e){return t(`接口响应错误：\n${e}\n${JSON.stringify(e)}`),Promise.reject(e)}},notify:t=>{switch(t.length){case 1:$notify(e,t[0]);break;case 2:$notify(e,t[0],t[1])}},store:{get:t=>{let e=$prefs.valueForKey(t);try{e=JSON.parse(e)}catch(t){}return e},set:(t,e)=>{"object"==typeof e&&(e=JSON.stringify(e)),$prefs.setValueForKey(e,t)}},done:()=>{t("Quanx done"),$done()}}}}(t)}
