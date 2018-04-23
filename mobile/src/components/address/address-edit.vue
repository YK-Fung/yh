<template>
  <form class="wrap">
  	<!-- 地址信息 -->
  	<div class="infor">
  		<div class="form-group">
  			<label>收货人</label>
  			<input type="text" placeholder="请输入收货人姓名" v-model="address.addressRecipientName">
  		</div>
  		<div class="form-group">
  			<label>手机号码</label>
  			<input type="tel" placeholder="请输入手机号码" v-model="address.addressPhone">
  		</div>
  		<div class="form-group">
  			<label>所属地区</label>
  			<div class="address-view" @click="addressFn()">{{address.addressName.replace(/\-/g, '')}}</div>
  			<input class="address-input" type="text" v-model="address.addressName.replace(/\-/g, '')">
  		</div>
  		<div class="form-group">
  			<label>详细地址</label>
  			<textarea placeholder="建议您如实填写详细收货地址" v-model="address.addressDetail"></textarea>
  		</div>
  	</div>

  	<!-- 设置默认地址 -->
  	<div class="set">
			<label class="label-text">设为默认地址</label>
			<input type="checkbox" v-model="addressDefault">
			<div class="switch" 
				:class="{'active': addressDefault}"
				@click="addressDefaultFn()">
			</div>
		</div>

  	<!-- 保存 -->
  	<div class="btn-save" 
  		:class="{'active': btnSave}"
  		@click="btnSaveFn()">保存</div>

  	<!-- 弹窗-地址 -->
    <!-- <transition name="fade"> -->
      <div id="pop-shade" v-show="popShow">
        <!-- 弹窗主体 -->
        <div class="pop-main" @click.stop>
        	<div class="pop-header">所在地区</div>
        	<div class="pop-body">
        		<div class="select-view">请选择</div>
	        	<ul class="address">
	        		<li v-for="address in addressList" @click="addressFn(address.code, address.mergerName, address.zipCode)">{{address.name}}</li>
	        	</ul>
        	</div>
        </div>
      </div>
    <!-- </transition> -->
  </form>
</template>

