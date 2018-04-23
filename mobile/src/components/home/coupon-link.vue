<template>
  <div class="wrap">
	    <div class="coupon-main">
           <div class="coupon-main-logo"><img src="../../assets/icon/icon-coupon-logo.png" alt=""></div>
            <div class="company-name">广州浩诚医药有限公司</div>
            <div v-show="couponValid" class="coupon-item"
                 :style="{'background':'url('+coupon.bgSrc+') no-repeat','backgroundSize':'100% 100%'}">
                <div class="stamp" v-show="coupon.check"></div>
                <div class="coupon-item-left">
                    <p class="desc1"
                       :style="{'color':coupon.color}">
                        {{coupon.desc1}}</p>
                    <p class="desc2">{{coupon.desc2}}</p>
                    <p class="desc3">{{coupon.desc3}}</p>
                    <p class="desc4">{{coupon.desc4}}</p>
                </div>
                <div class="coupon-item-right">
                    <p class="coupon-item-price" :class="{'priceFontSize':coupon.price.length<3}">
                        {{coupon.price}}</p>
                    <span  @click="getCoupon(coupon)" class="coupon-item-btn">{{coupon.check?'立即使用':'立即领取'}}</span>
                </div>
            </div>
            <div v-show="!couponValid" class="coupon-item-invalid"></div>
        </div>
        <div class="coupon-desc">
            <p class="title"><i></i>活动说明<i></i></p>
            <p class="content">1. 点击“立即领取”按钮，领取成功后购买商品时使用，即可享受优惠。</p>
            <p class="content">2. 在药荟网-会员中心-我的优惠券，可查询已发放到账户的优惠券。</p>
            <p class="content">3. 因商品参与其它活动等原因，付款时优惠券可能无法使用，此时商品最终成交价以您实际付款时提示金额为准。</p>
            <p class="content">4. 获取、使用优惠券时如存在违规行为（作弊领取、恶意套现、虚假交易等），将取消用户领取资格、撤销违规交易且收回全部优惠券（含已使用及未使用的），必要时追究法律责任。</p>
            <p class="content">5. 请仔细核对优惠券使用期，商品价格以您当天实际支付金额为准。</p>
        </div>
  </div>
</template>

<script>
export default {
    name: "couponLink",
    data() {
      return {
          //优惠券是否失效
          couponValid:true,
          //优惠券数据
          coupon:{bgSrc:require('../../assets/coupon-store.png'),desc1:'满299元可用',desc2:'店铺商品通用促销特惠促销换惠促销特惠',desc3: '广东浩晨医药公司',desc4: '有效期:2017.09.29~2017.09.30',price: '999',check: false}
      }
    },
    methods:{
        getCoupon(item){
            item.check = true;
        }
    },
    created(){
        let type = this.coupon.bgSrc.split('coupon-')[1].substr(0,5);
        if(type == 'store'){
            this.coupon.color = '#fe985b';
        }else if(type == 'goods'){
            this.coupon.color = '#fe635b';
        }else{
            this.coupon.color = '#53cbf7';
        }



        this.token = document.cookie.split('token=')[1] ? document.cookie.split('token=')[1] : '';
        let timeStamp = new Date().getTime();
        let params = {'couponNo':'5546A8D6F47E0CD8'};
        let md5 = this._cryptojs.MD5(JSON.stringify(params));
        this.$http({
            method: 'post',
            url: this._ajaxUrl + '/encryption/aes',
            headers: {
                'data-signature': md5,
                accessToken: this.token
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
                        accessToken: this.token,
                        'time-stamp':timeStamp
                    },
                    url: this._ajaxUrl + '/coupon/index',
                    data: aes
                }).then((res) => {
                    console.log(res.data);
                    if (res.data.errorCode == '0000') {


                    }
                })
            }
        )
    }
}
</script>

<style lang="less" scoped>
.wrap{
  width: 100%;
    height: 100%;
  background: #f6f6f6;
    .coupon-main{
        width: 100%;
        height: 540px;
        background: url("../../assets/coupon-link-bg.png") no-repeat ;
        background-size: contain;
        padding: 32px 60px 0 60px;
        .coupon-main-logo{
            width: 100%;
            height: 135px;
            text-align: center;
            img{
                width: 135px;
            }
        }
        .company-name{
            text-align: center;
            margin-top: 35px;
            font-size: 32px;
            color: #fff;
            margin-bottom: 48px;
        }
        .coupon-item {
            width: 100%;
            height: 212px;
            margin-bottom: 16px;
            position: relative;
            overflow: hidden;
            .coupon-item-left {
                position: absolute;
                left: 170px;
                top: 50%;
                transform: translateY(-50%);
                .desc1 {
                    font-size: 32px;
                }
                .desc2 {
                    margin-top: 12px;
                    margin-bottom: 6px;
                    font-size: 18px;
                    color: #666;
                    width: 238px;
                    line-height: 24px;
                }
                .desc3 {
                    font-size: 18px;
                    color: #999;
                    margin-bottom: 12px;
                }
                .desc4 {
                    font-size: 14px;
                    color: #999;
                }
            }
            .coupon-item-right {
                position: absolute;
                right: 20px;
                bottom: 27px;
                display: flex;
                flex-direction: column;
                align-items: center;
                .coupon-item-price {
                    text-align: center;
                    font-size: 90px;
                    color: #fffefe;
                    line-height: 90px;
                }
                /*根据价格长度改变字体大小*/
                .coupon-item-price.priceFontSize {
                    font-size: 114px;
                }
                .coupon-item-btn {
                    margin-top: 17px;
                    font-size: 26px;
                    color: #fff;
                    display: inline-block;
                    width: 151px;
                    height: 42px;
                    line-height: 42px;
                    text-align: center;
                    box-shadow: 0 0 0 1px #fff;
                    border-radius: 30px;
                }

            }
            .stamp{
                width: 208px;
                height: 124px;
                position: absolute;
                right: 150px;
                bottom: 5px;
                z-index: 19;
                background: url("../../assets/coupon-get.png") no-repeat;
                background-size: contain;
            }
        }
        .coupon-item-invalid{
            width: 100%;
            height: 212px;
            background: url("../../assets/coupon-invalid.png") no-repeat;
            background-size: 100% 100%;

        }
    }
    .coupon-desc{
        margin-top: 16px;
        background: #fff;
        padding: 30px;
        .title{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            color: #666;
            margin-bottom: 30px;
            i{
                width: 265px;
                height: 1px;
                display: inline-block;
                background: #e5e5e5;
                margin-right: 22px;
            }
            i:nth-last-child(1){
                margin-right: 0;
                margin-left: 22px;
            }
        }
        .content{
            font-size: 20px;
            color: #666;
            line-height: 36px;
        }
    }
}
</style>