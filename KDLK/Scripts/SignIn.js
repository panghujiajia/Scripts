/**
 * 凯迪拉克商城签到脚本
 */

const KDLK_STORE_COOKIE = $prefs.valueForKey('KDLK_STORE_COOKIE');
console.log('\n================================================\n');
console.log(`Cookie：${KDLK_STORE_COOKIE}`);
console.log('\n================================================\n');

if (!KDLK_STORE_COOKIE) {
    $notify(
        '凯迪拉克商城',
        `Cookie读取失败！`,
        `请先打开重写，进去APP-商城页面获取Cookie`
    );
    $done();
}

const method = 'POST';
const baseUrl = 'https://cadillac-club.mysgm.com.cn/touch/control';
const headers = {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    Cookie: KDLK_STORE_COOKIE,
    Referer: 'https://cadillac-club.mysgm.com.cn/touch/control/signin',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
};

getSigninInfo();

// 签到方法
async function getSignin() {
    const url = `${baseUrl}/signinAsync`;
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

            const { code, msg } = JSON.parse(body);

            if (code === '200') {
                await getSigninInfo(true);
            } else {
                $notify('凯迪拉克', `签到失败！`, `失败原因：${msg}`);
                console.log(
                    '\n================================================\n'
                );
                console.log(`签到失败：${msg}`);
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
    const url = `${baseUrl}/checkSigninShowIndex`;
    const reqBody = {};

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

            const {
                signinData: { continuousDay, signCount, signDatePoint },
                signin
            } = JSON.parse(body);

            if (signin === 'Y') {
                await getSignin();
            } else {
                const date = new Date();
                const y = date.getFullYear();
                const m = date.getMonth() + 1;
                const d = date.getDate();
                console.log(
                    '\n================================================\n'
                );
                console.log(`${y}-${m}-${d}`);
                console.log(
                    '\n================================================\n'
                );
                let last = Object.values(signDatePoint).pop();

                if (success) {
                    $notify(
                        '凯迪拉克',
                        `签到成功！`,
                        `本次签到获得${last}积分，累计签到${signCount}天，已连续签到${continuousDay}天`
                    );
                    console.log(
                        `签到成功！本次签到获得${last}积分，累计签到${signCount}天，已连续签到${continuousDay}天`
                    );
                } else {
                    $notify(
                        '凯迪拉克',
                        `今日已签到！`,
                        `累计签到${signCount}天，已连续签到${continuousDay}天`
                    );
                    console.log(
                        `今日已签到！累计签到${signCount}天，已连续签到${continuousDay}天`
                    );
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
