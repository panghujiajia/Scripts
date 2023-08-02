// const $ = new Tool('标题');
// $.notify('副标题', '详情'); // 通知
// let store = $.getStore('key'); // 读取缓存
// $.log(store); // 打印
// $.setStore('key', 'value'); // 设置缓存

// async function test() {
//     // 发起请求
//     const res = await $.request({
//         url: 'https://www.baidu.com',
//         method: 'POST',
//         headers: {
//             contentType: 'text/html'
//         }
//     });
//     $.done(res);
// }
// test();

function Tool(title = '📣📣📣') {
    const isNode = 'undefined' !== typeof module && !!module.exports && 'node';
    const isQuanX = 'undefined' !== typeof $task && 'quanx';
    const isSurge = 'undefined' !== typeof $httpClient && 'surge';

    const ENV = isNode || isQuanX || isSurge;
    // title用作notice的标题
    this.title = title;

    const adapterStatus = response => {
        if (response) {
            if (response.status) {
                response['statusCode'] = response.status;
            } else if (response.statusCode) {
                response['status'] = response.statusCode;
            }
        }
        return response;
    };
    const nodeInit = () => {
        let { localStorage, fetch } = this;
        if (!localStorage) {
            let LocalStorage = require('node-localstorage').LocalStorage;
            const local = new LocalStorage('./store');
            localStorage = local;
        }
        if (!fetch) {
            // mod.cjs
            const fet = (...args) =>
                import('node-fetch').then(({ default: fetch }) =>
                    fetch(...args)
                );
            fetch = fet;
        }
        return { localStorage, fetch };
    };
    // 日志
    this.log = value => {
        if (typeof value === 'object') {
            console.log(`\n${JSON.stringify(value)}`);
        } else {
            console.log(`\n${value}`);
        }
    };
    // 发起请求
    this.request = async options => {
        if (isQuanX) {
            try {
                const response = await $task.fetch(options);
                const { status, body } = adapterStatus(response);
                if (status !== 200) {
                    return Promise.reject(response);
                }
                return Promise.resolve(body);
            } catch (error) {
                this.log(`接口响应错误：\n${error}\n${JSON.stringify(error)}`);
                return Promise.reject(error);
            }
        }
        if (isSurge) {
            return new Promise((resolve, reject) => {
                const { method } = options;
                const httpEnum = {
                    POST: (options, callback) => {
                        $httpClient.post(options, (error, response, body) => {
                            callback(error, adapterStatus(response), body);
                        });
                    },
                    GET: (options, callback) => {
                        $httpClient.get(options, (error, response, body) => {
                            callback(error, adapterStatus(response), body);
                        });
                    }
                };
                httpEnum[method](options, (error, response, body) => {
                    if (error) {
                        return reject(error);
                    }
                    const { status } = response;
                    if (status !== 200) {
                        return reject(response);
                    }
                    return resolve(body);
                });
            });
        }
        if (isNode) {
            const { localStorage, fetch } = nodeInit();
            try {
                const { url, ...rest } = options;
                const response = await fetch(url, rest);
                const { status } = adapterStatus(response);
                const contentType = rest.headers.contentType;
                const data =
                    contentType === 'text/html'
                        ? await response.text()
                        : await response.json();
                if (status !== 200) {
                    return Promise.reject(data);
                }
                return Promise.resolve(data);
            } catch (error) {
                this.log(`接口响应错误：\n${error}\n${JSON.stringify(error)}`);
                return Promise.reject(error);
            }
        }
    };
    // 结束
    this.done = res => {
        if (isQuanX || isSurge) $done({ res });
        if (isNode) this.log({ res });
    };
    this.wait = time => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, time * 1000 || 2000);
        });
    };
    /**
     * 通知，主标题用实例化的入参
     * @param {*} subTitle 副标题
     * @param {*} detail 详情
     * @returns
     */
    this.notify = (subtitle = '', body = '') => {
        if (isQuanX) $notify(this.title, subtitle, body);
        if (isSurge) $notification.post(this.title, subtitle, body);
        if (isNode) this.log(`${this.title}\n${subtitle}\n${body}`);
    };
    // 取缓存
    this.getStore = key => {
        if (isQuanX) return $prefs.valueForKey(key);
        if (isSurge) return $persistentStore.read(key);
        if (isNode) {
            const { localStorage, fetch } = nodeInit();
            let value = localStorage.getItem(key);
            try {
                value = JSON.parse(value);
            } catch (error) {}
            return value;
        }
    };
    // 存缓存
    this.setStore = (key, value) => {
        if (isQuanX) $prefs.setValueForKey(value, key);
        if (isSurge) $persistentStore.write(value, key);
        if (isNode) {
            const { localStorage, fetch } = nodeInit();
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            localStorage.setItem(key, value);
        }
    };
    this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`);
}
