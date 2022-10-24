/**
 * 唯品会签到脚本
 */

const WPH_URL = $prefs.valueForKey('WPH_URL');
const WPH_BODY = $prefs.valueForKey('WPH_BODY');
const WPH_HEADERS = $prefs.valueForKey('WPH_HEADERS');

if (!WPH_URL || !WPH_BODY || !WPH_HEADERS) {
    $notify('唯品会', `Cookie读取失败！`, `请先打开重写，进入唯品会获取Cookie`);
    $done();
}

const method = 'POST';

getSigninInfo();

// 签到方法
async function getSignin() {
    const url = WPH_URL.replace('info', 'exec');
    const myRequest = {
        url,
        method,
        headers: WPH_HEADERS,
        body: WPH_BODY
    };
    await $task.fetch(myRequest).then(
        async response => {
            const { body } = response;

            console.log('\n================================================\n');
            console.log(body);
            console.log('\n================================================\n');

            const { code, msg } = JSON.parse(body);
            if (code === 1) {
                await getSigninInfo(true);
            } else {
                $notify('唯品会', `签到失败！`, `${msg}`);
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
    const url = WPH_URL;

    const myRequest = {
        url,
        method,
        headers: WPH_HEADERS,
        body: WPH_BODY
    };
    await $task.fetch(myRequest).then(
        async response => {
            let { body } = response;

            console.log('\n================================================\n');
            console.log(body);
            console.log('\n================================================\n');

            const {
                data: {
                    signInInfo: { todaySinged, cycleDays }
                }
            } = JSON.parse(body);
            if (todaySinged !== 1) {
                await getSignin();
            } else {
                if (success) {
                    $notify('唯品会', `签到成功！`, `已连续签到${cycleDays}天`);
                    console.log(`已连续签到${cycleDays}天`);
                } else {
                    $notify(
                        '唯品会',
                        `今日已签到！`,
                        `已连续签到${cycleDays}天`
                    );
                    console.log(`今日已签到！已连续签到${cycleDays}天`);
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
