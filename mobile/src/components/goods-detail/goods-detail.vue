<template>
    <div class="detail">
        <div class="goods-detail" ref="goodsDetail">
            <!--轮播图-->
            <div class="swipe">
                <mt-swipe :auto="0" :show-indicators="false" @change="swipeChange">
                    <mt-swipe-item v-for="(item,index) in goodsBean.listGoodsImage" :key="index">
                        <img v-lazy="item.imageArtworkNameValue" alt="">
                    </mt-swipe-item>
                </mt-swipe>
                <div class="swipe-indicator">
                    {{swipeIndicatorCurr}}/{{goodsBean.listGoodsImage?goodsBean.listGoodsImage.length:0}}
                </div>
            </div>
            <!--商品标题-->

            <div class="goods-title">
                <p class="title">
                    <i class="rx" v-if="goodsBean.isRx==1"></i>
                    <i :class="{'otc-red':goodsBean.isOtc==1,'otc-green':goodsBean.isOtc==2}"></i>
                    <span v-if="goodsBean.isCountryBasicDrugs==1">基本</span>
                    <span v-if="goodsBean.isMedicalInsurance==1">甲类医保</span>
                    <span v-if="goodsBean.isMedicalInsurance==2">乙类医保</span>
                    <span>{{prodArea}}</span>{{goodsBean.goodsName}}
                </p>
                <p class="price">采购价格:
                    <router-link to="/login" v-if="numberTip==0" class="noLogin">登陆可见</router-link>
                    <span v-if="numberTip==3" class="noLogin">认证可见</span>
                    <span v-if="(numberTip==2)&&(goodsBean.isLimitGoodsStatus==5)" class="noLogin">定向供应,无法购买</span>
                    <span v-if="(numberTip==2)&&(goodsBean.isLimitGoodsStatus==6)" class="noLogin">超出经营范围</span>
                    <span v-if="(numberTip==2)&&(goodsBean.isLimitGoodsStatus==0)" class="price-item">￥<span>{{priceInt(price)}}</span>.{{priceDec(price)}}</span>

                    <span class="format">规格:{{goodsBean.spec}}</span>
                </p>
            </div>
            <!--购买选项-->
            <div class="option">
                <div class="section">
                    <div class="left"><span>采购方式:</span></div>
                    <div class="right">
                        <span v-for="(item,index) in goodsBean.buyType" :key="index"
                              @click="optionCheck(goodsBean.buyType,item)"
                              :class="{'option-check':item.check}">{{item.name}}<i
                                v-show="item.check"></i></span>
                    </div>
                </div>
                <div class="section">
                    <div class="left left-center"><span>批次:</span></div>
                    <div class="right right-center">
                        <!--<span class="option-check">{{buyPopCtn.goodsProductLotCode}}<i v-show="true"></i></span>-->
                        <span v-for="(item,index) in goodsBean.goodsProductLotList" :key="index"
                              @click="optionCheck(goodsBean.goodsProductLotList,item)"
                              :class="{'option-check':item.batch.check}">{{item.batch.name}}<i
                                v-show="item.batch.check"></i></span>
                        <p class="limit-date" v-if="numberTip==2&&goodsBean.isLimitGoodsStatus==0">(生产日期:{{prodDate}} 有效期至{{endDate}})</p>

                    </div>
                </div>

                <div class="section">
                    <div class="left left-bottom"><span>采购数量:</span></div>
                    <div class="right">
                        <div class="num-btn">
                            <span class="sub" @click="subNum">-</span>
                            <input class="num" type="tel" v-model="buyNum">
                            <span class="add" @click="addNum">+</span>
                        </div>
                        <span class="box">{{goodsBean.unit}}</span>
                        <p class="stock" v-if="(numberTip==2)&&goodsBean.isLimitGoodsStatus==0">当前库存量:{{stock}}{{goodsBean.unit}}<span class="stock-desc">{{minimum}}{{goodsBean.unit}}起</span>
                        </p>
                    </div>
                </div>

                <div class="section">
                    <div class="left left-bottom"><span>物流费用:</span></div>
                    <div class="right logistics" v-if="(numberTip==2)&&(goodsBean.isLimitGoodsStatus==0)">
                        订单起配金额需满<div class="price-tip">¥{{goodsBean.thirdStoreInfoAll.storeMinimumMoney}}</div>元&nbsp;<div class="price-tip" v-show="(price*buyNum)>=goodsBean.thirdStoreInfoAll.storeMinimumMoney">已满足条件</div>；订单满<div class="price-tip">¥{{goodsBean.thirdStoreInfoAll.freeMoney}}</div>元免运费<div v-show="!((price*buyNum)>=goodsBean.thirdStoreInfoAll.freeMoney)">，不满收取<div class="price-tip">¥{{goodsBean.thirdStoreInfoAll.collectMoney}}</div>元运费</div><div class="price-tip" v-show="(price*buyNum)>=goodsBean.thirdStoreInfoAll.freeMoney">&nbsp;已满足条件</div>
                    </div>
                </div>
            </div>

            <!--优惠券-->
            <div class="coupon">
                <div class="coupon-left">优惠信息</div>
                <div class="coupon-center">
                    <div class="coupon-desc" v-if="index<=1" v-for="(item,index) in couponArr"><span class="coupon-icon">{{item.couponType==1?'店铺优惠券':'商品优惠券'}}</span>满{{item.freeMoney}}元减{{item.couponPrice}}元</div>
                </div>
                <div class="coupon-right" @click="popupVisible=true">领优惠券<i></i></div>
            </div>

            <!--商品信息-->
            <div class="goods-desc">
                <div class="goods-desc-title">商品信息</div>
                <div class="goods-desc-content">
                    <p>生产厂家<span>{{goodsBean.producer}}</span></p>
                    <p>批准文号<span>{{goodsBean.approvalNumber}}</span></p>
                    <p>件量装<span>{{goodsBean.pieceLoading}}{{goodsBean.goodsDeno?goodsBean.goodsDeno:'盒'}}/件</span></p>
                </div>
            </div>

            <!--商品公司-->
            <router-link :to="{path:'/storeDetail',query:{storeId:goodsBean.storeId}}" class="goods-company">
                {{goodsBean.thirdStoreInfoAll.companyName}}<span>共{{goodsNum}}件商品<i></i></span>
            </router-link>

            <!--说明书-->
            <div class="goods-dir">
                <div class="goods-dir-title">说明书
                    <span class="fold-btn" @click="fold">{{toggle}}<i ref="arrow"></i></span>
                </div>
                <div ref="content" :class="{'fold':!foldType}" class="goods-dir-content"></div>
                <span class="mask" v-show="!foldType"></span>
            </div>
        </div>

        <!--优惠券面板-->
        <mt-popup
                v-model="popupVisible"
                position="bottom">
            <div class="coupon-panel">
                <div class="coupon-panel-main">
                    <div v-for="(item,index) in couponArr" :key="index" class="coupon-item"
                         :style="{'background':'url('+(item.couponType==1?require('../../assets/coupon-store.png'):require('../../assets/coupon-goods.png'))+')','backgroundSize':'contain'}">
                        <div class="stamp" v-show="item.isReceive==1"></div>
                        <div class="coupon-item-left">
                            <p class="desc1"
                               :style="{'color':item.couponType==1?'#fe985b':'#fe635b'}">
                                满{{item.freeMoney}}元可用</p>
                            <p class="desc2">{{item.couponTimeType==2&&item.goodsName?'仅限'+item.goodsName+'可用&nbsp;'+item.couponName:item.couponName}}</p>
                            <p class="desc3">{{item.companyName}}</p>
                            <p class="desc4">有效期:{{item.couponTimeType==1?_getCouponDate(item.couponStartTime)+'~'+_getCouponDate(item.couponEndTime):item.validityDays+'天'}}</p>
                        </div>
                        <div class="coupon-item-right">
                            <p class="coupon-item-price" :class="{'priceFontSize':item.couponPrice.toString().length<3}">
                                {{item.couponPrice}}</p>
                            <span @click="getCoupon(item)" class="coupon-item-btn" v-if="item.isReceive==0">立即领取</span>
                            <router-link :to="item.couponType==1?{path: '/storeProdList', query: {storeId: goodsBean.storeId}}:{path: '/storeProdList',query: {storeId: goodsBean.storeId, couponId: item.couponId}}" class="coupon-item-btn" v-if="item.isReceive==1">立即使用</router-link>
                        </div>
                    </div>
                </div>
                <div class="done" @click="popupVisible=false">完成</div>
            </div>
        </mt-popup>

        <!--底部栏-->
        <div class="footer">
            <div class="footer-left">
                <div class="store">
                    <router-link :to="{path:'/storeDetail',query:{storeId:goodsBean.storeId}}">
                        <i></i>
                        <p>进入店铺</p>
                    </router-link>
                </div>
                <div class="collect">
                    <div @click="collected">
                        <i :class="{'collected':collect}"></i>
                        <p>{{collect?'已收藏':'收藏'}}</p>
                    </div>
                </div>
            </div>
            <div class="footer-right">
                <div class="add-shopcar" :class="{'forbid-buy':(goodsBean.isLimitGoodsStatus!=0)||(numberTip!=2&&numberTip!=0)}" @click="addShopcar(0)">加入购物车</div>
                <a :class="{'forbid-buy':(goodsBean.isLimitGoodsStatus!=0)||(numberTip!=2&&numberTip!=0)}" @click.prevent="buyNow()" class="buy-now">立即采购</a>
            </div>
        </div>
    </div>
