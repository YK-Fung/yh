<template>
    <div class="wrap" v-if="dataShow">
        <div class="wrap-ctn">

            <!-- 订单状态 -->
            <div class="order-status">
                <div class="status-ctn">
                    <!-- 订单状态文字 -->
                    <div class="status-text">{{orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag)}}</div>
                    <!-- 状态描述 -->
                    <!--<div class="status-describe"-->
                        <!--v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待确认' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待付款'">剩2天23小时自动关闭</div>-->
                    <div class="status-describe"
                         v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待付款'">剩2天23小时自动关闭</div>
                    <div class="status-describe"
                        v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '已取消'">{{orderInfor.orderCancelRemark}}</div>
                    <div class="status-describe"
                        v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '部分打款' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待发货' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '已部分发货'">供应商在准备发货了，请耐心等候。</div>
                    <div class="status-describe"
                        v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待收货'">您的货物已经发货了，请耐心等候收货吧。</div>
                    <div class="status-describe"
                        v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待评价'">货物收到了，赶紧来评价吧。</div>
                    <div class="status-describe"
                        v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '已完成'">订单已完成，祝您生活愉快。</div>
                </div>
            </div>

            <!-- 收货信息 -->
            <div class="receiving">
                <div class="title">收货信息</div>
                <div class="infor-detail">
                    <p class="detail-people">收货人：{{orderInfor.shippingPerson}}<span class="detail-mobile">{{orderInfor.shippingMobile}}</span></p>
                    <p class="detail-address">收货地址：{{orderInfor.shippingAddress}}</p>
                    <p class="detail-message" v-if="orderInfor.customerRemark.length > 0">给供应商留言：{{orderInfor.customerRemark}}</p>
                </div>
            </div>

            <!-- 订单信息 -->
            <div class="order">
                <div class="title">订单信息</div>
                <!-- 订单信息 -->
                <div class="order-infor">
                    <div class="infor-ctn">
                        <!-- 订单相关公司and人物 -->
                        <span class="order-firm">{{orderInfor.supplierThirdStoreInfoAll.companyName}}</span>
                        <span class="order-people">{{orderInfor.supplierThirdStoreInfoAll.companyContactName}}</span>
                    </div>
                </div>
                <!-- 订单商品 -->
                <div class="order-product">
                    <div class="product-detail" v-for="(product, productIdx) in orderInfor.listOrderGoods" v-if="productIdx <= showGoodNum">
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
                                <div class="product-price">￥<span>{{productPriceInteger(productIdx)}}</span>.{{productPriceDecimals(productIdx)}}
                                </div>
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
                                <span class="amount-label">{{product.shoppingType === 1 ? '拆零' : '整件'}}</span>x{{product.shoppingType === 1 ? product.goodsOpenNum : product.goodsCompleteNum}}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 查看更多 -->
                <div class="more" v-if="orderInfor.listOrderGoods.length > 5">
                    <div class="btn-more" @click="checkMore(showGoodNum)">{{showGoodNum == 4 ? '查看更多' : '收起'}}</div>
                </div>
            </div>

            <!-- 支付方式 -->
            <div class="pay-way"><span>支付方式</span><span>{{orderLinePay(orderInfor.orderLinePay)}}</span></div>

            <!-- 其他费用 -->
            <ul class="other-price">
                <li>
                    <div class="price-type">物流费用：</div>
                    <div class="price-num">¥<span>{{orderInfor.expressPrice}}</span>.00</div>
                </li>
                <li>
                    <div class="price-type">商品优惠：</div>
                    <div class="price-num">-¥<span>{{orderInfor.orderPrePrice}}</span>.00</div>
                </li>
                <li>
                    <div class="price-type">应付总额（含运费）：</div>
                    <div class="price-num">¥<span>{{orderPriceInteger()}}</span>.{{orderPriceDecimals()}}</div>
                </li>
            </ul>

            <!-- 订单档案 -->
            <div class="order-file">
                <div class="btn-copy" @click="copyFn" data-clipboard-target=".order-num">复制</div>
                <p>订单编号：<span class="order-num">{{orderInfor.orderCode}}</span></p>
                <p>下单时间：{{createTimeFn()}}</p>
            </div>

            <!-- 到底 -->
            <div class="html-base"></div>
        </div>

        <!-- 订单操作 -->
        <div class="order-opt">
            <!-- <div class="btn btn-default"
            v-if="orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '已完成' || orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '已取消'">删除订单</div> -->
            <div class="btn btn-default"
                v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待确认' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待付款'"
                @click="popCancelFn(orderIdx)">取消订单</div>
            <router-link class="btn btn-primary" 
                to="/orderPay"
                v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待付款'" v-show="orderInfor.orderLinePay == 3? false : true">付款</router-link>
            <div class="btn btn-default"
                v-if="(orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待收货' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待评价' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '已完成') && orderInfor.orderPartialExpressNumber <= 1"
                @click="logisticsFn(orderInfor.orderId)">物流跟踪</div>
            <router-link class="btn btn-default" 
                v-if="(orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待收货' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '已部分发货' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待评价' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '已完成') && orderInfor.orderPartialExpressNumber > 1"
                :to="{path: '/orderBatches', query: {orderCode: orderInfor.orderCode, orderId: orderInfor.orderId}}">发货信息</router-link>
            <div class="btn btn-primary"
                v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待发货' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '已部分发货' || orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '部分打款'"
                @click="popRemindFn(orderInfor.orderId)">提醒发货</div>
            <div class="btn btn-default"
                v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待收货'"
                @click="popPostponeFn(orderInfor.orderId)">延期收货</div>
            <div class="btn btn-primary" 
                @click="acceptAffirmFn(orderInfor.orderId)"
                v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待收货'">确认收货</div>
            <router-link class="btn btn-primary" 
                :to="{path: '/comment', query: {'orderId': orderInfor.orderId}}"
                v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '待评价'">评价</router-link>
           <!--  <router-link class="btn btn-primary"
                to="/shopCar"
                v-if="orderStatusTextFn(orderInfor.orderStatus, orderInfor.evaluateFlag) === '已完成'">再次购买</router-link> -->
        </div>

        <!-- 弹窗-取消 -->
        <transition name="fade">
            <div class="pop-shade" v-show="popCancel">
                <!-- 弹窗主体 -->
                <div class="pop-main">
                    <div class="pop-body">
                        <p>确定要取消此订单吗？</p>
                    </div>
                    <div class="pop-footer">
                        <div class="btn btn-yes" @click="orderCancelFn()">确定</div>
                        <div class="btn btn-no" @click="popCancelFn()">取消</div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 弹窗-提醒 -->
        <transition name="fade">
            <div class="pop-shade" v-show="popRemind">
                <!-- 弹窗主体 -->
                <div class="pop-main">
                    <div class="pop-body">
                        <p>提醒成功！</p>
                    </div>
                    <div class="pop-footer">
                        <div class="btn btn-yes" @click="popRemindFn()">我知道了</div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 弹窗-延期 -->
        <transition name="fade">
            <div class="pop-shade" v-show="popPostpone">
                <!-- 弹窗主体 -->
                <div class="pop-main">
                    <div class="pop-body">
                        <p>确定要延期{{postPoneDay}}天收货吗？</p>
                    </div>
                    <div class="pop-footer">
                        <div class="btn btn-yes" @click="postPoneAffirm()">确定</div>
                        <div class="btn btn-no" @click="popPostponeFn()">取消</div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 弹窗-删除 -->
        <transition name="fade">
            <div class="pop-shade" v-show="popDel">
                <!-- 弹窗主体 -->
                <div class="pop-main">
                    <div class="pop-body">
                        <p>确定要删除此订单吗？</p>
                    </div>
                    <div class="pop-footer">
                        <div class="btn btn-yes" @click="delAffirm()">确定</div>
                        <div class="btn btn-no" @click="popDelFn()">取消</div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 弹窗-确认收货 -->
        <transition name="fade">
            <div class="pop-shade" v-show="popAffirm">
                <!-- 弹窗主体 -->
                <div class="pop-main">
                    <div class="pop-body">
                        <p>{{popAffirmText}}</p>
                    </div>
                    <div class="pop-footer">
                        <div class="btn btn-yes" @click="popAffirmFn()">确定</div>
                        <div class="btn btn-no" @click="acceptAffirmFn()">取消</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
