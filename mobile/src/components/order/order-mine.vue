<template>
    <div class="wrap">

        <!-- 订单类型选择 -->
        <ul class="order-type-select">
            <li
                v-for="(orderType, orderTypeIdx) in orderTypeArr"
                :class="{'active': orderType.active}"
                @click="orderTypeFn(orderTypeIdx)">{{orderType.text}}</li>
        </ul>

        <!-- 订单为空 -->
        <div class="order-empty" v-if="orderEmpty">
            <router-link to="/home" class="btn-index">去首页逛逛</router-link>
        </div>

        <div v-else>
              <!-- 订单信息 -->
            <div class="order" v-for="(order, orderIdx) in orderArr">
                <!-- 订单编号 -->
                <router-link class="order-header" :to="{path: '/orderDetail', query: {orderId: order.orderId}}">
                    <div class="header-ctn">订单编号：{{order.orderCode}}</div>
                    <div class="header-ctn">状态：{{orderStatusTextFn(order.orderStatus, order.evaluateFlag)}}</div>
                </router-link>
                <!-- 配送方式 -->
                <div class="order-firm">
                    <router-link class="firm-name" :to="{path: '/storeDetail', query: {storeId: order.supplierStoreId}}">{{order.supplierCompanyName}}</router-link>
                </div>
                <!-- 订单商品 -->
                <div class="order-product">
                    <router-link class="product-detail" v-for="(product, productIdx) in order.listOrderGoods" v-if="productIdx <= 4" :key="productIdx" :to="{path: '/goodsDetail', query: {goodsId: product.goodsId}}">
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
                                    productIdx)}}
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
                    </router-link>
                </div>
                <!-- 查看更多 -->
                <div class="more" v-if="order.listOrderGoods.length > 5">
                    <router-link :to="{path: '/orderDetail', query: {orderId: order.orderId}}" class="btn-more">查看更多</router-link>
                </div>
                <!-- 订单总计 -->
                <div class="order-total">
                    <div class="left">交易方式：{{orderLinePay(order.orderLinePay)}}</div>
                    <div class="right">共{{order.listOrderGoods.length}}种商品，合计<span class="red">￥<span>{{orderPriceInteger(orderIdx)}}</span>.{{orderPriceDecimals(orderIdx)}}</span></div>
                </div>
                <div class="order-opt">
                    <!-- <div class="btn btn-default"
                    v-if="orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '已完成' || orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '已取消'">删除订单</div> -->
                    <div class="btn btn-default"
                        v-if="orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待确认' || orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待付款'"
                        @click="popCancelFn(orderIdx)">取消订单</div>
                    <router-link class="btn btn-primary" 
                        :to="{path:'/orderPay',query:{orderId:order.orderId,supplier:order.supplierCompanyName,orderCode:order.orderCode,price:order.orderPrice}}"
                        v-if="orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待付款'" v-show="order.orderLinePay == 3? false : true">立即付款</router-link>
                    <div class="btn btn-default"
                        v-if="(orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待收货' || orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待评价' || orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '已完成') && order.orderPartialExpressNumber <= 1"
                        @click="logisticsFn(order.orderId)">物流跟踪</div>
                    <router-link class="btn btn-default" 
                        v-if="(orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待收货' || orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '已部分发货' || orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待评价' || orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '已完成') && order.orderPartialExpressNumber > 1"
                        :to="{path: '/orderBatches', query: {orderCode: order.orderCode, orderId: order.orderId}}">发货信息</router-link>
                    <div class="btn btn-primary"
                        v-if="orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待发货' || orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '已部分发货' || orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '部分打款'"
                        @click="popRemindFn(order.orderId)">提醒发货</div>
                    <div class="btn btn-default"
                        v-if="orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待收货' && order.deferReceivingDay == 0"
                        @click="popPostponeFn(orderIdx, order.orderId)">延期收货</div>
                    <div class="btn btn-primary" 
                        @click="acceptAffirmFn(orderIdx, order.orderId)"
                        v-if="orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待收货'">确认收货</div>
                    <router-link class="btn btn-primary" 
                        :to="{path: '/comment', query: {'orderId': order.orderId}}"
                        v-if="orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '待评价'">去评价</router-link>
                    <!-- <router-link class="btn btn-primary"
                        to="/shopCar"
                        v-if="orderStatusTextFn(order.orderStatus, order.evaluateFlag) === '已完成'">再次购买</router-link> -->
                </div>
            </div>
            <!-- 到底 -->
            <div class="html-base" ref="base" v-if="isEnd"></div>
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
        <!-- <transition name="fade">
            <div class="pop-shade" v-show="popDel"> -->
                <!-- 弹窗主体 -->
                <!-- <div class="pop-main">
                    <div class="pop-body">
                        <p>确定要删除此订单吗？</p>
                    </div>
                    <div class="pop-footer">
                        <div class="btn btn-yes" @click="delAffirm()">确定</div>
                        <div class="btn btn-no" @click="popDelFn()">取消</div>
                    </div>
                </div> -->
        <!--     </div>
        </transition> -->
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
export default {
    name: "order-submit",
    data () {
        return {
            //当前的商品index
            orderIndex:0,
            // 订单类型选择
            orderTypeArr: [
                {text: '全部订单', active: true, status: 'all'},
                // {text: '待确认', active: false, status: 'confirmed'},
                {text: '待付款', active: false, status: 'paid'},
                {text: '待收货', active: false, status: 'receipt'},
            ],
            // 当前页数
            pageNo: 1,
            pageSize :3,
            //订单是否到底
            isEnd:false,
            // 是否加载完成
            orderLoaderEnd: false, 
            // 订单
            orderArr: [],
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
            orderAffirmId: null
        }
    },
    created() {
        // 订单显示
        this.orderViewFn(this.pageNo, this.$route.query.status);
        // 订单状态
        this.orderStatusTextFn();
        // 延期天数
        let timeStamp = new Date().getTime();
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
        })
    },
    mounted() {
        window.addEventListener('scroll', this.scrollFn);
    },
    //切换路由时注销滚动事件
    destroyed() {
        window.removeEventListener('scroll',this.scrollFn)
    },
    methods: {
        // 订单查询
        orderViewFn: function (pageNo = 1, status = 'all') {
            let timeStamp = new Date().getTime();
            let params = {'pageNo': pageNo, 'pageSize':this.pageSize, 'status': status };
            let md5 = this._cryptojs.MD5(JSON.stringify(params));
            // 订单类型
            this.orderTypeArr.forEach((item) => {
                if (item.status === status) {
                    item.active = true;
                } else {
                    item.active = false;
                }
            });
            // 订单信息
            this.$http({
                method: 'post',
                url: this._ajaxUrl + '/encryption/aes',
                headers: {
                    'time-stamp': timeStamp,
                    'data-signature': md5
                },
                data: {
                    'time-stamp': timeStamp,
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
                    url: this._ajaxUrl + '/order/orderSaveController/selectOrderInfoAll',
                    data: aes
                }).then((res) => {
                    console.log(res.data)
                    // 判断是第一次进来，还是加载新的，页数是1为第一次加载
                    if (pageNo === 1) {
                        // 是否成功并且有订单
                        if (res.data.errorCode === '0000' && res.data.data.list.length > 0) {
                            this.orderEmpty = false;
                            // 先清空原本的数据，再接入新数据
                            this.orderArr.splice(0, this.orderArr.length);
                            this.orderArr.push(...res.data.data.list);

                            // 加载完成，页数+1，确认加载完成状态
                            if(this.pageNo * this.pageSize <= res.data.data.rows){
                                this.pageNo ++;
                            }else{
                                this.isEnd = true;
                            }
                        } else {
                            this.orderEmpty = true;
                        }
                    }else{
                        if (res.data.errorCode === '0000'){
                            this.orderArr.push(...res.data.data.list);
                            // 加载完成，页数+1，确认加载完成状态
                            if(this.pageNo * this.pageSize <= res.data.data.rows){
                                this.pageNo ++;
                            }else{
                                this.isEnd = true;
                            }
                        }
                    }
                    this.orderLoaderEnd = true;
                })
            })
        },
        // 订单类型选择
        orderTypeFn: function (idx) {
            this.pageNo = 1;
            this.isEnd = false;
            this.orderViewFn(this.pageNo, this.orderTypeArr[idx].status);
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
        // 滚动加载事件
        scrollFn: function () {
            // 如果已经加载完成了才可触发滚动加载
            if (this.orderLoaderEnd && !this.isEnd) {
                // 滚动的距离
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                // 判断是否滚动到底了
                if ((document.documentElement.clientHeight + scrollTop + 100) >= document.body.scrollHeight) {
                    // 判断查询订单类型
                    let status = 'all';
                    this.orderTypeArr.forEach((item) => {
                        if (item.active) {
                            status = item.status;
                        }
                    });
                    this.orderLoaderEnd = false;
                    this.orderViewFn(this.pageNo, status);
                }
            }
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
        // 产品价格整数部分
        productPriceInteger: function (parentIdx, selfIdx) {
            let productPrice = '';
            // 判断是拆零还是整件，1是拆零2是整件
            if (this.orderArr[parentIdx].listOrderGoods[selfIdx].shoppingType === 1) {
                productPrice += this.orderArr[parentIdx].listOrderGoods[selfIdx].goodsOpenPrice;
                return productPrice.split('.')[0] || '00';
            } else {
                productPrice += this.orderArr[parentIdx].listOrderGoods[selfIdx].goodsCompletePrice;
                return productPrice.split('.')[0] || '00';
            }
        },
        // 产品价格小数部分
        productPriceDecimals: function (parentIdx, selfIdx) {
            let productPrice = '';
            // 判断是拆零还是整件，1是拆零2是整件
            if (this.orderArr[parentIdx].listOrderGoods[selfIdx].shoppingType === 1) {
                productPrice += this.orderArr[parentIdx].listOrderGoods[selfIdx].goodsOpenPrice;
                return productPrice.split('.')[1] || '00';
            } else {
                productPrice += this.orderArr[parentIdx].listOrderGoods[selfIdx].goodsCompletePrice;
                return productPrice.split('.')[1] || '00';
            }
        },
        // 订单总价整数部分
        orderPriceInteger: function (parentIdx) {
            return this.orderArr[parentIdx].orderPrice.toString().split('.')[0] || '00';
        },
        // 订单总价小数部分
        orderPriceDecimals: function (parentIdx) {
            return this.orderArr[parentIdx].orderPrice.toString().split('.')[1] || '00';
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
        acceptAffirmFn: function (orderIdx, orderId) {
            if (arguments.length > 0) {
                // 确认的订单id
                this.orderAffirmId = orderId;
                // 判断是一次性发货还是分批
                if (this.orderArr[orderIdx].orderPartialExpressNumber > 1) {
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
                        // 刷新数据
                        let orderTypeActive = this.orderTypeArr.filter((item) => {
                            return item.active;
                        });
                        this.orderViewFn(this.pageNo, orderTypeActive[0].status);
                        this.popAffirm = !this.popAffirm;       
                    }
                })
            })
        },
        // 取消订单弹窗
        popCancelFn: function (orderIdx) {
            // 如果有传入orderIdx，获取对于的数组id，否则改为null
            if (arguments.length > 0) {
                this.orderCancelId = this.orderArr[orderIdx].orderId;
            } else {
                this.orderCancelId = null;
            }
            this.popCancel = !this.popCancel;
        },
        // 取消订单
        orderCancelFn: function () {
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
                        console.log(res)
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
        popPostponeFn: function (orderIdx, orderId) {
            this.orderPostponeId = orderId;
            this.orderIndex = orderIdx;
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
                        //延期收货字段deferReceivingDay改为不等于0  将延期收货按钮隐藏
                        this.orderArr[this.orderIndex].deferReceivingDay = 1;
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
  height: 1334px;
  overflow-x: hidden;
  overflow-y: auto;
  background: #f6f6f6;
  // 订单类型选择
  .order-type-select {
    display: flex;
    flow: row nowrap;
    justify-content: center;
    width: 100%;
    height: 90px;
    padding: 0 30px;
    margin-bottom: 10px;
    background: #fff;
    li {
      display: block;
      flex: 1;
      height: 100%;
      font-size: 30px;
      text-align: center;
      line-height: 86px;
      color: #999;
      border-bottom: 3px solid #fff;
    }
    .active {
      color: #0066cc;
      border-bottom-color: #0066cc;
    }
  }
  // 订单是否为空
  .order-empty {
    width: 100%;
    padding-top: 640px;
    text-align: center;
    background: url('../../assets/order/order-no-bg.png') center 150px no-repeat;
    background-size: 438px 458px;
    // 去首页按钮
    .btn-index {
      display: inline-block;
      padding: 10px 16px;
      font-size: 28px;
      color: #fff;
      background: #0066cc;
      border-radius: 8px;
    }
  }
  // 订单
  .order {
    width: 100%;
    margin-bottom: 16px;
    overflow: hidden;
    // 订单编号
    .order-header {
      display: flex;
      flow: row nowrap;
      justify-content: space-between;
      width: 100%;
      height: 90px;
      padding: 0 30px;
      background: #fff;
      .header-ctn {
        height: 100%;
        font-size: 28px;
        line-height: 90px;
        white-space: nowrap;
        color: #222;
      }
    }
    // 订单公司
    .order-firm {
      height: 74px;
      width: 100%;
      padding: 0 30px;
      background: #fff;
      .firm-name {
        display: block;
        width: 100%;
        height: 100%;
        font-size: 28px;
        line-height: 74px;
        color: #666;
        background: url('../../assets/icon/icon-arrow-right.png') right center no-repeat;
        background-size: 12px 20px;
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
      /*border-bottom: 1px solid #ddd;*/
      box-shadow: 0 -1px #ddd inset;
      .btn-more {
        display: block;
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
    // 订单总计
    .order-total {
      width: 100%;
      padding: 20px 30px;
      font-size: 24px;
      color: #666;
      background: #fff;
      overflow: hidden;
      .red {
        color: #f82222;
        span {
          font-size: 32px;
        }
      }
      .right{
        float: right;
      }
      .left{
        float: left;
        line-height: 44px;
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
      box-shadow: 0 -1px #ccc;
      .btn {
        display: block;
        flex: 1;
        line-height: 90px;
        /*border-right: 1px solid #ccc;*/
        box-shadow: 1px 0 #ccc;
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