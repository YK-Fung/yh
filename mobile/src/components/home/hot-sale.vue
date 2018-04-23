<template>
    <div style="height: 100%;width: 100%;overflow: hidden;background: #f6f6f6;">
        <div class="hot-sale">
            <img class="hot-sale-banner" v-lazy="bannerImg">
            <ul class="hot-sale-list">
                <li v-for="(item,index) in goodsList" :key="index">
                    <router-link :to="{path: '/goodsDetail', query: {goodsId: item.goodsId}}">
                        <!-- 商品图片 -->
                        <div class="photo"><img v-lazy="item.goodsImg"></div>
                        <!-- 商品名称 -->
                        <p class="hot-sale-list-title">{{item.goodsName}}</p>
                        <!-- 商品规格 -->
                        <p class="amount">{{item.spec}}</p>
                        <!-- 无法购买 -->
                        <p class="price-none" v-if="goodPrice(item.isLimitGoodsStatus)">{{goodPrice(item.isLimitGoodsStatus)}}</p>
                        <!-- 商品价格-->
                        <p class="price" v-else="goodPrice(item.isLimitGoodsStatus)">￥<span>{{priceInt(item.goodsProductLimitPrice)}}</span>.{{priceDec(item.goodsProductLimitPrice)}}</p>
                    </router-link>
                </li>
            </ul>
            <!-- 加载中 -->
            <div class="loading" v-show="isLoading">加载中</div>
            <div class="list-end" v-show="isEnd"> >"< 已经到底啦~</div>
        </div>
        <shopcarBtn :shopCarNum="shopCarNum"></shopcarBtn>
    </div>
</template>

<script>
    import shopcarBtn from '../subcom/shopcar-btn';

    export default {
        name: "hot-sale",
        components: {
            shopcarBtn,
        },
        data() {
            return {
                //banner图
                bannerImg: null,
                // 购物车数量
                shopCarNum:0,
                // 登录认证提示数字
                numberTip: null,
                // 商品列表
                goodsList: [],
                // 当前页码
                pageNo: 1,
                // 一页显示多少数据
                pageSize: 6,
                // 到底部
                isEnd: false,
                // 加載中
                isLoading: false,
            }
        },
        methods:{
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
            goodPrice: function(isLimitGoodsStatus) {
                switch(this.numberTip)
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
            },
            // 加载更多
            loadMore: function(){
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
                    this.pageNo ++;
                    let timeStamp = new Date().getTime();
                    let params = {'pageNo' : this.pageNo, 'pageSize' : this.pageSize, 'moduleId': '34'}
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
                            console.log(res)
                            if (res.data.errorCode == '0000') {
                                if(!res.data.data[0].goodsList){
                                    //全部数据加载结束
                                    this.isEnd = true;
                                }else{
                                    //返回结果 追加进商品列表数组
                                    this.goodsList.push(...res.data.data[0].goodsList);
                                }
                                //隐藏加载中
                                this.isLoading = false;
                            }
                        });
                    });
                }
            }
        },
        mounted() {
            window.addEventListener('scroll', this.loadMore);
        },
        //切换路由时注销滚动事件
        destroyed() {
            window.removeEventListener('scroll',this.loadMore)
        },
        created() {
            // token
            let timeStamp = new Date().getTime();
            {
                // 获取信息列表
                let params = {'pageNo': this.pageNo, 'pageSize': this.pageSize, 'moduleId': '34'};
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
                        console.log(res.data);
                        if(res.data.errorCode == '0000'){
                            //清空数组，插入新数据
                            this.numberTip = res.data.data[0].numberTip;
                            this.goodsList.splice(0,this.goodsList.length);
                            this.goodsList.push(...res.data.data[0].goodsList);
                        }
                    });
                });
            }

            //头部banner
            {
                let params = {'advTypeCode': 'mobile-hosale'};
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
                            this.bannerImg = res.data.data[0].advImg;
                        }
                    });
                });
            }

            //购物车数量
            {
                this.$http({
                    method: 'post',
                    headers: {
                        'time-stamp': timeStamp
                    },
                    url: this._ajaxUrl + '/shoppingcart/shoppingCartSaveController/myShoppingCartNumber'
                }).then((res) => {
                    console.log(res.data);
                    if (res.data.errorCode == 'login_0004') {
                        this.login = false;
                        //登录超时 清空cookie
                        // alert('登录超时');
                        document.cookie = 'token='
                    }else{
                        this.shopCarNum = res.data.data
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .hot-sale {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        text-align: center;
        .hot-sale-banner {
            width: 100%;
            height: 300px;
            margin-bottom: 16px;
            &[lazy=loading] {
                width: auto;
                height: auto;
            }
        }
        .hot-sale-list {
            width: 100%;
            overflow: hidden;
            li {
                background: white;
                width: 48.5%;
                height: 514px;
                float: left;
                margin-bottom: 16px;
                text-align: center;
                padding-top: 30px;
                .photo{
                    width: 300px;
                    height: 300px;
                    margin: 0 auto;
                    position: relative;
                    img {
                        max-width: 100%;
                        max-height: 100%;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                    }
                }
                p.hot-sale-list-title {
                    width: 60%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 28px;
                    margin: 0 auto;
                    line-height: 52px;
                    color: #222;
                }
                p.amount {
                    color: #666;
                    font-size: 24px;
                    line-height: 52px;
                }
                p.price {
                    color: red;
                    font-size: 26px;
                    line-height: 52px;
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
            li:nth-child(2n+0) {
                float: right;
            }
        }
        .list-end {
            color: #bbb;
            text-align: center;
            padding-bottom: 16px;
            font-size: 18px;
        }
        /* 加载中 */
        .loading{
            color: #bbb;
            text-align: center;
            line-height: 70px;/*px*/
            font-size: 18px;/*px*/ 
        }
    }
</style>