<template>
    <div class="search-top">

        <header class="mint-header">
            <div class="search">
                <i></i>
                <div>
                    <input :class="{focus:isFocus}" @focus="btnShow" class="search-input" type="search"
                           placeholder="搜索" v-model="content">
                    <button v-show="isFocus" @click="_submit(content)">搜索</button>
                </div>
            </div>
        </header>
        <div v-show="!isSearch" class="hot-search">
            <p>热门搜索</p>
            <ul>
                <li v-for="(item,index) in list" :key="index">
                    <span @click="_submit(item.keyword)">{{item.keyword}}</span>
                </li>
            </ul>
        </div>
        <!--搜索框助记码-->
        <ul ref="dropList" class="drop-list" v-show="content&&isSearch">
            <li @click="_submit(item)" v-for="(item,index) in mnemonic" :key="index">
                    {{item}}
            </li>
        </ul>

    </div>



</template>

<script>
    export default {
        name: "hot-search",
        data(){
            return{
                isSearch:false,
                //助记码
                mnemonic: [],
                isFocus: false,
                content: '',
                list:[],
            }
        },
        methods:{
            //搜索框聚焦
            btnShow() {
                this.isFocus = true
            },
            _submit(ctn){
                this.$router.push({path:'/search',query:{sortFlag:1,searchText:ctn,agentType:'',brandName:'',pageNo:1}})
            }
        },
        created(){
            let timeStamp = new Date().getTime();
                    this.$http({
                        method: 'post',
                        headers: {
                            'time-stamp':timeStamp
                        },
                        url: this._ajaxUrl + '/index/selectHotSearchGoodsInfo'
                    }).then((res) => {
                        if (res.data.errorCode == '0000') {
                            this.list = res.data.data.hotSearchList;
                        }
                    })
        },
        mounted(){
            this.$refs.dropList.style.height = document.body.offsetHeight + 'px';
        },
        watch:{
            //监听搜索框内容
            content(newV) {
                if (newV) {
                    // this.$emit('submitSearch', [true]);
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
                                    'time-stamp':timeStamp
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
            }
        }
    }
</script>

<style lang="less" scoped>
    .search-top {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
    }

    .mint-header {
        height: 88px;
        background: white;
        /*border-bottom: 1px solid #ddd;*/
        box-shadow: 0 -1px  #ddd inset;
        display: flex;
        justify-content: center;
        align-items: center;

        .search {

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
    .hot-search{
        background: #fff;
        height: 1334px;
        padding: 10px 30px 30px 30px;
        p{
            font-size: 28px;
            color: #666;
            margin-bottom: 21px;
        }
        ul{
            overflow: hidden;
            li{
                float: left;
                box-shadow: 0 0 0 1px #ddd inset;
                border-radius: 30px;
                margin: 0 24px 24px 0;
                span{
                    display: inline-block;
                    padding: 0 17px;
                    height: 48px;
                    line-height: 50px;/*px*/
                    font-size: 28px;
                    color: #333;
                }
            }
        }
    }
</style>