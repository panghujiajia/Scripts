// 该脚本用于获取签到的Cookie

try {
    const { headers } = $request;
    const { Cookie, Authorization } = headers;
    if (!Cookie || !Authorization) {
        console.log('\n================================================\n');
        console.log('获取Cookie失败：');
        console.log(JSON.stringify(headers));
        console.log('\n================================================\n');

        $notify('唯品会', `Cookie获取失败！`);

        $done();
        return;
    }
    $prefs.setValueForKey(Cookie, 'WPH_COOKIE');
    $prefs.setValueForKey(Authorization, 'WPH_TOKEN');
    $notify(
        '唯品会',
        `Cookie写入成功！`,
        `Cookie：${Cookie}，\n\n
        Authorization${Authorization}`
    );
    $done();
} catch (err) {
    console.log('\n========================error========================\n');
    console.log(err);
    console.log('\n========================error========================\n');
    $done();
}
