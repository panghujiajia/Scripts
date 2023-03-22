function Tool(title) {
    return new (class {
        constructor(title) {
            const isNode =
                'undefined' !== typeof module && !!module.exports && 'node';
            const isQuanX = 'undefined' !== typeof $task && 'quanx';

            const ENV = isNode || isQuanX;

            this.ENV = ENV;
            // title用作notice的标题
            this.title = title || '📣📣📣';

            this.log(`脚本应用：${this.title}\n脚本环境：${ENV}`);
        }
        // 发起请求
        request(options) {
            return this[`_${this.ENV}`]().request(options);
        }
        // 结束
        done() {
            return this[`_${this.ENV}`]().done();
        }
        wait(time) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(true);
                }, time * 1000 || 2000);
            });
        }
        /**
         * 通知，主标题用实例化的入参
         * @param {*} subTitle 副标题
         * @param {*} detail 详情
         * @returns
         */
        notify(subTitle, detail) {
            return this[`_${this.ENV}`]().notify([subTitle, detail]);
        }
        // 取缓存
        getStore(key) {
            return this[`_${this.ENV}`]().store.get(key);
        }
        // 存缓存
        setStore(key, value) {
            return this[`_${this.ENV}`]().store.set(key, value);
        }
        // 日志
        log(value) {
            try {
                if (typeof value !== 'string') {
                    if (typeof value === 'object') {
                        console.log(`\n${JSON.stringify(value)}`);
                    } else {
                        console.log(`\n${value}`);
                    }
                } else {
                    console.log(`\n${value}`);
                }
            } catch (error) {
                console.log('\n================LOG ERROR================\n');
                console.log(`\n${error}`);
                console.log('\n');
                console.log(value);
            }
            console.log(`\n📔📔📔📔📔📔📔Log End📔📔📔📔📔📔📔\n`);
        }
        _node() {
            let { localStorage, fetch, log, title } = this;
            if (!localStorage) {
                let LocalStorage = require('node-localstorage').LocalStorage;
                const local = new LocalStorage('./store');
                localStorage = local;
                this.localStorage = local;
            }
            if (!fetch) {
                // mod.cjs
                const fet = (...args) =>
                    import('node-fetch').then(({ default: fetch }) =>
                        fetch(...args)
                    );
                fetch = fet;
                this.fetch = fetch;
            }
            return {
                request: async options => {
                    try {
                        const { url, ...rest } = options;
                        const response = await fetch(url, rest);
                        const { status } = response;
                        const contentType = rest.headers.contentType;
                        const data =
                            contentType === 'text/html'
                                ? await response.text()
                                : await response.json();
                        log(
                            `接口请求参数：${JSON.stringify(options)}\n
                            接口响应结果：${JSON.stringify(data)}`
                        );
                        if (status !== 200) {
                            return Promise.reject(data);
                        }
                        return Promise.resolve(data);
                    } catch (error) {
                        log(
                            `接口响应错误：\n${error}\n${JSON.stringify(error)}`
                        );
                        return Promise.reject(error);
                    }
                },
                notify: options => {
                    options.filter(item => !!item);
                    log(`${title}\n${options.join('\n')}`);
                },
                store: {
                    get: key => {
                        let value = localStorage.getItem(key);
                        try {
                            value = JSON.parse(value);
                        } catch (error) {}
                        return value;
                    },
                    set: (key, value) => {
                        if (typeof value === 'object') {
                            value = JSON.stringify(value);
                        }
                        localStorage.setItem(key, value);
                    }
                },
                done: () => {
                    log('Node done');
                }
            };
        }
        _quanx() {
            let { log, title } = this;
            return {
                request: async options => {
                    try {
                        const response = await $task.fetch(options);
                        const { statusCode, body } = response;
                        log(
                            `接口请求参数：${JSON.stringify(options)}\n
                            接口响应结果：${JSON.stringify(response)}`
                        );
                        if (statusCode !== 200) {
                            return Promise.reject(response);
                        }
                        return Promise.resolve(body);
                    } catch (error) {
                        log(
                            `接口响应错误：\n${error}\n${JSON.stringify(error)}`
                        );
                        return Promise.reject(error);
                    }
                },
                notify: options => {
                    switch (options.length) {
                        case 1:
                            $notify(title, options[0]);
                            break;
                        case 2:
                            $notify(title, options[0], options[1]);
                            break;
                        default:
                            break;
                    }
                },
                store: {
                    get: key => {
                        let value = $prefs.valueForKey(key);
                        try {
                            value = JSON.parse(value);
                        } catch (error) {}
                        return value;
                    },
                    set: (key, value) => {
                        if (typeof value === 'object') {
                            value = JSON.stringify(value);
                        }
                        $prefs.setValueForKey(value, key);
                    }
                },
                done: () => {
                    log('Quanx done');
                    $done();
                }
            };
        }
    })(title);
}