import {Toast} from 'mint-ui';
export default {
    name: "order-submit",
    data() {
        return {
            // 订单信息
            orderInfor: {},
            // 订单是否为空
            orderEmpty: false,
            // 弹窗-验收
            popAccept: false,
            // 验收订单的索引
            orderAcceptIdx: 0,
            // 弹窗-取消
            popCancel: false,
            // 取消的订单ID
            orderCancelId: null,
            // 弹窗-提醒
            popRemind: false,
            // 提醒的订单ID
            orderRemindId: null,
            // 延期天数
            postPoneDay: null,
            // 弹窗-延期
            popPostpone: false,
            // 延期的订单ID
            orderPostponeId: null,
            // 弹窗-删除
            popDel: false,
            // 删除的订单ID
            orderDelId: null,
            // 弹窗-确认收货
            popAffirm: false,
            // 弹窗-确认收货文字
            popAffirmText: '',
            // 确认的订单id
            orderAffirmId: null,
            // 如果删除，只是隐藏页面。交由后端将数据删掉
            dataShow: true,
            // 显示5个商品
            showGoodNum: 4,
        }
    },
    created () {
        // 订单信息
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
                'timeStamp': timeStamp,
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
                url: this._ajaxUrl + '/order/orderSaveController/selectOrderDetail',
                data: aes
            }).then((res) => {
                console.log(res)
                if (res.data.errorCode === '0000') {
                    this.orderInfor = res.data.data.resultBean;
                }
            })
        })
        // 延期天数
        this.$http({
            method: 'post',
            url: this._ajaxUrl + '/order/orderSaveController/deferReceivingConfirmDay',
            headers: {
                'time-stamp': timeStamp
            },
        }).then((res) => {
            if (res.data.errorCode === '0000' && res.data.data) {
                this.postPoneDay = res.data.data
            }
        });
    },
    methods: {
        // 查看更多
        checkMore(showGoodNum){
            if(showGoodNum == 4){
                this.showGoodNum = this.orderInfor.listOrderGoods.length;
            }else{
                this.showGoodNum = 4;
            }
            
        },
        //复制按钮
        copyFn(){
            const clipboard = new Clipboard('.btn-copy');
            clipboard.on('success',function (e) {
                Toast({
                    message: '复制成功',
                    position: 'bottom',
                    duration: 3000,
                    className: 'copy-success'
                });
            })
        },
        // 订单状态(订单状态码，评价情况)
        orderStatusTextFn: function (orderStatus, evaluateFlag) {
            switch(orderStatus) {
            case 0:
            case 1:
                return '待确认';
                break;
            case 2:
                return '待付款';
                break;
            case 3: 
                return '部分打款';
                break;
            case 4: 
                return '待发货';
                break;
            case 10: 
                return '已部分发货';
                break;
            case 5: 
                return '待收货';
                break;
            case 6: 
                if (evaluateFlag === -1 || evaluateFlag === 0) {
                    return '待评价'
                } else {
                    return '已完成'
                }
                break;
            case 7: 
                return '异议';
                break;
            case 8:
            case 9:
                return '已完成';
                break;
            case 11: 
                return '已取消';
                break;
            default: 
                return '网络异常' 
            }
        },
        //订单支付方式
        orderLinePay: function(pay){
            switch (pay)
            {
                case 2:
                    return '担保支付';
                    break;
                case 3:
                    return '对公交易';
                    break;
            }
        },
        // 产品价格整数部分
        productPriceInteger: function (selfIdx) {
            let productPrice = '';
            // 判断是拆零还是整件，1是拆零2是整件
            if (this.orderInfor.listOrderGoods[selfIdx].shoppingType === 1) {
                productPrice += this.orderInfor.listOrderGoods[selfIdx].goodsOpenPrice;
                return productPrice.split('.')[0] || '00';
            } else {
                productPrice += this.orderInfor.listOrderGoods[selfIdx].goodsCompletePrice;
                return productPrice.split('.')[0] || '00';
            }
        },
        // 产品价格小数部分
        productPriceDecimals: function (selfIdx) {
            let productPrice = '';
            // 判断是拆零还是整件，1是拆零2是整件
            if (this.orderInfor.listOrderGoods[selfIdx].shoppingType === 1) {
                productPrice += this.orderInfor.listOrderGoods[selfIdx].goodsOpenPrice;
                return productPrice.split('.')[1] || '00';
            } else {
                productPrice += this.orderInfor.listOrderGoods[selfIdx].goodsCompletePrice;
                return productPrice.split('.')[1] || '00';
            }
        },
        // 订单总价整数部分
        orderPriceInteger: function () {
            return this.orderInfor.orderPrice.toString().split('.')[0] || '00';
        },
        // 订单总价小数部分
        orderPriceDecimals: function () {
            return this.orderInfor.orderPrice.toString().split('.')[1] || '00';
        },
        // 下单时间
        createTimeFn: function () {
            var date = new Date(this.orderInfor.createTime);
            return `${date.getFullYear()}-${date.getMonth() + 1 > 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}-${date.getDate() > 10 ? date.getDate() : '0' + date.getDate()} ${date.getHours() > 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()}`;
        },
        // 物流跟踪
        logisticsFn: function (orderId) {
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
                        let orderExprEss = res.data.data[0].orderExprEss;
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
        popAcceptFn: function (orderIdx) {
            if (orderIdx || orderIdx === 0) {
                this.orderAcceptIdx = orderIdx;
            }
            this.popAccept = !this.popAccept;
        },
        // 确定验收
        acceptAffirmFn: function (orderId) {
            if (arguments.length > 0) {
                // 确认的订单id
                this.orderAffirmId = orderId;
                // 判断是一次性发货还是分批
                if (this.orderInfor.orderPartialExpressNumber > 1) {
                    this.popAffirmText = '是否验收所有批次的货品？'
                } else {
                    this.popAffirmText = '是否现在确认验收？'
                }
            }
            this.popAffirm = !this.popAffirm;
        },
        popAffirmFn: function () {
            let timeStamp = new Date().getTime();
            let params = {'orderId': this.orderAffirmId};
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
                    url: this._ajaxUrl + '/order/orderSaveController/confirmReceiptConfirm',
                    data: aes
                }).then((res) => {
                    if (res.data.errorCode === '0000' && res.data.data > 0) {
                        this.popAffirm = !this.popAffirm;       
                    }
                })
            })
        },
        // 取消订单弹窗
        popCancelFn: function (orderIdx) {
            // 如果有传入orderIdx，获取对于的数组id，否则改为null
            if (arguments.length > 0) {
                this.orderCancelId = this.orderInfor.orderId;
            } else {
                this.orderCancelId = null;
            }
            this.popCancel = !this.popCancel;
        },
        // 取消订单
        orderCancelFn: function () {
            // this.orderCancelId
            this.$router.push({
                path: '/orderCancel',
                query: {
                    'orderId': this.orderCancelId
                }
            });
        },
        // 提醒发货弹窗
        popRemindFn: function (orderId) {
            // 如果有传入orderIdx，执行提醒操作。否则只是取消
            if (arguments.length > 0) {
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
                        url: this._ajaxUrl + '/order/orderSaveController/warnDeliverConfirm',
                        data: aes
                    }).then((res) => {
                        console.log(res.data.data)
                        if (res.data.errorCode === '0000' && res.data.data > 0) {
                            this.popRemind = !this.popRemind;       
                        }
                    })
                })
            } else {
                this.popRemind = !this.popRemind;
            }
        },
        // 延期收货弹窗
        popPostponeFn: function (orderId) {
            this.orderPostponeId = orderId;
            this.popPostpone = !this.popPostpone;
        },
        // 确定延期
        postPoneAffirm: function () {
            let timeStamp = new Date().getTime();
            let params = {'orderId': this.orderPostponeId};
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
                    url: this._ajaxUrl + '/order/orderSaveController/deferReceivingConfirm',
                    data: aes
                }).then((res) => {
                    if (res.data.errorCode === '0000' && res.data.data > 0) {
                        this.popPostpone = !this.popPostpone;       
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
        // 订单状态
        .order-status {
            position: relative;
            width: 100%;
            height: 240px;
            text-align: left;
            background: url('../../assets/order/order-status.png') center center no-repeat;
            background-size: cover;
            .status-ctn {
                position: absolute;
                top: 50%;
                left: 88px;
                display: inline-block;
                line-height: 1;
                color: #fff;
                transform: translateY(-50%);
            }
            // 状态文字
            .status-text {
                font-size: 32px;
                margin-bottom: 26px;
            }
            // 状态描述
            .status-describe {
                font-size: 24px;
            }
        }

        .title {
            width: 100%;
            height: 60px; /*px*/
            padding: 0 30px;
            font-size: 28px; /*px*/
            line-height: 60px; /*px*/
            color: #222;
            background: #fff;
            /*border-bottom: 1px solid #ddd;*/
            box-shadow: 0 -1px #ddd inset;
        }

        // 收货信息
        .receiving {
            text-align: left;
            background: #fff;
            // 信息详情
            .infor-detail {
                padding: 30px;
                font-size: 28px;
                line-height: 50px;
                color: #666;
                p {
                    padding-left: 34px;
                    overflow: hidden;
                }
            }
            // 联系人
            .detail-people {
                background: url('../../assets/icon/icon-link.png') left (50-25)/2px no-repeat;
                background-size: 23px 25px;
                // 联系方式
                .detail-mobile {
                    float: right;
                }
            }
            // 地址
            .detail-address {
                background: url('../../assets/icon/icon-pos.png') left (50-30)/2px no-repeat;
                background-size: 22px 30px;
            }
            // 留言
            .detail-message {
                background: url('../../assets/icon/icon-message.png') left (50-22)/2px no-repeat;
                background-size: 24px 22px;
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
                box-shadow: 0 -1px  #e5e5e5 inset;

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
            // 查看更多
            .more {
                width: 100%;
                padding: 20px 0;
                background: #fff;


                .btn-more {
                    width: 150px;
                    height: 54px;
                    margin: 0 auto;
                    font-size: 24px;
                    text-align: center;
                    line-height: 56px;
                    color: #999;
                    /*border: 1px solid #ddd;*/
                    box-shadow: 0 0 0 1px #ddd;
                    border-radius: 54px;
                }
            }
        }
        // 支付方式
        .pay-way {
            display: flex;
            width: 100%;
            line-height: 44px;
            padding: 20px 30px;
            margin-top: 16px;
            margin-bottom: 16px;
            background: #fff;
            color: #666;
            /*border-top: 1px solid #e5e5e5;*/
            /*border-bottom: 1px solid #e5e5e5;*/
            box-shadow: 0 -1px #e5e5e5 inset,0 1px #e5e5e5 inset;
            span{
                flex: 1;
                text-align: right;
                &:nth-of-type(1){
                    text-align: left;
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
            box-shadow: 0 -1px #e5e5e5 inset,0 1px #e5e5e5 inset;
            li {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                font-size: 28px;
                line-height: 50px;
                color: #666;
                .price-num {
                    font-size: 24px;
                    span {
                        font-size: 28px;
                    }
                }
                &:last-child .price-num {
                    color: #f82222;
                }
            }
        }
        // 订单档案
        .order-file {
            padding: 15px 30px;
            background: #fff;
            p {
                overflow: hidden;
                font-size: 24px;
                text-align: left;
                line-height: 46px;
                color: #999;
            }
            // 复制按钮
            .btn-copy {
                display: block;
                float: right;
                width: 104px;
                height: 42px;
                font-size: 22px;
                text-align: center;
                line-height: 44px;/*px*/
                color: #999;
                border: none;
                /*border: 1px solid #ddd;*/
                box-shadow: 0 0 0 1px #ddd;
                border-radius: 5px;
                background: #fff;
            }
        }
        // 到底
        .html-base {
            width: 100%;
            height: 50px;
            background: url('../../assets/icon/icon-base.png') center center no-repeat;
            background-size: 146px 17px;
        }
        // 操作
        .order-opt {
            position: absolute;
            bottom: 0;
            left: 0;
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
                height: 54px;
                width: 150px;
                margin-left: 15px;
                font-size: 28px;
                text-align: center;
                line-height: 58px;/*px*/
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

        // 弹窗过渡动画
        .fade-enter-active, .fade-leave-active {
            transition: opacity .3s ease-in;
        }
        .fade-enter, .fade-leave-to {
            opacity: 0;
        }
        // 弹窗
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
                    display: block;
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
    }
</style>