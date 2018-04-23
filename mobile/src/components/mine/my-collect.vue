<template>
    <div class="wrap">
		<!-- tab标题切换 -->
		<ul class="tab-tit" :class="{hasRoll:scrolled}">
			<li v-for="(item,index) in tabs" :class="{active:index == tabNum}" @click="tabToggle(index)">
				<span>{{item}}</span>
			</li>
		</ul>
		<!-- 内容切换 -->
		<div class="tab-ctn">
			<!-- 商品收藏 -->
			<div class="list-ctn" :class="{active:0 == this.tabNum,edit:isShowGoodCancel}">
				<!-- 有收藏记录 -->
				<div v-if="hasCollectGoods">
					<div class="page-top">
						<div class="record">您收藏了 <span class="red">{{totalGoods}}</span> 个商品</div>
						<div class="btn-edit" @click="goodEditBtn()">
							<span v-if="isShowGoodCancel">完成</span>
							<span v-else>编辑</span>
						</div>
					</div>
					<!-- 商品列表 -->
					<ul class="goods-list">
						<li v-for="(item,listIndex) in goodArr" :class="{active:isShowGoodCancel}">
							<!-- 是否勾选 -->
							<div class="good-select" :class="{active:item.goodActive}" v-show="isShowGoodCancel" @click="goodSelect(listIndex)">
							</div>
							<router-link :to="{path: '/goodsDetail', query: {goodsId: item.goodsId}}">
								<div class="photo">
									<!-- 商品图片 -->
									<img v-lazy="item.goodsImg">
								</div>
								<div class="detail">
									<!-- 商品名称 -->
									<div class="good-name">{{item.goodsName}}</div>
									<!-- 商品规格 -->
									<div class="good-size">{{item.spec}}</div>
									<!-- 生产企业 -->
									<div class="good-vender">{{item.producer}}</div>
									<!-- 商品价格 显示文字-->
									<div class="good-price" v-if="goodPrice(listIndex)">{{goodPrice(listIndex)}}</div>
									<!-- 商品价格 显示金额-->
									<div class="good-price" v-else="goodPrice(listIndex)">￥<span>{{goodPriceInteger(item.goodsProductLimitPrice)}}</span>.{{goodPriceDecimals(item.goodsProductLimitPrice)}}</div>
								</div>
							</router-link>
						</li>
					</ul>
					<!-- 加载中 -->
					<div class="loading" v-show="isLoadingGood">加载中</div>
					<!-- 到底 -->
					<div class="list-end" v-show="isEndGood"> >"<  已经到底啦~ </div>
					<!-- 全选删除 -->
					<div class="select-delete" v-show="isShowGoodCancel">
						<span class="btn-delete" :class="{active:activeGoodDelete}" @click="deleteGoodFn()">取消收藏</span>
					</div>
				</div>
		    	<!-- 无收藏记录 -->
		    	<div class="collect-none" v-else>
		    		<!-- 图 -->
		    		<div class="none-photo"></div>
		    		<p class="none-text">您还没有任何收藏~</p>
		    		<router-link to='/home' class="link">去首页逛逛</router-link>
		    	</div>
			</div>
			<!-- 店铺收藏 -->
			<div class="list-ctn" :class="{active:1 == this.tabNum,edit:isShowStoreCancel}">
				<!-- 有收藏记录 -->
				<div v-if="hasCollectstore">
					<div class="page-top">
						<div class="record">您收藏了 <span class="red">{{totalStores}}</span> 个店铺</div>
						<div class="btn-edit" @click="storeEditBtn()">
							<span v-if="isShowStoreCancel">完成</span>
							<span v-else>编辑</span>
						</div>
					</div>
					<!-- 店铺列表 -->
					<ul class="store-list">
						<li v-for="(item,listIndex) in storeArr" :class="{active:isShowStoreCancel}">
							<!-- 是否勾选 -->
							<div class="store-select" :class="{active:item.storeActive}" v-show="isShowStoreCancel" @click="storeSelect(listIndex)">
							</div>
							<router-link :to="{path: '/storeDetail', query: {storeId: item.storeId}}">
								<!-- 商品图片 -->
								<div class="photo">
									<img v-lazy="item.storeLogo">
								</div>
								<!-- 生产企业 -->
								<div class="detail">
									<div class="store-name">{{item.storeName}}</div>
								</div>
							</router-link>
						</li>
					</ul>
					<!-- 加载中 -->
					<div class="loading" v-show="isLoadingStore">加载中</div>
					<!-- 到底 -->
					<div class="list-end" v-show="isEndStore"> >"<  已经到底啦~ </div>
					<!-- 全选删除 -->
					<div class="select-delete" v-show="isShowStoreCancel">
						<span class="btn-delete" :class="{active:activeStoreDelete}" @click="deleteStoreFn()">取消收藏</span>
					</div>
				</div>
		    	<!-- 无收藏记录 -->
		    	<div class="collect-none" v-else>
		    		<!-- 图 -->
		    		<div class="none-photo"></div>
		    		<p class="none-text">您还没有任何收藏~</p>
		    		<router-link to='/home' class="link">去首页逛逛</router-link>
		    	</div>
			</div>
		</div> 
    </div>
