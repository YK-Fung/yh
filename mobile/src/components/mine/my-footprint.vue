<template>
	<div class="wrap" :class="{active:isShowDelect}">
		<!-- 有足迹记录 -->
		<div class="footprint-more" v-if="hasFootprint">
			<!-- top -->
			<div class="page-top">
				<div class="record">共 <span class="red">{{totalGoods}}</span> 条，最多为您保存30条记录</div>
				<div class="btn-edit" @click="goodEditBtn()">
					<span v-if="isShowDelect">完成</span>
					<span v-else>编辑</span>
				</div>
			</div>

			<!-- 商品列表 -->
			<ul class="goods-list">
				<li v-for="(item,listIndex) in goodArr" :class="{active:isShowDelect}">
					<div class="good-select" :class="{active:item.goodActive}" v-show="isShowDelect" @click="goodSelect(listIndex)">
					</div>
					<router-link :to="{path: '/goodsDetail', query: {goodsId: item.goodsInfo.goodsId}}">
						<!-- 商品图片 -->
						<div class="photo">
							<img v-lazy="item.goodsInfo.goodsImg">
						</div>
						<div class="detail">
							<!-- 商品名称 -->
							<div class="good-name">{{item.goodsInfo.goodsName}}</div>
							<!-- 商品规格 -->
							<div class="good-size">{{item.goodsInfo.spec}}</div>
							<!-- 生产企业 -->
							<div class="good-vender">{{item.goodsInfo.producer}}</div>
							<!-- 商品价格 显示文字-->
							<div class="good-price" v-if="goodPrice(listIndex)">{{goodPrice(listIndex)}}</div>
							<!-- 商品价格 显示金额-->
							<div class="good-price" v-else="goodPrice(listIndex)">￥<span>{{goodPriceInteger(item.goodsInfo.goodsProductLimitPrice)}}</span>.{{goodPriceDecimals(item.goodsInfo.goodsProductLimitPrice)}}</div>
						</div>
					</router-link>
				</li>
			</ul>
			<!-- 加载中 -->
			<div class="loading" v-show="isLoading">加载中</div>
			<!-- 到底 -->
			<div class="list-end" v-show="isEnd"> >"<  已经到底啦~ </div>
			<!-- 全选删除 --> 
			<div class="select-delete" v-show="isShowDelect">
				<div class="select-all" :class="{active:allSelect}" @click="allSelectFn()">全选<input type="checkbox" v-model="allSelect"></div>
				<div class="btn-delete"><span :class="{active:activeDelete}" @click="deleteFn()">删除</span></div>
			</div>
		</div>
		<!-- 无足迹记录 -->
		<div class="footprint-none" v-else>
			<!-- 图 -->
    		<div class="none-photo"></div>
    		<p class="none-text">您还没有任何足迹~</p>
    		<router-link to='/home' class="link">去首页逛逛</router-link>
		</div>
	</div>
