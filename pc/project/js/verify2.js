define(['jquery'], function ($) {

    var verifyArg = {
        // 固话
        phone: function (val) {
            if (val === '' || (/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        // 手机
        mobile: function (val) {
            if (val === '' || (/^1[0-9]{10}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        // QQ
        qq: function (val) {
            if (val === '' || (/^[1-9]\d{4,9}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        // 微信
        wx: function (val) {
            if (val === '' || (/^[a-zA-Z\d_]{5,}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        // 电子邮箱
        mail: function (val) {
            if (val === '' || (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        // 邮政编码
        postal: function (val) {
            if (val === '' || val != '000000' || (/^[1-9][0-9]{5}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        // 账号
        user: function (val) {
            if (val === '') {
                return ''
            }
            else if (val != '' && (/^[A-Za-z0-9_]{6,20}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        // 密码
        pwd: function (val) {
            if (val === '' || (/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        // 验证码
        code: function (val) {
            if (val === '' || (/^[A-Za-z0-9]{4}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        // 短信验证码
        codeNote: function (val) {
            if (val === '' || (/^[0-9]{6}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //姓名
        person: function (val) {
            if (val === '' || (/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //手机/邮箱/用户名
        account: function (val) {
            if (val === '' || (/^(^[A-Za-z0-9_]{6,20}$)|(^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$)|(^1[0-9]{10}$)$/).test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        //公司名称
        company:function (val) {
            if (val === '') {
                return ''
            }
            else if (val != '' && (/^[\u4e00-\u9fa5_a-zA-Z0-9_]{4,50}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //银行账号
        bankAccount:function (val) {
            if (val === '') {
                return ''
            }
            else if (val != '' && (/^([1-9]{1})(\d{14}|\d{18})$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //银行卡户名
        bankUser:function (val) {
            if (val === '') {
                return ''
            }
            else if (val != '' && (/^([\u4e00-\u9fa5]{2,5}|[A-z]{1,26})$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //开户网点
        bankWd:function (val) {
            if (val === '') {
                return ''
            }
            else if (val != '' && (/^[\u4e00-\u9fa5]{2,}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //工商注册号
        regNum:function (val) {
            if (val === '') {
                return ''
            }
            else if (val != '' && (/^[a-zA-Z0-9\u4e00-\u9fa5]{1,}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //打款金额
        money:function (val) {
            if (val === '') {
                return ''
            }
            else if (val != '' && (/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
                    .test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //banner背景色
        bgColor:function (val) {
             if (val != '' && ( /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //二级域名
        secDomain:function (val) {
            if (val != '' && (/^(?=.*\d+)(?=.*[A-Za-z]+)[A-Za-z0-9]{3,16}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //店铺关键字
        keyword:function (val) {
            if (val != '' && (/^[\u4e00-\u9fa5/,]{1,40}$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        },
        //地址输入框
        address:function (val) {
            if (val != '' && (/^[A-Za-z0-9_\u4e00-\u9fa5]*$/.test(val))) {
                return true;
            }
            else {
                return false;
            }
        }
    };

    window.verifyArg = verifyArg;
    return verifyArg;
});