</template>

<script>
    import {Toast} from 'mint-ui';
    import Vue from 'vue';

    export default {
        name: "goods-detail",
        data() {
            return {
                //账号认证状态
                numberTip:0,
                //最低购买数量
                minimum: 0,
                //件装量
                pieceNum: 0,
                //库存量
                stock: 0,
                //有效期
                endDate: '',
                //生产日期
                prodDate: '',
                buyNum: 0,
                goodsBean: {thirdStoreInfoAll:{}},
                //获取页面滚动距离
                scrollTop: 0,
                collect: false,
                // login: document.cookie.split('token=')[1] ? true : false,
                //公司名称
                company: '广东惠民医药有限公司',
                //商品数量
                goodsNum: 0,
                //国产或非国产
                prodArea: '',
                //当前价格
                price: '',
                //拆零价格
                openPrice: '',
                //整件价格
                completePrice: '',
                //说明书
                goodsDir: '',
                couponArr: [],
                popupVisible: false,
                toggle: '收起',
                foldType: true,
                swipeIndicatorCurr: 1,
                swipeArr: [require('../../assets/goods-detail-banner.png'), require('../../assets/goods-detail-banner.png'), require('../../assets/goods-detail-banner.png'),],
                buyType: [{name: '拆零', check: true}, {name: '整件', check: false}],
                //拆零整件标识
                tempBuyType: true,
                batch: [{name: '20170506', check: true}, {name: '20170506', check: false}, {
                    name: '20170506',
                    check: false
                }, {name: '20170506', check: false}, {name: '20170506', check: false}],
            }
        },
        methods: {
            //获取优惠券有效期
            _getCouponDate(date) {
                let d = new Date(date);
                let Y = d.getFullYear() + '.';
                let M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '.';
                let D = d.getDate() < 10?'0' + d.getDate():d.getDate();
                return Y + M + D;
            },
            //立即购买
            buyNow(){
                if(this.numberTip==0){
                    //未登录
                    this.$router.replace('/login')
                }else if(this.numberTip==2&&this.goodsBean.isLimitGoodsStatus==0){
                    //可以购买
                        this.addShopcar(1)
                }else if(this.goodsBean.isLimitGoodsStatus!=0){
                    //不能购买的商品
                }
            },
            //获取产品有效期
            prodEndDate(timeStamp) {
                let date = new Date(timeStamp);
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                return Y + M + D
            },
            //购买面板点击选项
            optionCheck(type, item) {
                console.log(item);
                //点击批次
                if (item.batch) {
                    this.endDate = this.prodEndDate(item.goodsProductLotEndDate);
                    this.prodDate = this.prodEndDate(item.goodsProductLotProductionDate);
                    if (this.tempBuyType) {
                        //选择拆零时库存正常显示
                        this.openPrice =  item.goodsProductLimitPrice.openMoney;
                        this.completePrice = item.goodsProductLimitPrice.completeMoney;
                        this.price = this.openPrice;
                        this.stock = item.goodsProductLotWareStock - item.orderLockStock;
                        this.tempStock = this.stock;
                    } else {
                        //选择整件时库存需要除以件装量
                        this.openPrice =  item.goodsProductLimitPrice.openMoney;
                        this.completePrice = item.goodsProductLimitPrice.completeMoney;
                        this.price = this.completePrice;
                        this.stock = Math.floor((item.goodsProductLotWareStock - item.orderLockStock) / this.pieceNum);
                    }
                    //改变样式
                    for (let i = 0; i < type.length; i++) {
                        type[i].batch.check = false;
                    }
                    item.batch.check = true;
                }

                //点击采购方式
                if (item.name) {
                    if (item.check) {
                        //选中后再次点击不执行
                        return
                    }
                    if (item.name == '拆零') {
                        //拆零的单位
                        this.tempBuyType = true;
                        this.goodsBean.unit = this.goodsBean.goodsDeno?this.goodsBean.goodsDeno:'盒';
                        this.stock = this.tempStock;
                        this.price = this.openPrice;
                        this.minimum = this.goodsBean.openMinmum?this.goodsBean.openMinmum:(this.price?Math.ceil(this.goodsBean.openMinmumPrice/this.price):1);
                        this.buyNum = this.minimum;
                    } else {
                        //整件的单位
                        this.tempBuyType = false;
                        this.goodsBean.unit = '件';
                        this.stock = Math.floor(this.stock / this.pieceNum);
                        this.price = this.completePrice;
                        this.minimum = this.goodsBean.completeMinmum?this.goodsBean.completeMinmum:(this.price?Math.ceil(this.goodsBean.completeMinmumPrice/this.price):1);
                        this.buyNum = this.minimum;
                    }
                    //改变样式
                    for (let i = 0; i < type.length; i++) {
                        type[i].check = false;
                    }
                    item.check = true;
                }
            },
            subNum() {
                if (this.buyNum <= 0) {
                    return;
                }
                this.buyNum--;
            },
            addNum() {
                this.buyNum++;
            },
            priceInt(price) {
                return (price + '').split('.')[0]
            },
            priceDec(price) {
                if ((price + '').split('.')[1]) {
                    return (price + '').split('.')[1].length==1?(price + '').split('.')[1]+'0':(price + '').split('.')[1];
                } else {
                    return '00'
                }
            },
            swipeChange(index) {
                this.swipeIndicatorCurr = index + 1;
            },
            //收起展开按钮
            fold() {
                this.foldType = !this.foldType;
                this.toggle = this.foldType ? '收起' : '展开';
                this.$refs.arrow.style.transform = this.foldType ? 'rotateZ(180deg)' : 'rotateZ(0deg)';
            },
            //领取优惠券
            getCoupon(item) {
                let timeStamp = new Date().getTime();
                let params = {"couponId": item.couponId};
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
                                'time-stamp':timeStamp
                            },
                            url: this._ajaxUrl + '/couponRecord/saveCoupon',
                            data: aes
                        }).then((res) => {
                            console.log(res.data);
                            if (res.data.errorCode == '0004') {
                                // alert('登录超时');
                                localStorage.removeItem('unverified');
                                document.cookie = 'token=';
                                this.$router.replace('/login');
                                return;
                            }
                            if (res.data.errorCode == 'login_0004') {
                                localStorage.removeItem('unverified');
                                document.cookie = 'token=';
                                this.$router.replace('/login');
                                return;
                            }
                            if (res.data.data == 1) {
                                // 领取成功
                                item.isReceive = 1;
                                Toast({
                                    message: '领取成功',
                                    position: 'bottom',
                                    duration: 3000,
                                    className: 'get-coupon'
                                });
                            } else if (res.data.data == -1) {
                                //未登录
                                localStorage.removeItem('unverified');
                                document.cookie = 'token=';
                                this.$router.replace('/login');
                            } else if (res.data.data == -2) {
                                alert('账号未认证')
                                //未认证
                            } else if (res.data.data == -3) {
                                alert('供应商不能领取')
                                //供应商无法领取
                            } else if (res.data.data == -5) {
                                //优惠券ID为空
                            } else if (res.data.data == -6) {
                                //其他错误
                            } else if (res.data.data == -4) {
                                //不存在该优惠券
                            } else if (res.data.data == 99) {
                                //不能重复领取
                            }


                        })
                    }
                )

            },
            //加入购物车
            addShopcar(num) {
                if(num==1&&((this.price*this.buyNum)<this.goodsBean.thirdStoreInfoAll.storeMinimumMoney)){
                    //未满店铺起订金额
                    Toast({
                        message: '订单起订金额需满￥'+this.goodsBean.thirdStoreInfoAll.storeMinimumMoney+'元',
                        position: 'bottom',
                        duration: 3000,
                        className: 'store-minimum-money'
                    });
                    return
                }


                if(this.numberTip==0){
                    //未登录
                    this.$router.replace('/login')
                }else if(this.numberTip==2&&this.goodsBean.isLimitGoodsStatus==0){
                    //可以购买
                    let type;
                    let batch;
                    for (let i = 0; i < this.goodsBean.buyType.length; i++) {
                        if (this.goodsBean.buyType[i].check) {
                            if (this.goodsBean.buyType[i].name == '拆零') {
                                type = 'open'
                            } else {
                                type = 'complete'
                            }
                        }
                    }
                    for (let i = 0; i < this.goodsBean.goodsProductLotList.length; i++) {
                        if (this.goodsBean.goodsProductLotList[i].batch.check) {
                            batch = this.goodsBean.goodsProductLotList[i].batch.name;
                            break;
                        }
                    }
                    let timeStamp = new Date().getTime();
                    let params = {
                        goodsId: this.goodsBean.goodsId,
                        goodsNum: this.buyNum,
                        goodsProductLotCode: batch,
                        shoppingCartType: num,
                        purchase: type
                    };
                    console.log(params);
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
                                    'time-stamp':timeStamp
                                },
                                url: this._ajaxUrl + '/shoppingcart/shoppingCartSaveController/saveShoppingCartGoodsInfo',
                                data: aes
                            }).then((res) => {
                                console.log(res.data);
                                if (res.data.errorCode == 'login_0004') {
                                    alert('登录超时');
                                    //登录超时 清空cookie
                                    localStorage.removeItem('unverified');
                                    document.cookie = 'token=';
                                    this.$router.replace('/login');
                                    return
                                }
                                if(res.data.data.numberTip == 100){
                                    if(num==0){
                                        //加入购物车
                                        Toast({
                                            message: '添加成功',
                                            position: 'bottom',
                                            duration: 3000,
                                            className: 'add-shop-car'
                                        });
                                    }else{
                                        //立即购买
                                        //获取购物车信息
                                        this.$router.push({
                                            path: '/orderSubmit',
                                            query: {
                                                'shoppingIds': res.data.data.objectBean.shoppingCartId,
                                                'shoppingCartType': res.data.data.objectBean.shoppingCartType
                                            }
                                        });
                                    }
                                }else if(res.data.data.numberTip == -1){
                                    Toast({
                                        message: '库存不足',
                                        position: 'bottom',
                                        duration: 3000,
                                        className: 'add-shop-car'
                                    });
                                }
                            })
                        }
                    );
                }else if(this.goodsBean.isLimitGoodsStatus!=0){
                    //不能购买的商品
                }
            },
            //点击收藏或取消
            collected() {
                if(this.numberTip==0){
                    //未登录
                    this.$router.replace('/login')
                }else {
                    //已登录
                    if (this.collect) {
                        //取消收藏请求
                        let timeStamp = new Date().getTime();
                        let params = {"goodsId": this.$route.query.goodsId};
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
                                        'time-stamp':timeStamp
                                    },
                                    url: this._ajaxUrl + '/goods/collect/remove',
                                    data: aes
                                }).then((res) => {
                                    console.log(res.data);
                                    if (res.data.errorCode == '0000') {
                                        this.collect = false;
                                        Toast({
                                            message: '取消收藏',
                                            position: 'bottom',
                                            duration: 3000,
                                            className: 'add-shop-car'
                                        })
                                    } else if(res.data.errorCode == 'login_0004'){
                                        //登录超时 清空cookie
                                        localStorage.removeItem('unverified');
                                        document.cookie = 'token=';
                                        this.$router.replace('/login');
                                    } else {
                                        Toast({
                                            message: '取消收藏失败',
                                            position: 'bottom',
                                            duration: 3000,
                                            className: 'add-shop-car'
                                        })
                                    }
                                })
                            }
                        );

                    } else {
                        //添加收藏请求
                        let timeStamp = new Date().getTime();
                        let params = {"goodsId": this.$route.query.goodsId};
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
                                        'time-stamp':timeStamp
                                    },
                                    url: this._ajaxUrl + '/goods/collect/collectGoods',
                                    data: aes
                                }).then((res) => {
                                    console.log(res.data);
                                    if (res.data.errorCode == '0000') {
                                        this.collect = true;
                                        Toast({
                                            message: '收藏成功',
                                            position: 'bottom',
                                            duration: 3000,
                                            className: 'add-shop-car'
                                        })
                                    } else if(res.data.errorCode == 'login_0004'){
                                        //登录超时 清空cookie
                                        localStorage.removeItem('unverified');
                                        document.cookie = 'token=';
                                        this.$router.replace('/login');
                                    } else {
                                        Toast({
                                            message: '收藏失败',
                                            position: 'bottom',
                                            duration: 3000,
                                            className: 'add-shop-car'
                                        })
                                    }

                                })
                            }
                        );
                    }
                }
            },

        },
        created() {
            let timeStamp = new Date().getTime();
            let params = {"goodsId": this.$route.query.goodsId};
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
                            'time-stamp':timeStamp
                        },
                        url: this._ajaxUrl + '/goods/goodsSaveController/selectShoppingGoodsProductDetail',
                        data: aes
                    }).then((res) => {
                        console.log(res.data);
                        if (res.data.errorCode == '0000') {
                            //账号认证状态
                            this.numberTip = res.data.data.numberTip;
                            if(this.numberTip == 0){
                                document.cookie = 'token=';
                                localStorage.removeItem('unverified');
                            }
                            this.goodsBean = res.data.data.resultBean;
                            //收藏状态
                            this.collect = this.goodsBean.checkIsCollect;
                            //国产或进口
                            this.prodArea = res.data.data.resultBean.isGoodsImportType == 1 ? '国产' : '进口';
                            //店铺商品总数
                            this.goodsNum = this.goodsBean.thirdStoreInfoAll.thirdStoreGoodsNumber;
                            //说明书
                            this.$refs.content.innerHTML = this.goodsBean.goodsDetailDesc ? this.goodsBean.goodsDetailDesc : '';

                            //设置默认批次信息
                            if(this.goodsBean.goodsProductLotList){
                                for (let i = 0; i < this.goodsBean.goodsProductLotList.length; i++) {
                                    if (i == 0) {
                                        Vue.set(this.goodsBean.goodsProductLotList[i], 'batch', {
                                            name: this.goodsBean.goodsProductLotList[i].goodsProductLotCode,
                                            check: true
                                        });
                                        //默认生产日期
                                        this.prodDate = this.prodEndDate(this.goodsBean.goodsProductLotList[i].goodsProductLotProductionDate);
                                        //默认有效期
                                        this.endDate = this.prodEndDate(this.goodsBean.goodsProductLotList[i].goodsProductLotEndDate);
                                        //默认件装量
                                        this.pieceNum = this.goodsBean.goodsProductLotList[i].goodsProductLimitPrice.pieceLoading
                                        //默认库存
                                        this.stock = this.goodsBean.goodsSaleChanne == 1?(this.goodsBean.goodsProductLotList[i].goodsProductLotWareStock - this.goodsBean.goodsProductLotList[i].orderLockStock)/this.pieceNum:this.goodsBean.goodsProductLotList[i].goodsProductLotWareStock - this.goodsBean.goodsProductLotList[i].orderLockStock;
                                        this.tempStock = this.stock;
                                        //默认整件价格
                                        this.completePrice = this.goodsBean.goodsProductLotList[i].goodsProductLimitPrice.completeMoney;
                                        //默认拆零价格
                                        this.openPrice = this.goodsBean.goodsProductLotList[i].goodsProductLimitPrice.openMoney;
                                    }else{
                                        Vue.set(this.goodsBean.goodsProductLotList[i], 'batch', {
                                            name: this.goodsBean.goodsProductLotList[i].goodsProductLotCode,
                                            check: false
                                        });
                                    }
                                }
                            }

                            //对应拆零或整件
                            if (this.goodsBean.goodsSaleChanne == 1) {
                                this.price = this.completePrice;
                                this.minimum = this.goodsBean.completeMinmum?this.goodsBean.completeMinmum:(this.price?Math.ceil(this.goodsBean.completeMinmumPrice/this.price):1);
                                //采购数量输入框默认显示的数量
                                this.buyNum = this.minimum;
                                this.tempBuyType = false;
                                Vue.set(this.goodsBean, 'buyType', [{name: '整件', check: true}]);
                                Vue.set(this.goodsBean, 'unit', '件');
                            }  else {
                                this.price = this.openPrice;
                                this.minimum = this.goodsBean.openMinmum?this.goodsBean.openMinmum:(this.price?Math.ceil(this.goodsBean.openMinmumPrice/this.price):1);
                                //采购数量输入框默认显示的数量
                                this.buyNum = this.minimum;
                                this.tempBuyType = true;
                                Vue.set(this.goodsBean, 'unit', this.goodsBean.goodsDeno?this.goodsBean.goodsDeno:'盒');
                                if(this.goodsBean.goodsSaleChanne == 2){
                                    Vue.set(this.goodsBean, 'buyType', [{name: '拆零', check: true}]);
                                }else{
                                    Vue.set(this.goodsBean, 'buyType', [{name: '拆零', check: true}, {name: '整件', check: false}]);
                                }
                            }

                            //获取商品优惠券信息
                            {
                                let timeStamp = new Date().getTime();
                                let params = {"goodsId": this.$route.query.goodsId, 'storeId': this.goodsBean.storeId};
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
                                        url: this._ajaxUrl + '/coupon/selectReceiveCouponByStoreIdAndGoodsId',
                                        data: aes
                                    }).then((res) => {
                                        console.log(res.data);
                                        if (res.data.errorCode == '0000') {
                                            this.couponArr = res.data.data
                                        }
                                    })
                                });
                            }

                            // 新增商品浏览足迹请求
                            {
                                let timeStamp = new Date().getTime();
                                let params = {"goodsId": this.$route.query.goodsId};
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
                                        url: this._ajaxUrl + '/goods/footprint/create',
                                        data: aes
                                    }).then((res) => {
                                        console.log(res.data + '新增浏览足迹');
                                            if (res.data.errorCode == '0000') {
                                                //新增商品浏览足迹成功
                                            }
                                    })
                                });
                            }

                        } else if (res.data.errorCode == 'login_0004') {
                            alert('登录超时');
                            //登录超时 清空cookie
                            document.cookie = 'token=';
                            localStorage.removeItem('unverified');
                        }
                    });
                }
            );
        },
        mounted() {
            window.scrollTo(0, 0);
        },
        watch: {
            buyNum(newV) {
                if (newV-0 <= this.minimum-0) {
                    this.buyNum = this.minimum
                } else if (newV-0 >= this.stock-0) {
                    this.buyNum = this.stock
                }
            },
            popupVisible(newV) {

                if (newV) {
                    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                    document.body.className = 'forbid-scroll';
                    this.$refs.goodsDetail.style.transform = 'translateY(' + (-this.scrollTop) + 'px)'
                } else {
                    document.body.className = '';
                    this.$refs.goodsDetail.style.transform = '';
                    window.scrollTo(0, this.scrollTop);
                }


            }
        }
    }
