class PanghuJiajia {
    constructor(title) {
        const isNode =
            'undefined' !== typeof module && !!module.exports && 'node';
        const isQuanX = 'undefined' !== typeof $task && 'quanx';

        const ENV = isNode || isQuanX;

        function init(options, api) {
            return this[`_${ENV}_${api}`](options);
        }

        this.ENV = ENV;
        this.init = init;
        this.title = title;

        this.log(`脚本应用：${title}\n脚本环境：${ENV}`);
    }
    // 发起请求
    request(options) {
        return this.init(options, 'Request');
    }
    // 结束
    done(options) {
        if (this.ENV !== 'node') {
            return this.init(options, 'Done');
        }
    }
    // 通知
    notify(title, subTitle, detail) {
        return this.init({ title, subTitle, detail }, 'Notify');
    }
    // 日志
    log(value) {
        console.log(`\n📔📔📔Log Start📔📔📔\n`);
        if (typeof value !== 'string') {
            console.log(JSON.stringify(value));
        } else {
            console.log(value);
        }
        console.log(`\n📔📔📔Log End📔📔📔\n`);
    }

    /**
     * 不同平台方法封装
     * 前缀需跟 ENV 保持一致
     */
    async _node_Request(options) {
        try {
            const axios = this.axios || require('axios');
            this.axios = axios;
            this.log(`接口请求参数：${JSON.stringify(options)}`);
            const response = await axios(options);
            const { status, data } = response;
            if (status !== 200) {
                return Promise.reject(response);
            }
            return Promise.resolve(data);
        } catch (error) {
            this.log(`接口响应错误：${error.message}`);
            return Promise.reject(error);
        }
    }
    _node_Notify({ title, subTitle, detail }) {
        this.log(`${title}\n${subTitle}\n${detail}`);
    }
    async _quanx_Request(options) {
        try {
            this.log(`接口请求参数：${JSON.stringify(options)}`);
            const response = await $task.fetch(options);
            const { statusCode, body } = response;
            if (statusCode !== 200) {
                return Promise.reject(response);
            }
            return Promise.resolve(body);
        } catch (error) {
            this.log(`接口响应错误：${error.message}`);
            return Promise.reject(error);
        }
    }
    _quanx_Notify({ title, subTitle, detail }) {
        $notify(title, subTitle, detail);
    }
    _quanx_Done() {
        $done();
    }
}
