<template>
    <div>
        <header class="mint-header">
            <div class="search">
                <i></i>
                <div>
                    <input class="search-input" type="search" autofocus
                           placeholder="搜索本店商品" v-model="content">
                    <button @click="_submit(content)">搜索</button>
                </div>
            </div>
        </header>
        <!--搜索框助记码-->
        <ul ref="dropList" class="drop-list" v-show="content">
            <li @click="_submit(item)" v-for="(item,index) in mnemonic" :key="index">{{item}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "store-search",
        data() {
            return {
                content: '',
                tempCtn: '',
                //助记码
                mnemonic: [],
            }
        },
        methods: {
            //提交搜索
            _submit(ctn) {
                console.log(ctn);
                this.tempCtn = ctn;
                this.content = '';
                this.$router.push({path:'/storeSearchList',query:{title:this.$route.query.title,storeId:this.$route.query.storeId,data:JSON.stringify({sortFlag:1,searchText:this.tempCtn,agentType:'',brandName:'',pageNo:1,storeId:this.$route.query.storeId})}})
            },
        },
        mounted() {
            this.$refs.dropList.style.height = document.body.offsetHeight + 'px';
        },
        watch:{
            content(newV){
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
            }
        }
    }
</script>

<style lang="less" scoped>
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
</style>