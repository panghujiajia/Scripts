/**
 * 安吉星签到脚本
 */

const AJX_COOKIE = $prefs.valueForKey('AJX_COOKIE');
const AJX_TOKEN = $prefs.valueForKey('AJX_TOKEN');
console.log('\n================================================\n');
console.log(`Cookie：${AJX_COOKIE}`);
console.log('\n================================================\n');

if (!AJX_COOKIE || !AJX_TOKEN) {
	$notify(
		'安吉星',
		`Cookie读取失败！`,
		`请先打开重写，进去APP-我的-今日签到获取Cookie`
	);
	$done();
}

const method = 'POST';
const baseUrl = 'https://www.onstar.com.cn/mssos/sos/credit/v1/';
const headers = {
	'Connection': `keep-alive`,
	'Accept-Encoding': `gzip, deflate, br`,
	'Content-Type': `application/json`,
	'Origin': `https://www.onstar.com.cn`,
	'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
	'Authorization': `${AJX_TOKEN}`,
	'Cookie': `${AJX_COOKIE}`,
	'Host': `www.onstar.com.cn`,
	'Referer': `https://www.onstar.com.cn/mweb/ma80/sharedProjects/index.html`,
	'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
	'Accept': `*/*`
};

getSigninInfo();

// 签到方法
async function getSignin() {
	try {
		const url = `${baseUrl}/userSignIn`;
		const reqBody = `{}`;

		const myRequest = {
			url,
			method,
			headers,
			body: JSON.stringify(reqBody),
		};
		await $task.fetch(myRequest).then(
			async response => {
				const { body } = response;

				console.log(
					'\n================================================\n'
				);
				console.log(body);
				console.log(
					'\n================================================\n'
				);

				const { bizCode, bizMsg } = JSON.parse(body);

				if (bizCode === 'E0000') {
					await getSigninInfo(true);
				} else {
					$notify('安吉星', `签到失败！`, `失败原因：${bizMsg}`);
					console.log(
						'\n================================================\n'
					);
					console.log(`签到失败：${bizMsg}`);
					console.log(
						'\n================================================\n'
					);
				}

				$done();
			},
			reason => {
				console.log(
					'\n================================================\n'
				);
				console.log(reason.error);
				console.log(
					'\n================================================\n'
				);
				$done();
			}
		);
	} catch (err) {
		$done();
	}
}

// 获取签到信息
async function getSigninInfo(success) {
	try {
		const url = `${baseUrl}/getUserSignInit`;
		const reqBody = {};

		const myRequest = {
			url,
			method,
			headers,
			body: JSON.stringify(reqBody),
		};
		await $task.fetch(myRequest).then(
			async response => {
				const { body } = response;

				console.log(
					'\n================================================\n'
				);
				console.log(body);
				console.log(
					'\n================================================\n'
				);

				const {
					data: {currentSign,continueDays,signRanKing, currentYear, currentMonth, currentDay}
				} = JSON.parse(body);

				if (!currentSign) {
					await getSignin();
				} else {
					console.log(
						'\n================================================\n'
					);
					console.log(`${currentYear}-${currentMonth}-${currentDay}`);
					console.log(
						'\n================================================\n'
					);
					if (success) {
						$notify(
							'安吉星',
							`签到成功！`,
							`已连续签到${continueDays}天，今日签到排名${signRanKing}`
						);
						console.log(
							`已连续签到${continueDays}天，今日签到排名${signRanKing}`
						);
					} else {
						$notify(
							'安吉星',
							`今日已签到！`,
							`已连续签到${continueDays}天，今日签到排名${signRanKing}`
						);
						console.log(
							`今日已签到！已连续签到${continueDays}天，今日签到排名${signRanKing}`
						);
					}

					console.log(
						'\n================================================\n'
					);
				}

				$done();
			},
			reason => {
				console.log(
					'\n================================================\n'
				);
				console.log(reason.error);
				console.log(
					'\n================================================\n'
				);

				$done();
			}
		);
	} catch (err) {
		$done();
	}
}
