<template>
    <div class="comment">
        <div class="comment-option">
            <div v-for="(item,index) in commentTabs" @click="optionCheck(index)" :class="[{'option-item-active': index == activeOption}, 'option-item']" ><i></i>{{item}}</div>
        </div>
        <div class="comment-content">
            <div>
                <textarea v-model="commentInput" placeholder="请写下您的评价~" ></textarea>
                <p>还可以输入<span>{{commentLength}}</span>字</p>
            </div>
        </div>
        <div class="submit-btn" @click="submitComment" :style="{'backgroundColor':commentInput?'#0066cc':'#dbdbdb'}">发表评论</div>
    </div>
</template>

<script>
    export default {
        name: "comment",
        data(){
            return{
                commentInput:'',
                commentLength:200,
                // 评价等级
                activeOption: 0,
                commentTabs: ['好评', '中评', '差评']
            }
        },
        methods:{
            optionCheck(opt){
                this.activeOption = opt;
            },
            submitComment(){
                let comment = this.commentInput.replace(/^\s*/g,"");
                if(!comment){
                   alert('内容不能为空');
                   return;
                }
                // 参数（评价类型，评价内容，订单Id）
                let timeStamp = new Date().getTime();
                let params = {'evaluateType': this.activeOption+1,'evaluateContent': this.commentInput,'orderId': this.$route.query.orderId};
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
                            "time-stamp": timeStamp
                        },
                        url: this._ajaxUrl + '/order/evaluate',
                        data: aes
                    }).then((res) => {
                        if (res.data.errorCode == '0000') {
                            this.$router.push({
                                path: '/orderDetail',
                                query: {
                                    orderId: this.$route.query.orderId
                                }
                            }) 
                        }
                    });
                });
            }
        },
        watch:{
            commentInput(newV,oldV){
                if(newV.length > 200){
                    this.commentInput = oldV;
                    this.commentLength = 200 - oldV.length;
                    return;
                }
                this.commentLength = 200 - newV.length;
            },
        }
    }
</script>

<style lang="less" scoped>
    .comment{
        height: 100%;
        width: 100%;
        overflow: hidden;
        background: #f6f6f6;
        .comment-option{
            width: 100%;
            height: 128px;
            background: #fff;
            box-shadow: 0 -2px #eee inset;
            padding: 0 30px;
            .option-item{
                height: 100%;
                float: left;
                display: flex;
                align-items: center;
                font-size: 32px;
                color: #999;
                margin-right: 63px;
                &.option-item-active:nth-child(1){
                    color: #fc3021;
                    i{
                        background: url("../../assets/icon/icon-satisfy-active.png") no-repeat;
                        background-size: contain;
                    }
                }
                &.option-item-active:nth-child(2){
                    color: #f6934a;
                    i{
                        background: url("../../assets/icon/icon-neutral-active.png") no-repeat;
                        background-size: contain;
                    }
                }
                &.option-item-active:nth-child(3){
                    color: #e5c516;
                    i{
                        background: url("../../assets/icon/icon-dissatify-active.png") no-repeat;
                        background-size: contain;
                    }
                }


                i{
                    width: 34px;
                    height: 34px;
                    margin-right: 18px;
                    display: inline-block;
                    background: url("../../assets/icon/icon-satisfy-normal.png") no-repeat;
                    background-size: contain;
                }
                &:nth-child(2) i{
                    background: url("../../assets/icon/icon-neutral-normal.png") no-repeat;
                    background-size: contain;
                }
                &:nth-child(3) i{
                    background: url("../../assets/icon/icon-dissatisfy-normal.png") no-repeat;
                    background-size: contain;
                }
            }
        }
        .comment-content{
            text-align: center;
            margin-top: 16px;
            padding: 0 30px;
            div{
                box-shadow: 1.5px 2.598px 3px 0 rgba(212, 204, 204, 0.114);
                height: 350px;
                position: relative;
                textarea{
                    resize:none;
                    outline: none;
                    width: 100%;
                    height: 100%;
                    padding: 30px;
                    border: 1px solid #eee;
                    border-top: none;
                    font-size: 28px;
                    color: #999;
                }
                p{
                    color: #ccc;
                    font-size: 20px;
                    position: absolute;
                    right: 30px;
                    bottom: 30px;
                    span{
                        color: #f82222;
                    }
                }
            }

        }
        .submit-btn{
            margin: 60px auto;
            width: 345px;
            height: 88px;
            color: #fffefe;
            font-size: 34px;
            text-align: center;
            line-height: 88px;
            border-radius: 10px;
        }
    }
</style>