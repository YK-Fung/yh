define(['jquery'], function ($) {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    //判断是否IE浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
    //判断是否IE的Edge浏览器
    var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        //低于ie8 提示切换浏览器
        if (fIEVersion <= 8) {
            $('.ie-tip').show();
        }
    }

    //监听输入框内容
    $('.login-pwd,.login-user').on('input propertychange', function () {
        //如果输入框有内容显示删除按钮
        $('.login-user').val().length > 0 ? $('.input-del').show() : $('.input-del').hide();
        //输入框不为空即可登录
        $.trim($('.login-pwd').val()) =='' || $.trim($('.login-user').val()) =='' ? $('.login-btn').removeClass         ('usable') : $('.login-btn').addClass('usable')
    })

    //用户名输入框删除按钮
    $('.input-del').on('click', function () {
        $('.login-user').val('');
        $(this).hide();
        $('.login-btn').removeClass('usable')
    })

    //监听输入框失焦是否为空
    $('.form-group>.login-pwd,.login-user').on('blur', function () {
        $('.login-form').removeClass('fail');
        var selfVal = $.trim($(this).val());
        selfVal === '' ? $(this).parent().addClass('error') : $(this).parent().removeClass('error');
    })

    //账号登录
    $('.login-btn').on('click',function(){
        if ($(this).hasClass('usable')) {
            // 登陆失败
            $('.login-form').addClass('fail')
            /********************************************************/
            //登录成功
            console.log('登陆成功');
        }
    })

    //关闭登录弹窗
    $('.close').on('click',function(){
        $('.login-pop').hide()
    })
})