</script>

<style lang="less" scoped>
    .detail {
        width: 100%;
        height: 100%;
        background: #f6f6f6;
        .goods-detail {
            width: 100%;
            height: 100%;
            padding-bottom: 100px;
            .swipe {
                width: 100%;
                height: 530px;
                position: relative;
                .mint-swipe {
                    width: 100%;
                    height: 100%;
                    background: #fff;
                    .mint-swipe-item img {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%,-50%);
                        max-width: 100%;
                        max-height: 100%;
                        /*width: 100%;*/
                        /*height: 100%;*/
                    }
                }
                .swipe-indicator {
                    width: 63px;
                    height: 30px;
                    background: #ccc;
                    border-radius: 10px;
                    position: absolute;
                    bottom: 16px;
                    right: 32px;
                    text-align: center;
                    line-height: 32px; /*px*/
                    /*border: 1px solid transparent;*/
                    color: #fff;
                    font-size: 22px;
                }
            }
            .goods-title {
                box-shadow: 0px -5px 6px 0px rgba(4, 0, 0, 0.04),
                0 1px 0 0 #e5e5e5;
                height: 148px;
                width: 100%;
                background: #fff;
                position: relative;
                z-index: 10;
                padding: 22px 30px;
                .title {
                    font-size: 32px;
                    color: #222;
                    display: flex;
                    align-items: center;
                    i {
                        width: 60px;
                        height: 28px;
                        display: none;
                        margin-right: 8px;
                        &.otc-red {
                            display: inline-block;
                            background: url("../../assets/icon/icon-otc-red.png") no-repeat;
                            background-size: contain;
                        }
                        &.otc-green {
                            display: inline-block;
                            background: url("../../assets/icon/icon-otc-green.png") no-repeat;
                            background-size: contain;
                        }
                        &.rx{
                            display: inline-block;
                            background: url("../../assets/icon/icon-rx.png") no-repeat;
                            background-size: contain;
                        }
                    }
                    span {
                        font-size: 22px;
                        line-height: 36px;
                        color: #0066cc;
                        display: inline-block;
                        box-shadow: 0 0 0 1px #0066cc;
                        margin-right: 8px;
                        border-radius: 4px;

                        padding: 0 7px;
                        text-align: center;
                    }
                }
                .price {
                    font-size: 26px;
                    color: #666;
                    margin-top: 21px;
                    line-height: 50px;
                    .noLogin {
                        height: 48px;
                        border-radius: 8px;
                        color: #f82222;
                        display: inline-block;
                        /*width: 128px;*/
                        padding: 0 5px;
                        box-shadow: 0 0 0 2px #f82222;
                        margin-left: 17px;
                        text-align: center;
                        line-height: 50px; /*px*/
                    }
                    .price-item {
                        font-size: 28px;
                        color: #f82222;
                        margin-left: 17px;
                        text-align: center;
                        span {
                            font-size: 40px;
                        }
                    }
                    .format {
                        float: right;
                        max-width: 320px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        text-align: right;
                    }
                }
            }
            .coupon {
                width: 100%;
                height: 126px;
                padding: 0 30px;
                margin: 16px 0;
                box-shadow: 0 -1px 0 0 #e5e5e5 inset, 0 1px 0 0 #e5e5e5 inset;
                background: #fff;
                display: flex;
                align-items: center;
                .coupon-left {
                    display: inline-block;
                    height: 126px;
                    line-height: 126px;
                    color: #666;
                    font-size: 26px;
                    margin-right: 33px;
                }
                .coupon-center {
                    display: flex;
                    flex-direction: column;
                    width: 400px;
                    height: 100%;
                    padding: 20px 0;
                    .coupon-desc {
                        flex: 1;
                        font-size: 24px;
                        color: #666;
                        display: flex;
                        align-items: center;
                        .coupon-icon {
                            /*width: 136px;*/
                            padding-right: 5px;
                            height: 32px;
                            display: inline-block;
                            line-height: 32px;
                            background: url("../../assets/coupon-bg.png") no-repeat;
                            background-size: contain;
                            margin-right: 26px;
                            font-size: 22px;
                            color: #f00;
                            text-indent: 20px;
                        }
                    }
                }
                .coupon-right {
                    line-height: 126px;
                    display: inline-block;
                    color: #666;
                    font-size: 26px;
                    margin-left: 24px;
                    i {
                        margin-left: 12px;
                        width: 13px;
                        height: 22px;
                        display: inline-block;
                        background: url("../../assets/drop-arrow-right.png") no-repeat;
                        background-size: contain;
                    }
                }
            }
            .goods-desc {
                width: 100%;
                /*height: 225px;*/
                background: #fff;
                box-shadow: 0 -1px 0 0 #e5e5e5 inset;
                margin-bottom: 16px;
                .goods-desc-title {
                    padding-left: 30px;
                    height: 72px;
                    width: 100%;
                    box-shadow: 0 -1px 0 0 #e5e5e5 inset;
                    font-size: 26px;
                    color: #666;
                    line-height: 74px; /*px*/
                }
                .goods-desc-content {
                    /*height: 152px;*/
                    width: 100%;
                    padding: 22px 30px;
                    p {
                        font-size: 24px;
                        color: #999;
                        margin-bottom: 19px;
                        span {
                            margin-left: 30px;
                        }
                    }
                    p:nth-last-child(1) {
                        text-indent: 24px;
                        margin-bottom: 0;
                    }
                }
            }
            .goods-dir {
                width: 100%;
                background: #fff;
                box-shadow: 0 -1px 0 0 #e5e5e5 inset;
                margin-bottom: 16px;
                position: relative;
                .goods-dir-title {
                    height: 74px;
                    line-height: 76px; /*px*/
                    padding: 0 30px;
                    font-size: 26px;
                    color: #666;
                    position: relative;
                    .fold-btn {
                        position: absolute;
                        top: 50%;
                        right: 30px;
                        transform: translateY(-50%);
                        font-size: 22px;
                        color: #999;
                        i {
                            width: 24px;
                            height: 15px;
                            display: inline-block;
                            background: url("../../assets/drop-arrow.png") no-repeat;
                            background-size: contain;
                            transform: rotateZ(180deg);
                            margin-left: 5px;
                        }
                    }
                }
                .goods-dir-content {
                    box-shadow: 0 1px 0 0 #e5e5e5 inset;
                    padding: 23px 30px;
                    font-size: 24px;
                    color: #999;
                }
                .goods-dir-content.fold {
                    overflow: hidden;
                    height: 342px;

                }
                .mask {
                    height: 342px;
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    background-image: -moz-linear-gradient(90deg, rgb(248, 248, 248) 0%, rgba(255, 255, 255, 0) 100%);
                    background-image: -ms-linear-gradient(90deg, rgb(248, 248, 248) 0%, rgba(255, 255, 255, 0) 100%);
                    background-image: -webkit-linear-gradient(90deg, rgb(248, 248, 248) 0%, rgba(255, 255, 255, 0) 100%);
                }
            }
            .goods-company {
                display: block;
                width: 100%;
                background: #fff;
                height: 80px;
                padding: 0 30px;
                font-size: 26px;
                color: #222;
                line-height: 82px; /*px*/
                box-shadow: 0 1px 0 0 #e5e5e5 inset,0 -1px 0 0 #e5e5e5 inset;
                margin-bottom: 16px;
                span {
                    display: inline-block;
                    font-size: 22px;
                    color: #999;
                    float: right;
                    line-height: 82px; /*px*/
                    padding-right: 20px;
                    background: url("../../assets/drop-arrow-right.png") right center no-repeat;
                    background-size: 12px 20px;
                    i {
                        /*display: inline-block;*/
                        /*width: 12px;*/
                        /*height: 20px;*/
                        /*background: url("../../assets/drop-arrow-right.png") no-repeat;*/
                        /*background-size: contain;*/
                        /*margin-left: 7px;*/
                    }
                }
            }

        }
        .option {
            padding: 22px 30px;
            box-shadow: 0 -1px #e5e5e5 inset;
            background: #fff;
            .limit-date {
                color: #0066cc;
                font-size: 20px;
            }

            .section {
                overflow: hidden;

                margin-bottom: 24px;
                .left {
                    float: left;
                    width: 138px;
                    text-align: left;
                    height: 100%;
                    display: inline-block;
                    font-size: 26px;
                    color: #666;
                    line-height: 55px; /*px*/

                }
                .left.left-center {
                    text-indent: 52px;
                }
                .left.left-bottom {
                    line-height: 64.5px;
                    margin: 0;

                }
                .right {
                    float: left;
                    width: 552px;
                    display: inline-block;
                    padding-bottom: 1px;
                    margin-top: 2px;
                    margin-bottom: 2px;
                    span {
                        position: relative;
                        display: inline-block;
                        font-size: 24px;
                        color: #222;
                        box-shadow: 0 0 0 2px #e9e9e9;
                        padding: 14px 18px;
                        margin-right: 24px;

                        i {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            width: 24px;
                            height: 24px;
                            background: url("../../assets/option-check.png") no-repeat;
                            background-size: cover;
                        }
                    }
                    /*选项选中样式*/
                    span.option-check {
                        box-shadow: 0 0 0 3px #fa8c35;
                    }
                    p.stock {
                        font-size: 20px;
                        color: #999;
                        padding: 0;
                        margin-top: 16px;
                        text-align: left;
                        .stock-desc {
                            box-shadow: none;
                            font-size: 20px;
                            color: #999;
                            margin-left: 10px;
                            padding: 0;
                            margin-right: 0;
                        }
                    }
                    .num-btn {
                        float: left;
                        height: 64px;
                        display: flex;
                        box-shadow: 0 0 0 1px #ccc;
                        span {
                            width: 64px;
                            margin: 0;
                            padding: 0;
                            text-align: center;
                            box-shadow: none;
                            line-height: 64px; /*px*/
                        }
                        input.num {
                            outline: none;
                            text-align: center;
                            width: 90px;
                            border: none;
                            border-radius: 0;
                            padding: 1px 0;
                            font-size: 24px;
                            color: #333;
                        }
                        span.sub {
                            box-shadow: 1px 0 0 0 #ccc;
                            font-size: 30px;
                            color: #d2d2d2;
                        }
                        span.add {
                            box-shadow: -1px 0 0 0 #ccc;
                            font-size: 30px;
                            color: #f82222;
                        }
                    }
                    .box {
                        border: 1px solid transparent;
                        padding: 0;
                        line-height: 64px; /*px*/
                        margin-left: 16px;
                        margin-right: 24px;
                        color: #666;
                        font-size: 26px;
                        box-shadow: none;
                    }
                }
                .right.right-center {
                    margin-top: 3px;
                    span {
                        margin-bottom: 24px;
                    }
                }
                .logistics{
                    font-size: 22px;
                    color: #666;
                    margin-top: 15px;
                    word-break: break-all;
                    line-height: 35px;
                    div{
                        display: inline-block;
                    }
                    .price-tip{
                        color: #f82222;
                    }
                }
            }
            .section:nth-last-child(1) {
                margin-bottom: 0;
            }
        }
        .footer {
            width: 100%;
            background: #fff;
            height: 100px;
            box-shadow: 0 1px 0 0 #e5e5e5 inset;
            position: fixed;
            bottom: 0;
            left: 0;
            .footer-left {
                float: left;
                width: 254px;
                height: 100%;
                display: flex;
                .store {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                    text-align: center;
                    a {
                        color: #222;
                    }
                    i {
                        width: 44px;
                        height: 44px;
                        display: inline-block;
                        background: url("../../assets/tabbar-home-normal.png") no-repeat;
                        background-size: contain;
                    }
                }
                .collect {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                    color: #222;
                    text-align: center;
                    i {
                        width: 44px;
                        height: 44px;
                        display: inline-block;
                        background: url("../../assets/icon/icon-star.png") no-repeat;
                        background-size: contain;
                    }
                    i.collected {
                        background: url("../../assets/icon/icon-star-active.png") no-repeat;
                        background-size: contain;
                    }
                }
            }
            .footer-right {
                float: left;
                width: 496px;
                height: 100%;
                display: flex;
                .buy-now, .add-shopcar {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 34px;
                    color: #fff;
                    background: #fa8c35;
                    &.forbid-buy{
                        background: #c9c9c9;
                    }
                }
                .buy-now {
                    background: #f82222;
                    &.forbid-buy{
                        background: #868686;
                    }
                }
            }
        }
        /*优惠券弹窗*/
        .mint-popup {
            width: 100%;
            .coupon-panel {
                height: 992px;
                width: 100%;
                background: #fff;
                position: relative;
                .coupon-panel-main {
                    width: 100%;
                    height: 904px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    padding: 30px 25px 0 25px;
                    .coupon-item {
                        width: 100%;
                        height: 250px;
                        margin-bottom: 16px;
                        position: relative;
                        .coupon-item-left {
                            position: absolute;
                            left: 184px;
                            top: 50%;
                            transform: translateY(-50%);
                            .desc1 {
                                font-size: 36px;
                            }
                            .desc2 {
                                margin-top: 17px;
                                margin-bottom: 8px;
                                font-size: 20px;
                                color: #666;
                                width: 262px;
                                line-height: 27px;
                            }
                            .desc3 {
                                font-size: 20px;
                                color: #999;
                                margin-bottom: 12px;
                            }
                            .desc4 {
                                font-size: 16px;
                                color: #999;
                            }
                        }
                        .coupon-item-right {
                            position: absolute;
                            right: 28px;
                            bottom: 30px;
                            .coupon-item-price {
                                text-align: center;
                                font-size: 100px;
                                color: #fffefe;
                                line-height: 100px;
                            }
                            /*根据价格长度改变字体大小*/
                            .coupon-item-price.priceFontSize {
                                font-size: 130px;
                            }
                            .coupon-item-btn {
                                margin: 26px 1px 3px 2px;
                                font-size: 30px;
                                color: #fff;
                                display: inline-block;
                                width: 171px;
                                height: 48px;
                                line-height: 48px;
                                text-align: center;
                                box-shadow: 0 0 0 1px #fff;
                                border-radius: 30px;
                            }
                            .coupon-item-btn.get {
                                background: #cdcbca;
                                box-shadow: none;
                            }
                        }
                        .stamp {
                            width: 208px;
                            height: 142px;
                            position: absolute;
                            right: 200px;
                            bottom: 5px;
                            z-index: 19;
                            background: url("../../assets/coupon-get.png") no-repeat;
                            background-size: contain;
                        }
                    }
                }
                .done {
                    width: 100%;
                    height: 88px;
                    background: #0066cc;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    text-align: center;
                    line-height: 88px;
                    color: #fff;
                    font-size: 34px;
                }
            }
        }

    }


</style>