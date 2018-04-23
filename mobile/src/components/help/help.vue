<template>
    <div class="wrap">
        <ul v-for="(cateItem,cateIndex) in categoryList" :key="cateIndex">{{cateItem.helpcateName}}
            <router-link :to="{path:'/helpDetail',query:{helpId:helpItem.helpId,title:helpItem.helpTitle}}" v-for="(helpItem,helpIndex) in cateItem.helpList" :key="helpIndex">{{helpItem.helpTitle}}<i></i></router-link>
        </ul>
    </div>
</template>

<script>
    import Vue from 'vue';
    export default {
        name: "help",
        data(){
          return{
              categoryList:[]
          }
        },
        created(){
            let timeStamp = new Date().getTime();
            //获取帮助分类
            this.$http({
                method: 'post',
                headers: {
                    'time-stamp': timeStamp
                },
                url: this._ajaxUrl + '/information/help/categoryList '
            }).then((res) => {
                console.log(res.data);
                if(res.data.errorCode == '0000'){
                    this.categoryList = res.data.data;
                    let _this = this;
                    res.data.data.forEach(function (v) {
                        _this.ajaxFn(v)
                    })
                }
            })
        },
        methods:{
            ajaxFn(v){
                let timeStamp = new Date().getTime();
                let params = {'helpcateId': v.helpcateId};
                let md5 = this._cryptojs.MD5(JSON.stringify(params));
                //获取帮助分类的item
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
                        url: this._ajaxUrl + '/information/help/documentList',
                        data: aes
                    }).then((res) => {
                        if(res.data.errorCode == '0000'){
                            Vue.set(v,'helpList',res.data.data)
                        }
                    });
                });
            }
        },
    }
</script>

<style lang="less" scoped>
    ul {
        text-indent: 30px;
        /*height: 105px;*/
        line-height: 105px;
        font-size: 32px;
        color: #333;
        a {
            display: block;
            font-size: 32px;
            color: #666;
            line-height: 95px;
            border-bottom: 1px solid #eee;
            position: relative;
            background: #fff;
            i{
                width: 12px;
                height: 20px;
                background: url("../../assets/icon/icon-arrow-right.png") no-repeat;
                background-size: contain;
                position: absolute;
                top: 50%;
                right: 30px;
                transform: translateY(-50%);
            }
        }
    }
</style>