</template>
<script>
	import {Toast} from 'mint-ui';
	import Vue from 'vue';
	export default {
		name:"my-collect",
		data(){
			return{
				//tab
				tabs:['商品收藏','店铺收藏'],
				//当前切换的Index
				tabNum:0,
				//页面是否滚动
				scrolled:false,
				//当前页码
				pageNo:1,
				//一页显示多少数据
				pageSize:5,
				//错误提示数字
				numberTip: '',
				//////////商品收藏///////////
				//有无收藏记录
				hasCollectGoods:true,
				//显示编辑按钮
				isShowGoodCancel: false,
				//删除
				activeGoodDelete:false,
				//商品列表
				goodArr: [],
				//总条数
				totalGoods: null,
				//加载中
				isLoadingGood: false,
				//全部加载完成
				isEndGood: false,
				//////////店铺收藏///////////
				//有无收藏记录
				hasCollectstore:true,
				//显示编辑按钮
				isShowStoreCancel: false,
				//删除
				activeStoreDelete:false,
				//店铺列表
				storeArr: [],
				//总条数
				totalStores: null,
				//加载中
				isLoadingStore: false,
				//全部加载完成
				isEndStore: false
			}
		},
		methods:{
			// 获取商品收藏列表
			goodsViewFn: function(){
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
	                    url: this._ajaxUrl + '/goods/collect/pagingQueryMyCollectGoodsList',
	                    data: aes
	            	}).then((res) => {
	            		if(res.data.data.list.length > 0){
	            			this.hasCollectGoods = true;
	            			if (res.data.errorCode == '0000') {
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
			                }
	            		}else {
	            			//收藏为空
	            			this.hasCollectGoods = false;
	            		}
	            	});
	            });
			},
			// 获取店铺收藏列表
			storesViewFn: function(){
				this.pageNo = 1;
				let timeStamp = new Date().getTime();
				let params = {'pageNo' : this.pageNo, 'pageSize' : this.pageSize}
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
	                    url: this._ajaxUrl + '/store/collect/pagingQueryMyCollectStoreList',
	                    data: aes
	            	}).then((res) => {
	            		if(res.data.data.list.length > 0){
	            			this.hasCollectstore = true;
	            			if (res.data.errorCode == '0000') {
	            				//清空数组，插入新数据
	            				this.storeArr.splice(0,this.storeArr.length);
			                    this.storeArr.push(...res.data.data.list);
			                    // 符合条件的记录总数
			                    this.totalStores = res.data.data.rows;
			                    //设置店铺未选中
			                    for (var i = 0; i < this.storeArr.length; i++) {
									Vue.set(this.storeArr[i], 'storeActive', false);
			                    }
			                }
	            		}else {
	            			//收藏为空
	            			this.hasCollectstore = false;
	            		}
	            	});
	            });
			},
			//tab切换
			tabToggle:function(index){
				this.tabNum = index;
				// 获取商品收藏列表
				if(this.tabNum == 0){
					this.goodsViewFn();
				}
				// 获取店铺收藏列表
				if(this.tabNum == 1){
					this.storesViewFn();
				}
			},
			/*
			 *  商品收藏
			*/
			// 加载更多
			loadMore: function(){
				let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
				let windowHeight  = document.body.offsetHeight;
				let documentHeight  = document.body.scrollHeight;
				//滑到底部
				let timeStamp = new Date().getTime();
				if(documentHeight - (scrollTop + windowHeight) < windowHeight){
					//商品收藏
					if(this.tabNum == 0){
						//正在加载中 或者 已经全部加载完毕
						if(this.isLoadingGood || this.isEndGood){
							return false;
						}
						//显示加载中
						this.isLoadingGood = true;
						this.pageNo ++;
						let params = {'pageNo' : this.pageNo, 'pageSize' : this.pageSize}
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
			                    url: this._ajaxUrl + '/goods/collect/pagingQueryMyCollectGoodsList',
			                    data: aes
			            	}).then((res) => {
		            			if (res.data.errorCode == '0000') {
		            				//返回结果 追加进商品列表数组
		            				let oldLength= this.goodArr.length;
				                    this.goodArr.push(...res.data.data.list);
				                    //设置商品未选中
				                    for (var i = oldLength; i < this.goodArr.length; i++) {
										Vue.set(this.goodArr[i], 'goodActive', false);
				                    }
				                    //显示加载中
									this.isLoadingGood = false;
									//全部数据加载结束
									if(this.pageNo * this.pageSize >= this.totalGoods){
										this.isEndGood = true;
									}
				                }
			            	});
			            });
					}
					//店铺收藏
					if(this.tabNum == 1){
						//正在加载中 或者 已经全部加载完毕
						if(this.isLoadingStore || this.isEndStore){
							return false;
						}
						//显示加载中
						this.isLoadingStore = true;
						this.pageNo ++;
						let params = {'pageNo' : this.pageNo, 'pageSize' : this.pageSize}
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
			                    url: this._ajaxUrl + '/store/collect/pagingQueryMyCollectStoreList',
			                    data: aes
			            	}).then((res) => {
		            			if (res.data.errorCode == '0000') {
		            				//返回结果 追加进店铺列表数组
		            				let oldLength= this.storeArr.length;
				                    this.storeArr.push(...res.data.data.list);
				                    //设置店铺未选中
				                    for (var i = oldLength; i < this.storeArr.length; i++) {
										Vue.set(this.storeArr[i], 'storeActive', false);
				                    }
				                    //显示加载中
									this.isLoadingStore = false;
									//全部数据加载结束
									if(this.pageNo * this.pageSize >= this.totalStores){
										this.isEndStore = true;
									}
				                }
			            	});
			            });
					}
				}
			},
			//页面是否滚动
			pageRollFn: function(){
				this.scrolled = window.pageYOffset > 0;
			},
			// 商品价格不显示
			goodPrice: function(listIndex){
				if(this.numberTip == 3){
					//认证可见
					return '认证可见'
				}else if(this.numberTip == 2){
					//认证成功
					switch(this.goodArr[listIndex].isLimitGoodsStatus)
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
			// 编辑商品
			goodEditBtn: function(){
				this.isShowGoodCancel = !this.isShowGoodCancel;
			},
			// 删除按钮是否激活
			deleteGoodActive: function(){
				//总条数
				let goodLenth = this.goodArr.length;
				//选中条数
				let selectLenth = 0;
				for (let i = 0; i < goodLenth; i++) {
					if(this.goodArr[i].goodActive){
						selectLenth++;
					}
				}
				//删除按钮激活
				if(selectLenth > 0){
					this.activeGoodDelete = true;
				}else{
					this.activeGoodDelete = false;
				}
			},
			// 单选
			goodSelect:function(listIndex){
				//选中商品
				this.goodArr[listIndex].goodActive = !this.goodArr[listIndex].goodActive;
				this.deleteGoodActive();
			},
			 //批量取消商品收藏
            deleteGoodFn: function () {
            	if(this.activeGoodDelete){
            		//取消商品的id集合
            		let deleteGoodsId = '';
					for (let i = this.goodArr.length - 1; i >= 0; i--) {
	                    if (this.goodArr[i].goodActive) {
	                       	deleteGoodsId = deleteGoodsId+this.goodArr[i].goodsId+','
	                    }
	                }
	                let timeStamp = new Date().getTime();
	                let params = {'goodsIds' : deleteGoodsId};
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
                            url: this._ajaxUrl + '/goods/collect/batchRemove',
                            data: aes
	                	}).then((res) => {
		                    if (res.data.errorCode == '0000') {
		                    	//移除选中的商品
		                        for (let i = this.goodArr.length - 1; i >= 0; i--) {
				                    if (this.goodArr[i].goodActive) {
				                        this.goodArr.splice(i, 1);
				                    }
				                }
		                     	this.deleteGoodActive();
		                     	this.goodsViewFn();
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
            },
            /*
			 *  店铺收藏
			*/
			//编辑店铺
			storeEditBtn:function(){
				this.isShowStoreCancel = !this.isShowStoreCancel;
			},
			//删除按钮激活
			deleteStoreActive:function(){
				//总条数
				let storeLenth = this.storeArr.length;
				let storeSelectLenth = 0;
				for (let i = 0; i < storeLenth; i++) {
					if(this.storeArr[i].storeActive){
						storeSelectLenth++;
					}
				}
				if(storeSelectLenth > 0){
					this.activeStoreDelete = true;
				}else{
					this.activeStoreDelete = false;
				}
			},
			//选中店铺
			storeSelect:function(listIndex){
				this.storeArr[listIndex].storeActive = !this.storeArr[listIndex].storeActive;
				this.deleteStoreActive();
			},
			//取消收藏
            deleteStoreFn: function () {
            	if(this.activeStoreDelete){
            		//删除商品的id
            		let deleteStoresId = '';
	                for (let i = this.storeArr.length - 1; i >= 0; i--) {
	                    if (this.storeArr[i].storeActive) {
	                    	deleteStoresId = deleteStoresId+this.storeArr[i].storeId+','
	                    }
	                }
	                let timeStamp = new Date().getTime();
	                let params = {'storeIds' : deleteStoresId};
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
                            url: this._ajaxUrl + '/store/collect/batchRemoveCollect',
                            data: aes
	                	}).then((res) => {
		                    if (res.data.errorCode == '0000') {
		                    	for (let i = this.storeArr.length - 1; i >= 0; i--) {
				                    if (this.storeArr[i].storeActive) {
				                        this.storeArr.splice(i, 1);
				                    }
				                }
		                     	this.deleteStoreActive();
		                     	this.storesViewFn();
		                    }
	                        //提示语
		                    Toast({
	                            message: res.data.message,
	                            position: 'bottom',
	                            duration: 3000,
	                            className: 'public'
	                        });
	                	});
	                })
            	}
            }
		},
		created () {
			//监听滚动
			window.addEventListener('scroll', this.pageRollFn);
			//页面加载时tab选中状态
			let tabIndex = this.$route.query.index;
			if(tabIndex){
				this.tabNum = tabIndex;
			}
			// 获取商品收藏列表
			if(this.tabNum == 0){
				this.goodsViewFn();
			}
			// 获取店铺收藏列表
			if(this.tabNum == 1){
				this.storesViewFn();
			}
		},
		mounted() {
            window.addEventListener('touchmove', this.loadMore)
        }
	}
