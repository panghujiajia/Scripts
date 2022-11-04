/**
 * 凯迪拉克每日任务脚本
 */

const KDLK_APP_COOKIE = $prefs.valueForKey('KDLK_APP_COOKIE');
const KDLK_APP_HEARDERS = $prefs.valueForKey('KDLK_APP_HEARDERS');
const KDLK_APP_ACCESS_TOKEN = $prefs.valueForKey('KDLK_APP_ACCESS_TOKEN');

console.log('\n================================================\n');
console.log(`Token：${KDLK_APP_ACCESS_TOKEN}`);
console.log('\n================================================\n');

if (!KDLK_APP_COOKIE || !KDLK_APP_HEARDERS || !KDLK_APP_ACCESS_TOKEN) {
    $notify(
        '凯迪拉克APP',
        `Cookie读取失败！`,
        `请先打开重写，进入APP-我的页面获取Cookie`
    );
    $done();
}

const { idpUserId, deviceId, client_id, phone } = JSON.parse(KDLK_APP_HEARDERS);

const method = 'POST';
const baseUrl = 'https://app.sgmlink.com:443/service/mycadillacv3/rest/api';
const headers = {
    'Accept-Encoding': `gzip, deflate, br`,
    Host: `app.sgmlink.com:443`,
    idpUserId,
    deviceId,
    'X-Tingyun-Id': `4Nl_NnGbjwY;c=2;r=1662739668;u=35e02d1754b727796a15156a1ad53435::BD4E4C616020FB61`,
    app_version: `6.2.0`,
    mobile_model: `iPhone14,3`,
    Connection: `keep-alive`,
    mobile_brand: `ios`,
    uuId: deviceId,
    'User-Agent': `MyCadillac_Mycadillac_IOS_V.6.2.0__release/6.2.0 (iPhone; iOS 16.0.3; Scale/3.00)`,
    tag: `ios`,
    'Accept-Language': `zh-Hans-CN;q=1`,
    'Content-Type': `application/json; charset=utf-8`,
    'X-Tingyun': `c=A|HYFIoSexPMs`,
    mobile_OS: `16.0.3`,
    Accept: `*/*`,
    buId: idpUserId,
    appId: `MyCadillac`,
    client_id,
    Cookie: KDLK_APP_COOKIE,
    access_token: KDLK_APP_ACCESS_TOKEN
};

getTask();

function getTask() {
    const url = `${baseUrl}/private/task/v4/getTasks`;
    const reqBody = {};

    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };

    $task.fetch(myRequest).then(
        async response => {
            const { body } = response;

            const { data, resultCode } = JSON.parse(body);

            const { taskGroups } = data;
            if (resultCode === '0000') {
                const task = taskGroups.find(item => item.taskGroup === 'DAY');
                if (task) {
                    // FINISHED 完成任务但没领奖
                    // RECEIVED 完成任务并已领奖
                    // UNFINISHED 没有完成
                    const list = task.tasks.filter(
                        i => i.status !== 'RECEIVED'
                    );

                    const len = list.length;
                    if (!len) {
                        $notify('凯迪拉克', `任务失败！`, `今日任务已做完！`);
                        console.log(`任务失败！今日任务已做完！`);
                    } else {
                        for (let i = 0; i < len; i++) {
                            const item = list[i];
                            await doTask(item);
                        }
                    }
                }
            }
            $done();
        },
        reason => {
            console.log(reason.error);
            $done();
        }
    );
}

async function doTask(item) {
    const { id, status } = item;
    if (status === 'FINISHED') {
        await getPrize(id);
    } else {
        await getList(id);
    }
}

async function getList(type) {
    const url = `${baseUrl}/public/newCommunity/article/v4/getArticles`;
    const reqBody = {
        limit: '10',
        scope: 'ALL',
        idpUserId,
        category: 'RECOMMEND',
        skip: '0'
    };

    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };

    await $task.fetch(myRequest).then(
        async response => {
            const { body } = response;
            const { data } = JSON.parse(body);
            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    if (type === 'KD_FORWARD') {
                        await forward(item);
                    }
                    if (type === 'KD_BROWSE') {
                        await read(item);
                    }
                    if (type === 'KD_PRAISE') {
                        await like(item, 'CANCEL');
                        await like(item, 'PRAISED');
                    }
                }
                await getPrize(type);
            }
        },
        reason => {
            console.log(reason.error);
        }
    );
}

async function like(item, type) {
    const url = `${baseUrl}/private/newCommunity/article/v1/praise`;
    const reqBody = { articleId: item.id, praiseType: type };

    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };

    await $task.fetch(myRequest).then(
        response => {
            const { body } = response;

            console.log('\n================================================\n');
            console.log(
                `${type === 'CANCEL' ? '取赞' : '点赞'}文章：${item.title}`
            );
            console.log(body);
            console.log('\n================================================\n');
        },
        reason => {
            console.log(reason.error);
        }
    );
}

async function read(item) {
    const url = `${baseUrl}/public/newCommunity/article/v1/read`;
    const reqBody = { articleId: item.id };

    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };

    await $task.fetch(myRequest).then(
        response => {
            const { body } = response;

            console.log('\n================================================\n');
            console.log(`阅读文章：${item.title}`);
            console.log(body);
            console.log('\n================================================\n');
        },
        reason => {
            console.log(reason.error);
        }
    );
}

async function forward(item) {
    const url = `${baseUrl}/public/newCommunity/article/v1/forward`;
    const reqBody = { articleId: item.id, idpUserId };

    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };

    await $task.fetch(myRequest).then(
        response => {
            const { body } = response;

            console.log('\n================================================\n');
            console.log(`转发文章：${item.title}`);
            console.log(body);
            console.log('\n================================================\n');
        },
        reason => {
            console.log(reason.error);
        }
    );
}

async function getPrize(type) {
    const url = `${baseUrl}/private/task/loop/v2/receiveReward`;
    const reqBody = { id: type };

    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };

    await $task.fetch(myRequest).then(
        response => {
            const { body } = response;

            const { resultCode, message } = JSON.parse(body);

            console.log('\n================================================\n');
            console.log(body);
            const textObj = {
                KD_BROWSE: '浏览文章',
                KD_PRAISE: '点赞文章',
                KD_FORWARD: '转发文章'
            };

            const text = textObj[type];

            if (resultCode !== '0000') {
                $notify('凯迪拉克', `${text}任务失败！`, `${message}`);
                console.log(`${text}任务失败！${message}`);
            } else {
                $notify('凯迪拉克', `${text}任务成功！`);
                console.log(`${text}任务成功！`);
            }
            console.log('\n================================================\n');
        },
        reason => {
            console.log(reason.error);
        }
    );
}
