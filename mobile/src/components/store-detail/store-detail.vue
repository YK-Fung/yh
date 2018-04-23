<template>
    <div class="wrap">
        <!--搜索框-->
        <div ref="searchOut" :class="{'curr':searchBarChange}" class="search-out">
            <div class="search-in">
                <router-link
                        :to="{path:'/storeSearch',query:{title:storeInfo.companyName,storeId:$route.query.storeId}}">
                    <i></i>
                    <input type="search" placeholder="搜索本店商品">
                </router-link>
            </div>
        </div>

        <div class="store-main" ref="storeMain">

            <!--顶部图片区域-->
            <div ref="banner" :class="{'marginBottom':searchBarChange}" class="store-banner">
                <img class="store-bg" :src="storeInfo.bgImg" alt="">
                <div class="store-banner-mask"></div>
                <div class="store-logo"><img :src="storeInfo.storeLogoUrl" alt=""></div>
                <div class="store-info">
                    <p class="store-name">{{storeInfo.companyName}}</p>
                    <p class="store-url">{{storeInfo.subDomainName}}.yaohuiw.com</p>
                </div>
                <div :class="{'collected':isCollect}" class="store-collect-btn" @click="addCollect">
                    <i v-show="!isCollect"></i>{{isCollect?'已收藏':'收藏'}}
                </div>
            </div>

            <!--选项卡-->
            <div ref="storeTab" class="store-tab" :class="{'tabFixed':searchBarChange}">
                <div class="store-tab-item tab-active">
                    <div class="store-home">店铺首页</div>
                </div>
                <div class="store-tab-item">
                    <div class="all-goods" @click="$router.replace('/storeProdList?storeId='+$route.query.storeId)">全部商品
                    </div>
                </div>
            </div>

            <!--店铺首页分类推荐-->
            <div class="cate-list" v-for="(item,index) in title">
                <div class="title">
                    <p class="store"><i
                            :style="{'background':'url('+ require('../../assets/icon/icon-store-med'+(index+1)+'.png') +') no-repeat','backgroundSize':'contain'}"></i>{{item.categoryName}}
                    </p>
                </div>
                <!--列表-->
                <div class="brand-list-out">
                    <div class="brand-list">
                        <ul :style="{'width':3.07*item.list.length+'rem'}">
                            <!--<ul >-->
                            <router-link :to="{path: '/goodsDetail', query: {goodsId: $item.goodsId}}"
                                         v-for="($item,$index) in item.list" :key="$index">
                                <li ref="li">
                                    <div>
                                        <img v-lazy="$item.goodsImg" alt="">
                                    </div>
                                    <p class="brand-list-title">{{$item.goodsName}}</p>
                                    <p class="amount">{{$item.spec}}</p>
                                    <p class="price" v-if="(numberTip==2)&&($item.isLimitGoodsStatus==0)">
                                        ￥<span>{{storePriceInt($item)}}</span>.{{storePriceDec($item)}}
                                    </p>
                                    <p class="price" v-if="numberTip==3">认证可见</p>
                                    <p class="price" v-if="numberTip&&($item.isLimitGoodsStatus==5)">定向供应</p>
                                    <p class="price" v-if="numberTip&&($item.isLimitGoodsStatus==6)">超出经营范围</p>
                                    <p class="price" v-if="!numberTip">登录可见</p>
                                </li>
                            </router-link>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!--取消收藏弹窗-->
        <div class="cancel-collect">
            <mt-popup
                    v-model="popupCollect"
                    position="bottom">
                <div class="cancel" @click="cancelCollect">取消收藏</div>
                <div class="wait" @click="popupCollect=false">容我想想</div>
            </mt-popup>
        </div>

    </div>
</template>

