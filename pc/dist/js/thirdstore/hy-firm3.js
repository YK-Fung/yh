define(['jquery', 'bar-slider', 'bar-header', 'ie-tip'], function($){

    // 如果没有输入错误，才可以提交
    var submitFn = function () {
        if ($('.warn-tip:visible').length <= 0 && $('.verify-error:visible').length <= 0 && $('.verify-empty:visible').length <= 0) {
            $('.btn-submit').addClass('active');
        }
        else {
            $('.btn-submit').removeClass('active');
        }
    }

    // 中英文
    $('.input-ce').on('input propertychange',function() {
        //获取父级
        var parentDom = $(this).closest('.infor-right');
        if ($(this).val() === '') {
            // 内容为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        } else if (!(/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/.test($(this).val()))){
            // 格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        } else {
            // 通过
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-success');
        }
        submitFn();
    });
    // 手机输入框
    $(document).on('input propertychange', '.input-mobile', function (){
        //获取父级
        var parentDom = $(this).closest('.infor-right');
        if ($(this).val() === '') {
            //为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
            // 验证码按钮不可点击
            $('.btn-code').removeClass('active');
        } else if (!(/^1[0-9]{10}$/.test($(this).val()))){
            //格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
            // 验证码按钮不可点击
            $('.btn-code').removeClass('active');
        } else {
            //正确
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-success');
            // 验证码按钮可以点击
            $('.btn-code').addClass('active');
        }
        submitFn();
    });
    // 邮箱输入框
    $('.input-mail').on('input propertychange',function() {
        //获取父级
        var parentDom = $(this).closest('.infor-right');
        if ($(this).val() === '') {
            // 内容为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        } else if (!(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test($(this).val()))){
            // 格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        } else {
            // 通过
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-success');
        }
        submitFn();
    });
    // 手机验证码
    $(document).on('input propertychange', '.input-code', function (){
        //获取父级
        var parentDom = $(this).closest('.infor-right');
        if($(this).val() === ''){
            //为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        }else if( !(/^[A-Za-z0-9]{4}$/.test($(this).val()))){
            //格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        }else {
            //正确
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-success');
        }
        submitFn();
    });
    // 固话输入框
    $('.input-num').on('input propertychange', function (){
        var inputNum = '';
        //获取父级
        var parentDom = $(this).closest('.infor-right');
        if ($.trim(parentDom.find('.fj').val()) !== '') {
            inputNum = parentDom.find('.qh').val() + '-' + parentDom.find('.phone-num').val() + '-' + parentDom.find('.fj').val();
        }
        else {
            inputNum = parentDom.find('.qh').val() + '-' + parentDom.find('.phone-num').val();
        }
        if(inputNum === '' || inputNum === '-'){
            //为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        }
        else if (!(/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/.test(inputNum))) {
            //格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        }
        else{
            //正确
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-success');
        }
        submitFn();
    });
    // 长度输入框
    $('.input-len20').on('input propertychange', function (){
        //获取父级
        var parentDom = $(this).closest('.infor-right');
        if($(this).val() === ''){
            //为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        }else if($(this).val().length > 20){
            //格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        }else {
            //正确
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-success');
        }
        submitFn();
    });
    // 地址输入框
    $('.input-address').on('input propertychange', function (){
        //获取父级
        var parentDom = $(this).closest('.infor-right');
        if($(this).val() === ''){
            //为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        }else if(!(/^[A-Za-z0-9_\u4e00-\u9fa5]*$/.test($(this).val()))){
            //格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        }else {
            //正确
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-success');
        }
        submitFn();
    });

    // 修改手机号码
    var inputMobileRecord = '';
    $(document).on('click', '.btn-change', function () {
        var inputMobile = $(this).closest('.infor-detail').find('.input-mobile');
        if ($(this).hasClass('active')) {
            // 记录原本的输入框，并设置为提示语句
            inputMobileRecord = $(this).closest('.infor-detail').html();
            inputMobile.attr({
                'value': '',
                'placeholder': inputMobile.val(),
                'disabled': false
            });
            // 移除活动样式，显示验证码输入框
            $(this).removeClass('active');
            $(this).text('取消');
            $('.detail-code').show();
        } else {
            // 还原手机输入框
            $(this).closest('.infor-detail').html(inputMobileRecord);
            $('.detail-code').hide();
            // 初始化手机验证码
            $('.detail-code').html('<div class="infor-left">手机验证码：</div><div class="infor-right"><input class="w300 input-code" type="text" name="" value=""><span class="btn btn-code active">获取验证码</span><div class="error-tip">内容格式不正确！</div><div class="empty-tip">内容格式不能为空！</div></div>');
            // 清除计时器
            clearInterval(codeTime);
        }
        submitFn();
    });
    // 获取验证码
    var codeTime;
    $(document).on('click', '.btn-code', function () {
        if ($(this).hasClass('active')) {
            // 移除活动样式
            $(this).removeClass('active');
            var _self = $(this);
            var num = 10;
            _self.text(num + 's');
            codeTime = setInterval(function () {
                num--;
                _self.text(num + 's');
                if (num <= 0) {
                    clearInterval(codeTime);
                    _self.text('获取验证码');
                    _self.addClass('active');
                }
            }, 1000);
        }
    });

    // 提交审核按钮
    $('.btn-submit').on('click', function () {
        if ($(this).hasClass('active')) {
            alert('可以提交！');
        }
    });

    // 地址下拉框
    $('.address-select .select-choice').on('click', function(event) {
        var e = event || window.event;
        //其它下拉隐藏
        $('.address-select').removeClass('down');
        //下拉效果切换
        $(this).parent().addClass('down');
        //停止冒泡
        e.stopPropagation();
    });
    // 鼠标点击离开来目标，菜单栏隐藏
    $(document).on('click', function() {
        $('.address-select').removeClass('down');
    });
    //下拉菜单停止冒泡
    $('.select-drop').on('click',function(event) {
        var e = event || window.event;
        e.stopPropagation();
    });
    // 地区类型选择
    $('.address-select .select-type li').on('click', function () {
        // 获取索引值
        var idx = $(this).index();
        // 前面的区域已选的情况下，才可以选择再小一些的区域
        if (idx == 0 || $('.address-arr input').eq(idx - 1).val() != '') {
            // 设置活动状态，以及显示对应的内容
            $(this).addClass('active').siblings().removeClass('active');
            $('.select-type-ctn .type-main').eq(idx).show().siblings('.type-main').hide();
        }
    });
    // 地区选择
    $('.address-select .zm-ctn li').on('click', function () {
        // 获取索引值
        var idx = $(this).closest('.type-main').index();
        // 如果是之前选择的，则不向下执行
        if ($(this).hasClass('active')) {
            return false;
        }
        // 清除其他的活动状态，给当前添加活动状态
        $(this).closest('.type-main').find('.active').removeClass('active');
        $(this).addClass('active');
        // 设置并获取相应的text
        $('.address-arr input').eq(idx).attr('value', $(this).text() + '/');
        $('.address-arr input').eq(idx).nextAll('input').attr('value', '');
        var addressText = '';
        $('.address-arr input').each(function () {
            addressText += $(this).attr('value');
        });
        // 设置省市的值
        $(this).closest('.address-select').find('.select-chosen').val(addressText.substr(0, addressText.length-1));
        // 显示下一级地区,如果已经是最后一级了则隐藏下拉列表
        if (idx == $('.select-type li').length - 1) {
             $('.address-select').removeClass('down');
             return false;
        }
        // 地区类型切换
        $(this).closest('.select-drop').find('.select-type li').removeClass('active');
        $(this).closest('.select-drop').find('.select-type li').eq(idx + 1).addClass('active');
        // 内容切换
        $(this).closest('.select-drop').find('.type-main').hide();
        $(this).closest('.select-drop').find('.type-main').eq(idx + 1).show();
    });

    // 切换资质文件显示隐藏
    $('.toggle-show').on('click', function() {
        $(this).toggleClass('active');
        $(this).next('.file-ctn').toggleClass('active');
    });


	// 弹窗-编辑资质
	$(document).on('click', '.file-edit', function () {
		$(this).closest('li').find('.img-up').click();
	});

	//关闭弹窗
	$('.pop-up .btn-close, .pop-up .close').on('click', function(){
		$(this).closest('.pop-up').hide();
	});

	// 上传图片and预览
    var num = 0;
    var progressIn = null;
    var progressEnd = null;
	$(document).on('change', '.file-ctn .img-up', function(){
		var self = $(this).closest('li');
        //判断是否支持FileReader
        if (window.FileReader) {
            var reader = new FileReader();
        } else {
			alert('您的设备不支持图片预览功能，如需该功能请升级您的设备！');
            return false;
        }
        //获取文件
        var file = this.files[0];
        var imageType = /^image\//;
        //是否是图片
        if (!imageType.test(file.type)) {
			alert('请选择图片文件！')
            return false;
        }
        //读取完成
        reader.onload = function(e) {
             // 图片路径设置为读取的图片
            var imgSrc = e.target.result;
            self.find('img').attr('src', imgSrc);
            // 移除img-add
            self.find('.file-img').removeClass('img-add');
            //显示上传进度条 
            self.find('.upload-progress').show();
            self.find('.upload-progress .close').show();
            progressIn = setInterval(function(){
                num++;
                if(num > 99){
                    clearInterval(progressIn);
                    return false;
                }
                self.find('.upload-progress .progress-num').text(num+'%');
                self.find('.upload-progress .progress-width').css('width',num+'%');
            }, 100);

            // 上传成功
            // clearInterval(progressIn);
            // self.find('.upload-progress .close').hide();
            // progressEnd = setInterval(function(){
            //     num++;
            //     if(num > 100){
            //         clearInterval(progressEnd);
            //         self.find('.upload-progress .progress-txt').text('上传完成');
            //         self.find('.upload-progress').hide();
            //         return false;
            //     }
            //     self.find('.upload-progress .progress-num').text(num+'%');
            //     self.find('.upload-progress .progress-width').css('width',num+'%');
            // }, 10);
            // 如果没有 编辑 按钮，则添加一个
            if (!self.find('.file-edit')[0]) {
            	self.find('.file-type').append('<span class="file-edit"></span>');
            }
            // 如果有 已过期 标记，就移除
            if (self.find('.icon-due')[0]) {
            	self.find('.icon-due').remove();
            }
        };
        reader.readAsDataURL(file);
	});

    // // 取消上传
    // var cancelFile = null;
    // $(document).on('click', '.upload-progress .close', function() {
    //     // 清除定时器
    //     clearInterval(progressIn);
    //     clearInterval(progressEnd);
    //      var xhr = new XMLHttpRequest();
    //     xhr.abort();
    //     // 隐藏进度条
    //     $(this).closest('li').find('.upload-progress').hide();
    //     // 清空图片
    //     $(this).closest('li').find('img').attr('src','');
    //     $(this).closest('li').find('.file-img').addClass('img-add');
    // });

	// 查看大图
	$(document).on('click', '.file-img img', function () {
		$('.view-img img').attr('src', $(this).attr('src'));
		$('.view-img').show();
	});
	$('.view-img').on('click', function () {
		$(this).hide();
	});

});