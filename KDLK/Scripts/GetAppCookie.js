// 该脚本用于获取APP本身的Cookie和access_token

try {
	const { url, headers } = $request;
	const { Cookie, access_token, idpUserId, deviceId, client_id } = headers;
	const { body } = $response;

	const { data } = JSON.parse(body);
	if (url.includes('baseInfo')) {
		const phone = data.profileInfo.phone;
		$prefs.setValueForKey(
			JSON.stringify({
				idpUserId,
				deviceId,
				client_id,
				phone,
			}),
			'KDLK_APP_HEARDERS'
		);
	} else {
		const { accessToken, refreshToken } = data.auth;
		if (accessToken || access_token) {
			$prefs.setValueForKey(
				accessToken || access_token,
				'KDLK_APP_ACCESS_TOKEN'
			);
		}
		if (refreshToken) {
			$prefs.setValueForKey(
				refreshToken,
				'KDLK_APP_REFRESH_ACCESS_TOKEN'
			);
		}
	}
	if (Cookie) {
		$prefs.setValueForKey(Cookie, 'KDLK_APP_COOKIE');
	}
	notify();
	$done();
} catch (err) {
	console.log('\n========================error========================\n');
	console.log(err);
	console.log('\n========================error========================\n');
	$done();
}

function notify() {
	const KDLK_APP_COOKIE = $prefs.valueForKey('KDLK_APP_COOKIE');
	const KDLK_APP_HEARDERS = $prefs.valueForKey('KDLK_APP_HEARDERS');
	const KDLK_APP_ACCESS_TOKEN = $prefs.valueForKey('KDLK_APP_ACCESS_TOKEN');
	const KDLK_APP_REFRESH_ACCESS_TOKEN = $prefs.valueForKey(
		'KDLK_APP_REFRESH_ACCESS_TOKEN'
	);
	console.log(
		`Cookie：${KDLK_APP_COOKIE}，\n\n
		AccessToken：${KDLK_APP_ACCESS_TOKEN}，\n\n
		RefreshToken：${KDLK_APP_REFRESH_ACCESS_TOKEN}`
	);
	if (
		KDLK_APP_COOKIE &&
		KDLK_APP_HEARDERS &&
		KDLK_APP_ACCESS_TOKEN &&
		KDLK_APP_REFRESH_ACCESS_TOKEN
	) {
		$notify(
			'凯迪拉克APP',
			`Cookie写入成功！`,

			`Cookie：${KDLK_APP_COOKIE}，\n\n
			AccessToken：${KDLK_APP_ACCESS_TOKEN}，\n\n
			RefreshToken：${KDLK_APP_REFRESH_ACCESS_TOKEN}`
		);
	}
}
