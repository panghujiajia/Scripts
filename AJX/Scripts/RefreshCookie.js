// 该脚本用来刷新Cookie和Token

const AJX_COOKIE = $prefs.valueForKey('AJX_COOKIE');
const AJX_TOKEN = $prefs.valueForKey('AJX_TOKEN');

if (!AJX_COOKIE || !AJX_TOKEN) {
    $notify('安吉星', `刷新Cookie失败！`, `请先打开重写，进入APP获取Cookie`);
    $done();
}

refreshAppToken();

function refreshAppToken() {
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
