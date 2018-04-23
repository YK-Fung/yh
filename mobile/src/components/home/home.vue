<template>
	<div id="temp">
		<!--顶部搜索栏-->
		<div ref="searchOut" class="search-out" :class="{'curr':searchBarChange}">
			<div class="search-in">
				<router-link to="/hotSearch">
					<i></i>
					<input class="home-search-input" type="search" placeholder="搜索"></router-link>
			</div>
		</div>

		<div ref="home" class="home">
			<div class="home-main">
				<!--轮播图-->
				<div class="top-banner" :class="{loading:!swiper.length}" ref="banner">
					<mt-swipe :auto="4000">
						<!-- href由后台管理编辑 -->
						<mt-swipe-item v-for="(item,index) in swiper" :key="index"><a :href="item.advUrl?item.advUrl:'javascript:void(0)'"><img  v-lazy="item.advImg"></a></mt-swipe-item>
					</mt-swipe>
					<!--搜索栏-->

				</div>

				<!--分类导航-->
				<ul class="cate">
					<li>
						<router-link :to="(isLogin?{path: '/orderMine',query:{status: 'all'}}:'/login')">
							<i></i>
							<p>我的订单</p>
						</router-link>
					</li>
					<li>
						<router-link to="/coupon">
							<i></i>
							<p>领优惠券</p>
						</router-link>
					</li>
					<li>
						<router-link to="/hotSale">
							<i></i>
							<p>热销专区</p>
						</router-link>
					</li>
					<li>
						<router-link to="/category">
							<i></i>
							<p>商品分类</p>
						</router-link>
					</li>
				</ul>

				<!--新品优选-->
				<div class="new-goods">
					<!-- 广告位 href由后台管理编辑 -->
					<a class="new-goods-left" :href="newGoodsAdvs.advUrl?(window.location.origin+'/#/'+newGoodsAdvs.advUrl.split('/#/')[1]):'javascript:void(0)'">
						<img v-lazy="newGoodsAdvs.advImg">
					</a>
					<div class="new-goods-right">
						<router-link :to="{path:'/goodsDetail',query:{goodsId:item.goodsId}}" class="new-goods-right-top" v-for="(item,index) in newGoods" :key="index">
							<div class="desc">
								<!-- 商品名称 -->
								<h4>{{item.goodsName}}</h4>
								<!-- 商品规格 -->
								<p>{{item.spec}}</p>
								<!-- 无法购买 -->
								<div class="price-none" v-if="goodPrice(item.isLimitGoodsStatus,numberTip)">{{goodPrice(item.isLimitGoodsStatus,numberTip)}}</div>
								<!-- 商品价格 -->
								<div class="price" v-else="goodPrice(item.isLimitGoodsStatus,numberTip)">￥<span>{{priceInt(item.goodsProductLimitPrice)}}.{{priceDec(item.goodsProductLimitPrice)}}</span></div>
							</div>
							<!-- 商品图片 -->
							<div class="goods-img">
								<img v-lazy="item.goodsImg">
							</div>
						</router-link>
					</div>

				</div>
				<!--热门品牌-->
				<div class="brand">
					<div class="hot-brand"></div>
					<div class="brand-cate">
						<router-link v-for="(item,index) in hotBrand" :key="index" :to="{path:'/search',query:{sortFlag:1,searchText:'',agentType:'',brandName:item.brandName,pageNo:1}}"><img v-lazy="item.brandLogo"></router-link>
					</div>
				</div>

				<!--推荐信息列表-->
				<div ref="recommend">
					<div class="list" v-for="(item,index) in categoryList" :key="index" ref="recommendList">
						<!--标题-->
						<div class="title">
							<!--首页显示时-->
							<p class="home"><i :style="{'background':'url('+ require('../../assets/icon/icon-med'+(index+1)+'.png') +') no-repeat center right','backgroundSize':'contain '}"></i>{{item.module.moduleName.split('-').pop()}}<i :style="{'background':'url('+ require('../../assets/icon/icon-medr'+(index+1)+'.png') +') no-repeat','backgroundSize':'contain'}"></i>
							</p>
						</div>
						<!--列表-->
						<div class="brand-list-out">
							<div class="brand-list">
								<ul  :style="{'width': item.goodsList ? 3.066667 * item.goodsList.length+'rem' : 0}">
									<router-link :to="{path:'/goodsDetail',query: {goodsId: itemGoods.goodsId}}" v-for="(itemGoods,goodIndex) in item.goodsList" :key="goodIndex">
										<li>
											<!-- 商品图片 -->
											<div >
												<img v-lazy="itemGoods.goodsImg" alt=""></div>
											<!-- 商品名称 -->
											<p class="brand-list-title">{{itemGoods.goodsName}}</p>
											<!-- 商品规格 -->
											<p class="amount">{{itemGoods.spec}}</p>
											<!-- 无法购买 -->
											<p class="price-none" v-if="goodPrice(itemGoods.isLimitGoodsStatus,item.numberTip)">{{goodPrice(itemGoods.isLimitGoodsStatus,item.numberTip)}}</p>
											<!-- 商品价格-->
											<p class="price" v-else="goodPrice(itemGoods.isLimitGoodsStatus,item.numberTip)">￥<span>{{priceInt(itemGoods.goodsProductLimitPrice)}}</span>.{{priceDec(itemGoods.goodsProductLimitPrice)}}</p>
										</li>
									</router-link>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<!-- 加载中 -->
				<div class="loading" v-show="isLoading">加载中</div>
			</div>
		</div>
		<tabbar></tabbar>
	</div>
