<template>
	<div class="wrap">
		<!-- 输入信息 -->
		<div class="import-message" v-if="importMessage">
			<!-- 背景图 -->
			<img src="../../assets/forget-bg1.jpg" class="forget-bg">
			<!-- 手机号码 -->
			<div class="form-group phone-number">
				<div class="label">手机号码</div>
				<input type="number" placeholder="请输入您的手机号码" v-model="mobile">
				<span class="icon-close" v-show="phoneDelShow" @click="numDel()"></span>
			</div>
			<!-- 验证码 -->
			<div class="form-group code-number">
				<div class="label">验证码</div>
				<input type="number" placeholder="请输入短信验证码" v-model="captcha">
				<!-- 倒计时 " -->
				<button class="count-down" :class="{active:codeColor}" @click="sendCode()" :disabled="disabled">{{codeText}}</button>
			</div>
			<!-- 下一步 -->
			<div class="button">
				<div class="next-btn" :class="{active:nextActive}" @click="nextBtn()">下一步</div>
			</div>
		</div>

		<!-- 设置新密码 -->
		<div class="reset-password" v-else-if="resetPassword">
			<!-- 背景图 -->
			<img src="../../assets/forget-bg3.jpg" class="forget-bg">
			<!-- 手机号码 -->
			<div class="form-group">
				<div class="label">新密码</div>
				<input :type="newPwdType" placeholder="请输入新密码" v-model="newPwd">
				<span class="icon-close" v-show="newDelShow" @click="newPwdDel()"></span>
				<span class="icon-eye" :class="{show:newEyeOpen}" @click="newEyeToggle()"></span>
			</div>
			<!-- 验证码 -->
			<div class="form-group">
				<div class="label">确认新密码</div>
				<input :type="confirmPwdType" placeholder="再次输入密码" v-model="confirmPassword">
				<span class="icon-close" v-show="confirmDelShow" @click="confimPasswordDel()"></span>
				<span class="icon-eye" :class="{show:confirmEyeOpen}" @click="confirmeyeToggle()"></span>
			</div>
			<!-- 下一步 -->
			<div class="button">
				<div class="next-btn" :class="{active:resetNextActive}" @click="resetNextBtn()">下一步</div>
			</div>
		</div>

		<!-- 设置成功 -->
		<div class="reset-succeed" v-else-if="resetSucceed">
			<!-- 背景图 -->
			<img src="../../assets/forget-bg2.jpg" class="forget-bg">
			<!-- 下一步 -->
			<div class="button">
				<router-link to='login' class="next-btn active">返回登录</router-link>
			</div>
		</div>
	</div>
