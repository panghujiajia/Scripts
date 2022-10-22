/**
 * V2EX签到脚本
 */

const V2EX_COOKIE = $prefs.valueForKey('V2EX_COOKIE');
console.log('\n================================================\n');
console.log(`Cookie：${V2EX_COOKIE}`);
console.log('\n================================================\n');

if (!V2EX_COOKIE) {
    $notify('V2EX', `Cookie读取失败！`, `请先打开重写，进去V2EX获取Cookie`);
    $done();
}

const method = 'GET';
const baseUrl = 'https://www.v2ex.com/mission/daily';
const headers = {
    'Accept-Encoding': `gzip, deflate, br`,
    Cookie: V2EX_COOKIE,
    Connection: `keep-alive`,
    Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
    Host: `www.v2ex.com`,
    'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
    Referer: 'https://www.v2ex.com/mission/daily',
    'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
};

getSigninInfo();

// 签到方法
async function getSignin(code) {
    const url = `${baseUrl}/redeem?once=${code}`;
    const reqBody = `{}`;

    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    await $task.fetch(myRequest).then(
        async response => {
            const { body } = response;

            console.log('\n================================================\n');
            console.log(body);
            console.log('\n================================================\n');

            if (body.indexOf('每日登录奖励已领取') > -1) {
                await getSigninInfo(true);
            } else {
                $notify('V2EX', `签到失败！`, `每日登录奖励已领取`);
                console.log(
                    '\n================================================\n'
                );
                console.log(`签到失败：每日登录奖励已领取`);
                console.log(
                    '\n================================================\n'
                );
            }

            $done();
        },
        reason => {
            console.log('\n================================================\n');
            console.log(reason.error);
            console.log('\n================================================\n');
            $done();
        }
    );
}

// 获取签到信息
async function getSigninInfo(success) {
    const url = baseUrl;
    const reqBody = {};

    const myRequest = {
        url,
        method: 'GET',
        headers,
        body: JSON.stringify(reqBody)
    };
    await $task.fetch(myRequest).then(
        async response => {
            let { body } = response;

            console.log('\n================================================\n');
            console.log(body);
            console.log('\n================================================\n');

            if (body.indexOf('每日登录奖励已领取') < 0) {
                const code = body.match(
                    /<input[^>]*\/mission\/daily\/redeem\?once=(\d+)[^>]*>/
                )[1];
                await getSignin(code);
            } else {
                let continueDays = body.match(/已连续登录 (\d+?) 天/)[1];
                if (success) {
                    $notify(
                        'V2EX',
                        `签到成功！`,
                        `已连续签到${continueDays}天`
                    );
                    console.log(`已连续签到${continueDays}天`);
                } else {
                    $notify(
                        'V2EX',
                        `今日已签到！`,
                        `已连续签到${continueDays}天`
                    );
                    console.log(`今日已签到！已连续签到${continueDays}天`);
                }

                console.log(
                    '\n================================================\n'
                );
            }

            $done();
        },
        reason => {
            console.log('\n================================================\n');
            console.log(reason.error);
            console.log('\n================================================\n');

            $done();
        }
    );
}