</template>
<script>
	import {Toast} from 'mint-ui';
	import Vue from 'vue';
	export default {
		name:"my-footprint",
		data(){
			return{
				//是否有收藏记录
				hasFootprint:true,
				//显示编辑按钮
				isShowDelect: false,
				//全选
				allSelect:false,
				//删除
				activeDelete:false,
				//商品列表
				goodArr:[],
				//当前页码
				pageNo:1,
				//一页显示多少数据
				pageSize:5,
				//全部加载完成
				isEnd:false,
				//加载中
				isLoading:false,
				//总条数
				totalGoods: null,
				//错误提示数字
				numberTip: ''
			}
		},
		methods:{
			//获取足迹列表
			footPrintViewFn: function(){
				this.pageNo = 1;
				let timeStamp = new Date().getTime();
				let params = {'pageNo' : this.pageNo, 'pageSize' : this.pageSize};
				this._signature = this._cryptojs.MD5(JSON.stringify(params));
				this.$http({
					method: 'post',
					url: this._ajaxUrl + '/encryption/aes',
					headers: {
						'data-signature': this._signature
					},
					data: {
						"time-stamp": timeStamp,
		                "requestBody": JSON.stringify(params)
					}
				}).then((res) => {
					let aes = res.data.data.aesRequestBody;
	            	this.$http({
	            		method: 'post',
	                    headers: {
	                    	"time-stamp": timeStamp,
	                        'data-signature': this._signature
	                    },
	                    url: this._ajaxUrl + '/goods/footprint/pagingQueryMyGoodsFootprintList',
	                    data: aes
	            	}).then((res) => {
	            		//清空数组，插入新数据
	            		this.goodArr.splice(0,this.goodArr.length);
	            		this.goodArr.push(...res.data.data.list);
	            		// 符合条件的记录总数
				        this.totalGoods = res.data.data.rows;
				        //价格是否可见（提示数字）
			            this.numberTip = res.data.data.numberTip;
	            		//设置商品未选中
	                    for (var i = 0; i < this.goodArr.length; i++) {
							Vue.set(this.goodArr[i], 'goodActive', false);
	                    }
	            	});
				});
			},
			//加载更多
			loadMore:function(){
				let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
				let windowHeight  = document.body.offsetHeight;
				let documentHeight  = document.body.scrollHeight;
				//滑到底部
				if(documentHeight - (scrollTop + windowHeight) < windowHeight){
					//正在加载中 或者 已经全部加载完毕
					if(this.isLoading || this.isEnd){
						return false;
					}
					//显示加载中
					this.isLoading = true;
					this.pageNo++;
					let timeStamp = new Date().getTime();
					let params = {'pageNo' : this.pageNo, 'pageSize' : this.pageSize};
					this._signature = this._cryptojs.MD5(JSON.stringify(params));
					this.$http({
						method: 'post',
						url: this._ajaxUrl + '/encryption/aes',
						headers: {
							'data-signature': this._signature
						},
						data: {
							"time-stamp": timeStamp,
			                "requestBody": JSON.stringify(params)
						}
					}).then((res) => {
						let aes = res.data.data.aesRequestBody;
		            	this.$http({
		            		method: 'post',
		                    headers: {
		                    	"time-stamp": timeStamp,
		                        'data-signature': this._signature
		                    },
		                    url: this._ajaxUrl + '/goods/footprint/pagingQueryMyGoodsFootprintList',
		                    data: aes
		            	}).then((res) => {
		            		if (res.data.errorCode == '0000') {
			            		//追加商品列表
			            		let oldLength= this.goodArr.length;
			            		this.goodArr.push(...res.data.data.list);
			            		//设置商品未选中
			                    for (var i = oldLength; i < this.goodArr.length; i++) {
									Vue.set(this.goodArr[i], 'goodActive', false);
			                    }
			                    //显示加载中
								this.isLoading = false;
			                    //全部数据加载结束
								if(this.pageNo * this.pageSize >= this.totalGoods){
									this.isEnd = true;
								}
							}
		            	});
					});
				}
			},
			// 商品价格不显示
			goodPrice: function(listIndex){
				if(this.numberTip == 3){
					//认证可见
					return '认证可见'
				}else if(this.numberTip == 2){
					//认证成功
					switch(this.goodArr[listIndex].goodsInfo.isLimitGoodsStatus)
						{
							case 5:
								return '定向销售，无法购买'
								break;
							case 6:
								return '超出经营范围购买'
								break;
							case 0:
								//可以购买
								return false;
								break; 
						}
				}
			},
			//商品价格整数
			goodPriceInteger: function(price){
				if(price){
					return price.openOrCompleteSellMoney.toFixed(2).toString().split('.')[0];
				}
			},
			//商品价格小数
			goodPriceDecimals: function(price){
				if(price){
					return price.openOrCompleteSellMoney.toFixed(2).toString().split('.')[1];
				}
			},
			// 编辑
			goodEditBtn:function(){
				this.isShowDelect = !this.isShowDelect;
			},
			// 单选
			goodSelect:function(listIndex){
				//选中商品
				this.goodArr[listIndex].goodActive = !this.goodArr[listIndex].goodActive;
				//总条数
				let goodLenth = this.goodArr.length;
				//选中条数
				let selectLenth = 0;
				for (let i = 0; i < goodLenth; i++) {
					if(this.goodArr[i].goodActive){
						selectLenth++;
					}
				}
				if(selectLenth == goodLenth){
					//选中商品
					this.allSelect = true;
				}else{
					//选中商品
					this.allSelect = false;
				}
				//删除按钮激活
				if(selectLenth > 0){
					this.activeDelete = true;
				}else{
					this.activeDelete = false;
				}
			},
			//全选
			allSelectFn:function(){
				this.allSelect = !this.allSelect;
				//商品全选
				if(this.allSelect){
					for (let i = 0; i < this.goodArr.length; i++) {
						this.goodArr[i].goodActive = true;
						this.activeDelete = true;
					}
				}else{
					for (let i = 0; i < this.goodArr.length; i++) {
						//取消全选
						this.goodArr[i].goodActive = false;
						this.activeDelete = false;
					}
				}
			},
			//删除商品
			deleteFn:function(){
			    if(this.activeDelete){
                    //拼接商品id字符串
					let footprintIds = '';
                    for (let i = 0; i < this.goodArr.length; i++) {
                        if(this.goodArr[i].goodActive){
                            footprintIds += this.goodArr[i].footprintId + ',';
						}
                    }
                    //批量删除足迹请求
                    let timeStamp = new Date().getTime();
                    let params = {'footprintIds' : footprintIds};
	                this._signature = this._cryptojs.MD5(JSON.stringify(params));
	                this.$http({
	                    method: 'post',
	                    url: this._ajaxUrl + '/encryption/aes',
	                    headers: {
                            'data-signature': this._signature
                        },
                        data: {
                            "time-stamp": timeStamp,
                            "requestBody": JSON.stringify(params)
                        }
	                }).then((res) => {
	                	let aes = res.data.data.aesRequestBody;
	                	this.$http({
	                		method: 'post',
                            headers: {
                            	"time-stamp": timeStamp,
                                'data-signature': this._signature
                            },
                            url: this._ajaxUrl + '/goods/footprint/batchRemove',
                            data: aes
	                	}).then((res) => {
		                    if (res.data.errorCode == '0000') {
		                    	//移除选中的商品
		                        for (let i = this.goodArr.length - 1; i >= 0; i--) {
				                    if (this.goodArr[i].goodActive) {
				                        this.goodArr.splice(i, 1);
				                    }
				                }
				                this.activeDelete = false;
				                //重新渲染
		                     	this.footPrintViewFn();
		                    }
		                    //提示语
		                    Toast({
	                            message: res.data.message,
	                            position: 'bottom',
	                            duration: 3000,
	                            className: 'public'
	                        });
	                	});
	                });
				}
			}
		},
		created(){
			// 获取足迹列表
			this.footPrintViewFn();
		},
		mounted() {
            window.addEventListener('touchmove', this.loadMore)
        }
	}
