<template>
    <div class="search">
        <!--顶部搜索栏-->
        <div class="search-bar">
            <header class="mint-header">
                <div class="search-in">
                    <i></i>
                    <div>
                        <input class="search-input" type="search" autofocus
                               placeholder="搜索本店商品" v-model="content">
                        <button @click="_submit(content)">搜索</button>
                    </div>
                </div>
            </header>
            <!--搜索框助记码-->
            <ul ref="dropList" class="drop-list" v-show="content&&isSearch">
                <li @click="_submit(item)" v-for="(item,index) in mnemonic" :key="index">{{item}}</li>
            </ul>
        </div>

        <!--筛选条-->
        <ul v-show="!isSearch" class="filter-bar">
            <li @click="selectTab(nav,0)" :class="{active:nav[0].tap}"><span>综合</span>
            </li>
            <li @click="selectTab(nav,1)" :class="{active:nav[1].tap,iconRe:nav[1].icon}">
                <span>销量</span>
                <i></i>
            </li>
            <li @click="selectTab(nav,2)" :class="{active:nav[2].tap,iconRe:nav[2].icon}">
                <span>价格</span>
                <i></i>
            </li>
            <li class="filter" @click="popupSlider = true" :class="{active:nav[3].tap}">
                <span>筛选</span>
                <i></i>
            </li>
        </ul>

        <!--搜索列表-->
        <ul v-show="!isSearch" class="search-list" ref="searchList">
            <li v-show="listArr.length>0&&!load" v-for="(item,index) in listArr" :key='index'>
                <!--<router-link :to="{path:'/goodsDetail',query:{goodsId:item.goodsId}}">-->
                <!--<router-link :to="{path:(item.goodsInfoAdded==1&&item.productLotAdded==1),query:{goodsId:item.goodsId}}">-->
                <a @click.prevent="goto(item)">
                    <div class="list-left">
                        <img v-lazy="item.goodsImg" alt="">
                    </div>
                    <div class="list-right">
                        <h6>{{item.goodsName}}</h6>
                        <p class="desc">{{item.spec}}</p>
                        <p class="desc">{{item.producer}}</p>
                        <p class="desc">{{item.companyName}}</p>
                        <p class="price"
                           v-if="(state==2)&&((item.buyFlag==1&&item.goodsInfoAdded==1&&item.productLotAdded==1)?true:false)">
                            ￥<span>{{priceInt(item)}}</span>.{{priceDec(item)}}</p>
                        <p class="price" v-if="(item.goodsInfoAdded==1&&item.productLotAdded==1)?false:true">商品已下架</p>
                        <p class="price"
                           v-if="(state==2)&&(item.buyFlag==0)&&(item.goodsInfoAdded==1&&item.productLotAdded==1)&&item.isRangeAddress">定向供应</p>
                        <p class="price"
                           v-if="(state==2)&&(item.buyFlag==0)&&(item.goodsInfoAdded==1&&item.productLotAdded==1)&&item.isOutBusinessScope">超出经营范围</p>
                        <p class="price" v-if="(state==0)&&((item.goodsInfoAdded==1&&item.productLotAdded==1)?true:false)">
                            登录可见</p>
                        <p class="price" v-if="(state==1)&&((item.goodsInfoAdded==1&&item.productLotAdded==1)?true:false)">
                            认证可见</p>
                    </div>
                </a>
                <!--</router-link>-->
                <!--未登录状态和登陆后商品已上架才显示按钮-->
                <div class="shopcar" v-show="(item.goodsInfoAdded==1&&item.productLotAdded==1)?true:false"
                     @click="showBuyPanel(item)"></div>
            </li>
            <!--搜索无结果-->
            <div v-show="listArr.length==0&&!load" class="search-none"></div>
            <!--页面加载中-->
            <div v-show="load" class="list-loading"></div>
        </ul>
        <p class="loading" v-show="isLoadMore">加载中</p>
        <p class="loading" v-show="isEnd&&listArr.length>0"> >"< 已经到底啦~</p>

        <!--筛选面板-->
        <div class="filter-out">
            <mt-popup
                    v-model="popupSlider"
                    position="right">
                <!--筛选面板-->
                <div ref="filterPanel" @touchmove.prevent v-show="!allBrandListShow" class="filter-panel">

                    <div>
                        <p>品牌</p>
                        <ul>
                            <li @click="listCheck(item)" :class="{'filter-brand-select':item.check}"
                                class="filter-brand" v-for="(item,index) in filterPanelArr.brandList">
                                <span>{{item.brandName}}</span>
                            </li>
                            <li @click="allBrandList('品牌')" class="filter-brand all-brand">全部品牌<i></i></li>
                        </ul>
                    </div>
                    <div>
                        <p>剂型</p>
                        <ul>
                            <li @click="listCheck(item)" :class="{'filter-brand-select':item.check}"
                                class="filter-brand" v-for="(item,index) in filterPanelArr.agrentList">
                                <span>{{item.agentTypeName}}</span>
                            </li>
                            <li @click="allBrandList('剂型')" class="filter-brand all-brand">全部剂型<i></i></li>
                        </ul>
                    </div>
                    <div class="btn-group">
                        <div @click="reset">重置</div>
                        <div @click="popupSlider=false">完成</div>
                    </div>
                </div>

                <!--全部品牌列表的头部-->
                <div v-show="allBrandListShow" class="index-list-header">
                    <span @click="back" class="back"><i></i>返回</span>
                    <span class="title">{{filterType}}</span>
                    <span @click="confirm" class="confirm">确定</span>
                </div>


                <!--全部品牌列表-->
                <mt-index-list v-show="allBrandListShow&&filterType=='品牌'">
                    <mt-index-section v-for="(item,index) in secondBrandArr" :index="item[0].id" :key="index">
                        <div class="brand-item" @click="listCheck(list)" v-for="(list,$index) in item"
                             v-if="list.brandName" :key="$index">
                            <mt-cell :title="list.brandName">
                                <i v-show="list.check"></i>
                            </mt-cell>
                        </div>
                    </mt-index-section>
                </mt-index-list>

                <!--全部剂型列表-->
                <mt-index-list v-show="allBrandListShow&&filterType=='剂型'">
                    <mt-index-section v-for="(item,index) in secondAgentArr" :index="item[0].id" :key="index">
                        <div class="brand-item" @click="listCheck(list)" v-for="(list,$index) in item"
                             v-if="list.agentTypeName" :key="$index">
                            <mt-cell :title="list.agentTypeName">
                                <i v-show="list.check"></i>
                            </mt-cell>
                        </div>
                    </mt-index-section>
                </mt-index-list>

            </mt-popup>
        </div>

        <div class="buy-panel">
            <!--购买面板-->
            <mt-popup
                    v-model="popupVisible"
                    position="bottom">
                <div @touchmove.prevent>
                    <div class="title">
                        <span>{{buyPopCtn.companyName}}</span>
                        <i class="close" @click="popupVisible=false"></i>
                    </div>
                    <div class="desc">
                        <div>
                            <p>商品名称</p>
                            <p>{{buyPopCtn.goodsName}}&nbsp;&nbsp;&nbsp;{{buyPopCtn.spec}}</p>
                        </div>
                        <div>
                            <p>生产厂家</p>
                            <p>{{buyPopCtn.producer}}</p>
                        </div>
                        <div>
                            <p>批准文号</p>
                            <p>{{buyPopCtn.approvalNumber}}</p>
                        </div>
                        <div>
                            <p>件装量</p>
                            <p>{{buyPopCtn.pieceLoading}}{{buyPopCtn.goodsDeno?buyPopCtn.goodsDeno:'盒'}}/件</p>
                        </div>
                    </div>

                    <!--购买选项-->
                    <div class="option">
                        <div class="section">
                            <div class="left"><span>采购方式:</span></div>
                            <div class="right">
                        <span v-for="(item,index) in buyPopCtn.buyType" :key="index"
                              @click="optionCheck(buyPopCtn.buyType,item)"
                              :class="{'option-check':item.check}">{{item.name}}<i
                                v-show="item.check"></i></span>
                            </div>
                        </div>
                        <div class="section">
                            <div class="left left-center"><span>批次:</span></div>
                            <div class="right right-center">
                                <span class="option-check">{{buyPopCtn.goodsProductLotCode}}<i v-show="true"></i></span>
                                <p class="limit-date">(生产日期:{{prodEndDate(buyPopCtn.goodsProductLotProductionDate)}}
                                    有效期至{{prodEndDate(buyPopCtn.goodsProductLotEndDate)}})</p>
                            </div>
                        </div>

                        <div class="section">
                            <div class="left left-bottom"><span>采购数量:</span></div>
                            <div class="right">
                                <div class="num-btn">
                                    <span class="sub" @click="subNum">-</span>
                                    <input class="num" type="tel" v-model="buyNum">
                                    <span class="add" @click="addNum">+</span>
                                </div>
                                <span class="box">{{buyPopCtn.unit}}</span>
                                <p class="stock">当前库存量:{{buyPopCtn.stock}}{{buyPopCtn.unit}}<span class="stock-desc">{{minimum}}{{buyPopCtn.unit}}起</span>
                                </p>
                            </div>
                        </div>

                        <div class="section">
                            <div class="left left-bottom"><span>物流费用:</span></div>
                            <div class="right logistics" v-if="(state==2)&&((buyFlag==1&&buyPopCtn.goodsInfoAdded==1&&buyPopCtn.productLotAdded==1)?true:false)">
                                订单起配金额需满<div class="price-tip">¥{{logisticsInfo.storeMinimumMoney}}</div>元&nbsp;<div class="price-tip" v-show="(price*buyNum)>=logisticsInfo.storeMinimumMoney">已满足条件</div>；订单满<div class="price-tip">¥{{logisticsInfo.freeMoney}}</div>元免运费<div v-show="!((price*buyNum)>=logisticsInfo.freeMoney)">，不满收取<div class="price-tip">¥{{logisticsInfo.collectMoney}}</div>元运费</div><div class="price-tip" v-show="(price*buyNum)>=logisticsInfo.freeMoney">&nbsp;已满足条件</div>
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <div class="footer-left">
                            <router-link :to="{path:'/storeDetail',query:{storeId:buyPopCtn.storeId}}" class="store">
                                <div>
                                    <i></i>
                                    <p>进入店铺</p>
                                </div>
                            </router-link>
                            <router-link :to="state==0?'/login':'/shopCar'" class="shop-car">
                                <div>
                                    <i><span ref="badge" class="badge"
                                             :class="{'animate':animate}">{{shopCarNum}}</span></i>
                                    <p>购物车</p>
                                </div>
                            </router-link>
                        </div>
                        <div class="footer-right">
                            <div class="add-shop-car" :class="{'forbid-buy':state==1||(buyFlag==0&&(state==2))}"
                                 @click="state==2?addShopcar(0):(state==0?$router.replace('/login'):'')">加入购物车
                            </div>
                            <a :class="{'forbid-buy':state==1||(buyFlag==0&&(state==2))}" @click.prevent="buyNow()"
                               class="buy-now">立即采购</a>
                        </div>
                    </div>
                </div>
            </mt-popup>
        </div>

        <!--圆形悬浮的购物车按钮-->
        <shopcarBtn v-show="!isSearch" :shopCarNum="shopCarNum"></shopcarBtn>
    </div>
