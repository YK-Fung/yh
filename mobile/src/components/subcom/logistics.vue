<template>
    <div class="logistics">
        <div class="logistics-info">
            <router-link :to="{path:'/orderDetail',query:{orderId:this.$route.query.orderId}}" class="logistics-info-left"><img :src="orderInfo[0].goodsImageUrl" alt=""><span class="mask">共{{orderInfo.length}}件商品</span></router-link>
            <div class="logistics-info-right">
                <p class="logistics-state">{{selfSend?'已发货':status}}</p>
                <!--发快递的时候显示-->
                <p class="logistics-num" v-if="!selfSend">{{logBean.expressName}}:{{logBean.expressNo}}</p>
                <!--自主发货的时候显示-->
                <p class="logistics-num" v-if="selfSend">自主发货</p>
                <p class="order-num">订单号:{{orderCode}}</p>
            </div>
        </div>
        <div class="logistics-detail">
            <div  class="logistics-address">
                <p :class="{'sign':(selfSend?'已签收':status)=='已签收','self':selfSend}"><i></i>[收货地址]{{address}}</p>
            </div>

            <!--第三方物流-->
            <div v-if="!selfSend"  v-for="(item,index) in logBean.trackinfoList" :key="index" class="logistics-main"  >
                <div class="logistics-time">
                    <p class="time1">{{item.date.substr(5)}}</p>
                    <p class="time2">{{item.time.substr(0,5)}}</p>
                </div>
                <div class="logistics-desc" >
                    <i class="log"></i>
                    <!--第三方物流显示-->
                    <div class="logistics-desc-item" >{{item.statusDescription}}</div>
                </div>
            </div>
            <!--自主发货-->

            <div v-if="selfSend" class="logistics-main"  >
                <div class="logistics-time">
                    <p class="self-time1">{{logBean.createTime?_getDate1(logBean.createTime):''}}</p>
                    <p class="self-time2">{{logBean.createTime?_getDate2(logBean.createTime):''}}</p>
                </div>
                <div class="logistics-desc" >
                    <i></i>
                    <div class="self-logistics-desc-item">已发货</div>
                    <div class="self-logistics-desc-item">送货人姓名:{{logBean.deliverymanName}}</div>
                    <div class="self-logistics-desc-item">联系方式:{{logBean.phone}}</div>
                </div>
            </div>


        </div>
        <div class="end" v-if="!selfSend"> >”< 已经到底啦~ </div>
    </div>
</template>

<script>
    export default {
        name: "logistics",
        data(){
            return{
                //物流状态
                status:'',
                expressId:302,//302 333
                orderId:800,//800 635
                //订单编号
                orderCode:'',
                //是否自主发货
                selfSend:false,
                logBean:{},
                address:'',
                //订单信息
                orderInfo:[{goodsImageUrl:''}]
            }
        },
        created(){
            let params = {orderExpressId : this.$route.query.orderExpressId, orderId : this.$route.query.orderId};
            let timeStamp = new Date().getTime();
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
                        url: this._ajaxUrl + '/order/orderSaveController/selectOrderExpressDetailInfo',
                        data: aes
                    }).then((res) => {
                        console.log(res.data);
                        if (res.data.errorCode == '0000') {
                               this.logBean = res.data.data.orderExprEss;
                               this.orderCode = res.data.data.orderCode;
                               this.orderInfo = res.data.data.listOrderGoods;
                               this.address = (res.data.data.shippingProvince?res.data.data.shippingProvince:'') + (res.data.data.shippingCity?res.data.data.shippingCity:'') + (res.data.data.shippingCounty?res.data.data.shippingCounty:'') + (res.data.data.shippingAddress?res.data.data.shippingAddress:'');
                               if(this.logBean.expressTypeName=='自主发货'){
                                   this.selfSend = true;
                               }else{
                                   let status = JSON.parse(res.data.data.orderExprEss.expressInfo).data.items[0].status;
                                   if(status == 'delivered'){
                                       this.status = '已签收'
                                   }else if(status == 'out for delivery'){
                                       this.status = '派件中'
                                   }else if(status == 'in transit'){
                                       this.status = '发货中'
                                   }
                               }
                        }
                    })
                }
            )
        },
        methods:{
            _getDate1(date) {
                let d = new Date(date);
                let M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
                let D = d.getDate() < 10?'0' + d.getDate():d.getDate();
                return  M + D;
            },
            _getDate2(date){
                let d = new Date(date);
                let h = d.getHours() < 10?'0'+ d.getHours()+':':d.getHours() + ':';
                let m = d.getMinutes() < 10?'0'+ d.getMinutes():d.getMinutes() ;
                return  h + m;
            }
        }
    }