</script>
<style lang="less" scoped>
	.wrap{
	    width: 100%;
	    background: #f6f6f6;
	    &.active{
	   		padding-bottom: 100px;
	    }
	}
	/* 顶部显示条数 */
	.page-top{
		height: 78px;/*px*/
		line-height: 78px;/*px*/
		background-color: #f6f6f6;
		padding: 0 30px;
		font-size: 28px;/*px*/
		overflow: hidden;
		.record{
			float: left;
			color:#999;
		}
		.btn-edit{
			float: right;
			color:#666;
		}
		.red{
			color:#ff0000;
		}
	}
	/* 商品列表 */
	.goods-list{
		background-color: #fff;
		li{
			box-shadow: 0 -1px #e5e5e5 inset;
			display: flex;
			position: relative;
			padding: 32px 30px;
			&.active{
				padding: 32px 30px 32px 96px;
			}
			a{
				width: 100%;
				display: -webkit-box;
			}
			.good-select{
				position: absolute;
				left: 30px;
				top:0;
				width: 66px;
				height: 100%;
				background: url('../../assets/icon/icon-select.png') left center no-repeat;
				background-size: 40px 40px;
		        &.active{
		        	background: url('../../assets/icon/icon-select-active.png') left center no-repeat;
		        	background-size: 40px 40px;
		        }
				input{
					display: none;
				}
			}
			.photo{
				width: 200px;
				flex: 0 0 auto;
                -webkit-flex: 0 0 auto;
				img{
					width: 100%;
				}
			}
			.detail{	
				padding-left: 28px;
				flex: 1 1 auto;
                -webkit-flex: 1 1 auto;
				overflow: hidden;
			}
			.good-name{
				width: 100%;
				line-height: 50px;/*px*/
				font-size: 28px;/*px*/
				color:#222;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.good-size,.good-vender{
				line-height: 40px;/*px*/
				font-size: 24px;/*px*/
				color:#999;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.good-price{
				font-size: 28px;/*px*/
				color:#ff0101;
				margin-top: 30px;
				span{
					font-size: 34px;/*px*/
				}
			}
		}
	}
	/* 到底啦 */
	.list-end{
        color: #bbb;
        text-align: center;
        line-height: 70px;/*px*/
        font-size: 18px;/*px*/
    }
    /* 底部删除 */
    .select-delete{
    	width: 100%;
    	height: 100px;/*px*/
    	line-height: 100px;/*px*/
		background-color: #fff;
		box-shadow: 0 1px #e5e5e5 inset;
		padding: 0 30px;
		display: flex;
        align-items:center;
		position: fixed;
		left: 0;
		bottom: 0;
    }
    /* 全选 */
    .select-all{
    	flex:1;
    	height: 100%;
    	font-size: 28px;/*px*/
    	text-align: left;
    	padding-left: 56px;
    	color:#666;
    	background: url('../../assets/icon/icon-select.png') 0 center no-repeat;
    	background-size: 40px 40px;
        &.active{
          background: url('../../assets/icon/icon-select-active.png') 0 center no-repeat;
          background-size: 40px 40px;
        }
        input{
        	display: none;
        }
    }
    /* 删除 */
    .btn-delete{
    	flex:1;
    	text-align: right;
    	span{
	    	width: 210px;
	    	line-height: 62px;/*px*/
	    	text-align: center;
			font-size: 30px;/*px*/
			color:#fff;
			background-color: #ccc;
			border-radius: 40px;
			display: inline-block;
			&.active{
				color:#fff;
				background-color: #fa8c35;
			}
    	}
    }
    /* 无内容 */
	.footprint-none{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		.none-photo{
			width: 410px;
			height: 368px;
			background: url(../../assets/mine/footprint-none.png) no-repeat 0 0;
			background-size: 410px 368px;
			margin: 165px auto 0;
		}
		.none-text{
			font-size: 28px;/*px*/
			color:#666;
			line-height: 90px;/*px*/
			text-align: center;
		}
		.link{
			width: 168px;
			line-height: 48px;/*px*/
			text-align: center;
			color:#fff;
			background-color: #0066cc;
			font-size:28px;/*px*/
			margin:0 auto;
			display: block;
			border-radius: 10px;
		}
	}
	/* 加载中 */
    .loading{
		color: #bbb;
        text-align: center;
        line-height: 70px;/*px*/
        font-size: 18px;/*px*/ 
    }
</style>