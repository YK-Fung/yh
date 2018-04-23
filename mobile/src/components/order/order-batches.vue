<template>
    <div class="wrap">

        <!-- 订单编号 -->
        <div class="order-number">
            <div class="number-ctn">订单编号：{{orderCode}}</div>
        </div>

        <!-- 订单信息 -->
        <div class="order" v-for="(order, orderIdx) in orderArr">
            <!-- 配送方式 -->
            <div class="delivery">
                <!-- order.expressType 1是第三方物流，2是自主发货 -->
                <div class="delivery-type" v-if="order.expressType === 1">{{order.orderExprEss.expressName}}：{{order.orderExprEss.expressNo}}</div>
                <div class="delivery-type" v-if="order.expressType === 2">{{order.orderExprEss.expressTypeName}}：{{order.orderExprEss.phone}}</div>

                <div class="delivery-opt"
                     :class="{'active': order.deliveryOptText === '展开'}"
                     @click="productShowFn(orderIdx)">{{order.deliveryOptText}}</div>
            </div>
            <!-- 订单商品 -->
            <div class="order-product" v-show="order.deliveryOptText !== '展开'">
                <div class="product-detail" v-for="(product, productIdx) in order.orderGoodsList">
                    <!-- 产品图片 -->
                    <div class="product-img">
                        <img :src="product.goodsImageUrl">
                    </div>
                    <!-- 产品信息 -->
                    <div class="product-infor">
                        <div class="infor-div">
                            <!-- 产品名字 -->
                            <div class="product-name">{{product.goodsName}}</div>
                            <!-- 产品价格 -->
                            <div class="product-price">￥<span>{{productPriceInteger(orderIdx, productIdx)}}</span>.{{productPriceDecimals(orderIdx,
                                productIdx)}}</div>
                        </div>

                        <!-- 其他信息 -->
                        <ul class="infor-other">
                            <!-- 产品规格 -->
                            <li>{{product.goodsSpec}}</li>
                            <!-- 产品生产公司 -->
                            <li>{{product.goodsProducer}}</li>
                            <!-- 产品批号 -->
                            <li>批号：{{product.goodsProductLotCode}}</li>
                        </ul>

                        <!-- 产品数量 -->
                        <div class="product-amount">
                            <span class="amount-label">{{product.shoppingType === 1 ? '拆零' : '整件'}}</span>x{{product.orderPartialExpressGoods.expressGoodsNum}}</div>

                    </div>
                </div>
            </div>
            <!-- 订单操作 -->
            <div class="order-opt">
                <div class="btn btn-default" @click="logisticsFn(order.orderId, orderIdx)">物流跟踪</div>
                <div class="btn btn-default" v-if="order.orderAccept">已验收</div>
                <div class="btn btn-primary"
                     v-if="order.orderPartialStatus !== 2"
                     @click="popAcceptFn(orderIdx, order.orderPartialExpressId, order.orderId)">验收</div>
                <!--<span>{{orderIdx}}-{{order.orderPartialExpressId}}-{{order.orderId}}</span>-->
            </div>
        </div>

        <!-- 到底 -->
        <div class="html-base"></div>

        <!-- 弹窗-验收 -->
        <transition name="fade">
            <div class="pop-shade" v-show="popAccept">
                <!-- 弹窗主体 -->
                <div class="pop-main">
                    <div class="pop-body">
                        <p>确定要验收这批货品吗？</p>
                    </div>
                    <div class="pop-footer">
                        <div class="btn btn-yes" @click="acceptAffirmFn()">确定</div>
                        <div class="btn btn-no" @click="popAcceptFn()">取消</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import Vue from 'vue';
    export default {
        name: "order-submit",
        data () {
            return {
                // 订单编号
                orderCode: '',
                // 订单
                orderArr: [],
                // 弹窗-验收
                popAccept: false,
                // 验收的idx,发货批次id和订单id
                AcceptOrderIdx: null,
                AcceptOrderPartialExpressId: null,
                AcceptOrderId: null,
                // 是否验收
                orderAccept: false
            }
        },
        created () {
            // 订单编码
            this.orderCode = this.$route.query.orderCode;
            // 订单分批信息
            let timeStamp = new Date().getTime();
            let params = {'orderId': this.$route.query.orderId};
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
                    url: this._ajaxUrl + '/order/orderSaveController/selectOrderExpressDetail',
                    data: aes
                }).then((res) => {
                    console.log(res.data);
                    if (res.data.errorCode === '0000') {
                        this.orderArr.push(...res.data.data);
                        console.log(this.orderArr)
                        this.orderArr.forEach(item => {
                            Vue.set(item, 'deliveryOptText', '展开');
                        });
                    }
                })
            })
        },
        methods: {
            // 产品收起or展开
            productShowFn: function (orderIdx) {
                if (this.orderArr[orderIdx].deliveryOptText === '展开') {
                    this.orderArr[orderIdx].deliveryOptText = '收起';
                } else {
                    this.orderArr[orderIdx].deliveryOptText = '展开';
                }
            },
            // 产品价格整数部分
            productPriceInteger: function (parentIdx, selfIdx) {
                let productPrice = '';
                // 判断是拆零还是整件，1是拆零2是整件
                if (this.orderArr[parentIdx].orderGoodsList[selfIdx].shoppingType === 1) {
                    productPrice += this.orderArr[parentIdx].orderGoodsList[selfIdx].goodsOpenPrice;
                    return productPrice.split('.')[0] || '00';
                } else {
                    productPrice += this.orderArr[parentIdx].orderGoodsList[selfIdx].goodsCompletePrice;
                    return productPrice.split('.')[0] || '00';
                }
            },
            // 产品价格小数部分
            productPriceDecimals: function (parentIdx, selfIdx) {
                let productPrice = '';
                // 判断是拆零还是整件，1是拆零2是整件
                if (this.orderArr[parentIdx].orderGoodsList[selfIdx].shoppingType === 1) {
                    productPrice += this.orderArr[parentIdx].orderGoodsList[selfIdx].goodsOpenPrice;
                    return productPrice.split('.')[1] || '00';
                } else {
                    productPrice += this.orderArr[parentIdx].orderGoodsList[selfIdx].goodsCompletePrice;
                    return productPrice.split('.')[1] || '00';
                }
            },
            // 物流跟踪
            logisticsFn: function (orderId, orderIdx) {
                let timeStamp = new Date().getTime();
                let params = {'orderId': orderId};
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
                        url: this._ajaxUrl + '/order/orderSaveController/selectOrderExpressDetail',
                        data: aes
                    }).then((res) => {
                        if (res.data.errorCode === '0000' && res.data.data.length > 0) {
                            let orderExprEss = res.data.data[orderIdx].orderExprEss;
                            // console.log(orderExprEss);
                            this.$router.push({
                                path: '/logistics',
                                query: {
                                    orderExpressId: orderExprEss.orderExpressId,
                                    orderId: orderExprEss.orderId
                                }
                            })   
                        }
                    })
                })
            },
            // 验收订单弹窗
            popAcceptFn: function (AcceptOrderIdx, AcceptOrderPartialExpressId, AcceptOrderId) {
                // 如果有传入arg，获取相应的批次id和订单id
                if (arguments.length > 0) {
                    this.AcceptOrderIdx = AcceptOrderIdx;
                    this.AcceptOrderPartialExpressId = AcceptOrderPartialExpressId;
                    this.AcceptOrderId = AcceptOrderId;
                } else {
                    this.AcceptOrderIdx = null;
                    this.AcceptOrderPartialExpressId = null;
                    this.AcceptOrderId = null;
                }
                this.popAccept = !this.popAccept;
            },
            // 确定验收
            acceptAffirmFn: function () {
                console.log(this.orderArr[this.AcceptOrderIdx],this.AcceptOrderIdx);
                let timeStamp = new Date().getTime();
                let params = {'orderPartialExpressId': this.AcceptOrderPartialExpressId, 'orderId': this.AcceptOrderId};
                console.log(params);
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
                        url: this._ajaxUrl + '/order/orderSaveController/checkAcceptConfirm',
                        data: aes
                    }).then((res) => {
                        console.log(res.data)
                        if (res.data.errorCode === '0000' && res.data.data > 0) {
                            this.orderArr[this.AcceptOrderIdx].orderPartialStatus = 2;
                            this.popAccept = !this.popAccept;
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
        height: 1334px;
        overflow-x: hidden;
        overflow-y: auto;
        background: #f6f6f6;

        // 订单编号
        .order-number {
            width: 100%;
            height: 90px;
            padding: 0 30px;
            background: #fff;
            .number-ctn {
                width: 100%;
                height: 100%;
                font-size: 28px;
                line-height: 90px;
                color: #222;
                /*border-bottom: 1px solid #ddd;*/
                box-shadow: 0 -1px #ddd inset;
            }
        }

        // 订单
        .order {
            width: 100%;
            margin-bottom: 16px;
            overflow: hidden;
            // 配送方式
            .delivery {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                width: 100%;
                height: 72px;
                padding: 0 30px;
                font-size: 28px;
                white-space: nowrap;
                line-height: 72px;
                background: #fff;
                .delivery-type {
                    color: #222;
                }
                .delivery-opt {
                    padding-right: 30px;
                    color: #999;
                    background: url('../../assets/icon/icon-arrow-top.png') right center no-repeat;
                    background-size: 20px 12px;
                    &.active {
                        background: url('../../assets/icon/icon-arrow-bottom.png') right center no-repeat;
                        background-size: 20px 12px;
                    }
                }
            }
            // 订单信息
            .order-infor {
                height: 74px;
                width: 100%;
                padding: 0 30px;
                background: #fff;
                .infor-ctn {
                    width: 100%;
                    height: 100%;
                    font-size: 28px;
                    line-height: 74px;
                    color: #666;
                    background: url('../../assets/icon/icon-arrow-right.png') right center no-repeat;
                    background-size: 12px 20px;
                    .order-firm {
                        padding-right: 30px;
                    }
                }
            }
            // 订单商品
            .order-product {
                display: block;
                width: 100%;
                padding: 0 30px;
                background: #fffdf8;
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
                        // height: 36px;
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
            // 订单操作
            .order-opt {
                width: 100%;
                height: 100px;
                padding: 0 30px;
                text-align: right;
                line-height: 100px;
                background: #fff;
                /*border-top: 1px solid #e5e5e5;*/
                box-shadow: 0 1px #e5e5e5 inset;
                .btn {
                    display: inline-block;
                    /*height: 54px;!*px*!*/
                    width: 150px;
                    margin-left: 15px;
                    font-size: 30px;
                    text-align: center;
                    line-height: 54px;
                    border-radius: 54px;
                }
                // 灰色按钮
                .btn-default {
                    color: #666;
                    /*border: 1px solid #cccccc;*/
                    box-shadow: 0 0 0 1px #ccc;
                }
                // 蓝色按钮
                .btn-primary {
                    color: #0066cc;
                    /*border: 1px solid #0066cc;*/
                    box-shadow: 0 0 0 1px #0066cc;
                }
            }
        }

        // 到底
        .html-base {
            width: 100%;
            height: 50px;
            background: url('../../assets/icon/icon-base.png') center center no-repeat;
            background-size: 146px 17px;
            margin-bottom: 10px;
        }

        // 弹窗过渡动画
        .fade-enter-active, .fade-leave-active {
            transition: opacity .3s ease-in;
        }
        .fade-enter, .fade-leave-to {
            opacity: 0;
        }
        // 弹窗
        /*.pop-shade {*/
            /*position: fixed;*/
            /*top: 0;*/
            /*left: 0;*/
            /*z-index: 9999;*/
            /*width: 100%;*/
            /*height: 100%;*/
            /*background: rgba(0, 0, 0, .3);*/
            /*transition: all .2s ease-in;*/
            /*// 弹窗主体*/
            /*.pop-main {*/
                /*position: absolute;*/
                /*top: 50%;*/
                /*left: 50%;*/
                /*width: 540px;*/
                /*overflow: hidden;*/
                /*background: #fff;*/
                /*border-radius: 10px;*/
                /*transform: translate(-50%, -80%);*/
            /*}*/
            /*.pop-body {*/
                /*width: 100%;*/
                /*padding-top: 100px;*/
                /*padding-bottom: 70px;*/
                /*font-size: 32px;*/
                /*text-align: center;*/
                /*color: #666666;*/
            /*}*/
            /*.pop-footer {*/
                /*display: flex;*/
                /*flex-direction: row;*/
                /*width: 100%;*/
                /*height: 90px;*/
                /*overflow: hidden;*/
                /*font-size: 32px;*/
                /*text-align: center;*/
                /*!*border-top: 1px solid #ccc;*!*/
                /*box-shadow: 0 1px #ccc inset;*/
                /*.btn {*/
                    /*display: block;*/
                    /*flex: 1;*/
                    /*line-height: 90px;*/
                    /*!*border-right: 1px solid #ccc;*!*/
                    /*box-shadow: -1px 0 #ccc inset;*/
                    /*&.last-child {*/
                        /*box-shadow: none;*/
                    /*}*/
                /*}*/
                /*.btn-yes {*/
                    /*color: #0066cc;*/
                /*}*/
                /*.btn-no {*/
                    /*color: #666;*/
                /*}*/
            /*}*/
        /*}*/
    }
</style>