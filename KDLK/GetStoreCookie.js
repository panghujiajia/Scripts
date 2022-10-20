// 该脚本用于获取APP内部会员商城的Cookie

try {
	const { headers } = $request;
	const { Cookie } = headers;
	if (!Cookie) {
		console.log('\n================================================\n');
		console.log('获取Cookie失败：');
		console.log(JSON.stringify(headers));
		console.log('\n================================================\n');

		$notify('凯迪拉克会员商城', `Cookie获取失败！`);

		$done();
		return;
	}
	$prefs.setValueForKey(Cookie, 'KDLK_STORE_COOKIE');
	$notify('凯迪拉克会员商城', `Cookie写入成功！`
		, `Cookie：${Cookie}`);
	$done();
} catch (err) {
	console.log('\n========================error========================\n');
	console.log(err);
	console.log('\n========================error========================\n');
	$done();
}
