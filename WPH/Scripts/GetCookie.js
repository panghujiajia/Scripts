// 该脚本用于获取签到的Cookie

try {
    const { headers, method, path } = $request;
    const { Cookie, Authorization } = headers;
    if (method !== 'POST') {
        $done();
    }
    if (!Cookie || !Authorization) {
        console.log('\n================================================\n');
        console.log('获取Cookie失败：');
        console.log(JSON.stringify(headers));
        console.log('\n================================================\n');

        $notify('唯品会', `Cookie获取失败！`);

        $done();
    }
    const QueryParams = path.split('?')[1];
    $prefs.setValueForKey(QueryParams, 'WPH_QUERYPARAMS');
    $prefs.setValueForKey(Cookie, 'WPH_COOKIE');
    $prefs.setValueForKey(Authorization, 'WPH_TOKEN');
    $notify(
        '唯品会',
        `Cookie写入成功！`,
        `Cookie：${Cookie}，\n\n
        Authorization：${Authorization}，\n\n
        QueryParams：${QueryParams}`
    );
    $done();
} catch (err) {
    console.log('\n========================error========================\n');
    console.log(err);
    console.log('\n========================error========================\n');
    $done();
}
