<template>
	<div class="wrap" @keyup.enter="loginFn()">
		<!-- logo -->
		<div class="logo">
			<img src="../../assets/login-logo.png">
		</div>

		<!-- 用户名 -->
		<div class="form-group user-name">
			<input type="text" placeholder="请输入用户名" v-model="userName">
			<i class="icon-delete" v-show="userDelShow" @click="userDel()"></i>
		</div>

		<!-- 密码 -->
		<div class="form-group user-password">
			<input :type="pwdType" placeholder="请输入密码" v-model="password">
			<i class="icon-delete" v-show="passwordDelShow" @click="passwordDel()"></i>
			<i class="icon-eye" :class="{show:eyeOpen}" @click="eyeToggle()"></i>
		</div>

		<!-- 忘记密码？ -->
		<div class="forget">
			<router-link to='/forgetPassword'>忘记密码？</router-link>
		</div>

		<!-- 登录按钮 -->
		<div class="btn-login" :class="{active:loginActive}" @click="loginFn()">登录</div>

		<!-- 弹窗-警告 -->
		<transition name="fade">
			<div class="pop-shade" v-show="popShow">
				<!-- 弹窗主体 -->
				<div class="pop-main">
					<div class="pop-body">
						<p>{{popText}}</p>
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
	export default {
		name: "login",
		data() {
			return {
				//用户名
				userName: '',
				//密码
				password: '',
				//密码input type
				pwdType: 'password',
				//眨眼icon
				eyeOpen: false,
				//弹窗
				popShow: false,
				//弹窗内容
				popText: ''
			}
		},
		computed: {
			//用户名删除按钮显示或隐藏
			userDelShow: function () {
				if (this.userName != '') {
					return true;
				} else {
					return false;
				}
			},
			//密码删除按钮显示或隐藏
			passwordDelShow: function () {
				if (this.password != '') {
					return true;
				} else {
					return false;
				}
			},
			//登录按钮是否激活
			loginActive: function () {
				if (this.userName != '' && this.password != '') {
					return true;
				} else {
					return false;
				}
			}
		},
		methods: {
			//删除用户名
			userDel: function () {
				this.userName = '';
			},
			//删除密码
			passwordDel: function () {
				this.password = '';
			},
			//密码显示切换
			eyeToggle: function () {
				this.pwdType = this.pwdType === 'password' ? 'text' : 'password';
				this.eyeOpen = !this.eyeOpen;
			},
			//登录
			loginFn: function () {
				if (this.loginActive) {
					let timeStamp = new Date().getTime();
					let params = {"userName": this.userName, "passWord": this.password};
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
						// success
						let aes = res.data.data.aesRequestBody;
						this.$http({
							method: 'post',
							url: this._ajaxUrl + '/system/login',
							headers: {
								'time-stamp': timeStamp,
								'data-signature': md5
							},
							data: aes
						}).then((res) => {
							console.log(res)
							let resObj = res.data
							// 成功就跳转页面，失败就弹窗
							if (resObj.errorCode === '0000') {
                                localStorage.removeItem('unverified');
								var time = new Date();
								time.setHours(time.getHours() + (24 * 30)); //保存一个月
								document.cookie = `token=${resObj.data};expires=`+time.toGMTString();
								// 跳转至进登录页前的那个页面，如果直接从登录页进入的则跳转进默认页面
								console.log(sessionStorage.getItem('fromPath'))
								console.log(sessionStorage.getItem('fromQuery'))
								this.$router.replace({
									path: sessionStorage.getItem('fromPath') || '/mine', 
									query: JSON.parse(sessionStorage.getItem('fromQuery'))
								});
								// 清除缓存
								sessionStorage.removeItem('fromPath');
								sessionStorage.removeItem('fromQuery');
							} else if(resObj.errorCode === "login_0007"){
								// 未认证
								var time = new Date();
								time.setHours(time.getHours() + (24 * 30)); //保存一个月
								document.cookie = `token=${resObj.data};expires=`+time.toGMTString();
                                localStorage.setItem('unverified','1');
                                // document.cookie = `unverified=1;expires=`+time.toGMTString();
								this.$router.push({path: '/unverified'});
							}else {
								this.popShow = true;
								this.popText = resObj.message;
							}
                        });
					});
				}
			},
			//关闭弹窗
			confirmFn: function () {
				this.popShow = false;
				this.password = '';
			}
		},
		created() {
			// 回去上一次的页面
			let timeStamp = new Date().getTime();
            this.$http({
                method: 'post',
                url: this._ajaxUrl + '/customer/info/getMyAccountInfo',
                headers: {
                    "time-stamp": timeStamp
                }
            }).then((res) => {
            	if(res.data.errorCode == '0000'){
					this.$router.replace({
						path: localStorage.getItem('toPath') || '/login', 
						query: JSON.parse(localStorage.getItem('toQuery'))
					});
            	}
            });
		}
	}
</script>
<style lang="less" scoped>
	.wrap {
		width: 100%;
		height: 100%;
		background-color: #f6f6f6;
		padding: 0 30px;
		.logo {
			width: 100%;
			padding: 70px 0 90px 0;
			img {
				width: 253px;
				margin: 0 auto;
				display: block;
			}
		}
		/* 表单 */
		.form-group {
			width: 100%;
			height: 68px;
			position: relative;
			box-shadow: 0 -1px #0066cc inset;
			input {
				width: 100%;
				height: 100%;
				line-height: 68px;
				border: 0;
				background-color: transparent;
				outline: none;
				color: #333;
				font-size: 32px;
				padding: 0 10px;
			}
		}
		/* 用户名 */
		.user-name {
			margin-bottom: 66px;
			padding-right: 48px;
			.icon-delete {
				right: 10px;
			}
		}
		/* 密码 */
		.user-password {
			margin-bottom: 30px;
			padding-right: 112px;
			.icon-delete {
				right: 75px;
			}
		}
		/* 删除 */
		.icon-delete {
			width: 32px;
			height: 100%;
			background: url(../../assets/icon/icon-close.png) no-repeat 0 center;
			background-size: 28px 28px;
			position: absolute;
			top: 0;
		}
		.icon-eye {
			width: 32px;
			height: 100%;
			background: url(../../assets/icon/icon-eye2.png) no-repeat 0 center;
			background-size: 32px 20px;
			position: absolute;
			top: 0;
			right: 10px;
			&.show {
				background-image: url(../../assets/icon/icon-eye.png);
			}
		}
		/* 忘记密码 */
		.forget {
			text-align: right;
			margin-bottom: 100px;
			a {
				line-height: 30px;
				font-size: 28px;
				color: #999;
			}
		}
		/* 按钮 */
		.btn-login {
			width: 100%;
			height: 88px; /*px*/
			line-height: 88px; /*px*/
			text-align: center;
			background-color: #abd5ff;
			border-radius: 10px;
			font-size: 34px;
			color: #fffdf8;
			&.active {
				background-color: #0066cc;
			}
		}
		// 弹窗过渡动画
		.fade-enter-active, .fade-leave-active {
			transition: opacity .3s ease-in;
		}
		.fade-enter, .fade-leave-to {
			opacity: 0;
		}
	}
</style>