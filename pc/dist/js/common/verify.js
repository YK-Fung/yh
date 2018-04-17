define(['jquery'], function ($) {

    // 固话:/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/
    // 手机:/^1[0-9]{10}$/
    // QQ:/^[1-9]\d{4,9}$/
    // wx:/^[a-zA-Z\d_]{5,}$/
    // 邮箱:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    // 邮政编码:/^[1-9][0-9]{5}$/
    // 账号:/^[A-Za-z0-9_]{6,20}$/
    // 密码:/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/
    // 验证码:/^[A-Za-z0-9]{4}$/
    // 短信验证码:/^[0-9]{6}$/
    // 姓名:/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/
    // 手机/邮箱/用户名:/^(^[A-Za-z0-9_]{6,20}$)|(^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$)|(^1[0-9]{10}$)$/
    // 公司名称:/^[\u4e00-\u9fa5_a-zA-Z0-9_]{4,50}$/
    // 银行账号:/^([1-9]{1})(\d{14}|\d{18})$/
    // 银行卡户名:/^([\u4e00-\u9fa5]{2,5}|[A-z]{1,26})$/
    // 开户网点:/^[\u4e00-\u9fa5]{2,}$/
    // 工商注册号:/^[a-zA-Z0-9\u4e00-\u9fa5]{1,}$/
    // 打款金额:/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    // banner背景色:/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/
    // 二级域名:/^(?=.*\d+)(?=.*[A-Za-z]+)[A-Za-z0-9]{3,16}$/
    // 店铺关键字:/^[\u4e00-\u9fa5/,]{1,40}$/
    // 地址输入框:/^[A-Za-z0-9_\u4e00-\u9fa5]*$/

    var verifyArg = {
        // 固话
        phone: function (val) {
            if (/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        // 手机
        mobile: function (val) {
            if (/^1[0-9]{10}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        // QQ
        qq: function (val) {
            if (/^[1-9]\d{4,9}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        // 微信
        wx: function (val) {
            if (/^[a-zA-Z\d_]{5,}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        // 电子邮箱
        mail: function (val) {
            if (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        // 邮政编码
        postal: function (val) {
            if (/^(([0]{6})|([1-9][0-9]{5}))$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        // 账号
        user: function (val) {
            if (/^[A-Za-z0-9_]{6,20}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        // 密码
        pwd: function (val) {
            if (/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        // 短信验证码4位
        code4: function (val) {
            if (/^[A-Za-z0-9]{4}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        // 短信验证码6位
        code6: function (val) {
            if (/^[0-9]{6}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //姓名
        person: function (val) {
            if (/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //公司名称
        company: function (val) {
            if (/^[\u4e00-\u9fa5_a-zA-Z0-9_]{4,50}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //银行账号
        bankAccount: function (val) {
            if (/^([1-9]{1})(\d{14}|\d{18})$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //银行卡户名
        bankUser: function (val) {
            if (/^([\u4e00-\u9fa5]{2,5}|[A-z]{1,26})$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //开户网点
        bankWd: function (val) {
            if (/^[\u4e00-\u9fa5]{2,}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //工商注册号
        regNum: function (val) {
            if (/^[a-zA-Z0-9\u4e00-\u9fa5]{1,}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //打款金额(有问题的，但是产品说现在没用打款，等以后有打款了再改吧)
        money: function (val) {
            if ((/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
                    .test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //banner背景色
        bgColor: function (val) {
            if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //二级域名
        secDomain: function (val) {
            if (/^(?=.*\d+)(?=.*[A-Za-z]+)[A-Za-z0-9]{3,16}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //店铺关键字
        keyword: function (val) {
            if (/^[\u4e00-\u9fa5/,]{1,40}$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //地址输入框
        address: function (val) {
            if (/^[A-Za-z0-9_\u4e00-\u9fa5]*$/.test(val)) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    window.verifyArg = verifyArg;        

});