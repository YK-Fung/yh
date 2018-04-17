define(['jquery', 'bar-slider', 'bar-header','ie-tip'], function($){

	;(function selectBoxFn () {
        //下拉列表切换
        $(document).on('click', '.select-box .select-choice', function(event) {
            var e = event || window.event;
            //其它下拉隐藏
            $('.select-box').removeClass('down');
            //下拉效果切换
            $(this).parents('.select-box').toggleClass('down');
            //停止冒泡
            e.stopPropagation();
        });

        // 鼠标点击离开来目标，菜单栏隐藏
        $(document).on('click', function() {
            $('.select-box').removeClass('down');
        });

        //选中下拉选项
        $(document).on('click', '.select-box .select-drop li', function(event) {
            var e = event || window.event;
            var _txt = $(this).text();
            var _data = $(this).attr('data');
            //添加选中select值
            $(this).closest('.select-box').find('.select-text').text(_txt);
            $(this).closest('.select-box').find('.select-input').val(_data);
            //隐藏下拉列表
            $(this).closest('.select-box').removeClass('down');
            e.stopPropagation();
        }); 
    }());

	// 固话输入框
	$('.input-num').on('blur', function (){
		var inputNum;
		if ($.trim($('.form-ctn .fj').val()) !== '') {
			inputNum = $('.form-ctn .qh').val() + '-' + $('.form-ctn .phone-num').val() + '-' + $('.form-ctn .fj').val();
		}
		else {
			inputNum = $('.form-ctn .qh').val() + '-' + $('.form-ctn .phone-num').val();
		}
		if ($(this).val() !== '' && !(/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/.test(inputNum))) {
			$(this).closest('.form-ctn').find('.error-tip').show();
		}
		else{
			$(this).closest('.form-ctn').find('.error-tip').hide();
		}
	});
	// QQ输入框
	$('.input-qq').on('blur', function (){
		if ($(this).val() != '' && !(/^[1-9]\d{4,9}$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 微信输入框
	$('.input-wx').on('blur', function (){
		if ($(this).val() != '' && !(/^[a-zA-Z\d_]{5,}$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});

	// 保存
	$('.btn-save').on('click', function (event) {
		var e = event || window.event;
		// 验证项
		var verify = false;
		var verifyNum = 0;
		$('.error-tip').each(function (){
			if( $(this).is(':hidden') ){
				verifyNum ++;
			}
		});
		if (verifyNum == $('.error-tip').length) {
			verify = true;
		}
		// 判断数据是否符合要求
		if (verify) {
			$('#pop-success .tip-text').text('保存成功！');
			$('#pop-success').show();
		}
		else {
			$('#pop-success .tip-text').text('请检查填写的内容格式是否有误！');
			$('#pop-success').show();
		}
		e.preventDefault();
	});

	// 关闭弹窗
	$('#pop-success .btn-no, #pop-success .header-close,#pop-success .btn-yes').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});
});