<script>
    import {Toast} from 'mint-ui';
    import Vue from 'vue';

    export default {
        name: "store-detail",
        components: {},
        data() {
            return {
                //店铺首页列表内每个li的宽度
                liWidth: 0,
                //账号认证状态
                numberTip: 0,
                //定向供应0 可以购买1
                buyFlag: 0,
                //店铺信息
                storeInfo: {},
                scrollTop: 0,
                //取消收藏弹窗是否显示
                popupCollect: false,
                //是否收藏
                isCollect: false,
                title: [],
                //搜索框是否吸顶效果
                searchBarChange: false,
                //是否登录
                // login: document.cookie.split('token=')[1] ? true : false
            }
        },
        methods: {
            //店铺首页显示的价格
            storePriceInt(item) {
                if (item.goodsProductLimitPrice) {
                    return (item.goodsProductLimitPrice.openOrCompleteSellMoney + '').split('.')[0]
                }
            },
            //店铺首页显示的价格
            storePriceDec(item) {
                if (item.goodsProductLimitPrice) {
                    if ((item.goodsProductLimitPrice.openOrCompleteSellMoney + '').split('.')[1]) {
                        return ((item.goodsProductLimitPrice.openOrCompleteSellMoney + '').split('.')[1]).length == 1 ? (item.goodsProductLimitPrice.openOrCompleteSellMoney + '').split('.')[1] + '0' : (item.goodsProductLimitPrice.openOrCompleteSellMoney + '').split('.')[1]
                    } else {
                        return '00'
                    }
                }
            },
            //取消收藏
            cancelCollect() {
                //取消收藏请求
                let timeStamp = new Date().getTime();
                let params = {"storeId": this.$route.query.storeId};
                let md5 = this._cryptojs.MD5(JSON.stringify(params));
                this.$http({
                    method: 'post',
                    url: this._ajaxUrl + '/encryption/aes',
                    headers: {
                        'data-signature': md5,
                    },
                    data: {
                        "timeStamp": timeStamp,
                        "requestBody": JSON.stringify(params)
                    }
                }).then((res) => {
                        let aes = res.data.data.aesRequestBody;
                        this.$http({
                            method: 'post',
                            headers: {
                                'data-signature': md5,
                                'time-stamp': timeStamp
                            },
                            url: this._ajaxUrl + '/store/collect/remove',
                            data: aes
                        }).then((res) => {
                            console.log(res.data);
                            if (res.data.errorCode == '0000') {
                                this.isCollect = false;
                                this.popupCollect = false;
                            } else if (res.data.errorCode == 'login_0004') {
                                //登录超时 清空cookie
                                document.cookie = 'token=';
                                this.numberTip = 0;
                            }
                        })
                    }
                );
            },
            //加入收藏
            addCollect() {
                if (this.isCollect) {
                    this.popupCollect = true;
                    return;
                }

                //添加收藏请求
                let timeStamp = new Date().getTime();
                let params = {"storeId": this.$route.query.storeId};
                let md5 = this._cryptojs.MD5(JSON.stringify(params));
                this.$http({
                    method: 'post',
                    url: this._ajaxUrl + '/encryption/aes',
                    headers: {
                        'data-signature': md5,
                    },
                    data: {
                        "timeStamp": timeStamp,
                        "requestBody": JSON.stringify(params)
                    }
                }).then((res) => {
                        let aes = res.data.data.aesRequestBody;
                        this.$http({
                            method: 'post',
                            headers: {
                                'data-signature': md5,
                                'time-stamp': timeStamp
                            },
                            url: this._ajaxUrl + '/store/collect/collectStore',
                            data: aes
                        }).then((res) => {
                            console.log(res.data);
                            if (res.data.errorCode == '0000') {
                                this.isCollect = true;
                            } else if (res.data.errorCode == 'login_0004') {
                                //登录超时 清空cookie
                                document.cookie = 'token=';
                                this.numberTip = 0;
                            }
                        })
                    }
                );
            },
            //页面滚动事件
            storeScroll() {

                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if (document.body.className == 'forbid-scroll') {
                    return;
                }

                this.searchBarChange = (scrollTop >= (this.$refs.banner.offsetHeight - this.$refs.searchOut.offsetHeight
                )) ? true : false

            },
        }
        ,
        created() {
            let timeStamp = new Date().getTime();
            this.$http({
                method: 'post',
                headers: {
                    'time-stamp': timeStamp
                },
                url: this._ajaxUrl + '/store/index/' + this.$route.query.storeId,
            }).then((res) => {
                console.log(res.data);
                if (res.data.errorCode == '0000') {
                    //有店铺
                    this.storeInfo = res.data.data.storeInfo;
                    this.isCollect = res.data.data.isCollection;
                    this.title = res.data.data.categoryInfo;
                    this.numberTip = res.data.data.numberTip;
                    if (!this.numberTip) {
                        //未登录
                        document.cookie = 'token=';
                    }
                } else {
                    //店铺不存在
                    // alert('店铺不存在')
                }
            })
        }
        ,
        mounted() {
            //监听页面滚动
            window.addEventListener('scroll', this.storeScroll);

            // this.liWidth = this.$refs.li[0].offsetWidth * this.categoryList.length;

            //监听从店铺优惠券或商品优惠券的路由跳转需要显示全部商品
            // if (this.$route.query.allGoods) {
            //     this.storeTabToggle(this.storeTab[1])
            // }
        }
        ,
        //切换路由时注销滚动事件
        destroyed() {
            window.removeEventListener('scroll', this.storeScroll)
        }
        ,
        watch: {}
    }
</script>

