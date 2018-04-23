<template>
    <div id="temp">
        <!--顶部搜索条-->
        <div class="search-top">
            <header class="mint-header">
                <div class="search-in">
                    <i></i>
                    <div>
                        <input :class="{focus:isFocus}" @focus="btnShow" class="search-input" type="search"
                               placeholder="搜索" v-model="content">
                        <button v-show="isFocus" @click="_submit(content)">搜索</button>
                    </div>
                </div>
            </header>
            <!--搜索框助记码-->
            <ul ref="dropList" class="drop-list" v-show="content&&isSearch">
                <li @click="_submit(item)" v-for="(item,index) in mnemonic" :key="index">
                    {{item}}
                </li>
            </ul>
        </div>

        <!--商品分类搜索-->
        <div class="main" ref="main" >
            <!--侧边tabbar-->
               <div v-show="!isSearch" class="side-bar" >
                   <div @click="selectItem(index)" :class="{'selected':selected==index}" class="side-bar-item" v-for="(item,index) in title" :key="index" :id="index"><span>{{item.catName}}</span></div>
                </div>

            <!--右边分类面板-->
            <div v-show="!isSearch" class="right" >
                <div class="search-panel">
                    <img :src="src" alt="">
                    <div class="search-panel-content">
                        <h6><i></i> {{cateName}} <i></i></h6>
                        <ul>
                            <router-link :to="{path:'/search',query:{sortFlag:1,searchText:'',agentType:'',brandName:'',catName:item.catName,catGrade:2,pageNo:1}}" v-for="(item,index) in catePanel" :key="index">{{item.catName}}</router-link>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <tabbar v-show="!isSearch"></tabbar>
    </div>
</template>

<script>
    import tabbar from '../subcom/tab-bar';
    export default {
        name: "category",
        components: {
            tabbar
        },
        data() {
            return {
                //助记码
                mnemonic: [],
                isFocus: false,
                content: '',
                selected: null,
                title:[],
                isSearch:false,
                //右侧内容
                catePanel:[],
                src:'',
                cateName:''
            }
        },
        methods:{
            //搜索框聚焦
            btnShow() {
                this.isFocus = true
            },
            _submit(ctn) {
                this.$router.push({path:'/search',query:{sortFlag: 1, searchText: ctn, agentType: '', brandName: '', pageNo: 1}});
            },
            //侧边栏点击
            selectItem(index){
                if(this.selected==index){
                    return
                }
                this.selected = index;
                this.cateName = this.title[index].catName;
                //发送网络请求
                let timeStamp = new Date().getTime();
                let params = {catName: this.cateName , catGrade: 1,advTypeCode:'mobile-category-'+(index+1)};
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
                            url: this._ajaxUrl + '/index/categroy',
                            data: aes
                        }).then((res) => {
                            console.log(res);
                            if (res.data.errorCode == '0000') {
                                this.catePanel = res.data.data[0].catList;
                                this.src = res.data.data[0].advImg[0]?res.data.data[0].advImg[0].advImg:'';
                            }
                        })
                    }
                )
            }
        },
        created(){
            //获取一级分类
            let timeStamp = new Date().getTime();
            this.$http({
                method: 'post',
                url: this._ajaxUrl + '/index/findFirstCategroy',
                headers: {
                    'data-signature': '',
                    'time-stamp':timeStamp
                }
            }).then((res) => {
                console.log(res.data);
                if (res.data.errorCode == '0000') {
                    this.title = res.data.data[0].catList;
                    //获取二级分类
                    this.selectItem(0);
                }
            });

        },
        mounted() {
            this.$refs.dropList.style.height = document.body.offsetHeight + 'px';
        },
        watch:{
            //监听搜索框内容
            content(newV) {
                if (newV) {
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
                } else {
                    this.isSearch = false;
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    #temp{
        height: 100%;
        width: 100%;
        overflow: hidden;
        padding-bottom: 98px;
        background: #f6f6f6;
    }
    .search-top {
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
    .main {
        width: 100%;
        height: 1236px;
        display: flex;
        padding-top: 88px;
        .side-bar {
            width: 160px;
            background: #fff;
            height: 100%;
            .side-bar-item {
                height: 102px;/*px*/
                width: 160px;
                color: #222;
                padding: 0 25px;
                text-align: center;
                box-shadow: -1px -1px 0 0 #e5e5e5 inset;
                border-left: 4px solid #fff;
                span{
                    margin-left: -4px;
                    width: 105%;
                    line-height: 102px;/*px*/
                    font-size: 26px;/*px*/

                    display: inline-block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                }
            }
            .side-bar-item.selected {
                box-shadow: none;
                border-left: 4px solid #0066cc;
                margin-bottom: 0;
                background: #f6f6f6;
                color: #0066cc;
            }
        }
        .right {
            overflow-y: auto;
            width: 100%;
            .search-panel{
                padding: 16px;
                text-align: center;
                img{
                    width: 100%;
                    /*height: 160px;*/
                }
                .search-panel-content{
                    margin-top: 16px;
                    h6{
                        background: white;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 32px;
                        color: #222;
                        padding-top: 16px;
                        padding-bottom: 14px;
                        i{
                            display: inline-block;
                            height: 1px;
                            width: 40px;
                            background: #666;
                            margin: 0 12px;
                        }
                    }
                    ul{
                        width: 100%;
                        overflow: hidden;
                        box-shadow: 0 1px 0 0 #eee inset;
                        a{
                            background: white;
                            font-size: 24px;
                            color: #666;
                            float: left;
                            width: 50%;
                            height: 80px;
                            box-shadow: -1px -1px #eee inset;
                            line-height: 80px;/*px*/
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            text-align: center;
                            padding: 0 10px;
                        }
                        a:nth-child(2n+0){
                            box-shadow: 0 -1px #eee inset;
                        }
                    }
                }
            }
        }
    }

</style>