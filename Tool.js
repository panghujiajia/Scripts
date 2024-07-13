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
    const formatStore = (key, value) => {
        try {
            value = JSON.parse(value);
        } catch (error) {}
        return value;
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
            console.log(`\n\n${JSON.stringify(value)}`);
        } else {
            console.log(`\n\n${value}`);
        }
    };
    // 发起请求
    this.request = async options => {
        if (isQuanX) {
            try {
                this.log(`url：\n\n${options.url}`);
                this.log(`headers：\n\n${JSON.stringify(options.headers)}`);
                this.log(`body：\n\n${options.body}`);
                const response = await $task.fetch(options);
                const { status, body } = adapterStatus(response);
                if (status !== 200) {
                    return Promise.reject(response);
                }
                this.log('status：', status);
                this.log('body：', body);
                return Promise.resolve(body);
            } catch (error) {
                this.log(`接口响应错误：\n${error}\n${JSON.stringify(error)}`);
                return Promise.reject(error);
            }
        }
        if (isSurge) {
            return new Promise((resolve, reject) => {
                this.log(`url：\n\n${options.url}`);
                this.log(`headers：\n\n${JSON.stringify(options.headers)}`);
                this.log(`body：\n\n${options.body}`);
                const { method } = options;
                $httpClient[method.toLowerCase()](
                    options,
                    (error, response, body) => {
                        if (error) {
                            this.log(
                                `接口响应错误：\n${error}\n${JSON.stringify(
                                    error
                                )}`
                            );
                            return reject(error);
                        }
                        const { status } = adapterStatus(response);
                        if (status !== 200) {
                            return reject(response);
                        }
                        return resolve(body);
                    }
                );
            });
        }
        if (isNode) {
            try {
                const { localStorage, fetch } = nodeInit();
                this.log(`url：\n\n${options.url}`);
                this.log(`headers：\n\n${JSON.stringify(options.headers)}`);
                this.log(`body：\n\n${options.body}`);
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
    this.done = (value = {}) => {
        if (isQuanX || isSurge) $done(value);
        if (isNode) this.log(value);
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
        if (isQuanX) return formatStore(key, $prefs.valueForKey(key));
        if (isSurge) return formatStore(key, $persistentStore.read(key));
        if (isNode) {
            const { localStorage, fetch } = nodeInit();
            let value = localStorage.getItem(key);
            return formatStore(key, value);
        }
    };
    // 存缓存
    this.setStore = (key, value) => {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        if (isQuanX) $prefs.setValueForKey(value, key);
        if (isSurge) $persistentStore.write(value, key);
        if (isNode) {
            const { localStorage, fetch } = nodeInit();
            localStorage.setItem(key, value);
        }
    };
    this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`);
}
