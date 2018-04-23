<template>
    <div class="wrap" v-html="content"></div>
</template>

<script>
    export default {
        name: "help-detail",
        data(){
            return{
                content:''
            }
        },
        created(){
            let timeStamp = new Date().getTime();
            let params = {'helpId': this.$route.query.helpId};
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
                    url: this._ajaxUrl + '/information/help/documentInfo',
                    data: aes
                }).then((res) => {
                    console.log(res.data);
                    if(res.data.errorCode == '0000'){
                        this.content = res.data.data.helpContent
                    }
                });
            });
        }
    }
</script>

<style lang="less" scoped>
    .wrap{
        padding: 30px;
    }
</style>