</script>

<style lang="less" scoped>
    .logistics{
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        background: #f6f6f6;
        .logistics-info{
            height: 200px;
            background: #fff;
            box-shadow: 0 -1px  #eee inset;
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            .logistics-info-left{
                display: inline-block;
                margin-left: 57px;
                margin-right: 34px;
                width: 148px;
                height: 148px;
                box-shadow: 0 0 0 1px #ccc;
                padding: 5px;
                position: relative;
                img{
                    width: 100%;
                    height: 100%;
                }
                .mask{
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 40px;
                    background: rgba(178,178,178,.7);
                    font-size: 24px;
                    color: #fff;
                    text-align: center;
                    line-height: 40px;
                }
            }
            .logistics-info-right{
                display: inline-block;
                .logistics-state{
                    font-size: 34px;
                    color: #fa8c35;
                    margin-bottom: 30px;
                }
                .logistics-num,.order-num{
                    font-size: 28px;
                    color: #666;
                }
                .logistics-num{
                    margin-bottom: 16px;
                }

            }
        }
        .logistics-detail{
            width: 100%;
            background: #fff;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            .logistics-address{
                margin-top: 32px;
                i{
                    position: absolute;
                    left: -12px;
                    top: 0;
                    width: 24px;
                    height: 30px;
                    background: url("../../assets/icon/icon-location-normal.png") no-repeat;
                    background-size: contain;
                }
                p{
                    position: relative;
                    padding-bottom: 70px;
                    padding-left: 44px;
                    margin-left: 160px;
                    width: 426px;
                    font-size: 24px;
                    line-height: 40px;
                    color: #666;
                }
                /*发快递已签收的样式*/
                p.sign{
                    color: #fa8c35;
                    i{
                        background: url("../../assets/icon/icon-location-active.png") no-repeat;
                        background-size: contain;
                    }
                }
                /*自主发货的样式*/
                p.self{
                    border-left: 1px solid #eee;
                    /*box-shadow: 1px 0  #eee inset;*/
                }
            }
           .logistics-main{
                padding-left: 44px;
                padding-right: 30px;
                overflow: hidden;
                .logistics-time{
                    float: left;
                    width: 116px;
                    padding-right: 42px;
                    text-align: right;
                    .time1,.self-time1{
                        color: #ccc;
                        font-size: 26px;
                        margin-bottom: 10px;
                    }
                    .time2,.self-time2{
                        color: #ccc;
                        font-size: 20px;
                    }
                }
              .logistics-desc{
                    float: left;
                    width: 560px;
                    padding-left: 44px;
                    border-left: 1px solid #eee;
                    /*box-shadow: -1px 0  #eee ;*/
                    position: relative;
                    i{
                        width: 28px;
                        height: 28px;
                        position: absolute;
                        left: -14px;
                        top: 0;
                        background: url("../../assets/icon/icon-logistics-send.png") no-repeat;
                        background-size: contain;
                    }
                    .logistics-desc-state{
                        color: #666;
                        font-size: 26px;
                        margin-bottom: 24px;
                    }
                    .logistics-desc-item{
                        color: #666;
                        font-size: 24px;
                        margin-bottom: 75px;
                        line-height: 32px;
                    }

                    .self-logistics-desc-item{
                        color: #666;
                        font-size: 24px;
                        margin-bottom: 18px;
                        &:nth-last-child(1){
                            margin-bottom: 30px;
                        }
                    }
                }


            }
            .logistics-main:nth-last-child(1) .logistics-desc{
                box-shadow: none;
                border: none;
            }
            .logistics-main:nth-child(2){

                    .time1,.time2,.logistics-desc-state,.logistics-desc-item{
                        color: #fa8c35;
                    }
                    i.log{
                        background: url("../../assets/icon/icon-logistics-end.png") no-repeat;
                        background-size: contain;
                    }


            }
            .logistics-main.subItem{
                .time1{
                    font-size: 20px;
                }
                i{
                    width: 12px;
                    height: 12px;
                    position: absolute;
                    background:#ccc;
                    left: -6px;
                    top: 0;
                    border-radius: 50%;
                }
            }
        }
        .end{
            margin-top: 19px;
            text-align: center;
            color: #bbb;
            font-size: 18px;
            margin-bottom: 28px;
        }
    }
</style>