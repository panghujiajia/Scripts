// 该脚本用来刷新Cookie和Token

const WPH_URL = $prefs.valueForKey('WPH_URL');
const WPH_BODY = $prefs.valueForKey('WPH_BODY');
const WPH_HEADERS = JSON.parse($prefs.valueForKey('WPH_HEADERS'));

if (!WPH_URL || !WPH_BODY || !WPH_HEADERS) {
    $notify('唯品会', `Cookie读取失败！`, `请先打开重写，进入唯品会获取Cookie`);
    $done();
}

refreshAppToken();

function refreshAppToken() {
    const method = `POST`;
    const myRequest = {
        url: WPH_URL,
        method: method,
        headers: WPH_HEADERS,
        body: WPH_BODY
    };
    $task.fetch(myRequest).then(
        async response => {
            const { body } = response;

            console.log('\n================================================\n');
            console.log(body);
            console.log('\n================================================\n');

            const { code } = JSON.parse(body);
            if (code !== 1) {
                $notify('唯品会', `Cookie刷新失败！`, body);
            }
            $done();
        },
        reason => {
            console.log(reason.error);
            $done();
        }
    );
}
