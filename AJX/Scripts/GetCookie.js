// 该脚本用于获取签到的Cookie

try {
	const { headers } = $request;
	const { Cookie, Authorization } = headers;
	if (!Cookie || !Authorization) {
		console.log('\n================================================\n');
		console.log('获取Cookie失败：');
		console.log(JSON.stringify(headers));
		console.log('\n================================================\n');

		$notify('安吉星', `Cookie获取失败！`);

		$done();
		return;
	}
	$prefs.setValueForKey(Cookie, 'AJX_COOKIE');
	$prefs.setValueForKey(Authorization, 'AJX_TOKEN');
	$notify('安吉星', `Cookie写入成功！`
		, `Cookie：${Cookie}，\n\n
		Authorization${Authorization}`);
	$done();
} catch (err) {
	console.log('\n========================error========================\n');
	console.log(err);
	console.log('\n========================error========================\n');
	$done();
}
