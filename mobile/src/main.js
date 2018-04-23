import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import cryptojs from 'crypto-js'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import 'lib-flexible';

// mobile调试，发布的时候要关闭
// import vConsole from 'vconsole'
// let _console = new vConsole();

// mock模拟数据，发布的时候要关闭
// import '@/mock/zl'
// import '@/mock/yq'
// import '@/mock/xj'

// 如果是开发环境，设置为proxy代理的路径(在config/index.js设置)，如果是生产环境使用正式的路径
if (process.env.NODE_ENV === 'development') {
    Vue.prototype._ajaxUrl = '/ajaxUrl'
} else {
    Vue.prototype._ajaxUrl = window.location.origin + '/apis'
}

// 设置全局变量
// Vue.prototype._tiemStamp = new Date().getTime();
Vue.prototype._cryptojs = cryptojs;
Vue.prototype.$http = axios;

// 设置表头
axios.defaults.headers.post['mobile-type'] = 'yhstore-mobile-h5';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['accept-encoding'] = 'gzip,deflate';
// axios.defaults.headers.post['time-stamp'] = Vue.prototype._tiemStamp;
axios.defaults.headers.post['api-version'] = '1.0';
// axios.defaults.headers.post['data-signature'] = '';
axios.defaults.headers.post['accessToken'] = document.cookie.split('token=')[1] ? document.cookie.split('token=')[1].split(';')[0] : '';
axios.defaults.withCredentials = true;

Vue.use(Mint, {
    lazyload: {
        error: '',
        // preLoad:1,
        loading: require('./assets/loading.gif'),
        listenEvents: ['scroll']
    }
});


/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: {App},
    mode: 'history',
    history: true,
    router
});

// 设置title
if (router.app._route) {
    let _route = router.app._route;
    document.title = _route.meta.title;
    if (_route.path == '/storeSearchList' || _route.path == '/helpDetail') {
        document.title = _route.query.title;
    }
}
;

// 修改title
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
        if (to.path == '/storeSearchList' || to.path == '/helpDetail') {
            document.title = to.query.title;
        }
    };
    if (document.cookie.split('token=')[1]) {
        axios.defaults.headers.post['accessToken'] = document.cookie.split('token=')[1].split(';')[0];
        // 获取最后访问地址
        if (to.path !== '/login') {
            localStorage.setItem('toPath', to.path);
            localStorage.setItem('toQuery', JSON.stringify(to.query));
        }
    } else {
        axios.defaults.headers.post['accessToken'] = '';
        if (from.path !== '/login' && from.path !== '/forgetPassword') {
            sessionStorage.setItem('fromPath', from.path);
            sessionStorage.setItem('fromQuery', JSON.stringify(from.query));
        }
    }
    // axios.defaults.headers.post['accessToken'] = document.cookie ? document.cookie.split('token=')[1] : '';
    next();
});
