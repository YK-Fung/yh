<template>

    <div class="coupon" ref="$coupon">
        <div v-for="(item,index) in couponArr" :key="index" class="coupon-item"
             :style="{'background':'url('+_couponType(item).src+') no-repeat','backgroundSize':'contain'}">
            <div class="stamp" v-show="item.isReceive==1"></div>
            <div class="coupon-item-left">
                <p class="desc1"
                   :style="{'color':_couponType(item).color}">
                    满{{item.freeMoney}}元可用</p>
                <p class="desc2">{{item.couponTimeType==2&&item.goodsName?'仅限'+item.goodsName+'可用&nbsp;'+item.couponName:item.couponName}}</p>
                <p class="desc3">{{item.companyName}}</p>
                <p class="desc4">
                    有效期:{{item.couponTimeType==1?_getDate(item.couponStartTime)+'~'+_getDate(item.couponEndTime):item.validityDays+'天'}}</p>
            </div>
            <div class="coupon-item-right">
                <p class="coupon-item-price" :class="{'priceFontSize':item.couponPrice.toString().length<3}">
                    {{item.couponPrice}}</p>
                <span @click="getCoupon(item)" class="coupon-item-btn" v-if="item.isReceive==0">立即领取</span>
                <router-link :to="item.urlPath" class="coupon-item-btn" v-if="item.isReceive==1">立即使用</router-link>
            </div>
        </div>
        <p class="loading" v-show="isLoadMore">加载中</p>
    </div>

</template>

<script>
    export default {
        name: "coupon",
        data() {
            return {
                couponArr: [],
                //加载中
                isLoadMore: false,
                //数据全部加载完毕
                isEnd: false,
                pageNo: 1,
                pageSize: 5,
                totalCoupon: null,
            }
        },
        methods: {
            //加载更多
            loadmore() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                this.bottomDistance = this.$refs.$coupon.offsetHeight - document.body.offsetHeight;
                if (scrollTop >= this.bottomDistance - 30) {
                    if (this.isLoadMore || this.isEnd) return;
                    this.isLoadMore = true;
                    this.pageNo++;

                    if (this.pageNo * 5 >= this.totalCoupon) {
                        this.isEnd = true;
                    }
                    let timeStamp = new Date().getTime();
                    let params = {"pageNo": this.pageNo, "pageSize": this.pageSize};
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
                                url: this._ajaxUrl + '/coupon/index',
                                data: aes
                            }).then((res) => {
                                if (res.data.errorCode == '0000') {
                                    //加载成功
                                    this.isLoadMore = false;

                                    this.couponArr = this.couponArr.concat(res.data.data.list);

                                }
                            })
                        }
                    )
                }
            },
            _couponType(item) {
                console.log(item);
                // console.log(item.isReceive);
                if (item.couponType == 1) {
                    item.color = '#fe985b';
                    item.src = require('../../assets/coupon-store.png');
                    //店铺券跳转到店铺-所有商品
                    item.urlPath = {path: '/storeProdList', query: {storeId: item.storeId}}

                } else if (item.couponType == 2) {
                    item.color = '#fe635b';
                    item.src = require('../../assets/coupon-goods.png');
                    //商品券跳转到店铺-所有商品(只显示对应的商品)
                    item.urlPath = {
                        path: '/storeProdList',
                        query: {storeId: item.storeId, couponId: item.couponId}
                    }
                } else if (item.couponType == 0) {
                    item.color = '#53cbf7';
                    item.src = require('../../assets/coupon-platform.png');
                    //平台券跳转到搜索列表
                    item.urlPath = {path: '/search', query:{id:1,data:JSON.stringify({sortFlag:1,searchText:'',agentType:'',brandName:'',pageNo:1})}}
                }
                return item;
            },
            //获取有效期
            _getDate(date) {
                let d = new Date(date);
                let Y = d.getFullYear() + '.';
                let M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '.';
                let D = d.getDate() < 10?'0' + d.getDate():d.getDate();
                return Y + M + D;
            },
            //领取优惠券
            getCoupon(item) {
                let timeStamp = new Date().getTime();
                let params = {"couponId": item.couponId};
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
                            url: this._ajaxUrl + '/couponRecord/saveCoupon',
                            data: aes
                        }).then((res) => {
                            console.log(res.data);
                            if (res.data.errorCode == '0004') {
                                document.cookie = 'token=';
                                localStorage.removeItem('unverified');
                                this.$router.replace('/login');
                                return;
                            }
                            if (res.data.errorCode == 'login_0004') {
                                document.cookie = 'token=';
                                localStorage.removeItem('unverified');
                                this.$router.replace('/login');
                                return;
                            }
                            if (res.data.data == 1) {
                                // 领取成功
                                item.isReceive = 1;
                            } else if (res.data.data == -1) {
                                //未登录
                                alert('未登录')
                                document.cookie = 'token=';
                                localStorage.removeItem('unverified');
                                this.$router.replace('/login');
                            } else if (res.data.data == -2) {
                                alert('账号未认证')
                                //未认证
                            } else if (res.data.data == -3) {
                                alert('供应商不能领取')
                                //供应商无法领取
                            } else if (res.data.data == -5) {
                                //优惠券ID为空
                            } else if (res.data.data == -6) {
                                //其他错误
                            } else if (res.data.data == -4) {
                                //不存在该优惠券
                            } else if (res.data.data == 99) {
                                //不能重复领取
                            }


                        })
                    }
                )
            },

        },
        created() {
            let timeStamp = new Date().getTime();
            let params = {"pageNo": this.pageNo, "pageSize": this.pageSize};
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
                        url: this._ajaxUrl + '/coupon/index',
                        data: aes
                    }).then((res) => {
                        if (res.data.errorCode == '0000') {
                            // res.data.data
                            this.couponArr = res.data.data.list;
                            this.totalCoupon = res.data.data.rows;
                            //如果总个数少于等于5个,则不能加载更多
                            if(this.totalCoupon <= 5){
                                this.isEnd = true;
                            }
                            console.log(res.data);
                        }
                    })
                }
            )
        },
        mounted() {
            window.addEventListener('scroll', this.loadmore)
        },
        //切换路由时注销滚动事件
        destroyed() {
            window.removeEventListener('scroll', this.loadmore)
        },
    }
