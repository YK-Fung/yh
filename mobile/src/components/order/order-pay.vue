<template>
    <div class="wrap" >
        <div class="pay-top">
            <div class="pay-money">
                <p>支付金额</p>
                <span>￥<span>{{orderBean.price.toString().split('.')[0] || '00'}}</span>.{{orderBean.price.toString().split('.')[1] || '00'}}</span>
            </div>
            <div class="pay-info">
                <p class="name">供应商名称<span>{{orderBean.supplier}}</span></p>
                <p class="order-num">订单号码<span>{{orderBean.orderCode}}</span></p>
            </div>
        </div>
        <div class="pay-bottom">
            <div class="pay-type-title">
                <i></i>选择支付方式<i></i>
            </div>
            <div class="pay-type-main">
                <div v-if="this.isWX" class="pay-wx"><i></i>微信支付</div>
                <div v-if="!this.isWX" class="pay-zfb" @click="toPay(2)"><i></i>支付宝支付</div>
                <!--<div class="pay-bank"><i></i>银行卡支付</div>-->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "order-pay",
        data() {
            return {
                orderBean:{},
                imgSrc: '',
                //是否微信或QQ浏览器打开
                isWX:false
            }
        },
        methods:{
            orderCheck(){
                this.orderBean = this.$route.query;
                //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
                let ua = window.navigator.userAgent.toLowerCase();
                //通过正则表达式匹配ua中是否含有MicroMessenger字符串
                if(ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/QQ/i) == "qq"){
                    //匹配是否微信或QQ浏览器打开
                    this.isWX = true;
                }
                let timeStamp = new Date().getTime();
                let params = {'orderId': this.orderBean.orderId};
                let md5 = this._cryptojs.MD5(JSON.stringify(params));

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
                        url: this._ajaxUrl + '/order/orderSaveController/selectOrderDetail',
                        data: aes
                    }).then((res) => {
                        if(res.data.errorCode == '0000'){
                            if(res.data.data.resultBean.orderStatus == 4){
                                this.$router.push('/orderMine?status=receipt')
                            }
                        }
                    })
                })
            },
            //支付
            toPay(type){
                let timeStamp = new Date().getTime();
                let params = {'orderId': this.orderBean.orderId, 'version': 0,'directpaytype':type};
                let md5 = this._cryptojs.MD5(JSON.stringify(params));

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
                        url: this._ajaxUrl + '/shouqianba/pay/toPay',
                        data: aes
                    }).then((res) => {
                        if(res.data.errorCode == '0000'){
                            window.location.href = res.data.data
                        }
                    })
                })
            }
        },
        created() {
            window.addEventListener("popstate",this.orderCheck);
           this.orderCheck()
        },
        destroyed(){
            window.removeEventListener('popstate',this.orderCheck)
        }
    }
</script>

<style lang="less" scoped>
    .wrap{
        width: 100%;
        height: 1334px;
        overflow: hidden;
        background: #f6f6f6;
        .pay-top{
            width: 100%;
            background: #fff;
            padding: 0 30px;
            .pay-money{
                width: 100%;
                border-bottom: 2px dashed #ccc;
                text-align: center;
                padding-bottom: 48px;
                p{
                    font-size: 34px;
                    color: #222;
                    padding-top: 38px;
                    margin-bottom: 48px;
                }
                span{
                    font-size: 36px;
                    color: #f82222;
                    span{
                        font-size: 48px;
                    }

                }
            }
            .pay-info{
                width: 100%;
                .name{
                    padding-top: 22px;
                    font-size: 28px;
                    color: #666;
                    padding-bottom: 22px;
                }
                .order-num{
                    font-size: 28px;
                    color: #666;
                    padding-bottom: 28px;
                }
                span{
                    float: right;
                }
            }
        }
        .pay-bottom{
            margin-top: 16px;
            /*height: 1882px;*/
            height: 100%;
            width: 100%;
            background: #fff;
            padding: 0 30px;
            .pay-type-title{
                height: 72px;
                width: 100%;
                font-size: 22px;
                color: #999;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                i{
                    width: 64px;
                    height: 5px;
                    display: inline-block;
                    background: url("../../assets/icon/icon-pay-type.png") no-repeat;
                    background-size: contain;
                    margin: 0 8px;
                }
                i:nth-last-child(1){
                    transform: rotateZ(180deg);
                }
            }
            .pay-type-main{
                .pay-wx,.pay-zfb,.pay-bank{
                    i{
                        width: 62px;
                        height: 54px;
                        display: inline-block;
                        background: url("../../assets/icon/icon-pay-wx.png") no-repeat;
                        background-size: contain;
                        margin-right: 16px;
                    }
                    /*border: 2px solid #ccc;*/
                    box-shadow: 0 0 0 2px #ccc;
                    margin-bottom: 32px;
                    border-radius: 10px;
                    height: 88px;
                    color: #222;
                    font-size: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .pay-zfb{
                    padding-left: 34px;
                    i{
                        width: 54px;
                        background: url("../../assets/icon/icon-pay-zfb.png") no-repeat;
                        background-size: contain;
                    }
                }
                .pay-bank{
                    padding-left: 34px;
                   i{
                       width: 58px;
                       height: 43px;
                       background: url("../../assets/icon/icon-pay-bank.png") no-repeat;
                       background-size: contain;
                   }
                }
            }
        }
    }
</style>