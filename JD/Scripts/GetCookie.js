// 该脚本用于获取签到的Cookie

try {
    const { headers, url } = $request;

    console.log('\n================================================\n');
    const { Cookie } = headers;
    if (!Cookie) {
        console.log('\n================================================\n');
        console.log('获取Cookie失败：');
        console.log(JSON.stringify(headers));
        console.log('\n================================================\n');

        $notify('京东', `Cookie获取失败！`);

        $done();
        return;
    }
    $prefs.setValueForKey(url, 'JD_URL');
    $prefs.setValueForKey(headers, 'JD_HEADERS');
    $notify(
        '京东',
        `Cookie写入成功！`,
        `headers：${headers}，\n\n
		url：${url}`
    );
    $done();
} catch (err) {
    console.log('\n========================error========================\n');
    console.log(err);
    console.log('\n========================error========================\n');
    $done();
}
