<template>
	<div class="wrap">
		<!-- 用户名 -->
		<div class="account-detail">
			<div class="left">用户名</div>
			<div class="right">{{userName}}</div>
		</div>
		<!-- 手机号码 -->
		<div class="account-detail">
			<div class="left">手机号码</div>
			<div class="right">{{mobile}}</div>
		</div>
		<!-- 收货地址 -->
		<router-link :to="(isLogin?'/address':'/login')" replace class="account-detail">
			<div class="left">收货地址</div>
			<div class="right arrow"></div>
		</router-link>
		<!-- 退出当前账户 -->
		<div class="exit-account">
			<div class="btn-exit" @click="exitFn()">退出当前账户</div>
		</div>
		<!-- 弹窗-警告 -->
        <transition name="fade">
            <div class="pop-shade" v-show="popShow">
                <!-- 弹窗主体 -->
                <div class="pop-main">
                    <div class="pop-body">
                        <p>{{popTip}}</p>
                    </div>
                    <div class="pop-footer">
                        <div class="btn btn-yes" @click="confirmFn()">确认</div>
                    </div>
                </div>
            </div>
        </transition>
	</div>
</template>
<script>
	export default{
		name : "account",
		data(){
			return {
				//是否登录
                isLogin: false,
				//用户名
				userName: '',
				//手机号码
				mobile: '',
				//弹窗
                popShow: false,
                //提示语
                popTip: ''
			}
		},
		methods: {
			// 退出当前账户
			exitFn: function () {
				if (this.isLogin) {
					let timeStamp = new Date().getTime();
					this.$http({
						method: 'post',
						url: this._ajaxUrl + '/system/logout',
						headers:{
		                    'data-signature': '',
		                    "time-stamp": timeStamp
		                }
					}).then((res) => {
						let resObj = res.data
						// 成功就跳转页面，失败就弹窗
						if (resObj.errorCode === '0000') {
							this.$router.push('/login');
							//退出登录 清空cookie
							document.cookie = 'token=';
                            localStorage.removeItem('unverified');
						} else {
							this.popShow = true;
							this.popTip = '退出登录失败，请稍后再试。';
						}
					});
				}
			},
			confirmFn: function(){
				this.popShow = false;
			}
		},
		created() {
			let timeStamp = new Date().getTime();
			this.$http({
				method: 'post',
				url: this._ajaxUrl + '/customer/info/getMyAccountInfo',
				headers:{
                    'data-signature': '',
                    "time-stamp": timeStamp
                }
			}).then((res) => {
				//用户未登录
				if(res.data.errorCode == 'login_0004'){
					this.isLogin = false;
				}
				//用户已登录
				if(res.data.errorCode == '0000'){
					this.isLogin = true;
					this.userName = res.data.data.userInfo.userName;
					this.mobile = res.data.data.userInfo.mobile;
				}
			})
		}
	}
</script>
<style lang="less" scoped>
	.wrap{
		width: 100%;
		background-color: #f6f6f6;
	}
	/* 账号详情 */
	.account-detail{
		height: 105px;/*px*/
		line-height: 105px;/*px*/
		background-color: #fff;
		/* border-bottom: 1px solid #e5e5e5; */
		box-shadow: 0 -1px #e5e5e5 inset;
		font-size: 32px;/*px*/
		padding: 0 30px;
		display: flex;
		.left{
			width:160px; 
			height: 100%;
			color:#222;
			flex: 0 0 auto;
		}
		.right{
			flex: 1 1 auto;
			height: 100%;
			color:#666;
			text-align: right;
			overflow: hidden;
		    white-space: nowrap;
		    text-overflow: ellipsis;
		}
		.arrow{
			background: url(../../assets/icon/icon-arrow-right.png) no-repeat right center;
			background-size: 12px 20px;
		}
	}
	/* 退出当前账户 */
	.exit-account{
		width: 100%;
		padding: 0 30px;
		margin-top: 95px;
		.btn-exit{
			width: 100%;
			line-height: 88px;/*px*/
			text-align: center;
			background-color: #0066cc;
			color:#fffdf8;
			font-size: 34px;/*px*/
			display: block;
			border-radius: 10px;
		}
	}
</style>