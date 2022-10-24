// 该脚本用于获取签到的Cookie

try {
    const { headers, url, body } = $request;
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
    $prefs.setValueForKey(url, 'WPH_URL');
    $prefs.setValueForKey(body, 'WPH_BODY');
    $prefs.setValueForKey(headers, 'WPH_HEADERS');
    $notify(
        '唯品会',
        `Cookie写入成功！`,
        `url：${url}，\n\n
        body：${body}，\n\n
        headers：${headers}`
    );
    $done();
} catch (err) {
    console.log('\n========================error========================\n');
    console.log(err);
    console.log('\n========================error========================\n');
    $done();
}
