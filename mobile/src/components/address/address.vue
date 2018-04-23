<template>
    <div class="wrap">
        <!-- 地址 -->
        <ul class="address">
            <li v-for="(address, addressIdx) in addressArr">
                <!-- 地址详情 -->
                <div class="address-detail">
                    <div class="detail-t">
                        <div class="detail-name">{{address.addressRecipientName}}</div>
                        <div class="detail-tel">{{detailTelStar(addressIdx)}}</div>
                    </div>
                    <!-- 地址 -->
                    <div class="detail-b">{{address.addressName.replace(/\-/g, '') + address.addressDetail}}</div>
                </div>
                <!-- 地址操作 -->
                <div class="address-opt">
                    <div class="select"
                        :class="{'active': !address.isDefault}"
                        @click="addressSelectFn(addressIdx, address.addressId)">
                        <input type="radio" name="addressSelect" :checked="!address.isDefault">{{address.isDefault ? '设为默认' : '默认地址'}}
                    </div>
                    <div class="btn btn-del"
                        v-if="address.isDefault"
                        @click="delPopShowFn(addressIdx, address.addressId)">删除
                    </div>
                    <div class="btn btn-edit" @click="addressEditFn(addressIdx)">编辑</div>
                </div>
            </li>
        </ul>
        <!-- 添加地址 -->
        <router-link class="btn-add" to='/addressAdd'>
            <div class="add-text">添加地址</div>
        </router-link>
        <!-- 弹窗-删除 -->
        <transition name="fade">
            <div class="pop-shade" v-show="popShow">
                <!-- 弹窗主体 -->
                <div class="pop-main">
                    <div class="pop-body">
                        <p>确定要删除该地址？</p>
                    </div>
                    <div class="pop-footer">
                        <div class="btn btn-yes" @click="delFn()">确定</div>
                        <div class="btn btn-no" @click="delPopHideFn()">取消</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "address",
        data() {
            return {
                addressArr: [],
                // 要删除的目标和目标id
                delTargetIdx: null,
                delTargetId: null,
                // 弹窗显示or隐藏
                popShow: false
            }
        },
        created () {
            let timeStamp = new Date().getTime();
            let params = {'pageNo': 0, 'pageSize': 10};
            let md5 = this._cryptojs.MD5(JSON.stringify(params));
            this.$http({
                method: 'post',
                url: this._ajaxUrl + '/encryption/aes',
                headers: {
                    'time-stamp': timeStamp,
                    'data-signature': md5
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
                        'time-stamp': timeStamp,
                        'data-signature': md5
                    },
                    url: this._ajaxUrl + '/customer/address/getMyAddressList',
                    data: aes
                }).then((res) => {
                    if (res.data.errorCode === '0000') {
                        this.addressArr.push(...res.data.data.list);
                    }
                })
            })
        },
        methods: {
            // 手机号码打星星
            detailTelStar: function (idx) {
                let telStart = this.addressArr[idx].addressPhone.substring(0, 3);
                let telEnd = this.addressArr[idx].addressPhone.substring(7, 11);
                return telStart + '****' + telEnd;
            },
            // 默认地址设置
            addressSelectFn: function (addressIdx, addressId) {
                let timeStamp = new Date().getTime();
                let params = {'addressId': addressId};
                let md5 = this._cryptojs.MD5(JSON.stringify(params));
                this.$http({
                    method: 'post',
                    url: this._ajaxUrl + '/encryption/aes',
                    headers: {
                        'time-stamp': timeStamp,
                        'data-signature': md5
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
                            'time-stamp': timeStamp,
                            'data-signature': md5
                        },
                        url: this._ajaxUrl + '/customer/address/setUpDefault',
                        data: aes
                    }).then((res) => {
                        console.log(res.data)
                        if (res.data.errorCode === '0000') {
                            this.addressArr.forEach((address, idx) => {
                                if (idx === addressIdx) {
                                    address.isDefault = 0
                                } else {
                                    address.isDefault = 1;
                                }
                            });
                        }
                    })
                })
            },
            // 编辑地址
            addressEditFn: function (idx) {
                // to='/addressEdit'
                // console.log(this.addressArr[idx]);
                this.$router.push({
                    path: '/addressEdit',
                    query: {
                      "addressId": this.addressArr[idx].addressId,
                      "addressProvince": this.addressArr[idx].addressProvince,
                      "addressCity": this.addressArr[idx].addressCity,
                      "addressCounty": this.addressArr[idx].addressCounty,
                      "addressDetail": this.addressArr[idx].addressDetail,
                      "addressName": this.addressArr[idx].addressName,
                      "addressPhone": this.addressArr[idx].addressPhone,
                      "addressRecipientName": this.addressArr[idx].addressRecipientName,
                      "addressZip": this.addressArr[idx].addressZip,
                      "countryRegionName": this.addressArr[idx].countryRegionName,
                      "createTime": this.addressArr[idx].createTime,
                      "isDefault": this.addressArr[idx].isDefault
                    }
                });
            },
            // 删除弹窗-显示
            delPopShowFn: function (addressIdx, addressId) {
                this.delTargetIdx = addressIdx;
                this.delTargetId = addressId;
                this.popShow = true;
            },
            // 删除弹窗-隐藏
            delPopHideFn: function () {
                this.popShow = false;
            },
            // 删除
            delFn: function () {
                let timeStamp = new Date().getTime();
                let params = {'addressId': this.delTargetId};
                let md5 = this._cryptojs.MD5(JSON.stringify(params));
                this.$http({
                    method: 'post',
                    url: this._ajaxUrl + '/encryption/aes',
                    headers: {
                        'time-stamp': timeStamp,
                        'data-signature': md5
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
                            'time-stamp': timeStamp,
                            'data-signature': md5
                        },
                        url: this._ajaxUrl + '/customer/address/delete',
                        data: aes
                    }).then((res) => {
                        if (res.data.errorCode === '0000') {
                            this.addressArr.splice(this.delTargetIdx, 1);
                        }
                        this.delPopHideFn();
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .wrap {
        width: 100%;
        background: #f6f6f6;
        // 地址
        .address {
            display: block;
            width: 100%;
            li {
                display: block;
                width: 100%;
                margin-bottom: 15px;
                background: #fff;
                /*border-top: 1px solid #e5e5e5;*/
                /*border-bottom: 1px solid #e5e5e5;*/
                box-shadow: 0 -1px #e5e5e5, 0 1px #e5e5e5;
            }
            .address-detail {
                width: 100%;
                padding: 26px 30px;
                text-align: left;
                /*border-bottom: 1px solid #eeeeee;*/
                box-shadow: 0 1px #eee;
                .detail-t {
                    width: 100%;
                    margin-bottom: 20px;
                    overflow: hidden;
                    font-size: 32px;
                    color: #222;
                    & > div {
                        display: inline-block;
                    }
                    .detail-name {
                        padding-right: 70px;
                    }
                }
                .detail-b {
                    font-size: 28px;
                    word-break: break-all;
                    letter-spacing: 1px;
                    line-height: 34px;
                    color: #666;
                }
            }
            .address-opt {
                width: 100%;
                height: 104px;
                padding: 30px;
                overflow: hidden;
                // 选择
                .select {
                    float: left;
                    height: 40px;
                    padding-left: 64px;
                    font-size: 26px;
                    line-height: 42px;/*px*/
                    color: #222;
                    background: url('../../assets/icon/icon-select.png') left center no-repeat;
                    background-size: 40px 40px;
                    input {
                        display: none;
                    }
                    &.active {
                        background: url('../../assets/icon/icon-select-active.png') left center no-repeat;
                        background-size: 40px 40px;
                    }
                }
                .btn {
                    display: block;
                    float: right;
                    height: 40px;
                    padding-left: 40px;
                    margin-left: 70px;
                    font-size: 26px;
                    line-height: 40px;
                    color: #666;
                }
                // 按钮-编辑
                .btn-edit {
                    background: url('../../assets/icon/icon-edit.png') left center no-repeat;
                    background-size: 26px 26px;
                }
                // 按钮-删除
                .btn-del {
                    background: url('../../assets/icon/icon-del.png') left center no-repeat;
                    background-size: 26px 26px;
                }
            }
        }
        .btn-add {
            display: block;
            width: 100%;
            text-align: center;
            line-height: 104px;/*px*/
            background: #fff;
            /*border-top: 1px solid #eee;*/
            /*border-bottom: 1px solid #eee;*/
            box-shadow: 0 -1px #eee,0 1px #eee;
            .add-text {
                display: inline-block;
                height: 46px;
                padding-left: 70px;
                font-size: 32px;
                line-height: 48px;/*px*/
                color: #0066cc;
                background: url('../../assets/icon/icon-add.png') left center no-repeat;
                background-size: 45px 45px;
            }
        }
        // 弹窗过渡动画
        .fade-enter-active, .fade-leave-active {
            transition: opacity .3s ease-in;
        }
        .fade-enter, .fade-leave-to {
            opacity: 0;
        }
        // 弹窗-删除
        .pop-shade {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .3);
            transition: all .2s ease-in;
            // 弹窗主体
            .pop-main {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 540px;
                overflow: hidden;
                background: #fff;
                border-radius: 10px;
                transform: translate(-50%, -80%);
            }
            .pop-body {
                width: 100%;
                padding-top: 100px;
                padding-bottom: 70px;
                font-size: 32px;
                text-align: center;
                color: #666666;
            }
            .pop-footer {
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 90px;
                overflow: hidden;
                font-size: 32px;
                text-align: center;
                /*border-top: 1px solid #ccc;*/
                box-shadow: 0 -1px #ccc;
                .btn {
                    flex: 1;
                    line-height: 90px;
                    /*border-right: 1px solid #ccc;*/
                    box-shadow: 1px 0 #ccc;
                    &.last-child {
                        box-shadow: none;
                    }
                }
                .btn-yes {
                    color: #0066cc;
                }
                .btn-no {
                    color: #666;
                }
            }
        }
    }
</style>