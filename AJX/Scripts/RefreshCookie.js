// 该脚本用来刷新Cookie和Token

const AJX_COOKIE = $prefs.valueForKey('AJX_COOKIE');
const AJX_TOKEN = $prefs.valueForKey('AJX_TOKEN');

if (!AJX_COOKIE || !AJX_TOKEN) {
    $notify('安吉星', `刷新Cookie失败！`, `请先打开重写，进入APP获取Cookie`);
    $done();
}

refreshAppToken();
refreshAppCookie();

function refreshAppCookie() {
    const url = `https://www.onstar.com.cn/mssos/sos/credit/v1/getUserSignInit`;
    const method = `GET`;
    const headers = {
        Connection: `keep-alive`,
        'Accept-Encoding': `gzip, deflate, br`,
        'Content-Type': `application/json`,
        Origin: `https://www.onstar.com.cn`,
        'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
        Authorization: AJX_TOKEN,
        Cookie: AJX_COOKIE,
        Host: `www.onstar.com.cn`,
        Referer: `https://www.onstar.com.cn/mweb/ma80/sharedProjects/index.html`,
        'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
        Accept: `*/*`
    };
    const body = ``;

    const myRequest = {
        url: url,
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    };

    $task.fetch(myRequest).then(
        async response => {
            const { body } = response;

            console.log('\n================================================\n');
            console.log(body);
            console.log('\n================================================\n');

            const { bizCode } = JSON.parse(body);
            if (!bizCode || bizCode !== 'E0000') {
                $notify('安吉星', `Cookie刷新失败！`, body);
            }
            $done();
        },
        reason => {
            console.log(reason.error);
            $done();
        }
    );
}
function refreshAppToken() {
    const url = `https://api.shanghaionstar.com/sos/mobileuser/v1/public/greetings/OWNER`;
    const method = `GET`;
    const headers = {
        'client-info': `IPHONE_LARGE_16.1_100100_zh-CN_iPhone14,3_w9tZVO22q9XO8uHzOgqKyQ==`,
        accept: `application/json`,
        authorization: `Bearer ${AJX_TOKEN}`,
        'x-b3-traceid': `ad643423c5e4b6d4`,
        'x-b3-spanid': `ad643423c5e4b6d4`,
        'accept-language': `zh-CN`,
        'accept-encoding': `gzip`,
        host: `api.shanghaionstar.com`,
        'user-agent': `Dart/2.13 (dart:io)`,
        'client-trace-id': `bbfd52e0-5b3c-11ed-a6df-1d9338d3d9fb|MYCDL013650309|1843C130F0E`,
        'x-b3-parentspanid': `ad643423c5e4b6d4`,
        'x-b3-sampled': `1`
    };
    const body = ``;

    const myRequest = {
        url: url,
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    };

    $task.fetch(myRequest).then(
        async response => {
            const { body } = response;

            console.log('\n================================================\n');
            console.log(body);
            console.log('\n================================================\n');

            if (body.indexOf('车况') < 0) {
                $notify('安吉星', `Cookie刷新失败！`, body);
            }
            $done();
        },
        reason => {
            console.log(reason.error);
            $done();
        }
    );
}
