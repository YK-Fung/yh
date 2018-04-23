<template>
    <!--底部tabbar-->
    <mt-tabbar >
        <mt-tab-item id="首页">
            <router-link to="/home">
                <div class="img"></div>
                <p>首页</p>
            </router-link>

        </mt-tab-item>

        <mt-tab-item id="分类">
            <router-link to="/category">
                <div class="img"></div>
                <p>分类</p>
            </router-link>
        </mt-tab-item>

        <mt-tab-item id="购物车">
            <router-link to="/shopCar">
                <span class="badge">{{tempNum?tempNum:shopCarNum}}</span>
                <div class="img"></div>
                <p>购物车</p>
            </router-link>
        </mt-tab-item>

        <mt-tab-item id="我的">
            <router-link to="/mine">
                <div class="img"></div>
                <p>我的</p>
            </router-link>
        </mt-tab-item>

    </mt-tabbar>
</template>

<script>
    export default {
        name: "tab-bar",
        props:{
            //购物车页面删除商品以后传值
            tempNum:{
                default:0
            }
        },
        data(){
            return{
                shopCarNum:0
            }
        },
        created(){
            //获取购物车数量
            let timeStamp = new Date().getTime();
            this.$http({
                method: 'post',
                headers: {
                    'time-stamp': timeStamp
                },
                url: this._ajaxUrl + '/shoppingcart/shoppingCartSaveController/myShoppingCartNumber'
            }).then((res) => {
                if (res.data.errorCode == 'login_0004') {
                    this.login = false;
                    //登录超时 清空cookie
                    // alert('登录超时');
                    document.cookie = 'token='
                }else if(res.data.errorCode == '0000'){
                    this.shopCarNum = res.data.data
                }
            })
        }
    }
</script>

<style lang="less" scoped>


    .mint-tabbar {
        background-color: white;
        box-shadow: 0px -1px 1px 0px rgba(229, 229, 229, 0.6); 
        height: 98px; 
        position: fixed;
        left: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        .mint-tab-item-label{
            a {
                display: inline-block;
                width: 100%;
                height: 100%;
                position: relative;
                p{
                    color: #666;
                    margin-top: 9px;
                    font-size: 26px;
                }
                .img {
                    width: 44px;
                    height: 44px;
                    margin: 0 auto;
                }
                .badge{
                    position: absolute;
                    top: -5px;
                    right: 60px;
                    display: inline-block;
                    height: 24px;/*px*/
                    padding-left: 8px;
                    padding-right: 8px;
                    line-height: 24px;/*px*/
                    text-align: center;
                    font-size: 16px;
                    color: #fff;
                    background-color: #f82222;
                    border-radius: 24px;/*px*/
                }
            }
            .router-link-active:hover{
                background: none;
            }
            .router-link-active {
                background: none;
                p {
                    color: #0066cc;
                }
            }
        }
    }


    .mint-tab-item:nth-child(1) {
        .mint-tab-item-label {
            a {
                .img {
                    background: url("../../assets/tabbar-home-normal.png") no-repeat center center;
                    background-size: contain;
                }
            }
            a.router-link-active {
                .img {
                    background: url("../../assets/tabbar-home-active.png") no-repeat center center;
                    background-size: contain;
                }
            }
        }
    }

    .mint-tab-item:nth-child(2) {
        .mint-tab-item-label {
            a {
                .img {
                    background: url("../../assets/tabbar-cate-normal.png") no-repeat center center;
                    background-size: contain;
                }
            }
            a.router-link-active {
                .img {
                    background: url("../../assets/tabbar-cate-active.png") no-repeat center center;
                    background-size: contain;
                }
            }
        }
    }

    .mint-tab-item:nth-child(3) {
        .mint-tab-item-label {
            a {
                .img {
                    background: url("../../assets/tabbar-shopcar-normal.png") no-repeat center center;
                    background-size: contain;
                }
            }
            a.router-link-active {
                .img {
                    background: url("../../assets/tabbar-shopcar-active.png") no-repeat center center;
                    background-size: contain;
                }
            }
        }
    }

    .mint-tab-item:nth-child(4) {
        .mint-tab-item-label {
            a {
                .img {
                    background: url("../../assets/tabbar-mine-normal.png") no-repeat center center;
                    background-size: contain;

                }
            }
            a.router-link-active {
                .img {
                    background: url("../../assets/tabbar-mine-active.png") no-repeat center center;
                    background-size: contain;
                }
            }
        }
    }
</style>