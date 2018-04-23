<template>
    <div class="wrap">
    	<div class="title">请选择取消订单的原因:</div>
    	<ul class="reason">
    		<li 
    			v-for="(reason, reasonIdx) in reasonArr"
    			:class="{'active': reason.active}"
    			@click="reasonSelectFn(reasonIdx)">{{reason.text}}</li>
    	</ul>
    	<div class="reason-detail">
      	<textarea name="" placeholder="填写其它取消原因" 
      		v-model="reasonDetail"
      		:disabled="reasonDefault"
      		@input="detailFn()"></textarea>
      	<span class="detail-num">{{detailNum}}/30</span>
      </div>
    	<!-- 确定按钮 -->
    	<div class="btn-submit" 
    		:class="{'active': submitActive}"
    		@click="submitFn()">确定</div>
    </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  export default {
    name: "order-submit",
    data () {
    	return {
    		// 原因
    		reasonArr: [
    			{text: '拍错了', active: false},
    			{text: '缺货', active: false},
    			{text: '其他', active: false}
    		],
    		// 原因详情
    		reasonDetail: '',
    		// 原因详情可不可以填写,只有选择'其他',才可以填写
    		reasonDefault: true,
    		// 详情文字数量
    		detailNum: '0',
    		// 是否可以提交
    		submitActive: false
    	}
    },
    created () {

    },
    methods: {
    	// 原因选择
    	reasonSelectFn: function (idx) {
    		for (let i = 0, len = this.reasonArr.length; i < len; i++) {
    			this.reasonArr[i].active = false;
    		}
    		this.reasonArr[idx].active = true;
    		// 如果选择了'其他',原因详情变为可填.如果勾选了'其他'之外的选项,清空填写的详情.发送给后端的是所填写的文字
    		if (idx === 2) {
    			this.reasonDefault = false;
    		} else {
    			this.reasonDefault = true;
    			this.reasonDetail = '';
    		}
    		// 如果选择的不是'其他',直接就可以提交了,如果选择的是'其他',需要填写具体原因才可以提交。发送给后端的就是所选择的文字
    		if (idx !== 2 || (idx === 2 && this.reasonDetail !== '')) {
    			this.submitActive = true;
    		} else {
    			this.submitActive = false;
    		}
    	},
    	// 原因详情
    	detailFn: function () {
    		this.detailNum = this.reasonDetail.length;
    		if (this.reasonDetail !== '' && this.detailNum <= 30) {
    			this.submitActive = true;
    		} else {
    			this.submitActive = false;
    		}
    	},
    	// 提交
    	submitFn: function () {
    		if (this.submitActive) {
                // 取消原因
                let orderCancelRemark = '';
                // 如果不是勾选其他，则使用选项的文字，勾选其他就用输入框的文字。
                this.reasonArr.forEach((reason, reasonIdx) => {
                    if (reason.active) {
                        if (reasonIdx !== 2) {
                            orderCancelRemark = reason.text
                        } else {
                            orderCancelRemark = this.reasonDetail
                        }
                    }
                });
                let timeStamp = new Date().getTime();
    			let params = {'orderId': this.$route.query.orderId, 'orderCancelRemark': orderCancelRemark};
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
                        url: this._ajaxUrl + '/order/orderSaveController/cancelOrder',
                        data: aes
                    }).then((res) => {
                        console.log(res.data.data)
                        // 大于0成功，0失败,成功后跳去对应详情页面
                        if (res.data.data.numberTip > 0) {
                            this.$router.push({
                                path: '/orderDetail',
                                query: {
                                    'orderId': this.$route.query.orderId
                                }
                            });
                        } else {
                            Toast({
                                message: '取消订单失败',
                                position: 'bottom',
                                duration: 3000
                            });
                        }
                    })
                })
    		}
    	}
    }
  }
</script>

<style lang="less" scoped>
  .wrap{
  	position: relative;
    width: 100%;
    height: 100%;
    padding: 280px 30px 86px;
    overflow-x: hidden;
    overflow-y: auto;
    background: #fff url('../../assets/order/order-cancel-bg.png') center top no-repeat;
    background-size: contain;
    .title{  	
	    font-size: 32px;
	    color: #222;
    }
    // 原因
    .reason{
    	display: block;
    	font-size: 32px;
    	color: #666;
    	li{
    		display: block;
    		padding-left: 54px;
    		margin-top: 40px;
    		line-height: 40px;
	    	background: url('../../assets/icon/icon-select.png') left center no-repeat;
	    	background-size: 40px 40px;
    	}
    	.active{
    		background: url('../../assets/icon/icon-select-active.png') left center no-repeat;
	    	background-size: 40px 40px;
    	}
    }
    // 原因详情
    .reason-detail{
    	position: relative;
    	textarea{
	    	width: 100%;
	    	height: 320px;
	    	padding: 20px 20px 50px;
	    	margin-top: 40px;
	    	font-size: 32px;
	    	color: #222;
	    	background: #fff;
	    	border: 1px solid #ccc;
	    	border-radius: 10px;
	    	outline: none;
	    	resize: none;
	    	&:disabled{
	    		background: #f5f5f5;
	    	}
	    }
	    // 字数统计
	    .detail-num{
	    	position: absolute;
	    	bottom: 20px;
	    	right: 20px;
	    	font-size: 28px;
	    	line-height: 30px;
	    	color: #ddd;
	    }
    }
    // 确定按钮
    .btn-submit{
    	width: 100%;
    	height: 88px;
    	margin-top: 104px;
    	font-size: 34px;
    	text-align: center;
    	line-height: 88px;
    	color: #fff;
    	background: #abd5ff;
    	border-radius: 10px;
    	&.active{
    		background: #0066cc;
    	}
    }
  }
</style>