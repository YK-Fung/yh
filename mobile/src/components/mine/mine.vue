<template>
    <div class="wrap">
        <!-- 用户信息 -->
        <div class="user-message">
            <!-- logo -->
            <div class="user-logo">
                <img :src="imgUrl">
            </div>
            <!-- 用户名 -->
            <div class="user-name" v-if="isLogin">
                <h4>{{companyName}}</h4>
                <p><span>用户名：</span><span class="name">{{userName}}</span></p>
            </div>
            <!-- 立即登录 -->
            <div class="no-login" v-else>
                <router-link :to="{path:'/login'}" replace>立即登录</router-link>
            </div>
            <!-- 账号管理 -->
            <div class="account">
                <router-link :to="(isLogin?'/account':'/login')" replace>账号管理</router-link>
            </div>
        </div>
        <!-- 我的订单 -->
        <div class="my-order">
            <div class="title">我的订单</div>
            <ul>
                <li @click="isLogin?$router.push({path:'/orderMine',query:{ status: 'all' }}):$router.replace('/login')">全部订单</li>
                <!--<li @click="isLogin?$router.push({path:'/orderMine',query:{ status: 'confirmed' }}):$router.replace('/login')">待确认</li>-->
                <li @click="isLogin?$router.push({path:'/orderMine',query:{ status: 'paid' }}):$router.replace('/login')">待付款</li>
                <li @click="isLogin?$router.push({path:'/orderMine',query:{ status: 'receipt' }}):$router.replace('/login')">待收货</li>
            </ul>
        </div>
        <!-- 我的收藏 -->
        <div class="my-collect">
            <div class="title">我的收藏</div>
            <ul>
                <li @click="isLogin?$router.push({path:'/collect',query:{ index: 0 }}):$router.replace('/login')">商品收藏</li>
                <li @click="isLogin?$router.push({path:'/collect',query:{ index: 1 }}):$router.replace('/login')">店铺收藏</li>
                <li @click="isLogin?$router.push('/footprint'):$router.replace('/login')">我的足迹</li>
            </ul>
        </div>
        <!-- 底部tabbar -->
        <tabbar></tabbar>
    </div>
</template>
<script>
    import tabbar from '../subcom/tab-bar';
    export default {
        name : "mine",
        components:{
            tabbar
        },
        data() {
            return {
                //是否登录
                isLogin: false,
                //个人信息
                imgUrl: require('../../assets/shop-logo.png'),
                companyName: '',
                userName: '',
                //用户id
                id: '',
            }
        },
        created() {
            //获取用户信息
            let timeStamp = new Date().getTime();
            this.$http({
                method: 'post',
                url: this._ajaxUrl + '/customer/info/getMyAccountInfo',
                headers: {
                    "time-stamp": timeStamp
                }
            }).then((res) => {
                console.log(res)
                //成功
                if(res.data.errorCode == '0000'){
                    if(res.data.data.storeInfo){
                        this.companyName = res.data.data.storeInfo.companyName;//公司名
                    }
                    this.userName = res.data.data.userInfo.userName;//用户名
                    this.id = res.data.data.userInfo.id;//id
                    this.isLogin = true;
                } else if(res.data.errorCode == 'login_0004'){
                    this.isLogin = false;
                } else{
                    this.isLogin = false;
                    alert(res.data.message);
                }
            });
        }
    }
</script>
<style lang="less" scoped>
    .user-message{
        width: 100%;
        height: 218px;
        background: url(../../assets/user-bg.jpg);
        background-size: cover;
        box-shadow: 0px 2px 4px 0px rgba(244, 49, 27, 0.35);
        display: flex;
        align-items:center
    }
    /* logo */
    .user-logo{
        width: 26%;
        float: left;
        text-align: center;
        img{
            width: 130px;
            height: 130px;
            border-radius: 50%;
            box-shadow: 0px 3px 3px 0px rgba(27, 118, 205, 0.1);
        }
    }
    /* 公司名 */
    .user-name{
        width: 51%;
        color:#fff;
        text-align: left;
        float: left;
        padding-right: 10px;
        h4{
            width: 100%;
            line-height: 52px;/*px*/
            font-size: 28px;/*px*/
            font-weight: normal;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        p{
            font-size: 24px;/*px*/
            background:rgba(209,52,29,.5);
            border-radius: 22px;
            padding: 6px 18px;
            display: inline-block;
        }
        span{
            float: left;
            &.name{
                max-width: 200px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
    /* 立即登录 */
    .no-login{
        width: 51%;
        text-align: left;
        float: left;
        padding-right: 10px;
        a{
            width: 160px;
            height: 58px;
            line-height: 58px;/*px*/
            font-size: 28px;/*px*/
            color:#fff;
            text-align: center;
            color:#fff;
            border:2px solid #fff;
            border-radius: 30px;
            display: inline-block;
        }
    }
    /* 账号管理 */
    .account{
        width: 23%;
        float: left;
        font-size: 24px;/*px*/
        text-align: left;
        a{
            color: #fff;
            background: url(../../assets/icon/icon-manage.png) no-repeat 0 center;
            background-size: 24px 24px; 
            padding-left: 42px;
        }
    }
    /* 我的订单 */
    .my-order{
        background-color: #fff;
        margin-top: 16px;
        .title{
            color:#666;
            line-height: 62px;/*px*/
            box-shadow: 0 -1px #e5e5e5 inset;
            font-size: 32px;/*px*/
            padding: 0 30px;
        }
        ul{
            display: flex;
        }
        li{
            height: 145px;
            flex:1;
            text-align: center;
            line-height: 74px;/*px*/
            font-size: 28px;/*px*/
            color:#666;
            padding-top: 74px;
            background: url(../../assets/icon/icon-order.png) no-repeat center 25px;
            background-size: 42px 44px;
            &:nth-of-type(2){
                background-image: url(../../assets/icon/icon-wait.png);
                background-size: 45px 45px;
            }
             &:nth-of-type(3){
                background-image: url(../../assets/icon/icon-pay.png);
                background-size: 44px 44px;
            }
            &:nth-of-type(4){
                background-image: url(../../assets/icon/icon-delivery.png);
                background-size: 54px 44px;
            }
        }
    }
    /* 我的收藏 */
    .my-collect{
        .my-order;
        li{
            &:nth-of-type(1){
                background-image: url(../../assets/icon/icon-collect.png);
                background-size: 44px 44px;
            }
            &:nth-of-type(2){
                background-image: url(../../assets/icon/icon-shop.png);
                background-size: 44px 44px;
            }
            &:nth-of-type(3){
                background-image: url(../../assets/icon/icon-footprint.png);
                background-size: 44px 44px;
            }
        }
    }
</style>