</script>
<style lang="less" scoped>
	.wrap{
		width: 100%;
		background-color: #f6f6f6;
		padding-top: 90px;	
	}
	.tab-tit{
		width: 100%;
		height: 90px;
		background-color: #fff;
		display: flex;
		position: fixed;
		left: 0;
		top:0;
		z-index: 2;
		&.hasRoll{
			box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
		}
		li{
			flex:1;
			line-height: 90px;/*px*/
			text-align: center;
			font-size: 32px;/*px*/
			color:#999;
			&.active{
				span{
					height: 100%;
					color:#0066cc;
					border-bottom: 3px solid #0066cc;
					display: inline-block;
				}
			}
		}
	}
	.tab-ctn{
		.list-ctn{
			display: none;
			&.active{
				display: block;
			}
			&.edit{
				padding-bottom: 100px;
			}
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
	/* 店铺列表 */
	.store-list{
		background-color: #fff;
		li{
			box-shadow: 0 -1px #e5e5e5 inset;
			display: flex;
			position: relative;
			padding: 40px 30px;
			&.active{
				padding: 40px 30px 40px 88px;
			}
			a{
				width: 100%;
				display: -webkit-box;
			}
			.store-select{
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
				width: 164px;
				height: 124px;
				flex: 0 0 auto;
                -webkit-flex: 0 0 auto;
				display: flex;
    			align-items: center;
				img{
					max-width: 100%;
					max-height: 100%;
					border:0;
				}
			}
			.detail{	
				padding-left: 28px;
				flex: 1 1 auto;
                -webkit-flex: 1 1 auto;
				overflow: hidden;
			}
			.store-name{
				width: 100%;
				line-height: 124px;/*px*/
				font-size: 28px;/*px*/
				color:#222;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
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
    /* 加载中 */
    .loading{
		color: #bbb;
        text-align: center;
        line-height: 70px;/*px*/
        font-size: 18px;/*px*/ 
    }
    /* 底部删除 */
    .select-delete{
    	width: 100%;
    	line-height: 100px;/*px*/ 
    	height: 100px;/*px*/ 
		background-color: #fff;
		/* border-top: 1px solid #e5e5e5; */
		box-shadow: 0 1px #e5e5e5 inset;
		padding: 0 30px;
		position: fixed;
		left: 0;
		bottom: 0;
		text-align: right;
    }
    /* 删除 */
    .btn-delete{
    	width: 210px;
    	height: 62px;/*px*/
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
    /* 无内容 */
    .collect-none{
    	width: 100%;
    	height: 100%;
    	position: absolute;
    	left: 0;
    	top: 0;
    	padding-top: 90px;/*px*/
    	.none-photo{
    		width: 265px;
    		height: 446px;
    		background: url(../../assets/mine/collect-none.png) no-repeat 0 0;
			background-size: 265px 446px;
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
    		height: 48px;/*px*/
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
</style>