<script>
import Vue from 'vue';
export default {
    name: "address-edit",
    data() {
      return {
        // 地址
        address: {},
      	// 弹窗-地址
      	popShow: false,
        // 地址列表
        addressList: []
      }
    },
    created() {
      // 移除不需要的keyName
      let address = JSON.stringify(this.$route.query);
      this.address = JSON.parse(address);
      this.$delete(this.address, 'createTime')
      // console.log(this.address);
    },
    computed: {
      // 默认
      addressDefault: function () {
        return this.address.isDefault ? 0 : 1;
      },
     	// 可不可以保存
    	btnSave: function () {
	    	if (this.address.addressRecipientName != '' && this.address.addressPhone != '' && this.address.addressName != '' && this.address.addressDetail != '') {
	    		return true;
	    	} else {
	    		return false;
	    	}
    	}
    },
    methods: {
    	// 地区弹窗
    	addressFn: function (parentCode = '100000', mergerName = '', zipCode) {
        let timeStamp = new Date().getTime();
        let params = {'parentCode': parentCode};
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
                url: this._ajaxUrl + '/system/area/getAreaList',
                data: aes
            }).then((res) => {
                // 省市区 
                this.address.addressProvince = mergerName.split(',')[1] ? mergerName.split(',')[1] + '-' : '';
                this.address.addressCity = mergerName.split(',')[2] ? mergerName.split(',')[2] + '-' : '';
                this.address.addressCounty = mergerName.split(',')[3] ? mergerName.split(',')[3] + '-' : '';
                // 地址拼接
                this.address.addressName = this.address.addressProvince + this.address.addressCity + this.address.addressCounty.substr(0, this.address.addressCounty.length - 1);
                if (res.data.data.length === 0) {
                  this.address.addressZip = zipCode;
                  this.popShow = false;
                } else {
                  //先清空地址列表，然后再获取对应的列表 
                  this.addressList.splice(0, this.addressList.length);
                  this.addressList.push(...res.data.data);
                  // console.log(this.addressList);
                  this.popShow = true;
                }
            })
        })
    	},
    	// 默认地址
    	addressDefaultFn: function () {
    		this.address.isDefault = this.address.isDefault ? 0 : 1;
    	},
    	// 保存
    	btnSaveFn: function () {
    		if (this.btnSave) {
          let timeStamp = new Date().getTime();
          let params = this.address;
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
                  url: this._ajaxUrl + '/customer/address/update',
                  data: aes
              }).then((res) => {
                  if (res.data.errorCode === '0000') {
                    this.$router.push({path: '/address'});
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
	display: block;
  width: 100%;
  background: #f6f6f6;
  // 地址信息
  .infor{
  	width: 100%;
  	margin-bottom: 20px;
  	background: #fff;
  }
  // 表单组
  .form-group{
  	position: relative;
  	display: flex;
  	flex-flow: row nowrap;
  	align-items: flex-start;
  	width: 100%;
  	padding: 34px 30px;
  	overflow: hidden;
  	background: #fff;
 		/*border-bottom: 1px solid #e5e5e5;*/
	  box-shadow: 0 -1px #e5e5e5 inset;
  	label{
  		width: 220px;
  		height: 44px;
  		font-size: 32px;
  		white-space: nowrap;
  		line-height: 44px;
  		color: #222;
  	}
  	input{
  		flex: 1;
  		padding: 0;
  		height: 100%;
  		font-size: 32px;
  		line-height: 1;
  		color: #222;
  		border: none;
  		outline: none;
  	}
  	.address-view{
  		flex: 1;
  		height: 44px;
  		padding-right: 22px;
  		font-size: 32px;
  		line-height: 44px;
  		color: #333;
  		background: url('../../assets/icon/icon-arrow-right.png') right center no-repeat;
		  background-size: 12px 20px;
  	}
  	.address-input{
  		display: none;
  	}
  	textarea{
  		display: inline-block;
  		flex: 1;
  		height: 160px;
  		padding: 0;
  		font-size: 32px;
  		line-height: 44px;
  		color: #666666;
  		background: url('../../assets/icon/icon-textarea.png') right bottom no-repeat;
		  background-size: 11px 11px;
  		border: none;
  		outline: none;
  		resize: none;
  	}
  }
  // 设置默认地址
  .set{
  	position: relative;
  	width: 100%;
  	padding: 30px;
  	background: #fff;
  	overflow: hidden;
 		/*border-bottom: 1px solid #e5e5e5;*/
	  box-shadow: 0 -1px #e5e5e5 inset;
  	.label-text{
  		width: 220px;
  		height: 62px;
  		font-size: 32px;
  		white-space: nowrap;
  		line-height: 62px;
  		color: #222;
  	}
  	input{
			display: none;
		}
  }
	/*滑动按钮*/
	.switch{
		position: relative;
		float: right;
		width: 110px;
		height: 60px;
		overflow: hidden;
		background: #ffffff;
		/*border: 1px solid #e5e5e5;!*no*!*/
		box-shadow: 0 0 0 1px #e5e5e5;
		border-radius: 62px;
		transition: all .2s ease-in;
		&:before{
			content: '';
			position: absolute;
			top: 0;
			left: 4px;
			display: block;
			width: 100%;
			height: 100%;
			background: #ffffff;
			border-radius: 60px;
			transition: all .2s ease-in;
		}
		&:after{
			content: '';
			position: relative;
			top: 50%;
			left: 0;
			display: block;
			width: 55px;
			height: 55px;
			background: #fff;
			border-radius: 55px;
			/*border: 1px solid #d7d7d7;!*no*!*/
			box-shadow: 0 0 0 1px #d7d7d7;
			// box-shadow: 0 0 3px 2px #d7d7d7;
			transform: translateY(-50%);
			transition: all .2s ease-in;
		};
		&.active{
			background: #53d769;
			/*border: 1px solid transparent;!*no*!*/
			box-shadow: none;
			transition: all .2s ease-in;
			&:before{
				top: 50%;
				left: 50%;
				width: 20%;
				height: 0;
				transition: all .2s ease-in;
			}
			&:after{
				left: 50px;
				// box-shadow: 0 0 3px 2px #4ab35b;
				transform: translateY(-50%);
				transition: all .2s ease-in;
			}
		}
	}
  // 保存
  .btn-save{
  	width: 690px;
  	height: 90px;
  	margin: 100px auto 0;
  	font-size: 34px;
  	text-align: center;
  	line-height: 90px;
  	color: #fff;
 		background: #dbdbdb;
  	border-radius: 10px;
  	&.active{
	  	background: #0066cc;
  	}
  }
  // 弹窗过渡动画
  .fade-enter-active, .fade-leave-active {
    transition: all .1s ease-in;
  }
  .fade-enter, .fade-leave-to{
    opacity: 1;
    .pop-main{
      transform: translateY(0%);
    }
  }
  // 弹窗-地址
  #pop-shade{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .3);
    transition: all 1s ease-in;
    // 弹窗主体
    .pop-main{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      overflow: hidden;
      background: #fff;
      transition: all .3s ease-in;
    }
    // 头部
    .pop-header{
    	width: 100%;
    	height: 80px;
    	padding: 0 30px;
    	font-size: 28px;
    	line-height: 80px;
    	color: #222;
    	background: #f6f6f6;
    }
    // 内容
    .pop-body{
    	width: 100%;
    	height: 710px;
    	overflow-y: auto;
    	font-size: 32px;
    	background: #fff;
    	/*border-top: 1px solid #e5e5e5;*/
		  box-shadow: 0 1px #e5e5e5 inset;
    }
    // 已选择
    .select-view{
    	width: 100%;
    	height: 80px;
    	padding: 0 30px;
    	line-height: 80px;
    	color: #f82222;
    }
    // 地区
    .address{
    	display: block;
    	width: 100%;
    	li{
    		display: block;
    		width: 100%;
    		height: 80px;
    		padding: 0 30px;
    		line-height: 80px;
	    	color: #222;
    		/*border-top: 1px solid #e5e5e5;*/
			  box-shadow: 0 1px #e5e5e5 inset;
    	}
    }
  }
}
</style>