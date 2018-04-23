<template>
    <div class="wrap">
        <div class="wrap-ctn">
            <!-- 收货地址 -->
            <router-link class="address" to="/address">
                <div class="address-t" v-if="addressInfor.length>0">
                    <span class="infor-name">
                        {{this.addressInfor[0].addressRecipientName}}
                    </span>
                    <span class="infor-tel">
                        {{this.addressInfor[0].addressPhone}}
                    </span>
                </div>
                <div class="address-b" :class="{'address-none':addressInfor.length<1}">
                    <div class="address-pos">
                        {{this.addressInfor.length>0?this.addressInfor[0].addressName.replace(/\-/g, '') +
                        this.addressInfor[0].addressDetail:'请先选择收货地址'}}
                    </div>
                </div>
            </router-link>

            <!-- 订单 -->
            <div class="order" v-for="(order, orderIdx) in orderArr">
                <!-- 订单信息 -->
                <div class="order-infor">
                    <span class="order-firm">{{order.thirdStoreInfoAll.companyName}}</span>
                    <span class="order-people">{{order.thirdStoreInfoAll.bussLegalName}}</span>
                </div>

                <!-- 订单商品 -->
                <div class="order-product">
                    <div class="product-detail" v-for="(product, productIdx) in order.listShoppingCart">
                        <!-- 产品图片 -->
                        <div class="product-img">
                            <img :src="product.goodsInfoAll.goodsImg">
                        </div>
                        <!-- 产品信息 -->
                        <div class="product-infor">
                            <div class="infor-div">
                                <!-- 产品名字 -->
                                <div class="product-name">{{product.goodsName}}</div>
                                <!-- 产品价格 -->
                                <div class="product-price">￥<span>{{productPriceInteger(orderIdx, productIdx)}}</span>.{{productPriceDecimals(orderIdx,
                                    productIdx)}}
                                </div>
                            </div>

                            <!-- 其他信息 -->
                            <ul class="infor-other">
                                <!-- 产品规格 -->
                                <li>{{product.specName}}</li>
                                <!-- 产品生产公司 -->
                                <li>{{product.goodsInfoAll.producer}}</li>
                                <!-- 产品批号 -->
                                <li>批号：{{product.approvalNumber}}</li>
                            </ul>

                            <!-- 产品数量 -->
                            <div class="product-amount">
                                <span class="amount-label">{{product.shoppingType === 1 ? '拆零' : '整件'}}</span>x{{product.shoppingType
                                === 1 ? product.goodsOpenNum : product.goodsCompleteNum}}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 支付方式 -->
                <div class="pay-way"><span>支付方式</span><span>担保交易</span></div>

                <!-- 供应商留言 -->
                <div class="leave-message">
        	  			<textarea name="" placeholder="给供应商留言:(45字以内)"
                                  v-model="leaveMessage[orderIdx]"
                                  @touchmove.prevent
                                  @change="leaveMessageFn(orderIdx)">
          				</textarea>
                </div>

                <!-- 优惠信息,没有优惠券就不显示 -->
                <div class="discounts" v-if="order.couponList && order.couponList.length > 0">
                    <div class="disocunts-div">
                        <div class="discounts-infor"
                             :class="{'active': order.couponListShow}"
                             @click="couponListShowFn(orderIdx)">优惠信息：<span
                                class="infor-view">{{order.couponInfor}}</span></div>
                    </div>
                    <!-- 优惠选择.优惠券类型(0:平台优惠券，1：店铺优惠券，2：商品优惠券，)-->
                    <ul class="discounts-select" v-show="order.couponListShow">
                        <!-- <li><input type="radio" value="">不使用优惠券</li> -->
                        <li
                                v-for="(discounts, discountsIdx) in order.couponList"
                                :class="{'active': discounts.couponListSelect}"
                                @click="couponSelectFn(orderIdx, discountsIdx)">
                            <span v-if="discountsIdx === 0">不使用优惠券</span>
                            <span v-else>
                            <input type="radio" value="discounts.couponId">
                            <span class="discounts-type">{{discountsType(discounts.couponType)}}</span>
                            满{{discounts.freeMoney}}元减{{discounts.couponPrice}}&nbsp有效期为{{discounts.couponTimeType==1?discountsEnd(discounts.couponEndTime):discounts.validityDays+'天'}}
                          </span>
                        </li>
                    </ul>
                </div>

                <!-- 订单总计 -->
                <ul class="order-total">
                    <li>运费：<span class="total-price">¥&nbsp<span>{{order.goodsSumFreight}}</span>.00</span></li>
                    <li>货物总价格：<span class="total-price">¥&nbsp<span>{{goodsSumMoneyInteger(orderIdx)}}</span>.{{goodsSumMoneyDecimals(orderIdx)}}</span>
                    </li>
                </ul>
            </div>

            <!-- 其他费用 -->
            <ul class="other-price">
                <li>
                    <div class="price-type">物流费用：</div>
                    <div class="price-num">¥{{goodsSumFreightAll}}.<span>00</span></div>
                </li>
                <li>
                    <div class="price-type">商品优惠：</div>
                    <div class="price-num">-¥{{couponPriceAll}}.<span>00</span></div>
                </li>
            </ul>
        </div>

        <!-- 操作 -->
        <div class="opt">
            <div class="all-total">应付总额<span class="grey">（含运费）</span>：<span class="total-price">¥{{totalPriceInteger}}.<span>{{totalPriceDecimals}}</span></span>
            </div>
            <div class="btn-submit" @click="submitFn()">提交订单</div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {Toast} from 'mint-ui';

    export default {
        name: "order-submit",
        data() {
            return {
                //物流费用
                goodsSumFreightAll: 0,
                // 地址信息
                addressInfor: [],
                // 订单信息
                orderArr: [],
                // 留言
                leaveMessage: [],
                // 优惠总价
                couponPriceAll: 0,
                // 货物总价格
                goodsSumMoneyAll: 0
            }
        },
        created() {
            // console.log(this.$route.query.shoppingIds);
            let timeStamp = new Date().getTime();
            let params = {
                'shoppingIds': this.$route.query.shoppingIds,
                'shoppingCartType': this.$route.query.shoppingCartType
            }
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
                    url: this._ajaxUrl + '/shoppingcart/shoppingCartSaveController/selectConfirmShoppingCartOrder',
                    data: aes
                }).then((res) => {
                    if (res.data.errorCode === '0000') {
                        console.log(res)
                        if (res.data.data.list.length > 0) {
                            // 订单信息
                            let orderInfor = res.data.data.list;
                            // 地址信息(筛选出默认地址)
                            let addressInfor = orderInfor[0].customerAddressList.filter((val) => {
                                return val.isDefault === 0;
                            });
                            this.addressInfor.push(...addressInfor);
                            // 物流费用
                            let goodsSumFreightAll = 0;
                            // 货物总价
                            let goodsSumMoneyAll = 0;
                            // 订单详情
                            this.orderArr.push(...orderInfor);
                            this.orderArr.forEach((store, storeIdx) => {
                                console.log(store)
                                // 有优惠券
                                if (store.couponList && store.couponList.length > 0) {
                                    // 优惠券数量
                                    let couponLen = store.couponList.length;
                                    // 加入不选择优惠券选项
                                    store.couponList.unshift({});
                                    // 店铺优惠券是否展开,如果没有修改过，默认展开
                                    if (!store.couponListShow) {
                                        Vue.set(store, 'couponListShow', true);
                                    }
                                    // 优惠券信息
                                    Vue.set(store, 'couponInfor', `可用优惠券${couponLen}张`);
                                }
                                // 物流费用
                                goodsSumFreightAll += store.goodsSumFreight;
                                // 货物总价
                                goodsSumMoneyAll += store.goodsSumMoney;
                            });
                            this.goodsSumFreightAll = goodsSumFreightAll;
                            this.goodsSumMoneyAll = goodsSumMoneyAll;
                        } else {
                            this.$router.push({path: '/shopCar'});
                        }
                    }
                })
            })
        },
        computed: {
            // 应付总额
            totalPrice: function () {
                return this.goodsSumMoneyAll + this.goodsSumFreightAll - this.couponPriceAll;
            },
            // 应付总额整数部分
            totalPriceInteger: function () {
                return this.totalPrice.toString().split('.')[0] || '00';
            },
            // 应付总额小数部分
            totalPriceDecimals: function () {
                return this.totalPrice.toString().split('.')[1] || '00';
            },
        },
        methods: {
            // 产品价格整数部分
            productPriceInteger: function (parentIdx, selfIdx) {
                let productPrice = '';
                // 判断是拆零还是整件，1是拆零2是整件
                if (this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingType === 1) {
                    productPrice += this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.openMoney;
                    return productPrice.split('.')[0] || '00';
                } else {
                    productPrice += this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.completeMoney;
                    return productPrice.split('.')[0] || '00';
                }
            },
            // 产品价格小数部分
            productPriceDecimals: function (parentIdx, selfIdx) {
                let productPrice = '';
                // 判断是拆零还是整件，1是拆零2是整件
                if (this.orderArr[parentIdx].listShoppingCart[selfIdx].shoppingType === 1) {
                    productPrice += this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.openMoney;
                    return productPrice.split('.')[1] || '00';
                } else {
                    productPrice += this.orderArr[parentIdx].listShoppingCart[selfIdx].goodsProductLimitPrice.completeMoney;
                    return productPrice.split('.')[1] || '00';
                }
            },
            // 留言
            leaveMessageFn: function (parentIdx) {
                this.leaveMessage[parentIdx] = this.leaveMessage[parentIdx].substr(0, 45);
            },
            // 优惠券类型(0:平台优惠券，1：店铺优惠券，2：商品优惠券，)
            discountsType: function (couponType) {
                switch (couponType) {
                    case 0:
                        return '平台优惠券';
                        break;
                    case 1:
                        return '店铺优惠券';
                        break;
                    default:
                        return '商品优惠券';
                        break;
                }
            },
            // 优惠券有效期
            discountsEnd: function (time) {
                var date = new Date(time);
                return `${date.getFullYear()}.${date.getMonth() + 1 > 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}.${date.getDate() > 10 ? date.getDate() : '0' + date.getDate()}`;
            },
            // 优惠券展开or隐藏
            couponListShowFn: function (parentIdx) {
                this.orderArr[parentIdx].couponListShow = !this.orderArr[parentIdx].couponListShow;
            },
            // 选择优惠券
            couponSelectFn: function (parentIdx, selfIdx) {
                this.orderArr[parentIdx].couponList.forEach((coupon) => {
                    Vue.set(coupon, 'couponListSelect', false);
                });
                Vue.set(this.orderArr[parentIdx].couponList[selfIdx], 'couponListSelect', true);
                // 如果是选择了第一张，则显示“不使用优惠券”，否则显示实际优惠信息。
                if (selfIdx === 0) {
                    this.orderArr[parentIdx].couponInfor = '不使用优惠券';
                } else {
                    let couponPrice = this.orderArr[parentIdx].couponList[selfIdx].couponPrice;
                    this.orderArr[parentIdx].couponInfor = `共抵用${couponPrice}元;使用优惠券1张`;
                }
                // 优惠总价
                let couponPriceAll = 0;
                this.orderArr.forEach((order) => {
                    order.couponList.forEach((coupon) => {
                        if (coupon.couponListSelect) {
                            couponPriceAll += coupon.couponPrice || 0
                        }
                    });
                });
                this.couponPriceAll = couponPriceAll;
            },
            // 货物总价整数部分
            goodsSumMoneyInteger: function (parentIdx) {
                return this.orderArr[parentIdx].goodsSumMoney.toString().split('.')[0] || '00';
            },
            // 货物总价小数部分
            goodsSumMoneyDecimals: function (parentIdx) {
                return this.orderArr[parentIdx].goodsSumMoney.toString().split('.')[1] || '00';
            },
            // 提交订单
            submitFn: function () {
                // /orderMine
                // 店铺信息
                let thirdStoreInfoAllList = [];
                this.orderArr.forEach((order, orderIdx) => {
                    thirdStoreInfoAllList[orderIdx] = {};
                    // 供应商id
                    thirdStoreInfoAllList[orderIdx].storeId = order.thirdStoreInfoAll.storeId
                    // 留言
                    thirdStoreInfoAllList[orderIdx].placeOrderMessage = this.leaveMessage[orderIdx] || '';
                    // 是否有优惠券
                    if (order.couponList) {
                        // 选中的优惠券id
                        order.couponList.forEach((coupon) => {
                            if (coupon.couponId && coupon.couponListSelect) {
                                thirdStoreInfoAllList[orderIdx].orderCouponId = coupon.couponId;
                            }
                        });
                    }
                    // 购物车id
                    let shoppingCartIds = '';
                    order.listShoppingCart.forEach((goods) => {
                        shoppingCartIds += goods.shoppingCartId + ',';
                    })
                    thirdStoreInfoAllList[orderIdx].shoppingCartIds = shoppingCartIds.substr(0, shoppingCartIds.length - 1);
                    // 支付类型
                    thirdStoreInfoAllList[orderIdx].orderLinePay = 2;
                });
                let timeStamp = new Date().getTime();
                let params = {
                    'addressId': this.addressInfor[0].addressId,
                    'thirdStoreInfoAllList': thirdStoreInfoAllList
                };
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
                        url: this._ajaxUrl + '/order/orderSaveController/saveOrderInfo',
                        data: aes
                    }).then((res) => {
                        if (res.data.data.numberTip === 100) {
                            this.$router.push({path: '/orderMine'});
                        } else {
                            //提示语
                            Toast({
                                message: res.data.data.errorTip,
                                position: 'bottom',
                                duration: 3000,
                                className: 'public'
                            });
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .wrap {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding-bottom: 101px;
        background: #f6f6f6;
        .wrap-ctn {
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
        }
        // 收货地址
        .address {
            display: block;
            width: 100%;
            padding: 20px 30px 34px;
            background: #fff url('../../assets/shop-car/address-bg.png') center bottom no-repeat;
            background-size: contain;
            .address-t {
                padding-left: 50px;
                font-size: 32px;
                color: #222;
            }
            .infor-name {
                padding-right: 60px;
            }
            .address-b {
                padding-right: 90px;
                margin-top: 10px;
                font-size: 26px;
                line-height: 54px;
                color: #999;
                background: #fff url('../../assets/icon/icon-arrow-right.png') right (54-20)/2px no-repeat;
                background-size: 12px 20px;
                &.address-none {
                    font-size: 32px;
                    color: #222;
                }
            }
            .address-pos {
                word-break: break-all;
                padding-left: 50px;
                background: #fff url('../../assets/icon/icon-pos.png') left 14px no-repeat;
                background-size: 22px 30px;
            }
        }
        // 订单
        .order {
            width: 100%;
            margin-top: 16px;
            overflow: hidden;
            /*border-top: 1px solid #e5e5e5;*/
            /*border-bottom: 1px solid #e5e5e5;*/
            box-shadow: 0 -1px #e5e5e5 inset, 0 1px #e5e5e5 inset;
            // 订单信息
            .order-infor {
                height: 76px;
                width: 100%;
                padding: 0 30px;
                font-size: 28px;
                line-height: 76px; /*px*/
                color: #666;
                background: #fff5e2;
                .order-firm {
                    padding-right: 30px;
                }
            }
            // 订单商品
            .order-product {
                display: block;
                width: 100%;
                padding: 0 30px;
                background: #fffdf8;
                /*border-top: 1px solid #e5e5e5;*/
                /*border-bottom: 1px solid #e5e5e5;*/
                box-shadow: 0 -1px #e5e5e5 inset, 0 1px #e5e5e5 inset;
            }
            // 商品详情
            .product-detail {
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 100%;
                padding: 30px 0;
                /*border-bottom: 1px solid #e5e5e5;*/
                box-shadow: 0 -1px #e5e5e5 inset;
                &:last-child {
                    box-shadow: none;
                }
            }
            // 商品图片
            .product-img {
                position: relative;
                width: 178px;
                height: 178px;
                /*border: 1px solid #cccccc;*/
                box-shadow: 0 0 0 1px #ccc;
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
                    margin-bottom: 6px;
                    overflow: hidden;
                }
                // 产品名字
                .product-name {
                    float: left;
                    width: 280px;
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
                        height: 36px;
                        font-size: 24px;
                        line-height: 36px;
                        text-align: left;
                        color: #666;
                    }
                }
            }
            // 数量
            .product-amount {
                float: right;
                font-size: 24px;
                white-space: nowrap;
                color: #999;
                .amount-label {
                    padding-right: 20px;
                }
            }
            // 支付方式
            .pay-way {
                display: flex;
                width: 100%;
                line-height: 58px;
                padding: 16px 30px;
                background: #fff;
                font-size: 28px;
                /*border-bottom: 1px solid #e5e5e5;*/
                box-shadow: 0 -1px #e5e5e5 inset;
                color: #666;
                span {
                    flex: 1;
                    text-align: right;
                    &:nth-of-type(1) {
                        text-align: left;
                    }
                }
            }
            // 供应商留言
            .leave-message {
                padding: 16px 30px;
                background: #fff;
                /*border-bottom: 1px solid #e5e5e5;*/
                box-shadow: 0 -1px #e5e5e5 inset;
                textarea {
                    width: 100%;
                    height: 100%;
                    padding: 0;
                    font-size: 32px;
                    line-height: 44px;
                    color: #666666;
                    background: url('../../assets/icon/icon-textarea.png') right bottom no-repeat;
                    background-size: 12px 12px;
                    border: none;
                    outline: none;
                    resize: none;
                }
            }
            // 优惠
            .discounts {
                width: 100%;
                .disocunts-div {
                    padding: 0 30px;
                    /*border-bottom: 1px solid #e5e5e5;*/
                    box-shadow: 0 -1px #e5e5e5 inset;
                    background: #fff;

                }
                // 优惠信息
                .discounts-infor {
                    width: 100%;
                    height: 90px;
                    font-size: 28px;
                    line-height: 90px;
                    color: #666;
                    background: #fff url('../../assets/icon/icon-arrow-bottom.png') right center no-repeat;
                    background-size: 20px 12px;
                    .infor-view {
                        color: #999999;
                    }
                    &.active {
                        background: #fff url('../../assets/icon/icon-arrow-top.png') right center no-repeat;
                        background-size: 20px 12px;
                    }
                }
                // 优惠选择
                .discounts-select {
                    display: block;
                    width: 100%;
                    padding: 0 30px;
                    font-size: 26px;
                    color: #666;
                    background: #fbfbfb;
                    /*border-bottom: 1px solid #e5e5e5;*/
                    box-shadow: 0 -1px #e5e5e5 inset;
                    li {
                        width: 100%;
                        height: 90px;
                        padding-right: 70px;
                        line-height: 90px;
                        border-bottom: 1px dashed #dddddd;
                        background: url('../../assets/icon/icon-select.png') right center no-repeat;
                        background-size: 40px 40px;
                        &:last-child {
                            border-bottom: none;
                        }
                        &.active {
                            background: url('../../assets/icon/icon-select-active.png') right center no-repeat;
                            background-size: 40px 40px;
                        }
                    }
                    input {
                        display: none;
                    }
                    .discounts-type {
                        display: inline-block;
                        vertical-align: middle;
                        width: 136px;
                        height: 32px;
                        padding-left: 18px;
                        padding-right: 8px;
                        margin-right: 20px;
                        font-size: 22px;
                        white-space: nowrap;
                        line-height: 32px;
                        color: #f82222;
                        background: url('../../assets/shop-car/discounts-bg.png') center center no-repeat;
                        background-size: 136px 32px;
                    }
                }
            }
            // 订单总计
            .order-total {
                display: block;
                width: 100%;
                height: 90px;
                padding: 0 30px;
                font-size: 28px;
                text-align: right;
                line-height: 90px;
                color: #222;
                background: #fff;
                li {
                    display: inline-block;
                    &:last-child {
                        padding-left: 60px;
                    }
                }
                .total-price {
                    color: #f82222;
                    & > span {
                        font-size: 38px;
                    }
                }
            }
        }
        // 其他费用
        .other-price {
            display: block;
            width: 100%;
            padding: 20px 30px;
            margin-top: 16px;
            margin-bottom: 16px;
            background: #fff;
            /*border-top: 1px solid #e5e5e5;*/
            /*border-bottom: 1px solid #e5e5e5;*/
            box-shadow: 0 -1px #e5e5e5 inset, 0 1px #e5e5e5 inset;
            li {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                font-size: 28px;
                line-height: 50px;
                color: #222222;
                .price-num {
                    color: #f82222;
                    & > span {
                        font-size: 24px;
                    }
                }
            }
        }
        // 操作
        .opt {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            padding-left: 30px;
            padding-right: 280px;
            /*border-top: 1px solid #e5e5e5;*/
            box-shadow: 0 1px #e5e5e5 inset;
            background: #fff;
            .all-total {
                width: 100%;
                height: 100%;
                font-size: 28px;
                text-align: right;
                line-height: 100px;
                color: #222;
                .grey {
                    font-size: 24px;
                    color: #999999;
                }
                .total-price {
                    color: #f82222;
                    & > span {
                        font-size: 24px;
                    }
                }
            }
            .btn-submit {
                position: absolute;
                top: 0;
                right: 0;
                display: block;
                width: 250px;
                height: 100%;
                font-size: 34px;
                text-align: center;
                line-height: 100px;
                color: #fff;
                background: #0066cc;
            }
        }
    }
</style>