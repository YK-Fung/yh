define(['jquery', 'bar-slider', 'bar-header', 'verify', 'ie-tip'], function($){

	// 再次输入密码框
	$('.form-second input').on('blur', function () {
		if ($(this).val() != $('.input-pwd').val()) {
			$('.pwd-tip').show();
		}
		else {
			$('.pwd-tip').hide();
		}
	});
	// 确认提交
	$('.btn-submit').on('click', function () {
		if ($('.input-pwd').val() != '' && $('.error-tip').is(':hidden') && $('.input-pwd').val() == $('.form-second input').val()) {
			$('#pop-success').fadeIn('fast');
		}
		else{
			$('#pop-fail').fadeIn('fast');
		}
	});
	// 取消or关闭按钮
	$('.pop-shade .btn-no, .pop-shade .header-close').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});
});