</template>

<script>
    import shopcarBtn from '../subcom/shopcar-btn';
    import {Toast} from 'mint-ui';
    import Vue from 'vue';

    export default {
        name: "search",
        components: {
            shopcarBtn
        },
        data() {
            return {
                load:false,
                //账号状态
                state:0,
                //价格
                price:0,
                //物流费用信息
                logisticsInfo:{},
                isSearch:false,
                //输入框内容
                content: '',
                //助记码
                mnemonic: [],
                //搜索内容
                tempCtn: '',
                //筛选类型
                filterType: '',
                searchNavShow: true,
                //筛选面板隐藏与显示
                popupSlider: false,
                //全部品牌列表显示与隐藏
                allBrandListShow: false,
                //筛选面板对应的品牌与剂型
                filterPanelArr: {},
                //首字母对应的品牌
                secondBrandArr: [],
                //首字母对应的剂型
                secondAgentArr: [],
                //一级品牌筛选选中的内容
                firstBrand: '',
                //一级剂型筛选选中的内容
                firstAgent: '',
                //筛选条切换属性
                nav: [
                    {tap: true, icon: false},
                    {tap: false, icon: false},
                    {tap: false, icon: false},
                    {tap: false, icon: false}
                ],
                //定向供应0 可以购买1
                buyFlag: 0,
                //最低购买数量
                minimum: 0,
                buyNum: 0,
                //加载中
                isLoadMore: false,
                //数据全部加载完毕
                isEnd: false,
                totalPages: null,
                //搜索数据的请求体
                searchParams: null,
                //登录状态
                // login: document.cookie.split('token=')[1] ? true : false,
                //购物车数量
                shopCarNum: 0,
                //动画状态
                animate: false,
                //购买面板内容
                // buyPopCtn:{buyType:[{name: '', check: null}],goodsProductLotCode:'',unit:[{deno:''}]},
                buyPopCtn: {},
                listArr: [],
                popupVisible: false,
                scrollTop: 0,
            }
        },
        methods: {
            //重置
            reset(){
                if(this.firstBrand){
                    this.filterPanelArr.brandList.forEach(function (value,index) {
                        if(value.check){
                            value.check = false
                        }
                    });
                    this.firstBrand = ''
                }
                if(this.firstAgent){
                    this.filterPanelArr.agrentList.forEach(function (value,index) {
                        if(value.check){
                            value.check = false
                        }
                    });
                    this.firstAgent = ''
                }
            },
            //提交搜索
            _submit(ctn){
                this.isSearch = false;
                this.firstAgent = '';
                this.firstBrand = '';
                this.nav[0].tap = true;
                this.nav[1].tap = false;
                this.nav[1].icon = false;
                this.nav[2].tap = false;
                this.nav[2].icon = false;
                this.nav[3].tap = false;
                this.tempCtn = ctn;
                this.searchParams = {
                        sortFlag: 1,
                        searchText: this.tempCtn,
                        agentType: this.firstAgent,
                        brandName: this.firstBrand,
                        storeId:this.$route.query.storeId,
                        pageNo: 1
                    };
                this._ajaxFn(this.searchParams)
            },
            //点击返回按钮
            back() {
                this.allBrandListShow = false;
            },
            //选中品牌剂型的某个条目
            listCheck(item) {
                Vue.set(item, 'check', !item.check);
                if (item.brandName) {
                    if (item.check) {
                        this.firstBrand += item.brandName + ','
                    } else {
                        this.firstBrand = this.firstBrand.split(item.brandName + ',').join('')
                    }
                } else if (item.agentTypeName) {
                    if (item.check) {
                        this.firstAgent += item.agentTypeName + ','
                    } else {
                        this.firstAgent = this.firstAgent.split(item.agentTypeName + ',').join('')
                    }
                }
            },
            //点击全部品牌或剂型
            allBrandList(filterType) {
                this.filterType = filterType;
                this.allBrandListShow = true;

                //有数据只请求一次
                // if (this.filterType == '品牌' && this.secondBrandArr.length > 0) {
                //     return;
                // } else if (this.filterType == '剂型' && this.secondAgentArr.length > 0) {
                //     return;
                // }

                let timeStamp = new Date().getTime();
                let url = filterType == '品牌' ? '/index/selectGoodsBrandAllInfo' : '/index/selectGoodsAgentTypeAllInfo';
                let params = {'searchText':this.tempCtn};
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
                                'time-stamp': timeStamp
                            },
                            url: this._ajaxUrl + url,
                            data: aes
                        }).then((res) => {
                            console.log(res.data.data.list[0]);
                            if (res.data.errorCode == '0000') {
                                if (filterType == '品牌') {
                                    this.secondBrandArr = res.data.data.list[0].brandList;
                                } else {
                                    this.secondAgentArr = res.data.data.list[0].agrentList;
                                }
                            }
                        })
                    }
                );
            },
            //全部品牌点击确定
            confirm() {
                this.popupSlider = false;
            },
            //筛选条样式切换
            selectTab(item, index) {
                let sortFlag;
                if (item[index].icon) {
                    item[index].icon = !item[index].icon;
                } else {
                    this.nav.forEach(function (value) {
                        value.tap = false;
                        value.icon = false;
                    });
                    item[index].tap = true;
                    item[index].icon = !item[index].icon;
                }
                //排序标识
                if (index == 0) {
                    sortFlag = 1;
                } else if (index == 1) {
                    sortFlag = item[index].icon ? 2 : 3;
                } else {
                    sortFlag = item[index].icon ? 4 : 5;
                }
                //发请求
                this.searchParams =  {
                    sortFlag: sortFlag,
                    searchText: this.tempCtn,
                    agentType: this.firstAgent,
                    brandName: this.firstBrand,
                    storeId:this.$route.query.storeId,
                    pageNo: 1
                };
                this._ajaxFn(this.searchParams)
            },
            //立即采购
            buyNow() {
                if (this.state) {
                    //已登录
                    if (this.buyFlag == 1) {
                        //可以购买
                        this.addShopcar(1)
                    } else {
                        //不可以购买
                    }
                } else if(this.state == 0) {
                    //未登录就跳去登录
                    this.$router.replace('/login')
                }
            },
            //商品上架跳转
            goto(item) {
                if ((item.goodsInfoAdded == 1 && item.productLotAdded == 1)) {
                    //商品已上架可以跳转到详情页
                    this.$router.push({path: '/goodsDetail', query: {goodsId: item.goodsId}})
                } else {
                    //商品已下架不可以跳转

                }
            },
            //获取产品有效期
            prodEndDate(timeStamp) {
                let date = new Date(timeStamp);
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                return Y + M + D
            },
            //购买面板点击选项
            optionCheck(type, item) {
                if (item.check) {
                    return
                }
                if (item.name == '拆零') {
                    this.minimum = this.buyPopCtn.openMinmum ? this.buyPopCtn.openMinmum : Math.ceil(this.buyPopCtn.openMinmumPrice / this.buyPopCtn.openMoney);
                    this.buyNum = this.minimum;
                    this.buyPopCtn.unit = this.buyPopCtn.goodsDeno ? this.buyPopCtn.goodsDeno : '盒';
                    this.buyPopCtn.stock = this.buyPopCtn.goodsProductLotWareStock - this.buyPopCtn.orderLockStock
                } else {
                    this.minimum = this.buyPopCtn.completeMinmum ? this.buyPopCtn.completeMinmum : Math.ceil(this.buyPopCtn.completeMinmumPrice / this.buyPopCtn.completeMoney);
                    this.buyNum = this.minimum;
                    this.buyPopCtn.unit = '件';
                    this.buyPopCtn.stock = Math.floor((this.buyPopCtn.goodsProductLotWareStock - this.buyPopCtn.orderLockStock) / this.buyPopCtn.pieceLoading);
                }
                //改变样式
                for (let i = 0; i < type.length; i++) {
                    type[i].check = false;
                }
                item.check = true;
            },
            subNum() {
                if (this.buyNum <= 0) {
                    return;
                }
                this.buyNum--;
            },
            addNum() {
                this.buyNum++;
            },
            //加载更多
            loadmore() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                this.bottomDistance = this.$refs.searchList.offsetHeight - document.body.offsetHeight;
                if (scrollTop >= this.bottomDistance - 30) {
                    if (this.isLoadMore || this.isEnd) return;
                    this.isLoadMore = true;
                    this.searchParams.pageNo++;
                    if (this.searchParams.pageNo >= this.totalPages) {
                        this.isEnd = true;
                    }

                    console.log(this.searchParams);
                    let timeStamp = new Date().getTime();
                    let md5 = this._cryptojs.MD5(JSON.stringify(this.searchParams));
                    this.$http({
                        method: 'post',
                        url: this._ajaxUrl + '/encryption/aes',
                        headers: {
                            'data-signature': md5,
                        },
                        data: {
                            "timeStamp": timeStamp,
                            "requestBody": JSON.stringify(this.searchParams)
                        }
                    }).then((res) => {
                            let aes = res.data.data.aesRequestBody;
                            this.$http({
                                method: 'post',
                                headers: {
                                    'data-signature': md5,
                                    'time-stamp': timeStamp
                                },
                                url: this._ajaxUrl + '/index/searchGoods',
                                data: aes
                            }).then((res) => {
                                if (res.data.errorCode == '0000') {
                                    console.log(res.data.data);

                                    //加载成功
                                    this.isLoadMore = false;
                                    this.listArr = this.listArr.concat(res.data.data.goodsItemList);
                                }
                            })
                        }
                    )
                }
            },
            priceInt(item) {
                if (item.goodsSaleChanne == 1) {
                    return item.completeMoney.toString().split('.')[0];
                } else if (item.goodsSaleChanne == 2 || item.goodsSaleChanne == 3) {
                    return item.openMoney.toString().split('.')[0];
                }
            },
            priceDec(item) {
                if (item.goodsSaleChanne == 1) {
                    if (item.completeMoney.toString().indexOf('.') == -1) {
                        return '00';
                    } else {
                        return item.completeMoney.toString().split('.')[1].length == 1 ? item.completeMoney.toString().split('.')[1] + '0' : item.completeMoney.toString().split('.')[1];
                    }
                } else if (item.goodsSaleChanne == 2 || item.goodsSaleChanne == 3) {
                    if (item.openMoney.toString().indexOf('.') == -1) {
                        return '00';
                    } else {
                        return item.openMoney.toString().split('.')[1].length == 1 ? item.openMoney.toString().split('.')[1] + '0' : item.openMoney.toString().split('.')[1];
                    }
                }
            },
            _ajaxFn(data) {
                this.load = true;
                console.log(data);
                this.$router.replace({query:{title:this.$route.query.title,storeId:this.$route.query.storeId,data:JSON.stringify(data)}});
                this.isEnd = false;
                let timeStamp = new Date().getTime();
                let md5 = this._cryptojs.MD5(JSON.stringify(data));
                this.$http({
                    method: 'post',
                    url: this._ajaxUrl + '/encryption/aes',
                    headers: {
                        'data-signature': md5,
                    },
                    data: {
                        "timeStamp": timeStamp,
                        "requestBody": JSON.stringify(data)
                    }
                }).then((res) => {
                        let aes = res.data.data.aesRequestBody;

                        this.$http({
                            method: 'post',
                            headers: {
                                'data-signature': md5,
                                'time-stamp': timeStamp
                            },
                            url: this._ajaxUrl + '/index/searchGoods',
                            data: aes
                        }).then((res) => {
                            console.log(res.data);
                            this.state = res.data.data.state;
                            this.listArr = res.data.data.goodsItemList;
                            this.load = false;
                            this.totalPages = res.data.data.totalPages;
                            //如果总页数少于等于1页,则不能加载更多
                            if (this.totalPages <= 1) {
                                this.isEnd = true;
                            }
                        })
                    }
                );
            },
            //弹出购买窗口
            showBuyPanel(item) {
                this.popupVisible = true;
                this.buyPopCtn = item;
                this.buyFlag = item.buyFlag;
                if (item.goodsSaleChanne == 1) {
                    //价格
                    this.price = this.buyPopCtn.completeMoney;
                    //最小起订量
                    this.minimum = this.buyPopCtn.completeMinmum ? this.buyPopCtn.completeMinmum : Math.ceil(this.buyPopCtn.completeMinmumPrice / this.buyPopCtn.completeMoney);
                    //采购数量输入框默认显示的数量
                    this.buyNum = this.minimum;
                    //拆零整件选项
                    Vue.set(this.buyPopCtn, 'buyType', [{name: '整件', check: true}]);
                    //结算单位
                    Vue.set(this.buyPopCtn, 'unit', '件');
                    //库存量
                    Vue.set(this.buyPopCtn, 'stock', Math.floor((item.goodsProductLotWareStock - item.orderLockStock) / item.pieceLoading));
                } else {
                    //价格
                    this.price = this.buyPopCtn.openMoney;
                    //最小起订量
                    this.minimum = this.buyPopCtn.openMinmum ? this.buyPopCtn.openMinmum : Math.ceil(this.buyPopCtn.openMinmumPrice / this.buyPopCtn.openMoney);
                    //采购数量输入框默认显示的数量
                    this.buyNum = this.minimum;
                    //结算单位
                    Vue.set(this.buyPopCtn, 'unit', item.goodsDeno ? item.goodsDeno : '盒');
                    //库存量
                    Vue.set(this.buyPopCtn, 'stock', item.goodsProductLotWareStock - item.orderLockStock);
                    if (item.goodsSaleChanne == 2) {
                        //拆零整件选项
                        Vue.set(this.buyPopCtn, 'buyType', [{name: '拆零', check: true}]);
                    } else {
                        //拆零整件选项
                        Vue.set(this.buyPopCtn, 'buyType', [{name: '拆零', check: true}, {name: '整件', check: false}]);
                    }
                }

                //获取物流费用信息
                let timeStamp = new Date().getTime();
                let params = {"goodsId": item.goodsId};
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
                }).then((res)=>{
                    let aes = res.data.data.aesRequestBody;
                    this.$http({
                        method: 'post',
                        headers: {
                            'data-signature': md5,
                            'time-stamp':timeStamp
                        },
                        url: this._ajaxUrl + '/goods/goodsSaveController/selectShoppingGoodsProductDetail',
                        data: aes
                    }).then((res)=>{
                        console.log(res.data.data.resultBean.thirdStoreInfoAll);
                        this.logisticsInfo = res.data.data.resultBean.thirdStoreInfoAll
                    })
                })
            },
            //加入购物车
            addShopcar(num) {
                if (this.animate) {
                    //没做完动画不执行代码
                    return
                }
                if(num==1&&((this.price*this.buyNum)<this.logisticsInfo.storeMinimumMoney)){
                    //未满店铺起订金额
                    Toast({
                        message: '订单起订金额需满￥'+this.logisticsInfo.storeMinimumMoney+'元',
                        position: 'bottom',
                        duration: 3000,
                        className: 'store-minimum-money'
                    });
                    return
                }
                let type;
                for (let i = 0; i < this.buyPopCtn.buyType.length; i++) {
                    if (this.buyPopCtn.buyType[i].check) {
                        if (this.buyPopCtn.buyType[i].name == '拆零') {
                            type = 'open'
                        } else {
                            type = 'complete'
                        }
                    }
                }
                let params = {
                    goodsId: this.buyPopCtn.goodsId,
                    goodsNum: this.buyNum,
                    goodsProductLotCode: this.buyPopCtn.goodsProductLotCode,
                    shoppingCartType: num,
                    purchase: type
                };
                let timeStamp = new Date().getTime();
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
                                'time-stamp': timeStamp
                            },
                            url: this._ajaxUrl + '/shoppingcart/shoppingCartSaveController/saveShoppingCartGoodsInfo',
                            data: aes
                        }).then((res) => {
                            console.log(res.data);
                            if (res.data.errorCode == 'login_0004') {
                                //登录超时 清空cookie
                                alert('登录超时');
                                document.cookie = 'token=';
                                localStorage.removeItem('unverified');
                                this.state = 0;
                                return
                            }
                            if (res.data.errorCode == 'store_0001') {
                                //定向供应
                                return
                            }
                            if (res.data.data.numberTip == 100) {
                                if (num == 0) {
                                    //加入购物车
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
                                            this.state = 0;
                                            //登录超时 清空cookie
                                            // alert('登录超时');
                                            document.cookie = 'token=';
                                            localStorage.removeItem('unverified');
                                        }else{
                                            this.shopCarNum = res.data.data;
                                            Toast({
                                                message: '添加成功',
                                                position: 'bottom',
                                                duration: 3000,
                                                className: 'add-shop-car'
                                            });
                                            //做动画
                                            this.animate = true;
                                        }
                                    });
                                } else {
                                    //立即购买
                                    //获取购物车信息
                                    this.$router.push({
                                        path: '/orderSubmit',
                                        query: {
                                            'shoppingIds': res.data.data.objectBean.shoppingCartId
                                        }
                                    });
                                }
                            }
                            else if(res.data.data.numberTip == -1){
                                Toast({
                                    message: '库存不足',
                                    position: 'bottom',
                                    duration: 3000,
                                    className: 'add-shop-car'
                                });
                            }
                        })
                    }
                );

            }
        },
        created() {
            if(JSON.parse(this.$route.query.data).sortFlag == 1){
                this.nav =  [
                    {tap: true, icon: false},
                    {tap: false, icon: false},
                    {tap: false, icon: false},
                    {tap: false, icon: false}
                ]
            }else if(JSON.parse(this.$route.query.data).sortFlag == 2){
                this.nav =  [
                    {tap: false, icon: false},
                    {tap: true, icon: true},
                    {tap: false, icon: false},
                    {tap: false, icon: false}
                ]
            }else if(JSON.parse(this.$route.query.data).sortFlag == 3){
                this.nav =  [
                    {tap: false, icon: false},
                    {tap: true, icon: false},
                    {tap: false, icon: false},
                    {tap: false, icon: false}
                ]
            }else if(JSON.parse(this.$route.query.data).sortFlag == 4){
                this.nav =  [
                    {tap: false, icon: false},
                    {tap: false, icon: false},
                    {tap: true, icon: true},
                    {tap: false, icon: false}
                ]
            }else {
                this.nav =  [
                    {tap: false, icon: false},
                    {tap: false, icon: false},
                    {tap: true, icon: false},
                    {tap: false, icon: false}
                ]
            }
            //获取购物车信息
            let timeStamp = new Date().getTime();
            //获取购物车数量
            this.$http({
                method: 'post',
                headers: {
                    'time-stamp': timeStamp
                },
                url: this._ajaxUrl + '/shoppingcart/shoppingCartSaveController/myShoppingCartNumber'
            }).then((res) => {
                console.log(res.data);
                if (res.data.errorCode == 'login_0004') {
                    this.state = 0;
                    //登录超时 清空cookie
                    // alert('登录超时');
                    document.cookie = 'token=';
                    localStorage.removeItem('unverified');
                }else{
                    this.shopCarNum = res.data.data
                }
            })
        },
        mounted() {
            window.addEventListener('scroll', this.loadmore);
            this.$refs.filterPanel.style.height = document.body.offsetHeight + 'px';
            this.$refs.dropList.style.height = document.body.offsetHeight + 'px';

            this.searchParams = JSON.parse(this.$route.query.data);
            this.tempCtn = this.searchParams.searchText;
            this.firstBrand = this.searchParams.brandName;
            this.firstAgent = this.searchParams.agentType;
            this._ajaxFn(this.searchParams);

            let _this = this;
            this.$refs.badge.addEventListener("webkitAnimationEnd", function () {
                _this.animate = false;
            })
        },
        //切换路由时注销滚动事件
        destroyed() {
            window.removeEventListener('scroll', this.loadmore)
        },
        watch: {
            content(newV) {
                if(newV){
                    this.isSearch = true;
                    //获取助记码
                    let params = {searchText: newV};
                    let timeStamp = new Date().getTime();
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
                                    'time-stamp': timeStamp
                                },
                                url: this._ajaxUrl + '/index/esSearchGoodsMnemonicCode',
                                data: aes
                            }).then((res) => {
                                console.log(res.data);
                                //搜索到数据
                                this.mnemonic = res.data.data.list;

                            })
                        }
                    )
                }else{
                    this.isSearch = false
                }

            },
            popupVisible(newV, oldV) {
                if (!newV) {
                    this.buyPopCtn = {}
                }
            },
            popupSlider(newV, oldV) {
                if (!newV) {
                    //关闭筛选面板
                    this.allBrandListShow = false;

                    //发请求
                    this.searchParams =  {
                        sortFlag: 1,
                        searchText: this.tempCtn,
                        agentType: this.firstAgent,
                        brandName: this.firstBrand,
                        storeId:this.$route.query.storeId,
                        pageNo: 1
                    };

                    this._ajaxFn(this.searchParams);
                    this.nav[0].tap = true;
                    this.nav[1].tap = false;
                    this.nav[1].icon = false;
                    this.nav[2].tap = false;
                    this.nav[2].icon = false;
                    this.nav[3].tap = true;

                } else {
                    this.firstAgent = '';
                    this.firstBrand = '';
                    //一级筛选项只请求一次
                    // if (this.filterPanelArr.brandList) {
                    //     return;
                    // }
                    //展开一级筛选面板请求数据
                    let timeStamp = new Date().getTime();
                    let params = {'searchText':this.tempCtn};
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
                                    'time-stamp': timeStamp
                                },
                                url: this._ajaxUrl + '/index/selectGoodsBrandAndAgentType',
                                data: aes
                            }).then((res) => {
                                console.log(res.data.data.list[0]);
                                if (res.data.errorCode == '0000') {
                                    this.filterPanelArr = res.data.data.list[0]
                                }
                            })
                        }
                    );
                }
            },
            buyNum(newV) {
                if (newV-0 <= this.minimum-0) {
                    this.buyNum = this.minimum
                } else if (newV-0 >= this.buyPopCtn.stock-0) {
                    this.buyNum = this.buyPopCtn.stock
                }
            },
            allBrandListShow(newV) {
                if (newV) {
                    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                    document.body.className = 'forbid-scroll';
                    this.$refs.searchList.style.transform = 'translateY(' + (-this.scrollTop) + 'px)'
                } else {
                    document.body.className = '';
                    this.$refs.searchList.style.transform = '';
                    window.scrollTo(0, this.scrollTop);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .search {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #f6f6f6;

        .search-bar{
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
            .mint-header {
                height: 88px;
                background: white;
                /*border-bottom: 1px solid #ddd;*/
                box-shadow: 0 -1px  #ddd inset;
                display: flex;
                justify-content: center;
                align-items: center;

                .search-in {

                    width: 95%;
                    position: relative;
                    i {
                        display: inline-block;
                        width: 28px;
                        height: 28px;
                        background: url("../../assets/search-grey.png") no-repeat;
                        background-size: contain;
                        position: absolute;
                        left: 30px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    div {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        width: 100%;
                        input.focus {
                            width: 80%;
                        }
                        input {
                            border-radius: 120px;
                            outline: none;
                            border: none;
                            background: #f2f2f2;
                            width: 100%;
                            height: 64px;
                            line-height: 64px;
                            padding-left: 70px;
                            font-size: 28px;
                        }
                        button {
                            border-radius: 8px;
                            margin-left: 34px;
                            width: 96px;
                            height: 48px;
                            background: #0066cc;
                            font-size: 24px;
                            color: #fff;
                            border: none;
                        }
                    }
                }
            }
            .drop-list {
                width: 100%;
                padding: 0 30px;
                background: #fff;
                overflow-y: auto;
                li {
                    display: block;
                    box-shadow: 0 -1px 0 0 #ddd inset;
                    height: 88px;
                    line-height: 90px; /*px*/
                    color: #333;
                    font-size: 28px;
                }
            }
        }


        .search-list {
            padding-top: 192px;
            li {
                background: white;
                height: 264px;
                box-shadow: 0 -1px  #ddd inset;
                position: relative;
                a {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    .list-left {
                        flex: 0.8;
                        padding: 30px;
                        display: flex;
                        justify-content: center;

                        img {
                            width: 100%;
                        }
                    }
                    .list-right {
                        flex: 2;
                        h6 {
                            max-width: 400px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            margin: 35px 0 13px 0;
                            font-size: 28px;
                            color: #222;
                        }
                        .desc {
                            max-width: 400px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-size: 24px;
                            color: #999;
                            margin-bottom: 13px;
                        }
                        .price {
                            color: #ff0101;
                            font-size: 28px;
                            margin-top: 16px;
                            span {
                                font-size: 32px;
                            }
                        }

                    }
                }
                .shopcar {
                    width: 120px;
                    height: 120px;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    background: url("../../assets/shopcar-grey.png") no-repeat center;
                    background-size: 44px 44px;
                }
            }
            .search-none {
                width: 100%;
                height: 1158px;
                margin-top: -16px;
                background: #fff url("../../assets/search-none.png") center 125px no-repeat;
                background-size: 354px 354px;
            }
            .list-loading{
                width: 100%;
                height: 1158px;
                margin-top: -16px;
                background: #fff url("../../assets/loading.gif") center 250px no-repeat;
            }
        }
        .loading {
            color: #bbb;
            text-align: center;
            padding: 20px 0;
        }

        .buy-panel {
            /*购买面板*/
            .mint-popup {
                width: 100%;
                background: #fff;

                .title {
                    height: 80px;
                    padding: 0 30px;
                    box-shadow: 0 -1px 0 0 #ddd inset;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    line-height: 82px; /*px*/
                    span {
                        font-size: 28px;
                        color: #222;
                    }
                    .close {
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        background: url("../../assets/close.png");
                        background-size: cover;
                    }
                }
                .desc {
                    box-shadow: 0 -1px 0 0 #ddd inset;
                    margin-bottom: 2px;
                    padding: 15px 30px;

                    div {
                        display: flex;
                        text-align: left;
                        color: #666;
                        font-size: 26px;
                        line-height: 26px;
                        margin-bottom: 16px;
                        p:first-child {
                            flex: 1;
                        }
                        p:last-child {
                            flex: 4;
                            word-break: break-all;
                        }
                    }
                    div:last-child {
                        margin-bottom: 0;
                    }
                }
                .option {
                    padding: 22px 30px;
                    box-shadow: 0 -1px #e5e5e5 inset;
                    background: #fff;
                    .limit-date {
                        color: #0066cc;
                        font-size: 20px;
                    }

                    .section {
                        overflow: hidden;

                        margin-bottom: 24px;
                        .left {
                            float: left;
                            width: 138px;
                            text-align: left;
                            height: 100%;
                            display: inline-block;
                            font-size: 26px;
                            color: #666;
                            line-height: 55px; /*px*/

                        }
                        .left.left-center {
                            text-indent: 52px;
                        }
                        .left.left-bottom {
                            line-height: 64.5px;
                            margin: 0;

                        }
                        .right {
                            float: left;
                            width: 552px;
                            display: inline-block;
                            padding-bottom: 1px;
                            margin-top: 2px;
                            margin-bottom: 2px;
                            span {
                                position: relative;
                                display: inline-block;
                                font-size: 24px;
                                color: #222;
                                box-shadow: 0 0 0 2px #e9e9e9;
                                padding: 14px 18px;
                                margin-right: 24px;

                                i {
                                    position: absolute;
                                    bottom: 0;
                                    right: 0;
                                    width: 24px;
                                    height: 24px;
                                    background: url("../../assets/option-check.png") no-repeat;
                                    background-size: cover;
                                }
                            }
                            /*选项选中样式*/
                            span.option-check {
                                box-shadow: 0 0 0 3px #fa8c35;
                            }
                            p.stock {
                                font-size: 20px;
                                color: #999;
                                padding: 0;
                                margin-top: 16px;
                                text-align: left;
                                .stock-desc {
                                    box-shadow: none;
                                    font-size: 20px;
                                    color: #999;
                                    margin-left: 10px;
                                    padding: 0;
                                    margin-right: 0;
                                }
                            }
                            .num-btn {
                                float: left;
                                height: 64px;
                                display: flex;
                                box-shadow: 0 0 0 1px #ccc;
                                span {
                                    width: 64px;
                                    margin: 0;
                                    padding: 0;
                                    text-align: center;
                                    box-shadow: none;
                                    line-height: 64px; /*px*/
                                }
                                input.num {
                                    outline: none;
                                    text-align: center;
                                    width: 90px;
                                    border: none;
                                    border-radius: 0;
                                    padding: 1px 0;
                                    font-size: 24px;
                                    color: #333;
                                }
                                span.sub {
                                    box-shadow: 1px 0 0 0 #ccc;
                                    font-size: 30px;
                                    color: #d2d2d2;
                                }
                                span.add {
                                    box-shadow: -1px 0 0 0 #ccc;
                                    font-size: 30px;
                                    color: #f82222;
                                }
                            }
                            .box {
                                border: 1px solid transparent;
                                padding: 0;
                                line-height: 64px; /*px*/
                                margin-left: 16px;
                                margin-right: 24px;
                                color: #666;
                                font-size: 26px;
                                box-shadow: none;
                            }
                        }
                        .right.right-center {
                            margin-top: 3px;
                            span {
                                margin-bottom: 24px;
                            }
                        }
                        .logistics{
                            font-size: 22px;
                            color: #666;
                            margin-top: 15px;
                            word-break: break-all;
                            line-height: 35px;
                            div{
                                display: inline-block;
                            }
                            .price-tip{
                                color: #f82222;
                            }
                        }
                    }
                    .section:nth-last-child(1) {
                        margin-bottom: 0;
                    }
                }
                .footer {
                    height: 100px;
                    display: flex;
                    .footer-left {
                        flex: 0.34;
                        height: 100%;
                        /*width: 256px;!*px*!*/
                        display: flex;
                        p {
                            color: #222;
                            font-size: 20px;
                        }
                        .store {
                            flex: 1;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            div {
                                text-align: center;
                            }
                            i {
                                width: 44px;
                                height: 44px;
                                display: inline-block;
                                background: url("../../assets/tabbar-home-normal.png");
                                background-size: cover;
                            }

                        }
                        .shop-car {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex: 1;
                            div {
                                text-align: center;
                            }
                            i {
                                width: 44px;
                                height: 44px;
                                display: inline-block;
                                background: url("../../assets/tabbar-shopcar-normal.png");
                                background-size: cover;
                                position: relative;
                                .badge {
                                    position: absolute;
                                    right: -10px;
                                    top: -8px;
                                    width: 30px;
                                    height: 30px;
                                    border-radius: 50%;
                                    border: 1px solid transparent;
                                    background: #f82222;
                                    color: #fff;
                                    font-size: 18px;
                                    text-align: center;
                                    line-height: 30px;
                                    font-style: normal;
                                }
                            }
                        }
                    }
                    .footer-right {
                        flex: 0.66;
                        height: 100%;
                        /*width: 494px;!*px*!*/
                        display: flex;
                        .add-shop-car {
                            flex: 1;
                            background: #fa8c35;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 32px;
                            color: #fff;
                            &.forbid-buy {
                                background: #c9c9c9;
                            }
                        }
                        .buy-now {
                            flex: 1;
                            background: #f82222;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 32px;
                            color: #fff;
                            &.forbid-buy {
                                background: #868686;
                            }
                        }
                    }
                }
            }
        }

        /*筛选条*/
        .filter-bar {
            position: fixed;
            top: 88px;
            left: 0;
            width: 100%;
            background: white;
            height: 88px;
            display: flex;
            margin-bottom: 16px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.078);
            padding: 0 30px;
            z-index: 99;
            /*筛选条选中状态*/
            li.active {
                border-bottom: 2px solid #0066cc;
                span {
                    color: #0066cc;
                }
                i {
                    background: url("../../assets/drop-arrow-active.png") no-repeat;
                    background-size: contain;
                }

            }
            li.filter.active {
                border-bottom: none;
                i {
                    background: url("../../assets/filter-active.png") no-repeat;
                    background-size: contain;
                }
            }
            .iconRe {
                i {
                    transform: rotateZ(180deg);
                }
            }
            /*默认状态*/
            li {
                display: flex;
                justify-content: center;
                align-items: center;
                color: #666;
                flex: 1;
                font-size: 30px;
                border-bottom: 2px solid #fff;
                i {
                    display: inline-block;
                    width: 22px;
                    height: 13px;
                    margin-left: 5px;
                    background: url("../../assets/drop-arrow.png") no-repeat;
                    background-size: contain;
                }
            }
            li:nth-last-child(1) {
                i {
                    display: inline-block;
                    width: 28px;
                    height: 28px;
                    background: url("../../assets/filter.png") no-repeat;
                    background-size: contain;
                }
            }
        }

        .filter-out {
            /*筛选面板*/
            .mint-popup {
                width: 650px;
                /*筛选面板*/
                .filter-panel {
                    width: 100%;
                    background-color: #fff;
                    padding: 30px;
                    p {
                        font-size: 32px;
                        color: #333;
                        margin-bottom: 30px;
                        margin-top: 30px;
                    }
                    ul {
                        width: 100%;
                        overflow: hidden;

                        /*选中样式*/
                        .filter-brand.filter-brand-select {
                            background: #0066cc;
                            color: #fff;
                        }
                        /*默认样式*/
                        .filter-brand {

                            float: left;
                            width: 180px;
                            height: 66px;
                            background: #f1f1f1;
                            font-size: 26px;
                            color: #333;
                            /*border-top: 2px solid transparent;*/

                            text-align: center;
                            line-height: 66px; /*px*/
                            border-radius: 10px;
                            margin-right: 20px;
                            margin-bottom: 24px;
                            span {
                                display: inline-block;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                width: 85%;
                                text-align: center;
                            }
                        }
                        .filter-brand:nth-child(3n+0) {
                            margin-right: 0;
                        }
                        .all-brand {
                            font-size: 24px;
                            background: none;
                            color: #999;
                            i {
                                background: url("../../assets/drop-arrow-right.png");
                                display: inline-block;
                                width: 13px;
                                height: 22px;
                                background-size: cover;
                                margin-left: 11px;
                            }
                        }
                    }
                    .btn-group{
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        div{
                            float: left;
                            height: 88px;
                            width: 50%;
                            font-size: 36px;
                            color: #fff;
                            text-align: center;
                            line-height: 88px;
                            background: #0086cc;
                            &:last-child{
                                background: #0066cc;
                            }
                        }
                    }
                }
                /*全部品牌剂型的头部*/
                .index-list-header {
                    background: #fff;
                    width: 100%;
                    position: fixed;
                    z-index: 9999;
                    top: 0;
                    left: 0;
                    height: 86px;
                    padding: 0 30px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #ddd;
                    .back {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        line-height: 86px; /*px*/
                        font-size: 26px;
                        color: #666;
                        i {
                            display: inline-block;
                            width: 13px;
                            height: 22px;
                            background: url("../../assets/drop-arrow-right.png");
                            background-size: cover;
                            transform: rotateZ(180deg);
                            margin-right: 10px;
                        }
                    }
                    .title {
                        font-size: 32px;
                        color: #333;
                    }
                    .confirm {

                        font-size: 26px;
                        color: #666;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
                /*全部品牌/剂型*/
                .mint-indexlist {
                    .mint-indexlist-content {
                        .mint-indexsection {
                            .brand-item {
                                box-shadow: 0 -1px 0 0 #ddd inset;
                            }
                            .mint-cell {
                                height: 88px;

                                i {
                                    width: 23px;
                                    height: 17px;
                                    display: inline-block;
                                    background: url("../../assets/filter-check.png");
                                    background-size: cover;
                                }
                            }
                        }
                    }
                }
            }
        }

        /*加入购物车的动画*/
        .animate {
            animation: big 1s;
        }

        @keyframes big {
            0% {
                transform: scale(1)
            }
            50% {
                transform: scale(1.3)
            }
            100% {
                transform: scale(1)
            }
        }
    }
</style>