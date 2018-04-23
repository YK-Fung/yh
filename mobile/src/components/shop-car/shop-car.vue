<template>
    <div class="wrap">
        <!-- 网络异常 -->
        <div class="network-error" v-if="netWorkError">
            <div class="btn-refresh" @click="$router.replace(0)">刷新</div>
        </div>

        <!-- 未认证 -->
        <div class="shop-empty" v-else-if="unverified">
            <router-link class="btn-login" to="/">账号未认证</router-link>
        </div>

        <!-- 未登录 -->
        <div class="login-no" v-else-if="isLogin">
            <router-link class="btn-login" :to="{path:'/login'}" replace>立即登录</router-link>
        </div>

        <!-- 购物车为空 -->
        <div class="shop-empty" v-else-if="shopEmpty">
            <router-link to='/'>去采购吧~</router-link>
        </div>

        <!-- 购物车有东西 -->
        <div class="shop-view" ref="shopcar" v-else>
            <div class="shop-ctn">
                <!-- 头部 -->
                <div class="shop-header">
                    <div class="header-text">购物车({{productAmount}})</div>
                    <div class="btn" @click="headerBtn($event)">{{headerBtnText}}</div>
                </div>

                <!-- 订单 -->
                <div class="order" v-for="(order, orderIdx) in orderArr">
                    <!-- 订单头部 -->
                    <div class="order-header">
                        <div class="header-left" :class="{'active': order.firmSelectActive}" @click="firmSelectFn(orderIdx)">
                            <span class="order-firm">{{order.thirdStoreInfoAll.companyName}}</span>
                            <span class="order-people">{{order.thirdStoreInfoAll.bussLegalName}}</span>
                        </div>
                        <!--<div class="header-right" @click="couponPop(order)" v-if="order.couponList&&order.couponList.length">领券</div>-->
                        <div class="header-right" @click="couponPop(order)" v-if="order.hasCoupon">领券</div>
                    </div>

                    <!-- 订单提示 -->
                    <div class="order-tip">
                        <div v-show="!orderTipFn(order.listShoppingCart)">订单满
                            <div class="price">¥{{order.thirdStoreInfoAll.storeMinimumMoney}}</div>
                            元起配 ，满
                            <div class="price">¥{{order.thirdStoreInfoAll.freeMoney}}</div>
                            元免运费<div class="coupon-tip" v-if="order.hasCoupon">,优惠满<div class="price">¥{{order.couponArr[0].freeMoney}}</div>减<div class="price">¥{{order.couponArr[0].couponPrice}}</div>元</div>
                        </div>
                        <div v-show="orderTipFn(order.listShoppingCart)">订单{{order.thirdStoreInfoAll.storeMinimumMoney
                            <= supplierPrice(order.listShoppingCart)?'已满':'再购'}}
                            <div  class="price">¥{{order.thirdStoreInfoAll.storeMinimumMoney <=
                                supplierPrice(order.listShoppingCart)?order.thirdStoreInfoAll.storeMinimumMoney:(order.thirdStoreInfoAll.storeMinimumMoney
                                - supplierPrice(order.listShoppingCart)).toFixed(2)}}
                            </div>
                            元起配,{{order.thirdStoreInfoAll.freeMoney <= supplierPrice(order.listShoppingCart)?'已满':'再购'}}
                            <div  class="price">¥{{order.thirdStoreInfoAll.freeMoney <=
                                supplierPrice(order.listShoppingCart)?order.thirdStoreInfoAll.freeMoney:(order.thirdStoreInfoAll.freeMoney
                                - supplierPrice(order.listShoppingCart)).toFixed(2)}}
                            </div>
                            元免运费
                            <div class="coupon-tip" v-if="order.hasCoupon">,优惠{{order.couponArr[0].freeMoney <= supplierPrice(order.listShoppingCart)?'已':''}}满<div class="price">¥{{order.couponArr[0].freeMoney}}</div>减<div class="price">¥{{order.couponArr[0].couponPrice}}</div>元</div>
                        </div>
                        <router-link :to="{path:'/storeProdList?storeId='+order.thirdStoreInfoAll.storeId}"
                                     v-show="(order.thirdStoreInfoAll.storeMinimumMoney > supplierPrice(order.listShoppingCart))||(order.thirdStoreInfoAll.freeMoney > supplierPrice(order.listShoppingCart))">
                            去凑单
                        </router-link>
                    </div>
                    <!-- 订单内容 -->
                    <div class="order-ctn">
                        <!-- 订单详情 product, productIdx-->
                        <div class="order-detail" :class="{'prod-cancel':!((product.goodsInfoAll?product.goodsInfoAll.goodsInfoAdded:false)&&product.goodsProductLot)}" v-for="(product, productIdx) in order.listShoppingCart">
                            <!-- 产品选择 -->
                            <div class="product-select"
                                 v-if="product.prodCancel"
                                 :class="{'active': product.productSelectActive}"
                                 @click="productSelectFn(orderIdx, productIdx)">
                                <input name="" type="checkbox"
                                       :value="product.shoppingCartId"
                                       v-model="product.productSelectActive">
                            </div>

                            <!-- 产品详情 -->
                            <div class="product-detail">
                                <!-- 产品图片 -->
                                <a class="product-img"
                                             @click="_goto(product)">
                                    <img :src="product.goodsInfoAll ? product.goodsInfoAll.goodsImg : ''">
                                    <span class="mask" v-if="!((product.goodsInfoAll?product.goodsInfoAll.goodsInfoAdded:false)&&product.goodsProductLot)"></span>
                                    <p class="warm-tip" v-show="goodsProductLotTip(product)" v-if="(product.goodsInfoAll?product.goodsInfoAll.goodsInfoAdded:false)&&product.goodsProductLot">
                                        (库存不足，剩余{{product.goodsProductLot ?
                                        product.goodsProductLot.goodsProductLotWareStock : 0}}盒)</p>
                                </a>

                                <!-- 产品信息 -->
                                <div class="product-infor">
                                    <a @click="_goto(product)">
                                        <div class="infor-div">
                                            <!-- 产品名字 -->
                                            <div class="product-name">{{product.goodsName}}</div>
                                            <!-- 产品价格 -->
                                            <div class="product-price" v-if="(product.goodsInfoAll?product.goodsInfoAll.goodsInfoAdded:false)&&product.goodsProductLot"><span>{{productPriceInteger(orderIdx, productIdx)}}</span>{{productPriceDecimals(orderIdx,
                                                productIdx)}}
                                            </div>
                                        </div>

                                        <!-- 其他信息 -->
                                        <ul class="infor-other">
                                            <!-- 产品规格 -->
                                            <li>{{product.specName}}</li>
                                            <!-- 产品生产公司 -->
                                            <li>{{product.goodsInfoAll ? product.goodsInfoAll.producer : ''}}</li>
                                            <!-- 产品批号 -->
                                            <li>批次号：{{product.goodsProductLotCode}}</li>
                                        </ul>
                                    </a>

                                    <!-- 产品数量 -->
                                    <div class="product-amount" v-if="(product.goodsInfoAll?product.goodsInfoAll.goodsInfoAdded:false)&&product.goodsProductLot">
                                        <span class="amount-label">{{product.shoppingType === 1 ? '拆零' : '整件'}}:</span>
                                        <span class="btn-amount amount-reduce"
                                              @click="amountReduceFn(orderIdx, productIdx)">-</span>
                                        <input class="amount-input" type="tel"
                                               v-model="product.shoppingType === 1 ? product.goodsOpenNum : product.goodsCompleteNum"
                                               @focus="amountFocus($event)"
                                               @blur="amountInputFn($event, orderIdx, productIdx)">
                                        <span class="btn-amount amount-add"
                                              @click="amountAddFn(orderIdx, productIdx)">+</span>
                                    </div>

                                    <!--批次已下架-->
                                    <div class="product-amount" v-else>批次已下架</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 操作栏 -->
            <div class="shop-opt">
                <div class="select-all"
                     :class="{'active': allSelectActive}"
                     @click="allSelectFn()">全选
                </div>
                <!-- 结算 -->
                <div class="go-buy" v-if="goBuy">
                    <div class="total">总价：<span class="total-price">￥<span>{{totalPriceInteger}}</span>.{{totalPriceDecimals}}</span>
                    </div>
                    <div class="btn-buy" @click="buyFn()">去结算</div>
                </div>
                <!-- 编辑 -->
                <div class="go-edit " v-else>
                    <div class="btn btn-del" @click="delPopShowFn()">删除</div>
                    <div class="btn btn-collect" @click="collectFn()">移入收藏夹</div>
                </div>
            </div>

            <!-- 导航 -->
            <tabbar :tempNum="productAmount"></tabbar>
        </div>

        <!-- 弹窗-删除 -->
        <transition name="fade">
            <div class="pop-shade" v-show="popShow">
                <!-- 弹窗主体 -->
                <div class="pop-main">
                    <div class="pop-body">
                        <p>确定要删除这件商品吗？</p>
                    </div>
                    <div class="pop-footer">
                        <div class="btn btn-yes" @click="delFn()">确定</div>
                        <div class="btn btn-no" @click="delPopHideFn()">取消</div>
                    </div>
                </div>
            </div>
        </transition>

        <!--优惠券面板-->
        <mt-popup
                v-model="popupVisible"
                position="bottom">
            <div class="coupon-panel">
                <div class="coupon-panel-main">
                    <div v-for="(item,index) in couponArr.couponArr" :key="index" class="coupon-item"
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
                            <router-link :to="item.couponType==1?{path: '/storeProdList', query: {storeId: couponArr.thirdStoreInfoAll.storeId}}:{path: '/storeProdList',query: {storeId: couponArr.thirdStoreInfoAll.storeId, couponId: item.couponId}}" class="coupon-item-btn" v-if="item.isReceive==1">立即使用</router-link>
                        </div>
                    </div>
                </div>
                <div class="done" @click="popupVisible=false">完成</div>
            </div>
        </mt-popup>

    </div>