</template>

<script>
	import tabbar from '../subcom/tab-bar';

	export default {
		name: "home",
		components: {
			tabbar
		},
		data() {
			return {
			    window:window,
				searchBarChange: false,
				swiper:[],
				// 登录认证提示数字
				numberTip: null,
				// 新品优选广告图
				newGoodsAdvs:[],
				// 新品优选商品
				newGoods:[],
				// 热门品牌推荐
				hotBrand: [],
				// 类目列表推荐
				categoryList: [],
				//是否登录
                isLogin: document.cookie.split('token=')[1] ? (document.cookie.split('token=')[1].split(';')[0] ? true : false) : false,
				//加载中
				isLoading: false,
				// 请求页码id
				pageNo:0,
				// 推荐信息id数组
				moduleId:[]
			}
		},
		methods: {
			homeScroll() {
				let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
				this.searchBarChange = (scrollTop >= (this.$refs.banner.offsetHeight - this.$refs.searchOut.offsetHeight
				)) ? true : false

				//获取推荐信息
				let windowHeight  = document.body.offsetHeight;
				//滑到距离推荐信息底部
				if(scrollTop+windowHeight > this.$refs.recommend.offsetTop+this.$refs.recommend.offsetHeight-this.$refs.recommendList[0].offsetHeight){
					//正在加载中 或者 已经全部加载完毕
					if(this.isLoading || this.pageNo >= this.moduleId.length-1){
						return false;
					}
					//显示加载中
					this.isLoading = true;
					this.pageNo ++
					let timeStamp = new Date().getTime();
					let params = {'pageSize': 8,'pageNo': 1,'moduleId': this.moduleId[this.pageNo].refereeModuleId};
					let md5 = this._cryptojs.MD5(JSON.stringify(params));
					this.$http({
						method: 'post',
						url: this._ajaxUrl + '/encryption/aes',
						headers: {
							'data-signature': md5
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
								'data-signature': md5,
	                            'time-stamp':timeStamp
							},
							url: this._ajaxUrl + '/goods/recommend/getModuleGoodsList',
							data: aes
						}).then((res) => {
	                        if (res.data.errorCode == '0000') {
								//插入新数据
								this.categoryList.push(...res.data.data);
								this.isLoading = false;
							}
						});
					});
				}
			},
			// 价格整数 参数（价格）
			priceInt: function(price) {
				if(price){
					return price.openOrCompleteSellMoney.toFixed(2).toString().split('.')[0];
				}
			},
			// 价格小数 参数（价格）
			priceDec: function(price) {
				if(price){
					return price.openOrCompleteSellMoney.toFixed(2).toString().split('.')[1];
				}
			},
			// 是否显示价格 参数（商品限制状态）
			goodPrice: function(isLimitGoodsStatus,numberTip) {
				switch(numberTip)
				{
					case 0:
						return '登录可见';
						break;
					case 3:
						return '认证可见';
						break;
					case 2:
						switch(isLimitGoodsStatus)
						{
							case 5:
								return '定向销售';
								break;
							case 6:
								return '超出经营范围';
								break;
							case 2:
								return false;
								break;
						}
						break;
					default:
						return '登录可见';
						break;
				}
			}
		},
		mounted() {
			window.scrollTo(0,0);
			window.addEventListener('scroll', this.homeScroll);
		},
		//切换路由时注销滚动事件
		destroyed() {
			window.removeEventListener('scroll',this.homeScroll)
		},
		created() {
            let timeStamp = new Date().getTime();
			//获取banner图
			{
				let params = {'advTypeCode': 'mobile-index001'};
				let md5 = this._cryptojs.MD5(JSON.stringify(params));
				this.$http({
					method: 'post',
					url: this._ajaxUrl + '/encryption/aes',
					headers: {
						'data-signature': md5
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
							'data-signature': md5,
                            'time-stamp':timeStamp
						},
						url: this._ajaxUrl + '/banner/getBanners',
						data: aes
					}).then((res) => {
						if (res.data.errorCode == '0000') {
							//清空数组，插入新数据
							this.swiper.splice(0,this.swiper.length);
							this.swiper.push(...res.data.data);
						}
					});
				});
			}

			//获取新品优选广告图
			{
				let params = {'advTypeCode': 'mobile-category12'};
				let md5 = this._cryptojs.MD5(JSON.stringify(params));
				this.$http({
					method: 'post',
					url: this._ajaxUrl + '/encryption/aes',
					headers: {
						'data-signature': md5
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
							'data-signature': md5,
                            'time-stamp':timeStamp
						},
						url: this._ajaxUrl + '/banner/getBanners',
						data: aes
					}).then((res) => {
						if (res.data.errorCode == '0000') {
							this.newGoodsAdvs = res.data.data[0];
                        }
					});
				});
			}

			// 新品优选商品
			{
				let params = {'pageSize': 2 ,'moduleId': '33'};
				let md5 = this._cryptojs.MD5(JSON.stringify(params));
				this.$http({
					method: 'post',
					url: this._ajaxUrl + '/encryption/aes',
					headers: {
						'data-signature': md5
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
							'data-signature': md5,
                            'time-stamp':timeStamp
						},
						url: this._ajaxUrl + '/goods/recommend/getModuleGoodsList',
						data: aes
					}).then((res) => {
						console.log(res.data.data[0])
						if (res.data.errorCode == '0000') {
							//清空数组，插入新数据
							this.numberTip = res.data.data[0].numberTip;
							this.newGoods.splice(0,this.newGoods.length);
							this.newGoods.push(...res.data.data[0].goodsList);
						}
					});
				});
			}


			{
				// 获取推荐id
	            this.$http({
	                method: 'post',
	                url: this._ajaxUrl + '/goods/refereemodule/mobileTerminalIndexRefereeModule',
	                headers: {
	                    "time-stamp": timeStamp
	                }
	            }).then((res) => {
	                this.moduleId.push(...res.data.data)
	                // 获取推荐信息一楼
	                let params = {'pageSize': 8,'pageNo': 1,'moduleId': this.moduleId[this.pageNo].refereeModuleId};
					let md5 = this._cryptojs.MD5(JSON.stringify(params));
					this.$http({
						method: 'post',
						url: this._ajaxUrl + '/encryption/aes',
						headers: {
							'data-signature': md5
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
								'data-signature': md5,
	                            'time-stamp':timeStamp
							},
							url: this._ajaxUrl + '/goods/recommend/getModuleGoodsList',
							data: aes
						}).then((res) => {
	                        if (res.data.errorCode == '0000') {
								//清空数组，插入新数据
								this.categoryList.splice(0,this.categoryList.length);
								this.categoryList.push(...res.data.data);
							}
						});
					});
	            });
			}


			//获取推荐的商品品牌
			{
				this.$http({
					method: 'post',
					url: this._ajaxUrl + '/goodsBrand/recommendGoodsBrand',
					headers: {
						'data-signature': '',
                        'time-stamp':timeStamp
					}
				}).then((res) => {
					if (res.data.errorCode == '0000') {
						//清空数组，插入新数据
						this.hotBrand.splice(0,this.hotBrand.length);
						this.hotBrand.push(...res.data.data);
                    }
				});
			}
		}
	}
