/**
 * 京东签到脚本
 */

const JD_URL = $prefs.valueForKey('JD_URL');
const JD_HEADERS = JSON.parse($prefs.valueForKey('JD_HEADERS'));

if (!JD_HEADERS || !JD_URL) {
    $notify('京东', `Cookie读取失败！`, `请先打开重写，进入京东获取Cookie`);
    $done();
}

getSignin();

// 签到方法
async function getSignin() {
    const myRequest = {
        url: JD_URL,
        method,
        headers: JD_HEADERS
    };
    await $task.fetch(myRequest).then(
        async response => {
            const { body } = response;

            console.log('\n================================================\n');
            console.log(body);
            console.log('\n================================================\n');

            if (body.indexOf('"code":"0"') > -1) {
                let beanCount = success.match(/[.]*"beanCount":"(\d+)"[.]*/)[1];
                if (body.indexOf('签到成功') > -1) {
                    $notify(
                        '京东',
                        `签到成功！`,
                        `本次签到获得${beanCount}京豆`
                    );
                }
                if (body.indexOf('今日已签到') > -1) {
                    $notify('京东', `签到失败！`, `今日已签到`);
                }
            } else {
                $notify('京东', `签到失败！`, `${body}`);
                console.log(
                    '\n================================================\n'
                );
                console.log(`签到失败：${body}`);
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