</template>
<script>
	import {Toast} from 'mint-ui';
	export default{
		name:"forget-password",
		data(){
			return{
				//输入信息
				importMessage:true,
				//重置密码
				resetPassword:false,
				//设置成功
				resetSucceed:false,
				//手机号码
				mobile:'',
				//验证码
				captcha:'',
				//倒计时+1
				totalTime:60+1,
				time:60+1,
				//发送按钮激活
				disabled:false,
				//新密码
				newPwd:'',
				//确认新密码
				confirmPassword:'',
				//默认密码隐藏
				newEyeOpen:false,
				confirmEyeOpen:false,
				//默认密码type = password
				newPwdType: 'password',
				confirmPwdType: 'password',
				token: ''
			}
		},
		computed:{
			/****************
				填写信息
			*****************/
			//发送验证码按钮text
			codeText:function(){
				if(this.time == this.totalTime){
					return '发送';
				}else if(this.time == 0){
					return '重新发送';
				}else if(this.totalTime > this.time > 0){
					return '（'+this.time+'s）';
				}
			},
			//验证码颜色
			codeColor:function(){
				if(this.time == this.totalTime || this.time == 0){
					return true;
				}else if(this.totalTime > this.time > 0){
					return false;
				}
			},
			//手机号码删除按钮显示或隐藏
			phoneDelShow:function(){
				if(this.mobile != ''){
					return true;
				}else{
					return false;
				}
			},
			//下一步按钮是否激活
			nextActive:function(){
				if(this.mobile != '' && this.captcha != ''){
					return true;
				}else{
					return false;
				}
			},
			/****************
				重置密码
			*****************/
			//新密码删除按钮显示或隐藏
			newDelShow:function(){
				if(this.newPwd != ''){
					return true;
				}else{
					return false;
				}
			},
			//新密码删除按钮显示或隐藏
			confirmDelShow:function(){
				if(this.confirmPassword != ''){
					return true;
				}else{
					return false;
				}
			},
			//下一步按钮是否激活
			resetNextActive:function(){
				if(this.newPwd != '' && this.confirmPassword != ''){
					return true;
				}else{
					return false;
				}
			},
		},
		methods:{
			/****************
				填写信息
			*****************/
			//发送验证码
			sendCode:function(){
				if(this.mobile != ''){
					let timeStamp = new Date().getTime();
					let params = {"mobile" : this.mobile};
					this._signature = this._cryptojs.MD5(JSON.stringify(params));
					this.$http({
						method: 'post',
						url: this._ajaxUrl + '/encryption/aes',
						headers: {
							'data-signature': this._signature,
						},
						data: {
							'time-stamp': timeStamp,
							"requestBody": JSON.stringify(params)
						}
					}).then((res) => {
						let aes = res.data.data.aesRequestBody;
						this.$http({
							method: 'post',
							url: this._ajaxUrl + '/customer/reset/pwd/sendSms',
							headers: {
								'time-stamp': timeStamp,
								'data-signature': this._signature,
							},
							data: aes
						}).then((res) => {
							if (res.data.errorCode === '0000') {
								// 成功倒计时
								this.time = this.totalTime;
								this.disabled = true;
								this.timer();
							}else{
								//失败 提示语
								Toast({
				                    message: res.data.message,
				                    position: 'bottom',
				                    duration: 3000,
				                    className:'public'
				                });
							}
						});
					});
				}else{
					//提示语
					Toast({
	                    message: '请输入手机号码',
	                    position: 'bottom',
	                    duration: 3000,
	                    className:'public'
	                });
				}
			},
			//倒计时
			timer:function(){
				if(this.time > 0){
					this.time --;
					setTimeout(this.timer,1000);
				}else{
					this.disabled = false;
				}
			},
			//清空手机号
			numDel:function(){
				this.mobile = '';
			},
			//下一步(校验短信)
			nextBtn:function(){
				if(this.nextActive){
					let timeStamp = new Date().getTime();
					let params = {'mobile' : this.mobile, 'captcha' : this.captcha};
					this._signature = this._cryptojs.MD5(JSON.stringify(params));
					this.$http({
						method: 'post',
						url: this._ajaxUrl + '/encryption/aes',
						headers: {
							'data-signature': this._signature,
						},
						data: {
							'time-stamp': timeStamp,
							"requestBody": JSON.stringify(params)
						}
					}).then((res) => {
						let aes = res.data.data.aesRequestBody;
						this.$http({
							method: 'post',
							url: this._ajaxUrl + '/customer/reset/pwd/checkSmsCaptcha',
							headers: {
								'time-stamp': timeStamp,
								'data-signature': this._signature,
							},
							data: aes
						}).then((res) => {
							if (res.data.errorCode === '0000') {
								// 成功跳转页面
								this.resetPassword = true;
								this.importMessage = false;
								//返回数据
								this.token = res.data.data;
							} else {
								//失败提示语
								Toast({
									//后台返回
								    message: res.data.message,
								    position: 'bottom',
								    duration: 3000,
								    className:'public'
				    			});
							}
						});
					});
				}
			},
			/****************
				重置密码
			*****************/
			//清空新密码
			newPwdDel:function(){
				this.newPwd = ''
			},
			//清空确认密码
			confimPasswordDel:function(){
				this.confirmPassword = ''
			},
			//下一步(重置密码)
			resetNextBtn:function(){
				if(this.resetNextActive){
					//判断密码是否一致
					if(this.newPwd !== this.confirmPassword){
						Toast({
						    message: '前后两次密码输入不一致',
						    position: 'bottom',
						    duration: 3000,
						    className:'public'
		    			});
					}
					else if(!(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(this.newPwd))){
						Toast({
						    message: '密码由数字、字母或下划线组成，长度为6-20！',
						    position: 'bottom',
						    duration: 3000,
						    className:'public'
		    			});
					}
					else{
						let timeStamp = new Date().getTime();
						let params = {'newPwd' : this.newPwd, 'token' : this.token};
						this._signature = this._cryptojs.MD5(JSON.stringify(params));
						this.$http({
							method: 'post',
							url: this._ajaxUrl + '/encryption/aes',
							headers: {
								'data-signature': this._signature,
							},
							data: {
								'time-stamp': timeStamp,
								"requestBody": JSON.stringify(params)
							}
						}).then((res) => {
							let aes = res.data.data.aesRequestBody;
							this.$http({
								method: 'post',
								url: this._ajaxUrl + '/customer/reset/pwd/submit',
								headers: {
									'time-stamp': timeStamp,
									'data-signature': this._signature,
								},
								data: aes
							}).then((res) => {
								if (res.data.errorCode === '0000') {
									//成功跳转页面
									this.resetSucceed = true;
									this.resetPassword = false;
								}else {
									//失败提示语
									Toast({
										//后台返回
									    message: res.data.message,
									    position: 'bottom',
									    duration: 3000,
									    className:'public'
					    			});
								}
							});
						})
					}
				}
			},
			//新密码切换眼睛
			newEyeToggle:function(){
				this.newPwdType = this.newPwdType === 'password'?'text':'password';
				this.newEyeOpen = !this.newEyeOpen;
			},
			//确认密码切换眼睛
			confirmeyeToggle:function(){
				this.confirmPwdType = this.confirmPwdType === 'password'?'text':'password';
				this.confirmEyeOpen = !this.confirmEyeOpen;
			}
		},
		created() {
			
		}
	}
