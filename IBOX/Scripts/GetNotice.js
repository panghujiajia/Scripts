const $ = new Tool('Ibox');

const IBOX_NOTICE_NUMBER = $.getStore('IBOX_NOTICE_NUMBER');

!(async () => {
    await getNotice();
})()
    .catch(error => $.log(`Error：\n${error}\n${JSON.stringify(error)}`))
    .finally(() => $.done());

async function getNotice() {
    const url = `https://notice.ibox.art/html/notice/notice.html`;
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
        method: 'GET',
        headers: headers
    };
    const res = await $.request(myRequest);

    const regex = /window.__json4fe=(.*?);window/;
    res.replace(/\s/g, '').replace(regex, '');
    let { allList, byClassList, tabList } = evalJsString(RegExp.$1);
    $.setStore('IBOX_NOTICE_NUMBER', allList.length + '');
    let newNoticeNum = allList.length - IBOX_NOTICE_NUMBER;
    // 有新公告
    if (newNoticeNum > 0) {
        let newNotice = allList.filter((item, index) => index < newNoticeNum);
        for (let i = 0; i < newNotice.length; i++) {
            const item = newNotice[i];
            $.notify('公告通知', `${item.noticeName}`);
        }
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
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",s="undefined"!=typeof $task&&"quanx",o="undefined"!=typeof $httpClient&&"surge",n=e||s||o;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),r=(t,e)=>{try{e=JSON.parse(e)}catch(t){}return e},l=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const s=new e("./store");t=s}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n\n${JSON.stringify(t)}`):console.log(`\n\n${t}`)}),this.request=(async t=>{if(s)try{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const e=await $task.fetch(t),{status:s,body:o}=i(e);return 200!==s?Promise.reject(e):(this.log("status：",s),this.log("body：",o),Promise.resolve(o))}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(o)return new Promise((e,s)=>{this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{method:o}=t;$httpClient[o.toLowerCase()](t,(t,o,n)=>{if(t)return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),s(t);const{status:r}=i(o);return 200!==r?s(o):e(n)})});if(e)try{const{localStorage:e,fetch:s}=l();this.log(`url：\n\n${t.url}`),this.log(`headers：\n\n${JSON.stringify(t.headers)}`),this.log(`body：\n\n${t.body}`);const{url:o,...n}=t,r=await s(o,n),{status:a}=i(r),h=n.headers.contentType,c="text/html"===h?await r.text():await r.json();return 200!==a?Promise.reject(c):Promise.resolve(c)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}),this.done=((t={})=>{(s||o)&&$done(t),e&&this.log(t)}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",n="")=>{s&&$notify(this.title,t,n),o&&$notification.post(this.title,t,n),e&&this.log(`${this.title}\n${t}\n${n}`)}),this.getStore=(t=>{if(s)return r(t,$prefs.valueForKey(t));if(o)return r(t,$persistentStore.read(t));if(e){const{localStorage:e,fetch:s}=l();let o=e.getItem(t);return r(t,o)}}),this.setStore=((t,n)=>{if("object"==typeof n&&(n=JSON.stringify(n)),s&&$prefs.setValueForKey(n,t),o&&$persistentStore.write(n,t),e){const{localStorage:e,fetch:s}=l();e.setItem(t,n)}}),this.log(`脚本应用：${this.title}\n脚本环境：${n}`)}
