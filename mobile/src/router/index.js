import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home/home';
import search from '../components/search/search';
import hotSearch from '../components/search/hot-search';
import hotSale from '../components/home/hot-sale';
import category from '../components/category/category';
import shopCar from '../components/shop-car/shop-car';
import orderSubmit from '../components/shop-car/order-submit';
import orderDetail from '../components/order/order-detail';
import orderBatches from '../components/order/order-batches';
import orderMine from '../components/order/order-mine';
import orderCancel from '../components/order/order-cancel';
import mine from '../components/mine/mine';
import address from '../components/address/address';
import addressEdit from '../components/address/address-edit';
import addressAdd from '../components/address/address-add';
import footprint from '../components/mine/my-footprint';
import collect from '../components/mine/my-collect';
import goodsDetail from '../components/goods-detail/goods-detail';
import login from '../components/user/login.vue';
import coupon from '../components/home/coupon';
import couponLink from '../components/home/coupon-link';
import comment from '../components/subcom/comment';
import logistics from '../components/subcom/logistics';
import storeDetail from '../components/store-detail/store-detail';
import storeProdList from '../components/store-detail/store-prod-list';
import storeSearch from '../components/store-detail/store-search';
import storeSearchList from '../components/store-detail/store-search-list';
import account from '../components/user/account';
import orderPay from '../components/order/order-pay';
import forgetPassword from '../components/user/forget-password';
import downLoad from '../components/load/app-download';
import unverified from '../components/user/unverified.vue';
import help from '../components/help/help';
import helpDetail from '../components/help/help-detail';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path:'/home',
            meta: {
                title: '药荟商城'
            },
            component: home
        },
        {
            path:'/search',
            meta: {
                title: '搜索'
            },
            component: search
        },
        {
            path:'/hotSearch',
            meta: {
                title: '搜索'
            },
            component: hotSearch
        },
        {
            path:'/hotSale',
            meta: {
                title: '热销专区'
            },
            component: hotSale
        },
        {
            path:'/category',
            meta: {
                title: '商品分类'
            },
            component: category
        },
        {
            path:'/shopCar',
            meta: {
                title: '购物车'
            },
            component: shopCar,
        },
        {
            path:'/orderSubmit',
            meta: {
                title: '提交订单'
            },
            component: orderSubmit,
        },
        {
            path:'/orderDetail',
            meta: {
                title: '订单详情'
            },
            component: orderDetail,
        },
        {
            path:'/orderBatches',
            meta: {
                title: '分批信息'
            },
            component: orderBatches,
        },
        {
            path:'/orderMine',
            meta: {
                title: '我的订单'
            },
            component: orderMine,
        },
        {
            path:'/orderCancel',
            meta: {
                title: '取消订单'
            },
            component: orderCancel,
        },
        {
            path:'/mine',
            meta: {
                title: '个人中心'
            },
            component:mine
        },
        {
            path:'/footprint',
            meta: {
                title: '我的足迹'
            },
            component:footprint
        },
        {
            path:'/collect',
            meta: {
                title: '我的收藏'
            },
            component:collect
        },
        {
            path:'/address',
            meta: {
                title: '收货地址'
            },
            component:address
        },
        {
            path:'/addressEdit',
            meta: {
                title: '修改收货地址'
            },
            component:addressEdit
        },
        {
            path:'/goodsDetail',
            meta: {
                title: '商品详情'
            },
            component:goodsDetail
        },
        {
            path:'/addressAdd',
            meta: {
                title: '编辑收货地址'
            },
            component:addressAdd
        },
        {
            path:'/login',
            meta: {
                title: '登录'
            },
            component:login
        },
        {
            path:'/coupon',
            meta: {
                title: '领优惠券'
            },
            component:coupon
        },
        {
            path:'/couponLink',
            meta: {
                title: '获取优惠券'
            },
            component:couponLink
        },
        {
            path:'/comment',
            meta: {
                title: '评论'
            },
            component:comment
        },
        {
            path:'/logistics',
            meta: {
                title: '查看物流'
            },
            component:logistics
        },
        {
            path:'/storeDetail',
            meta: {
                title: '商铺详情'
            },
            component:storeDetail
        },
        {
            path:'/storeProdList',
            meta: {
                title: '商铺详情'
            },
            component:storeProdList
        },
        {
            path:'/storeSearch',
            meta: {
                title: '商铺搜索'
            },
            component:storeSearch
        },
        {
            path:'/storeSearchList',
            meta: {
                title: '公司名称'
            },
            component:storeSearchList
        },
        {
            path:'/account',
            meta: {
                title: '账号管理'
            },
            component:account
        },
        {
            path:'/orderPay',
            meta: {
                title: '支付订单'
            },
            component:orderPay
        },
        {
            path:'/forgetPassword',
            meta: {
                title: '忘记密码'
            },
            component:forgetPassword
        },
        {
            path:'/downLoad',
            meta: {
                title: 'app下載'
            },
            component:downLoad
        },
        {
            path:'/unverified',
            meta: {
                title: '未认证提示'
            },
            component:unverified
        },
        {
            path:'/help',
            meta: {
                title: '帮助中心'
            },
            component:help
        },
        {
            path:'/helpDetail',
            meta: {
                title: '帮助中心'
            },
            component:helpDetail
        }
    ]
});