</script>
<style lang="less" scoped>
	.wrap{
		width: 100%;
		background-color: #f6f6f6;
	}
	/* 背景图 */
	.forget-bg{
		width: 100%;
	}
	/* 输入框 */
	.form-group{
		height: 105px;/*px*/
		line-height: 105px;/*px*/
		background: #fff;
		font-size: 32px;/*px*/
		color:#333;
		padding: 0 30px;
		/* border-bottom: 1px solid #e5e5e5; */
		box-shadow: 0 1px #e5e5e5;
		margin-bottom: 16px;
		display: flex;
		flex-flow:row;
		position: relative;
		padding-left:235px;
		.label{
			width: 205px;
			text-align: left;
			position: absolute;
			left: 30px;
			top: 0;
		}
		input{
			width: 100%;
			flex:1;
			outline: none;
			border:0;
		}
		/* 删除 */
		.icon-close{
			width: 28px;
			height: 100%;
			background: url(../../assets/icon/icon-close.png) no-repeat 0 center;
			background-size: 28px 28px;
			position: absolute;
			right: 40px;
		}
	}
	/* 下一步 */
	.button{
		padding: 0 30px;
		margin-top: 88px;
		.next-btn{
			width: 100%;
			line-height: 88px;/*px*/
			text-align: center;
			font-size: 34px;/*px*/
			color:#fffdf8;
			background-color: #abd5ff;
			border-radius: 10px;
			display: block;
			&.active{
				background-color: #0066cc;
			}
		}	
	}
	/* 输入信息 */
	.import-message{
		.form-group{
			/* 手机号码 */
			&.phone-number{
				padding-right: 77px;
			}
			/* 验证码 */
			&.code-number{
				padding-right: 202px;
			}
			/* 倒计时 */
			.count-down{
				width: 192px;
				background: transparent;
				border:0;
				/* border-left:1px solid #e5e5e5; */
				box-shadow: 1px 0 #e5e5e5 inset;
				outline: none;
				height: 100%;
				color:#ccc;
				font-size: 28px;/*px*/
				white-space: nowrap;
				position: absolute;
				right: 0;
				top:0;
				&.active{
					color:#0066cc;
				}
			}
		}
	}
	/* 设置新密码 */
	.reset-password{
		.form-group{
			padding-right: 140px;
		}
		.icon-eye{
			width: 32px;
			height: 100%;
			background:url(../../assets/icon/icon-eye2.png) no-repeat 0 center;
			background-size: 32px 20px;
			position: absolute;
			top: 0;
			right:35px;
			&.show{
				background-image: url(../../assets/icon/icon-eye.png);
			}
		}
		.icon-close{
			right:100px;
		}
	}
	/* 重置成功 */
	.reset-succeed{
		.button{
			margin-top: 0;
		}
	}
	/* 提示语 */
	.toast-tips{
		font-size: 28px;/*px*/
	}
</style>