</script>

<style lang="less" scoped>

    .coupon {

        width: 100%;
        height: 100%;
        padding: 16px 25px 0 25px;
        overflow-x: hidden;
        overflow-y: auto;
        background: #f6f6f6;
        .coupon-item {
            width: 100%;
            height: 250px;
            margin-bottom: 16px;
            position: relative;
            overflow: hidden;
            .coupon-item-left {
                position: absolute;
                left: 184px;
                top: 50%;
                transform: translateY(-50%);
                .desc1 {
                    font-size: 36px;
                }
                .desc2 {
                    margin-top: 17px;
                    margin-bottom: 8px;
                    font-size: 20px;
                    color: #666;
                    width: 262px;
                    line-height: 27px;
                }
                .desc3 {
                    font-size: 20px;
                    color: #999;
                    margin-bottom: 12px;
                }
                .desc4 {
                    font-size: 16px;
                    color: #999;
                }
            }
            .coupon-item-right {
                position: absolute;
                right: 0;
                bottom: 30px;
                width: 225px;
                text-align: center;
                .coupon-item-price {
                    text-align: center;
                    font-size: 100px;
                    color: #fffefe;
                    line-height: 100px;
                }
                /*根据价格长度改变字体大小*/
                .coupon-item-price.priceFontSize {
                    font-size: 130px;
                }
                .coupon-item-btn {
                    margin-top: 26px;
                    font-size: 30px;
                    color: #fff;
                    display: inline-block;
                    width: 171px;
                    height: 48px;
                    line-height: 48px;
                    text-align: center;
                    box-shadow: 0 0 0 1px #fff;
                    border-radius: 30px;
                }

            }
            .stamp {
                width: 208px;
                height: 142px;
                position: absolute;
                right: 200px;
                bottom: 5px;
                z-index: 19;
                background: url("../../assets/coupon-get.png") no-repeat;
                background-size: contain;
            }
        }
        .loading {
            text-align: center;
            padding-bottom: 20px;
        }
    }
</style>