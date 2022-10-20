// 该脚本用来刷新Cookie和access_token

const KDLK_STORE_COOKIE = $prefs.valueForKey('KDLK_STORE_COOKIE');

const KDLK_APP_COOKIE = $prefs.valueForKey('KDLK_APP_COOKIE');
const KDLK_APP_HEARDERS = $prefs.valueForKey('KDLK_APP_HEARDERS');
const KDLK_APP_ACCESS_TOKEN = $prefs.valueForKey('KDLK_APP_ACCESS_TOKEN');
const KDLK_APP_REFRESH_ACCESS_TOKEN = $prefs.valueForKey(
	'KDLK_APP_REFRESH_ACCESS_TOKEN'
);

if (
	!KDLK_STORE_COOKIE ||
	!KDLK_APP_COOKIE ||
	!KDLK_APP_HEARDERS ||
	!KDLK_APP_ACCESS_TOKEN ||
	!KDLK_APP_REFRESH_ACCESS_TOKEN
) {
	$notify('凯迪拉克', `刷新Cookie失败！`, `请先打开重写，进去APP获取Cookie`);
	$done();
}

refreshAppToken();
function refreshAppToken() {
	const url = `https://app.sgmlink.com:443/service/mycadillacv3/rest/api/public/auth/v3/refreshToken`;
	const method = `POST`;
	const { idpUserId, deviceId, client_id, phone } =
		JSON.parse(KDLK_APP_HEARDERS);
	const headers = {
		Connection: `keep-alive`,
		'Accept-Encoding': `gzip, deflate, br`,
		app_version: `6.2.0`,
		'Content-Type': `application/json; charset=utf-8`,
		appId: `MyCadillac`,
		uuId: deviceId,
		deviceId,
		'X-Tingyun-Id': `4Nl_NnGbjwY;c=2;r=8936987;u=35e02d1754b727796a15156a1ad53435::BD4E4C616020FB61`,
		'User-Agent': `MyCadillac_Mycadillac_IOS_V.6.2.0__release/6.2.0 (iPhone; iOS 16.0.3; Scale/3.00)`,
		Cookie: KDLK_APP_COOKIE,
		Host: `app.sgmlink.com:443`,
		'Accept-Language': `zh-Hans-CN;q=1`,
		Accept: `*/*`,
		'X-Tingyun': `c=A|HYFIoSexPMs`,
	};
	const body = {
		permToken: KDLK_APP_REFRESH_ACCESS_TOKEN,
		userName: phone,
	};

	const myRequest = {
		url: url,
		method: method,
		headers: headers,
		body: JSON.stringify(body),
	};

	$task.fetch(myRequest).then(
		async response => {
			const { body } = response;

			console.log('\n================================================\n');
			console.log(body);
			console.log('\n================================================\n');

			const {
				resultCode,
				data: { accessToken },
			} = JSON.parse(body);
			if (resultCode !== '0000') {
				$notify('凯迪拉克APP', `Cookie刷新失败！请重新登录`, body);
			} else {
				$prefs.setValueForKey(accessToken, 'KDLK_APP_ACCESS_TOKEN');
			}
			await refreshStoreCookie();
			$done();
		},
		reason => {
			console.log(reason.error);
			$done();
		}
	);
}

async function refreshStoreCookie() {
	await $task
		.fetch({
			url: 'https://cadillac-club.mysgm.com.cn/touch/control/checkUserLogin',
			headers: {
				accept: '*/*',
				'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
				'cache-control': 'no-cache',
				pragma: 'no-cache',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'x-requested-with': 'XMLHttpRequest',
				Cookie: KDLK_STORE_COOKIE,
				Referer: 'https://cadillac-club.mysgm.com.cn/touchs/index.html',
				'Referrer-Policy': 'strict-origin-when-cross-origin',
			},
			body: null,
			method: 'POST',
		})
		.then(
			response => {
				const { body } = response;

				console.log(
					'\n================================================\n'
				);
				console.log(body);
				console.log(
					'\n================================================\n'
				);

				const { IS_LOGIN } = JSON.parse(body);
				if (!IS_LOGIN || IS_LOGIN !== 'Y') {
					$notify('凯迪拉克会员商城', `Cookie刷新失败！`, body);
				}
				$done();
			},
			reason => {
				console.log(reason.error);
				$done();
			}
		);
}