</script>

<style lang="less" scoped>


	#temp {
		width: 100%;
		padding-bottom: 98px;
		background: #f6f6f6;

	}

	.home {

		width: 100%;

	}

	.top-banner {
		width: 100%;
		&.loading{
			background: url("../../assets/loading.gif") center center no-repeat;
		}
	}

	.search-out {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;

		padding: 17px 0;
		z-index: 99;
		.search-in {
			width: 90%;
			height: 64px;/*px*/
			border-radius: 100px;
			overflow: hidden;
			i{
				position: absolute;
				left: 65px;
				top: 50%;
				transform: translateY(-50%);
				width: 28px;
				height: 28px;
				background: url("../../assets/search.png") no-repeat;
				background-size: contain;
			}
			input {
				outline: none;
				border: none;
				width: 100%;
				height: 100%;/*px*/
				padding-left: 70px;
				background-color: rgba(240, 240, 240, 0.5);
				line-height: 64px;/*px*/
				border-radius: 100px;
			}
			::-webkit-input-placeholder {
				color: rgba(240, 240, 240, 0.5);
				font-size: 28px;
			}
		}
	}

	.search-out.curr {
		background-color: #fff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.078);
		i{
			background: url("../../assets/search-grey.png") no-repeat;
			background-size: contain;
		}
		.search-in .home-search-input {
			background: #f2f2f2;
		}
		::-webkit-input-placeholder {
			color: #bbb;
		}
	}

	/*轮播图*/
	.mint-swipe {
		height: 330px;
		width: 100%;
		.mint-swipe-item img {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			width: 100%;
			height: 100%;
			&[lazy=loading] {
				width: auto;
				height: auto;
			}
		}
	}

	/*分类导航*/
	.cate {
		padding-top: 24px;
		padding-bottom: 24px;
		width: 100%;
		display: flex;
		background: white;
		margin-bottom: 16px;
		li {
			flex: 1;
			text-align: center;
			a {
				width: 100%;
				height: 100%;
				display: inline-block;
				p {
					font-size: 28px;
					color: #666;
				}
			}
			&:nth-child(1){
				i{
					background: url("../../assets/icon/icon-cate-order.png") no-repeat;
					background-size: contain;
					display: inline-block;
					width: 70%;
					height: 144px;
				}
			}
			&:nth-child(2){
				i{
					background: url("../../assets/icon/icon-cate-coupon.png") no-repeat;
					background-size: contain;
					display: inline-block;
					width: 70%;
					height: 144px;
				}
			}
			&:nth-child(3){
				i{
					background: url("../../assets/icon/icon-cate-hot-sale.png") no-repeat;
					background-size: contain;
					display: inline-block;
					width: 70%;
					height: 144px;
				}
			}
			&:nth-child(4){
				i{
					background: url("../../assets/icon/icon-cate-product.png") no-repeat;
					background-size: contain;
					display: inline-block;
					width: 70%;
					height: 144px;
				}
			}
		}
	}


	.cate li img {
		width: 70%;
		/*height: 144px;!*px*!*/
		margin-bottom: 12px;

	}

	/*新品优选*/
	.new-goods {
		background: white;
		overflow: hidden;
		margin-bottom: 16px;
		height: 300px;
		.new-goods-left, .new-goods-right {
			height: 100%;
			width: 50%;
			float: left;

		}
		.new-goods-left {
			position: relative;
			padding: 30px;
			display: flex;
			align-items: center;
			justify-content: center;
			img {
				position: absolute;
				width: 80%;
				height: 80%;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
			}
		}
		.new-goods-right {
			box-shadow: 1px 0 0 0 #e5e5e5 inset;
			padding: 0;
			flex-direction: column;
			display: flex;
			.new-goods-right-top {
				box-shadow: 0 -1px 0 0 #e5e5e5 inset;
			}
			.new-goods-right-top, .new-goods-right-bottom {
				padding: 15px 30px 15px 14px;
				flex: 1;
				display: flex;
				.desc {
					width: 186px;
					h4 {
						color: #222;
						margin-bottom: 10px;
						font-size: 30px;
						font-weight: normal;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					p {
						font-size: 26px;
						color: #666;
						margin-bottom: 10px;
					}
					div.price {
						color: #f82222;
						font-size: 20px;
						span{
							font-size: 24px;
						}
					}
					div.price-none {
						line-height: 36px;
						color: #f82222;
						font-size: 24px;
						border:1px solid #f82222;
						border-radius: 6px;
						display: inline-block;
						padding: 0 8px;
						margin:0 -3px;
						white-space: nowrap;
					}
				}
				.goods-img {
					width: 144px;
					text-align: center;
					img {
						width: 100%;
						height: 100%;
					}
				}
			}
			.new-goods-right-bottom {
				flex: 1;

			}
		}
	}

	/*热门品牌*/
	.brand {
		background: white;
		.hot-brand {
			text-align: center;
			height: 50px;
			background: url("../../assets/hot-brand.png") center center no-repeat;
			background-size: 257px 28px;

		}
	}

	.brand-cate {
		width: 100%;
		/*padding-top: 1px;*/
		overflow: hidden;
		margin-bottom: 16px;
		a {
			box-shadow: -1px 1px  #e5e5e5 inset;
			float: left;
			width: 33.33%;
			height: 104px;
			display: inline-block;
			padding: 22px 35px;
			text-align: center;
			img {
				max-width: 100%;
				max-height: 100%;
			}
		}
		a:nth-child(3n) {
			box-shadow: 0 1px 0 0 #e5e5e5 inset;
		}
	}
	.title {
		display: flex;
		align-items: center;
		margin-top: 16px;
		height: 54px;
		margin-bottom: 1px;
		.home{
			height: 100%;
			font-size: 28px;
			color: #222;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto;
			i{

				width: 60px;
				height: 40px;
				display: inline-block;
				margin: 0 7px;
			}
		}
	}
	.list {
		background: white;
	}
    /* 加载中 */
    .loading{
		color: #bbb;
        text-align: center;
        line-height: 70px;/*px*/
        font-size: 18px;/*px*/ 
    }
	.brand-list-out{
		height: 344px;
		/*width: 100%;*/
		overflow: hidden;
	}
	.brand-list {
		width: 100%;
		overflow-x: scroll;
		height: 350px;
		ul {
			height: 100%;
			li {
				float: left;
				box-shadow: -1px 0 0 0 #eee inset,0 1px #eee inset;
				width: 230px;
				height: 100%;
				padding: 15px 30px;
				text-align: center;
				div{
					width: 170px;
					height: 170px;
					position: relative;
					img{
						position: absolute;
						left: 50%;
						top: 50%;
						max-width: 100%;
						max-height: 100%;
						transform: translate(-50%,-50%);
					}
				}

				p {
					text-align: center;
				}
				p.brand-list-title {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 26px;
					margin-top: 20px;
					margin-bottom: 16px;
					color: #333;
				}
				p.amount {
					color: #666;
					font-size: 24px;
					margin-bottom: 12px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				p.price {
					color: #f82222;
					font-size: 26px;
					span {
						font-size: 32px;
					}
				}
				p.price-none{
					line-height: 36px;
					color: #f82222;
					font-size: 26px;
					border:1px solid #f82222;
					border-radius: 6px;
					display: inline-block;
					padding: 0 8px;
					margin:0 -3px;
					white-space: nowrap;
				}
			}
			a:nth-last-child(1) {
				li{
					box-shadow: 0 1px #eee inset;
				}
			}
		}

	}

</style>