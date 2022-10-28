// prettier-ignore
class PanghuJiajia{constructor(t){const e="undefined"!=typeof module&&!!module.exports&&"node",i="undefined"!=typeof $task&&"quanx",s=e||i;this.ENV=s,this.init=function(t,e){return this[`_${s}_${e}`](t)},this.title=t,this.log(`脚本应用：${t}\n脚本环境：${s}`)}request(t){return this.init(t,"Request")}done(t){if("node"!==this.ENV)return this.init(t,"Done")}notify(t,e,i){return this.init({title:t,subTitle:e,detail:i},"Notify")}log(t){console.log("\n📔📔📔Log Start📔📔📔\n"),"string"!=typeof t?console.log(JSON.stringify(t)):console.log(t),console.log("\n📔📔📔Log End📔📔📔\n")}async _node_Request(t){try{const e=this.axios||require("axios");this.axios=e,this.log(`接口请求参数：${JSON.stringify(t)}`);const i=await e(t),{status:s,data:o}=i;return 200!==s?Promise.reject(i):Promise.resolve(o)}catch(t){return this.log(`接口响应错误：${t.message}`),Promise.reject(t)}}async _node_Notify({title:t,subTitle:e,detail:i}){this.log(`${t}\n${e}\n${i}`)}async _quanx_Request(t){try{this.log(`接口请求参数：${JSON.stringify(t)}`);const e=await $task.fetch(t),{statusCode:i,body:s}=e;return 200!==i?Promise.reject(e):Promise.resolve(s)}catch(t){return this.log(`接口响应错误：${t.message}`),Promise.reject(t)}}async _quanx_Notify({title:t,subTitle:e,detail:i}){$notify(t,e,i)}_quanx_Done(){$done()}}

const panghu = new PanghuJiajia('京东');



const JD_URL = $prefs.valueForKey('JD_URL');
const JD_HEADERS = $prefs.valueForKey('JD_HEADERS');

if (!JD_HEADERS || !JD_URL) {
    $notify('京东', `Cookie读取失败！`, `请先打开重写，进入京东获取Cookie`);
    $done();
}

getSignin();

// 签到方法
async function getSignin() {
    try {
        const myRequest = {
            url: JD_URL,
            method: 'GET',
            headers: JSON.parse(JD_HEADERS)
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

                if (body.indexOf('"code":"0"') > -1) {
                    let beanCount = body.match(
                        /[.]*"beanCount":"(\d+)"[.]*/
                    )[1];
                    if (body.indexOf('签到成功') > -1) {
                        $notify(
                            '京东',
                            `签到成功！`,
                            `本次签到获得${beanCount}京豆`
                        );
                    }
                    if (body.indexOf('今天已签到') > -1) {
                        $notify('京东', `签到失败！`, `今天已签到`);
                    }
                } else {
                    $notify('京东', `签到失败！`, `${body}`);
                    console.log(
                        '\n================================================\n'
                    );
                    console.log(`签到失败：${body}`);
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
    } catch (error) {
        console.log('============error');
        console.log(error);
        $done();
    }
}