<style lang="less" scoped>

    .wrap {
        width: 100%;
        background: #f6f6f6;

        .search-out {
            width: 100%;
            height: 88px;
            display: flex;
            align-items: center;
            padding: 0 30px;
            position: fixed;
            top: 20px;
            z-index: 10;
            .search-in {
                width: 100%;
                height: 64px;
                border-radius: 30px;
                position: relative;
                i {
                    position: absolute;
                    width: 28px;
                    height: 28px;
                    left: 30px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: url("../../assets/search-grey.png") no-repeat;
                    background-size: contain;
                }
                input {
                    outline: none;
                    border: none;
                    width: 100%;
                    height: 100%;
                    border-radius: 30px;
                    background: rgba(246, 246, 246, 0.902);
                    color: #333;
                    font-size: 28px;
                    padding-left: 74px;
                }
                input.focus {
                    width: 80%;
                }
                ::-webkit-input-placeholder {
                    color: #ccc;
                }

            }
            .filter-nav {
                box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.038);

            }
        }
        .search-out.curr {
            box-shadow: 0 -1px  #eee inset;
            background: #fff;
            top: 0;
            input {
                background: #f2f2f2;
            }
        }
        .store-tab {

            height: 96px;
            width: 100%;
            background: #fff;
            display: flex;
            .store-tab-item {
                flex: 1;

                .store-home, .all-goods {
                    width: 200px;
                    height: 100%;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 96px;
                    font-size: 32px;
                    color: #999;
                }

            }
            /*选项卡切换*/
            .store-tab-item.tab-active {
                .store-home, .all-goods {
                    border-bottom: 3px solid #0066cc;
                    color: #0066cc;
                }
            }
        }

        /*选项卡固定*/
        .store-tab.tabFixed {
            position: fixed;
            left: 0;
            top: 88px;
            z-index: 10;
            box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.038);

        }
    }

    .store-main {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        background: #f6f6f6;
        .store-banner {
            position: relative;
            height: 280px;
            width: 100%;

            .store-bg {
                width: 100%;
                height: 100%;
            }
            .store-banner-mask {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background: rgba(0, 0, 0, 0.2);
            }
            .store-logo {
                width: 90px;
                height: 90px;
                position: absolute;
                left: 30px;
                bottom: 16px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .store-info {
                position: absolute;
                left: 135px;
                bottom: 27px;
                .store-name {
                    font-size: 32px;
                    color: #fff;
                }
                .store-url {
                    font-size: 26px;
                    color: #fff;
                }
            }
            .store-collect-btn {
                width: 128px;
                height: 48px;
                position: absolute;
                bottom: 37px;
                right: 30px;
                background: #f00;
                border-radius: 10px;
                color: #fff;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                i {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    background: url("../../assets/icon/icon-store-star.png") no-repeat;
                    background-size: contain;
                    /*margin-left: 20px;*/
                    margin-right: 10px;
                }

            }
            .store-collect-btn.collected {
                background: #fff;
                color: #f00;
            }
        }
        .store-banner.marginBottom {
            margin-bottom: 96px;
        }
        .loading {
            text-align: center;
            padding-bottom: 20px;
        }
    }

    /*店铺首页列表*/
    .cate-list {
        background: white;
        .title {
            display: flex;
            align-items: center;
            margin-top: 16px;
            height: 54px;
            margin-bottom: 1px;
            .home {
                height: 100%;
                font-size: 28px;
                color: #222;
                display: flex;
                align-items: center;
                margin: 0 auto;
                i {

                    width: 60px;
                    height: 40px;
                    display: inline-block;
                    margin: 0 7px;
                }
            }
            .store {
                height: 100%;
                font-size: 28px;
                color: #222;
                display: flex;
                align-items: center;
                padding-left: 30px;

                i {
                    width: 4px;
                    height: 24px;
                    display: inline-block;
                    margin-right: 16px;
                }
            }
        }
        .brand-list-out {
            height: 344px;
            /*width: 100%;*/
            overflow: hidden;
            .brand-list {
                width: 100%;
                overflow-x: scroll;
                height: 350px;
                ul {
                    height: 100%;
                    a {
                        float: left;
                        display: inline-block;
                    }
                    li {
                        /*float: left;*/
                        box-shadow: -1px 0 0 0 #eee inset, 0 1px #eee inset;
                        width: 230px;
                        height: 100%;
                        padding: 15px 30px;
                        text-align: center;
                        div {
                            width: 170px;
                            height: 170px;
                            position: relative;
                            img{
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                max-width: 100%;
                                max-height: 100%;
                                transform: translate(-50%,-50%);
                            }
                        }

                        p {
                            text-align: center;
                        }
                        p.brand-list-title {
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-size: 26px;
                            margin-top: 30px;
                            margin-bottom: 16px;
                            color: #333;
                        }
                        p.amount {
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            color: #666;
                            font-size: 24px;
                            margin-bottom: 12px;
                        }
                        p.price {
                            color: red;
                            font-size: 26px;
                            span {
                                font-size: 32px;
                            }
                        }
                    }
                    a:nth-last-child(1) {
                        li {
                            /*box-shadow: 0 1px #eee inset;*/
                        }
                    }
                }

            }
        }
    }

    /*取消收藏弹窗*/
    .cancel-collect {
        .mint-popup {
            width: 100%;
            background: #fff;
            .wait, .cancel {
                height: 88px;
                box-shadow: 0 -1px #e5e5e5 inset;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                color: #f00;
            }
            .wait {
                height: 88px;
                box-shadow: none;
                color: #333;
            }
        }
    }

</style>