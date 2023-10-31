const $ = new Tool('Ibox');

const IBOX_NOTICE_NUMBER = $.getStore('IBOX_NOTICE_NUMBER');

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
        $.setStore('IBOX_NOTICE_NUMBER', allList.length + '');
        let newNoticeNum = allList.length - IBOX_NOTICE_NUMBER;
        // 有新公告
        if (newNoticeNum > 0) {
            let newNotice = allList.filter(
                (item, index) => index < newNoticeNum
            );
            for (let i = 0; i < newNotice.length; i++) {
                const item = newNotice[i];
                $.notify('公告通知', `${item.noticeName}`);
            }
        }
        $.done();
    } catch (error) {
        $.log(`Error：\n${error}\n${JSON.stringify(error)}`);
        $.done();
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
function Tool(t="📣📣📣"){const e="undefined"!=typeof module&&!!module.exports&&"node",o="undefined"!=typeof $task&&"quanx",s="undefined"!=typeof $httpClient&&"surge",r=e||o||s;this.title=t;const i=t=>(t&&(t.status?t.statusCode=t.status:t.statusCode&&(t.status=t.statusCode)),t),n=t=>{$.log(t);try{t=JSON.parse(t)}catch(e){return t}},a=()=>{let{localStorage:t,fetch:e}=this;if(!t){let e=require("node-localstorage").LocalStorage;const o=new e("./store");t=o}if(!e){const t=(...t)=>import("node-fetch").then(({default:e})=>e(...t));e=t}return{localStorage:t,fetch:e}};this.log=(t=>{"object"==typeof t?console.log(`\n${JSON.stringify(t)}`):console.log(`\n${t}`)}),this.request=(async t=>{if(o)try{const e=await $task.fetch(t),{status:o,body:s}=i(e);return 200!==o?Promise.reject(e):Promise.resolve(s)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}if(s)return new Promise((e,o)=>{const{method:s}=t;$httpClient[s.toLowerCase()](t,(t,s,r)=>{if(t)return o(t);const{status:n}=i(s);return 200!==n?o(s):e(r)})});if(e){const{localStorage:e,fetch:o}=a();try{const{url:e,...s}=t,r=await o(e,s),{status:n}=i(r),a=s.headers.contentType,l="text/html"===a?await r.text():await r.json();return 200!==n?Promise.reject(l):Promise.resolve(l)}catch(t){return this.log(`接口响应错误：\n${t}\n${JSON.stringify(t)}`),Promise.reject(t)}}}),this.done=(t=>{(o||s)&&$done({res:t}),e&&this.log({res:t})}),this.wait=(t=>new Promise(e=>{setTimeout(()=>{e(!0)},1e3*t||2e3)})),this.notify=((t="",r="")=>{o&&$notify(this.title,t,r),s&&$notification.post(this.title,t,r),e&&this.log(`${this.title}\n${t}\n${r}`)}),this.getStore=(t=>{if(o)return n($prefs.valueForKey(t));if(s)return n($persistentStore.read(t));if(e){const{localStorage:e,fetch:o}=a();let s=e.getItem(t);return n(s)}}),this.setStore=((t,r)=>{if("object"==typeof r&&(r=JSON.stringify(r)),o&&$prefs.setValueForKey(r,t),s&&$persistentStore.write(r,t),e){const{localStorage:e,fetch:o}=a();e.setItem(t,r)}}),this.log(`脚本应用：${this.title}\n脚本环境：${r}`)}
