// 该脚本用于获取签到的Cookie

try {
	const { headers } = $request;
	const { Cookie } = headers;
	if (!Cookie || Cookie.indexOf('A2=' < 0)) {
		console.log('\n================================================\n');
		console.log('获取Cookie失败：');
		console.log(JSON.stringify(headers));
		console.log('\n================================================\n');

		$notify('V2EX', `Cookie获取失败！`);

		$done();
		return;
	}
	$prefs.setValueForKey(Cookie, 'V2EX_COOKIE');
	$notify('V2EX', `Cookie写入成功！`
		, `Cookie：${Cookie}`);
	$done();
} catch (err) {
	console.log('\n========================error========================\n');
	console.log(err);
	console.log('\n========================error========================\n');
	$done();
}