</template>

<script>
    import tabbar from '../subcom/tab-bar';
    import Vue from 'vue';
    import {Toast} from 'mint-ui';

    export default {
        name: "shop-car",
        components: {
            tabbar
        },
        data() {
            return {
                unverified:false,
                //购物车数量
                productAmount:0,
                //滚动高度
                scrollTop:0,
                //优惠券对象
                couponArr:{},
                //优惠券弹窗
                popupVisible:false,
                // 网络异常
                netWorkError: false,
                // 是否登陆
                isLogin: false,
                // 购物车是否空
                shopEmpty: false,
                // 去结算or编辑
                goBuy: true,
                // 全选
                allSelectActive: false,
                // 订单
                orderArr: [],
                // 总价
                totalPrice: '0.00',
                // 弹窗显示or隐藏
                popShow: false,
                //输入框数字
                tempAmount: 0
            }
        },
        created() {
            this.shopData();
        },
        watch:{
            popupVisible(newV) {
                if (newV) {
                    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                    document.body.className = 'forbid-scroll';
                    this.$refs.shopcar.style.transform = 'translateY(' + (-this.scrollTop) + 'px)'
                } else {
                    document.body.className = '';
                    this.$refs.shopcar.style.transform = '';
                    window.scrollTo(0, this.scrollTop);
                }
            }
        },
        computed: {
            // 头部按钮文字
            headerBtnText: function () {
                if (this.goBuy) {
                    return '编辑';
                } else {
                    return '完成';
                }
            },
            // 总价整数部分
            totalPriceInteger: function () {
                return this.totalPrice.split('.')[0];
            },
            // 总价小数部分
            totalPriceDecimals: function () {
                return this.totalPrice.split('.')[1];
            }
        },
        methods: {
            //商品跳转(prod.goodsInfoAll?prod.goodsInfoAll.goodsInfoAdded:false)&&prod.goodsProductLot
            _goto(prod){
                if((prod.goodsInfoAll?prod.goodsInfoAll.goodsInfoAdded:false)&&prod.goodsProductLot){
                    //商品正常
                    this.$router.push({path: '/goodsDetail', query: {goodsId: prod.goodsId}})
                }else{
                    //商品已下架
                }
            },
            //获取优惠券有效期
            _getCouponDate(date) {
                let d = new Date(date);
                let Y = d.getFullYear() + '.';
                let M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '.';
                let D = d.getDate() < 10?'0' + d.getDate():d.getDate();
                return Y + M + D;
            },
            //优惠券弹窗
            couponPop(order){
                console.log(order);
                this.couponArr = order;
                this.popupVisible = true;
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
                        // accessToken: this.token
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
                                // accessToken: this.token,
                                'time-stamp':timeStamp
                            },
                            url: this._ajaxUrl + '/couponRecord/saveCoupon',
                            data: aes
                        }).then((res) => {
                            console.log(res.data);
                            if (res.data.errorCode == '0004') {
                                alert('登录超时');
                                this.login = false;
                                this.$router.replace('/login');
                                return;
                            }
                            if (res.data.errorCode == 'login_0004') {
                                alert('登录超时');
                                this.login = false;
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
                                alert('未登录')
                                this.$router.replace('/login');
                            } else if (res.data.data == -2) {
                                alert('未认证')
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
            //同一供应商选中商品的价格(arr[i].goodsInfoAll?arr[i].goodsInfoAll.goodsInfoAdded:false)&&arr[i].goodsProductLot
            supplierPrice(arr) {
                let productPrice = 0;
                for (let i = 0; i < arr.length; i++) {
                    // 判断是否有这个批次
                    if (arr[i].productSelectActive && arr[i].goodsProductLimitPrice && arr[i].goodsProductLot && (arr[i].goodsInfoAll?arr[i].goodsInfoAll.goodsInfoAdded:false)) {
                        // 判断是拆零还是整件，1是拆零2是整件
                        if (arr[i].shoppingType === 1) {
                            productPrice += arr[i].goodsProductLimitPrice.openMoney * arr[i].goodsOpenNum;
                        } else {
                            productPrice += arr[i].goodsProductLimitPrice.completeMoney * arr[i].goodsCompleteNum;
                        }
                    }
                }
                return productPrice

            },
            //物流信息提示
            orderTipFn(arr) {
                let flag = false;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].productSelectActive) {
                        flag = true;
                        break;
                    }
                }
                return flag;
            },
            // 刷新
            // refresh: function () {
            //     this.$router.go(0);
            // },
            // 购物车数据
            shopData: function () {
                let timeStamp = new Date().getTime();
                this.$http({
                    method: 'post',
                    url: this._ajaxUrl + '/shoppingcart/shoppingCartSaveController/selectShoppingCartInfoAll',
                    headers: {
                        'time-stamp': timeStamp
                    },
                }).then((res) => {
                    console.log(res.data)
                    // 用户未登陆
                    if (res.data.errorCode === 'login_0004') {
                        if(localStorage.getItem('unverified')){
                            //未认证
                            this.unverified = true;
                        }else{
                            //未登录
                            this.isLogin = true;
                        }
                    } else {
                        this.isLogin = false;
                        // 清除原本的数据
                        this.orderArr.splice(0, this.orderArr.length);
                        // 后端返回的订单数据,没数据返回网络异常
                        if (res.data.data.list) {
                            this.orderArr.push(...res.data.data.list);
                            if (this.orderArr.length <= 0) {
                                this.shopEmpty = true;
                            } else {
                                this.shopEmpty = false;
                                // 商品数量
                                let productAmount = 0;
                                this.orderArr.forEach(order => {
                                    productAmount += order.listShoppingCart.length;
                                    Vue.set(order, 'hasCoupon', false);
                                    // v-if="(product.goodsInfoAll?product.goodsInfoAll.goodsInfoAdded:false)&&product.goodsProductLot"
                                    order.listShoppingCart.forEach(prod => {
                                        Vue.set(prod, 'prodCancel', (prod.goodsInfoAll?prod.goodsInfoAll.goodsInfoAdded:false)&&prod.goodsProductLot)})
                                    //读取供应商优惠券
                                    let timeStamp = new Date().getTime();
                                    let params = {'storeId': order.thirdStoreInfoAll.storeId};
                                    let md5 = this._cryptojs.MD5(JSON.stringify(params));
                                    this.$http({
                                        method: 'post',
                                        url: this._ajaxUrl + '/encryption/aes',
                                        headers: {
                                            'data-signature': md5
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

                                            if (res.data.errorCode == '0000') {
                                                // this.couponArr = res.data.data
                                                if(res.data.data.length){
                                                    Vue.set(order, 'couponArr', res.data.data);
                                                     order.hasCoupon = true;
                                                }

                                            }
                                        })
                                    });
                                });
                                this.productAmount = productAmount;
                            }
                        } else {
                            this.netWorkError = true;
                        }
                    }
                })
            },
            // 总价(goodsVal.goodsInfoAll?goodsVal.goodsInfoAll.goodsInfoAdded:false)&&goodsVal.goodsProductLot
            totalFn: function () {
                let totalPrice = 0;
                this.orderArr.forEach((orderVal) => {
                    orderVal.listShoppingCart.forEach((goodsVal) => {
                        // 是否选择且有批次，如果选择了才计算价格
                        if (goodsVal.productSelectActive && goodsVal.goodsProductLimitPrice && goodsVal.goodsProductLot && (goodsVal.goodsInfoAll?goodsVal.goodsInfoAll.goodsInfoAdded:false)) {
                            // 1是拆零，2是整件
                            if (goodsVal.shoppingType === 1) {
                                totalPrice += goodsVal.goodsProductLimitPrice.openMoney * goodsVal.goodsOpenNum;
                            } else {
                                totalPrice += goodsVal.goodsProductLimitPrice.completeMoney * goodsVal.goodsCompleteNum;
                            }
                        }
                    });
                });
                this.totalPrice = totalPrice.toFixed(2) + '';
            },
            // 头部按钮。编辑or完成
            headerBtn: function (event) {
                if (this.goBuy) {
                    this.goBuy = false;
                } else {
                    this.goBuy = true;
                    // 如果产品被全部删除了，显示购物车为空
                    if (this.orderArr.length == 0) {
                        this.shopEmpty = true;
                    }
                }
                // v-if="(product.goodsInfoAll?product.goodsInfoAll.goodsInfoAdded:false)&&product.goodsProductLot"
                // 取消勾选
                this.allSelectActive = false;
                for (let i = 0, orderLen = this.orderArr.length; i < orderLen; i++) {
                    Vue.set(this.orderArr[i], 'firmSelectActive', false);
                    for (let j = 0, listShoppingCartLen = this.orderArr[i].listShoppingCart.length; j < listShoppingCartLen; j++) {
                        Vue.set(this.orderArr[i].listShoppingCart[j], 'productSelectActive', false);
                        if(!this.goBuy&&!((this.orderArr[i].listShoppingCart[j].goodsInfoAll?this.orderArr[i].listShoppingCart[j].goodsInfoAll.goodsInfoAdded:false)&&this.orderArr[i].listShoppingCart[j].goodsProductLot)){
                            //点编辑 并且 已下架
                            this.orderArr[i].listShoppingCart[j].prodCancel = true
                        }else if(this.goBuy&&!((this.orderArr[i].listShoppingCart[j].goodsInfoAll?this.orderArr[i].listShoppingCart[j].goodsInfoAll.goodsInfoAdded:false)&&this.orderArr[i].listShoppingCart[j].goodsProductLot)){
                            //点完成 并且 已下架
                            this.orderArr[i].listShoppingCart[j].prodCancel = false
                        }

                    }
                }
                this.totalFn();
            },
            // 所有勾选的，有空需要优化。
            // 商品选择
            productSelectFn: function (parentIdx, selfIdx) {
                // 勾选商品
                Vue.set(this.orderArr[parentIdx].listShoppingCart[selfIdx], 'productSelectActive', !this.orderArr[parentIdx].listShoppingCart[selfIdx].productSelectActive);
                // 商品的数量
                let listShoppingCartLen = this.orderArr[parentIdx].listShoppingCart.length;
                // 选择的产品数量
                let productSelectActiveLen = 0;
                for (let i = 0; i < listShoppingCartLen; i++) {
                    if (this.orderArr[parentIdx].listShoppingCart[i].productSelectActive) {
                        productSelectActiveLen++;
                    }
                }
                // 如果选择的商品数量=商品的数量，该商家也勾选上
                if (productSelectActiveLen === listShoppingCartLen) {
                    this.orderArr[parentIdx].firmSelectActive = true;
                } else {
                    this.orderArr[parentIdx].firmSelectActive = false;
                }
                // 商家的数量
                let orderLen = this.orderArr.length;
                // 选择的商家数量
                let firmSelectActiveLen = 0;
                for (let i = 0; i < orderLen; i++) {
                    if (this.orderArr[i].firmSelectActive) {
                        firmSelectActiveLen++;
                    }
                }
                // 如果选择的商家数量=商家的数量，则全选
                if (firmSelectActiveLen === orderLen) {
                    this.allSelectActive = true;
                } else {
                    this.allSelectActive = false;
                }
                this.totalFn();
            },
            // 商家选择
            firmSelectFn: function (selfIdx) {
                // 勾选商家
                Vue.set(this.orderArr[selfIdx], 'firmSelectActive', !this.orderArr[selfIdx].firmSelectActive);
                // 如果商家勾选了，勾选商家下的所有商品。反之，取消。
                if (this.orderArr[selfIdx].firmSelectActive) {
                    for (let i = 0, listShoppingCartLen = this.orderArr[selfIdx].listShoppingCart.length; i < listShoppingCartLen; i++) {
                        if(!this.goBuy){
                            Vue.set(this.orderArr[selfIdx].listShoppingCart[i], 'productSelectActive', true);
                        }else if(this.goBuy&&(this.orderArr[selfIdx].listShoppingCart[i].goodsInfoAll?this.orderArr[selfIdx].listShoppingCart[i].goodsInfoAll.goodsInfoAdded:false)&&this.orderArr[selfIdx].listShoppingCart[i].goodsProductLot){
                            //点完成 并且 上架商品
                            Vue.set(this.orderArr[selfIdx].listShoppingCart[i], 'productSelectActive', true);
                        }
                    }
                } else {
                    for (let i = 0, listShoppingCartLen = this.orderArr[selfIdx].listShoppingCart.length; i < listShoppingCartLen; i++) {
                        if(!this.goBuy){
                            Vue.set(this.orderArr[selfIdx].listShoppingCart[i], 'productSelectActive', false);
                        }else if(this.goBuy&&(this.orderArr[selfIdx].listShoppingCart[i].goodsInfoAll?this.orderArr[selfIdx].listShoppingCart[i].goodsInfoAll.goodsInfoAdded:false)&&this.orderArr[selfIdx].listShoppingCart[i].goodsProductLot){
                            //点完成 并且 上架商品
                            Vue.set(this.orderArr[selfIdx].listShoppingCart[i], 'productSelectActive', false);
                        }
                    }
                }
                // 商家的数量
                let orderLen = this.orderArr.length;
                // 选择的商家数量
                let firmSelectActiveLen = 0;
                for (let i = 0; i < orderLen; i++) {
                    if (this.orderArr[i].firmSelectActive) {
                        firmSelectActiveLen++;
                    }
                }
                // 如果选择的商家数量=商家的数量，则全选
                if (firmSelectActiveLen === orderLen) {
                    this.allSelectActive = true;
                } else {
                    this.allSelectActive = false;
                }
                this.totalFn();
            },
            // 全选
            allSelectFn: function () {
                // 全选
                this.allSelectActive = !this.allSelectActive;
                // 全选所有商家and产品，或者取消。
                if (this.allSelectActive) {
                    for (let i = 0, orderLen = this.orderArr.length; i < orderLen; i++) {
                        Vue.set(this.orderArr[i], 'firmSelectActive', true);
                        for (let j = 0, listShoppingCartLen = this.orderArr[i].listShoppingCart.length; j < listShoppingCartLen; j++) {
                            if(!this.goBuy){
                                Vue.set(this.orderArr[i].listShoppingCart[j], 'productSelectActive', true);
                            }else if(this.goBuy&&(this.orderArr[i].listShoppingCart[j].goodsInfoAll?this.orderArr[i].listShoppingCart[j].goodsInfoAll.goodsInfoAdded:false)&&this.orderArr[i].listShoppingCart[j].goodsProductLot){
                                //点完成 并且 上架商品
                                Vue.set(this.orderArr[i].listShoppingCart[j], 'productSelectActive', true);
                            }

                        }
                    }
                } else {
                    for (let i = 0, orderLen = this.orderArr.length; i < orderLen; i++) {
                        Vue.set(this.orderArr[i], 'firmSelectActive', false);
                        for (let j = 0, listShoppingCartLen = this.orderArr[i].listShoppingCart.length; j < listShoppingCartLen; j++) {
                            if(!this.goBuy){
                                Vue.set(this.orderArr[i].listShoppingCart[j], 'productSelectActive', false);
                            }else if(this.goBuy&&(this.orderArr[i].listShoppingCart[j].goodsInfoAll?this.orderArr[i].listShoppingCart[j].goodsInfoAll.goodsInfoAdded:false)&&this.orderArr[i].listShoppingCart[j].goodsProductLot){
                                //点完成 并且 上架商品
                                Vue.set(this.orderArr[i].listShoppingCart[j], 'productSelectActive', false);
                            }
                        }
                    }
                }
                this.totalFn();
            },
            // 产品价格整数部分
            productPriceInteger: function (parentIdx, selfIdx) {
                // 判断是否有这个批次
                if (this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice) {
                    let productPrice = '';
                    // 判断是拆零还是整件，1是拆零2是整件
                    if (this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingType === 1) {
                        productPrice += this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.openMoney;
                    } else {
                        productPrice += this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.completeMoney;
                    }
                    return '￥' + (productPrice.split('.')[0] || '00');
                } else {
                    return '';
                }
            },
            // 产品价格小数部分
            productPriceDecimals: function (parentIdx, selfIdx) {
                // 判断是否有这个批次
                if (this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice) {
                    let productPrice = '';
                    // 判断是拆零还是整件，1是拆零2是整件
                    if (this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingType === 1) {
                        productPrice += this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.openMoney;
                    } else {
                        productPrice += this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.completeMoney;
                    }
                    return '.' + (productPrice.split('.')[1] || '00');
                } else {
                    return '';
                }
            },
            // 数量变化ajax。传入购物车id，数量，以及对应数据的idx值
            amountAjaxFn: function (shoppingCartId, amountVal, parentIdx, selfIdx) {
                let timeStamp = new Date().getTime();
                let params = {'shoppingCartId': shoppingCartId, 'goodsNum': amountVal}
                let md5 = this._cryptojs.MD5(JSON.stringify(params));
                this.$http({
                    method: 'post',
                    url: this._ajaxUrl + '/encryption/aes',
                    headers: {
                        'time-stamp': timeStamp,
                        'data-signature': md5
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
                            'time-stamp': timeStamp,
                            'data-signature': md5
                        },
                        url: this._ajaxUrl + '/shoppingcart/shoppingCartSaveController/editShoppingGoodsNumber',
                        data: aes
                    }).then((res) => {
                        // 后端返回大于0就是成功，否则失败
                        if (res.data.data > 0) {

                            // 判断是否有这个批次
                            // if (this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice) {
                            //     let productPrice = '';
                            //     // 判断是拆零还是整件，1是拆零2是整件
                            //     if (this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingType === 1) {
                            //         productPrice += this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.openMoney;
                            //     } else {
                            //         productPrice += this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.completeMoney;
                            //     }
                            //     //判断输入后的数字比输入前的大还是小
                            //     if(amountVal > this.tempAmount){
                            //         this.orderArr[parentIdx].goodsSumMoney += productPrice*(amountVal - this.tempAmount);
                            //     }else{
                            //         this.orderArr[parentIdx].goodsSumMoney -= productPrice*(this.tempAmount - amountVal);
                            //     }
                            //     console.log( this.orderArr[parentIdx].goodsSumMoney);
                            //
                            // } else {
                            //
                            // }


                            let inventory = 0;
                            // 判断是拆零还是整件，1是拆零2是整件
                            if (this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingType === 1) {
                                this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsOpenNum = amountVal;
                                // 拆零库存直接就获取总数
                                inventory = parseInt(this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLot.goodsProductLotWareStock, 10);
                            } else {
                                this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsCompleteNum = amountVal;
                                // 整件库存需要除以件装量
                                inventory = parseInt(this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLot.goodsProductLotWareStock / this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.pieceLoading, 10);
                            }
                            // 如果大于剩余的库存，显示库存不足提示
                            // Vue.set(this.orderArr[parentIdx].listShoppingCart[selfIdx], 'inventoryShow' , amountVal > inventory);
                            // 如果该商品是被勾选的，联动总价的变化
                            if (this.orderArr[parentIdx].listShoppingCart[selfIdx].productSelectActive) {
                                this.totalFn();
                            }
                            // } else {
                            // Vue.set(this.orderArr[parentIdx].listShoppingCart[selfIdx], 'inventoryShow', true);
                            // }
                        }
                    })
                })
            },
            //聚焦输入框
            amountFocus(event) {
                this.tempAmount = event.target.value * 1;
            },
            // 数量输入框
            amountInputFn: function (event, parentIdx, selfIdx) {
                // 购物车中的商品id
                let shoppingCartId = this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingCartId;
                // 采购数量
                let val = event.target.value;

                let amountVal = parseInt(val.replace(/\D/g, '').substr(0, 6), 10);

                //拆零或整件的最低起订量
                let minimum = 0;
                // 判断是拆零还是整件，1是拆零2是整件
                if (this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingType === 1) {
                    // amountVal = this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsOpenNum;
                    //拆零最低起订量 = 商品拆零最低起订量 ? 商品拆零最低起订量 : (商品拆零价格 ? 商品拆零最低价格/商品拆零价格 : 1)
                    minimum = this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.openMinmum ? this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.openMinmum : (this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.openMoney ? Math.ceil(this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.openMinmumPrice / this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.openMoney) : 1);

                } else {
                    // amountVal = this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsCompleteNum;
                    //整件最低起订量 = 商品整件最低起订量 ? 商品整件最低起订量 : (商品整件价格 ? 商品整件最低价格/商品整件价格 : 1)
                    minimum = this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.completeMinmum ? this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.completeMinmum : (this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.completeMoney ? Math.ceil(this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.completeMinmumPrice / this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.completeMoney) : 1);

                }
                if (amountVal < minimum) {
                    amountVal = minimum;
                }
                if (amountVal >= 999999) {
                    amountVal = 999999;
                }
                //输入框数量等于输入的数量
                event.target.value = amountVal;
                this.amountAjaxFn(shoppingCartId, amountVal, parentIdx, selfIdx);
            },
            // 数量减少
            amountReduceFn: function (parentIdx, selfIdx) {
                // 购物车中的商品id
                let shoppingCartId = this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingCartId;
                // 采购数量
                let amountVal = 0;
                //拆零或整件的最低起订量
                let minimum = 0;
                // 判断是拆零还是整件，1是拆零2是整件
                if (this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingType === 1) {
                    amountVal = this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsOpenNum;
                    //拆零最低起订量 = 商品拆零最低起订量 ? 商品拆零最低起订量 : (商品拆零价格 ? 商品拆零最低价格/商品拆零价格 : 1)
                    minimum = this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.openMinmum ? this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.openMinmum : (this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.openMoney ? Math.ceil(this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.openMinmumPrice / this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.openMoney) : 1);

                } else {
                    amountVal = this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsCompleteNum;
                    //整件最低起订量 = 商品整件最低起订量 ? 商品整件最低起订量 : (商品整件价格 ? 商品整件最低价格/商品整件价格 : 1)
                    minimum = this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.completeMinmum ? this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.completeMinmum : (this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.completeMoney ? Math.ceil(this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsInfoAll.completeMinmumPrice / this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.completeMoney) : 1);

                }
                this.tempAmount = amountVal;
                amountVal--;
                if (amountVal < minimum) {
                    amountVal = minimum;
                    return
                }

                this.amountAjaxFn(shoppingCartId, amountVal, parentIdx, selfIdx);
            },
            // 数量增加
            amountAddFn: function (parentIdx, selfIdx) {
                // 购物车中的商品id
                let shoppingCartId = this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingCartId;
                // 采购数量
                let amountVal = 0;
                // 判断是拆零还是整件，1是拆零2是整件
                if (this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingType === 1) {
                    amountVal = this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsOpenNum;
                } else {
                    amountVal = this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsCompleteNum;
                }
                this.tempAmount = amountVal;
                amountVal++;
                if (amountVal >= 999999) {
                    amountVal = 999999;
                    return
                }

                this.amountAjaxFn(shoppingCartId, amountVal, parentIdx, selfIdx);
            },
            // 库存提示
            goodsProductLotTip: function (product) {
                // console.log(product);
                // 库存
                let goodsProductLotWareStock = product.goodsProductLot ? product.goodsProductLot.goodsProductLotWareStock : 0;
                // 采购数量
                let goodsNum = product.shoppingType === 1 ? product.goodsOpenNum : product.goodsCompleteNum;
                // 判断采购数量是否超过库存数量
                if (goodsNum > goodsProductLotWareStock) {
                    Vue.set(product, 'inventoryShow', true);
                    return true;
                } else {
                    Vue.set(product, 'inventoryShow', false);
                    return false;
                }
            },
            // 去结算
            buyFn: function () {
                // 选择的产品数量
                let productSelectActiveLen = 0;
                // 库存提示
                let inventoryTipLen = 0;
                let shoppingIds = '';
                //供应商不满足起配价格
                let Supplier = 0;
                //公司名称
                let companyName = '';
                //商品下架
                let prodCancel = 0;
                for (let i = 0, orderLen = this.orderArr.length; i < orderLen; i++) {
                    //供应商选中的商品价格(this.orderArr[i].listShoppingCart[j].goodsInfoAll?this.orderArr[i].listShoppingCart[j].goodsInfoAll.goodsInfoAdded:false)&&this.orderArr[i].listShoppingCart[j].goodsProductLot
                    let productPrice = 0;
                    for (let j = 0, listShoppingCartLen = this.orderArr[i].listShoppingCart.length; j < listShoppingCartLen; j++) {
                        if (this.orderArr[i].listShoppingCart[j].productSelectActive && this.orderArr[i].listShoppingCart[j].goodsProductLimitPrice && (this.orderArr[i].listShoppingCart[j].goodsInfoAll?this.orderArr[i].listShoppingCart[j].goodsInfoAll.goodsInfoAdded:false)) {
                            shoppingIds += this.orderArr[i].listShoppingCart[j].shoppingCartId + ',';
                            productSelectActiveLen++;
                            // 没库存或库存不足
                            if (!this.orderArr[i].listShoppingCart[j].goodsProductLot || this.orderArr[i].listShoppingCart[j].inventoryShow) {
                                inventoryTipLen++;
                            }

                            if (this.orderArr[i].listShoppingCart[j].shoppingType === 1) {
                                productPrice += this.orderArr[i].listShoppingCart[j].goodsProductLimitPrice.openMoney * this.orderArr[i].listShoppingCart[j].goodsOpenNum;
                            } else {
                                productPrice += this.orderArr[i].listShoppingCart[j].goodsProductLimitPrice.completeMoney * this.orderArr[i].listShoppingCart[j].goodsCompleteNum;
                            }
                        }
                    }

                    if (this.orderTipFn(this.orderArr[i].listShoppingCart)) {
                        //供应商有选中商品
                        if (this.orderArr[i].thirdStoreInfoAll.storeMinimumMoney > productPrice) {
                            //不满足起配费
                            Supplier++;
                            companyName = companyName + '[' + this.orderArr[i].thirdStoreInfoAll.companyName + '] '
                        }
                    }

                }
                console.log(inventoryTipLen);
                // 如果选择的商品数量不是0且库存充足，可以去结算
                if (productSelectActiveLen != 0 && inventoryTipLen == 0) {
                    shoppingIds = shoppingIds.substr(0, shoppingIds.length - 1);
                    if (Supplier > 0) {
                        //有订单不满足供应商起配费order.thirdStoreInfoAll.companyName
                        Toast({
                            message: companyName + '订单总额未达到起订金额，可凑单',
                            position: 'bottom',
                            duration: 3000,
                            className: 'public'
                        })
                    } else {
                        //满足起配费
                        this.$router.push({
                            path: '/orderSubmit',
                            query: {
                                'shoppingIds': shoppingIds,
                                'shoppingCartType': 0,
                            }
                        });
                    }


                } else {
                    //提示语
                    Toast({
                        message: '请选择库存充足的商品',
                        position: 'bottom',
                        duration: 3000,
                        className: 'public'
                    });
                }
            },
            // 删除弹窗-显示
            delPopShowFn: function () {
                // 是否有选择商品
                var productSelectActive = this.orderArr.some(order => {
                    return order.listShoppingCart.some(product => {
                        return product.productSelectActive
                    })
                });
                if (productSelectActive) {
                    this.popShow = true;
                } else {
                    //提示语
                    Toast({
                        message: '请选择商品',
                        position: 'bottom',
                        duration: 3000,
                        className: 'public'
                    });
                }
            },
            // 删除弹窗-隐藏
            delPopHideFn: function () {
                this.popShow = false;
            },
            // 删除商品
            delFn: function () {
                // 选中的购物车id
                let shoppingIds = '';
                this.orderArr.forEach(order => {
                    order.listShoppingCart.forEach(product => {
                        if (product.productSelectActive) {
                            shoppingIds += product.shoppingCartId + ',';
                        }
                    })
                });
                let timeStamp = new Date().getTime();
                let params = {'shoppingIds': shoppingIds.substr(0, shoppingIds.length - 1)}
                let md5 = this._cryptojs.MD5(JSON.stringify(params));
                this.$http({
                    method: 'post',
                    url: this._ajaxUrl + '/encryption/aes',
                    headers: {
                        'time-stamp': timeStamp,
                        'data-signature': md5
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
                            "time-stamp": timeStamp,
                            'data-signature': md5
                        },
                        url: this._ajaxUrl + '/shoppingcart/shoppingCartSaveController/editShoppingCartMoreDelFalg',
                        data: aes
                    }).then((res) => {
                        // 如果成功，重新加载数据。
                        if (res.data.errorCode === '0000') {
                            this.shopData();
                        }
                        // 取消全选，关闭弹窗
                        this.allSelectActive = false;
                        this.popShow = false;
                    })
                })
            },
            // 收藏
            collectFn: function () {
                // 选择的产品id
                let goodsIds = '';
                for (let i = 0, orderLen = this.orderArr.length; i < orderLen; i++) {
                    for (let j = 0, listShoppingCartLen = this.orderArr[i].listShoppingCart.length; j < listShoppingCartLen; j++) {
                        if (this.orderArr[i].listShoppingCart[j].productSelectActive) {
                            goodsIds += this.orderArr[i].listShoppingCart[j].goodsId + ',';
                        }
                    }
                }
                // 是否有选择商品
                if (goodsIds !== '') {
                    let timeStamp = new Date().getTime();
                    let params = {'goodsIds': goodsIds.substr(0, goodsIds.length - 1)};
                    let md5 = this._cryptojs.MD5(JSON.stringify(params));
                    this.$http({
                        method: 'post',
                        url: this._ajaxUrl + '/encryption/aes',
                        headers: {
                            'time-stamp': timeStamp,
                            'data-signature': md5
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
                                "time-stamp": timeStamp,
                                'data-signature': md5
                            },
                            url: this._ajaxUrl + '/goods/collect/batchCollect',
                            data: aes
                        }).then((res) => {
                            // console.log(res.data)
                            if (res.data.errorCode === '0000') {
                                //提示语
                                Toast({
                                    message: '收藏成功',
                                    position: 'bottom',
                                    duration: 3000,
                                    className: 'public'
                                });
                            } else {
                                //提示语
                                Toast({
                                    message: res.data.message,
                                    position: 'bottom',
                                    duration: 3000,
                                    className: 'public'
                                });
                            }
                        })
                    })
                } else {
                    //提示语
                    Toast({
                        message: '请选择商品',
                        position: 'bottom',
                        duration: 3000,
                        className: 'public'
                    });
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .wrap {
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding-bottom: 198px;
        background: #f6f6f6;
        // 网络异常
        .network-error {
            width: 100%;
            height: 100%;
            padding-top: 480px;
            overflow: hidden;
            text-align: center;
            background: url('../../assets/netword-error.png') center 180px no-repeat;
            background-size: 468px 271px;
            .btn-refresh {
                display: inline-block;
                width: 106px;
                height: 48px; /*px*/
                font-size: 26px;
                text-align: center;
                line-height: 50px; /*px*/
                color: #0066cc;
                /*border: 1px solid #0066cc;*/
                box-shadow: 0 0 0 1px #0066cc;
                border-radius: 10px;
                margin-bottom: 2px;
            }
        }
        // 未登录
        .login-no {
            width: 100%;
            height: 100%;
            padding-top: 480px;
            overflow: hidden;
            text-align: center;
            background: url('../../assets/shop-car/login-no.png') center 160px no-repeat;
            background-size: 355px 292px;
            .btn-login {
                display: inline-block;
                width: 160px;
                height: 48px;
                font-size: 26px;
                text-align: center;
                line-height: 50px; /*px*/
                color: #0066cc;
                /*border: 1px solid #0066cc;*/
                box-shadow: 0 0 0 1px #0066cc;
                border-radius: 10px;
                margin-bottom: 2px;
            }
        }
        // 购物车为空
        .shop-empty {
            width: 100%;
            height: 100%;
            padding-top: 440px;
            overflow: hidden;
            text-align: center;
            background: url('../../assets/shop-car/shop-car-empty.png') center 180px no-repeat;
            background-size: 268px 254px;
            a {
                font-size: 26px;
                line-height: 34px;
                text-decoration: underline;
                color: #0066cc;
            }
        }
        // 购物车内容
        .shop-view {
            width: 100%;
            height: 100%;
            overflow: hidden;
            .shop-ctn {
                width: 100%;
                height: 100%;
                overflow-y: auto;
            }
        }
        // 购物车头部
        .shop-header {
            width: 100%;
            height: 81px;
            padding: 0 30px;
            overflow: hidden;
            font-size: 32px;
            line-height: 80px;
            color: #222;
            background: #fff;
            /*border-bottom: 1px solid #eeeeee;*/
            box-shadow: 0 -1px #eee inset;
            .header-text {
                float: left;
            }
            .btn {
                float: right;
            }
        }
        .order {
            width: 100%;
            margin-bottom: 16px;
            // 订单头部
            .order-header {
                width: 100%;
                height: 81px;
                font-size: 28px;
                text-align: left;
                line-height: 80px;
                color: #666;
                background: #fff5e2 url('../../assets/icon/icon-select.png') 30px center no-repeat;
                background-size: 40px 40px;
                /*border-bottom: 1px solid #eeeeee;*/
                box-shadow: 0 -1px #eee inset;
                input {
                    display: none;
                }

                .header-left{
                    width: 85%;
                    padding-left: 86px;
                    float: left;
                    &.active {
                        background: #fff5e2 url('../../assets/icon/icon-select-active.png') 30px center no-repeat;
                        background-size: 40px 40px;
                    }
                }
                .header-right{
                    width: 15%;
                    padding-right: 30px;
                    float: right;
                    text-align: right;

                }
            }

            // 订单公司
            .order-firm {
                padding-right: 34px;
            }
            // 订单提示
            .order-tip {
                width: 100%;
                min-height: 30px;
                padding: 24px 30px 2px;
                font-size: 22px;
                letter-spacing: -.5px;
                line-height: 30px;
                color: #222;
                background: #fff;
                overflow: hidden;
                a {
                    display: inline-block;
                    width: 100px;
                    height: 38px;
                    text-align: center;
                    line-height: 38px;
                    float: right;
                    color: #f82222;
                    box-shadow: 0 0 0 1px #f82222 inset;;
                }
                > div {
                    width: 508px;
                    float: left;
                    .price {
                        display: inline;
                        color: #f82222;
                    }
                    .coupon-tip{
                        display: inline;
                    }
                }

            }
            // 订单内容
            .order-ctn {
                width: 100%;
                background: #fff;
                // 订单详情
                .order-detail {
                    position: relative;
                    width: 100%;
                    padding-left: 102px;
                    &:last-child .product-detail {
                        box-shadow: none;
                    }
                    //商品失效
                    &.prod-cancel{
                        .product-img{
                            box-shadow: 0 0 0 1px rgba(204,204,204,.46);
                        }
                        .product-name,.infor-other li{
                            color: #ddd;
                        }
                        .product-amount{
                            color: #fff;
                            width: 180px;
                            height: 50px;
                            background: #ccc;
                            border-radius: 30px;
                            text-align: center;
                            line-height: 50px;
                        }
                    }
                }
                // 商品选择
                .product-select {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 102px;
                    height: 100%;
                    background: url('../../assets/icon/icon-select.png') center center no-repeat;
                    background-size: 40px 40px;
                    input {
                        display: none;
                    }
                    &.active {
                        background: url('../../assets/icon/icon-select-active.png') center center no-repeat;
                        background-size: 40px 40px;
                    }
                }
                // 商品详情
                .product-detail {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    height: 100%;
                    padding: 30px 30px 30px 0;
                    /*border-bottom: 1px solid #eeeeee;*/
                    box-shadow: 0 -1px #eee inset;
                }
                // 商品图片
                .product-img {
                    position: relative;
                    width: 178px;
                    height: 178px;
                    /*border: 1px solid #cccccc;*/
                    box-shadow: 0 0 0 1px #ccc;
                    .mask{
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: #fff;
                        opacity: .8;
                    }
                    img {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        max-width: 100%;
                        max-height: 100%;
                        transform: translate(-50%, -50%);
                    }
                    // 库存提示
                    .warm-tip {
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        height: 50px;
                        font-size: 22px;
                        line-height: 50px;
                        color: #f82222;
                        white-space: nowrap;
                        transform: translate(-50%, 100%);
                    }
                }
                // 商品信息
                .product-infor {
                    flex: 1;
                    padding-left: 30px;
                    .infor-div {
                        width: 100%;
                        margin-bottom: 4px;
                        overflow: hidden;
                    }
                    // 产品名字
                    .product-name {
                        float: left;
                        width: 210px;
                        height: 36px;
                        overflow: hidden;
                        font-size: 32px;
                        white-space: nowrap;
                        line-height: 36px;
                        text-overflow: ellipsis;
                        color: #222222;
                    }
                    // 产品价格
                    .product-price {
                        float: right;
                        height: 36px;
                        font-size: 24px;
                        white-space: nowrap;
                        line-height: 36px;
                        color: #f82222;
                        span {
                            font-size: 34px;
                        }
                    }
                    // 其他信息
                    .infor-other {
                        display: block;
                        width: 100%;
                        li {
                            display: block;
                            width: 100%;
                            min-height: 38px;
                            font-size: 22px;
                            line-height: 38px;
                            text-align: left;
                            color: #666;
                        }
                    }
                }
                // 数量
                .product-amount {
                    margin-top: 30px;
                    float: right;
                    font-size: 22px;
                    white-space: nowrap;
                    color: #666666;
                    .amount-label {
                        float: left;
                        display: block;
                        height: 64px;
                        padding-right: 14px;
                        line-height: 64px;
                    }
                    // 数量操作按钮
                    .btn-amount {
                        float: left;
                        display: block;
                        width: 65px;
                        height: 64px;
                        vertical-align: middle;
                        text-align: center;
                        line-height: 64px;
                        /*border: 1px solid #e9e9e9;*/
                        box-shadow: 0 0 0 1px #ccc;
                        /*margin-right: 1px;*/
                        &.amount-reduce {
                            color: #d2d2d2;
                        }
                        &.amount-add {
                            color: #f82222;
                        }
                    }
                    // 数量输入框
                    .amount-input {
                        float: left;
                        display: block;
                        width: 88px;
                        height: 64px;
                        vertical-align: middle;
                        font-size: 24px;
                        text-align: center;
                        line-height: 1;
                        color: #333;
                        border: none;
                        /*border-top: 1px solid #e9e9e9;*/
                        /*border-bottom: 1px solid #e9e9e9;*/
                        box-shadow: 0 1px #ccc,0 -1px #ccc, -1px 0 #ccc;
                        border-radius: 0;
                        -webkit-appearance: none;
                        outline: none;
                    }
                }
            }
        }
        // 操作栏
        .shop-opt {
            position: fixed;
            bottom: 98px;
            left: 0;
            width: 100%;
            height: 101px;
            padding-left: 178px;
            background: #fff;
            /*border-top: 1px solid #ececec;*/
            box-shadow: 0 1px #ececec inset;
            // 全选
            .select-all {
                position: absolute;
                top: 0;
                left: 0;
                width: 148px;
                height: 100%;
                padding-left: 86px;
                font-size: 28px;
                white-space: nowrap;
                text-align: left;
                line-height: 100px;
                color: #666;
                background: url('../../assets/icon/icon-select.png') 30px center no-repeat;
                background-size: 40px 40px;
                input {
                    display: none;
                }
                &.active {
                    background: url('../../assets/icon/icon-select-active.png') 30px center no-repeat;
                    background-size: 40px 40px;
                }
            }
            // 去结算
            .go-buy {
                position: relative;
                width: 100%;
                padding-right: 278px;
                // 总价
                .total {
                    width: 100%;
                    height: 100%;
                    font-size: 28px;
                    text-align: right;
                    line-height: 100px;
                    white-space: nowrap;
                    color: #666;
                    .total-price {
                        font-size: 24px;
                        color: #f82222;
                        span {
                            font-size: 34px;
                        }
                    }
                }
                // 结算按钮
                .btn-buy {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 248px;
                    height: 100%;
                    font-size: 34px;
                    text-align: center;
                    line-height: 100px;
                    color: #fff;
                    background: #f82222;
                }
            }
            // 去编辑
            .go-edit {
                width: 100%;
                line-height: 100px;
                text-align: right;
                padding-right: 30px;
                .btn {
                    display: inline-block;
                    height: 60px;
                    margin-left: 10px;
                    padding: 0 30px;
                    vertical-align: middle;
                    font-size: 28px;
                    line-height: 62px; /*px*/
                    border-radius: 60px;
                }
                // 删除
                .btn-del {
                    color: #999;
                    background: #fff;
                    /*border: 1px solid #999999;*/
                    box-shadow: 0 0 0 1px #999;
                }
                // 收藏
                .btn-collect {
                    color: #fff;
                    background: #fa8c35;
                    /*border: 1px solid #fa8c35;*/
                    box-shadow: 0 0 0 1px #fa8c35;
                }
            }
        }
        // 弹窗过渡动画
        .fade-enter-active, .fade-leave-active {
            transition: opacity .3s ease-in;
        }
        .fade-enter, .fade-leave-to {
            opacity: 0;
        }
        // 弹窗-删除
        .pop-shade {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .3);
            transition: all .2s ease-in;
            // 弹窗主体
            .pop-main {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 540px;
                overflow: hidden;
                background: #fff;
                border-radius: 10px;
                transform: translate(-50%, -80%);
            }
            .pop-body {
                width: 100%;
                padding-top: 100px;
                padding-bottom: 70px;
                font-size: 32px;
                text-align: center;
                color: #666666;
            }
            .pop-footer {
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 90px;
                overflow: hidden;
                font-size: 32px;
                text-align: center;
                /*border-top: 1px solid #ccc;*/
                box-shadow: 0 1px #ccc inset;
                .btn {
                    flex: 1;
                    line-height: 90px;
                    /*border-right: 1px solid #ccc;*/
                    box-shadow: -1px 0 #ccc inset;
                    &.last-child {
                        box-shadow: none;
                    }
                }
                .btn-yes {
                    color: #0066cc;
                }
                .btn-no {
                    color: #666;
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