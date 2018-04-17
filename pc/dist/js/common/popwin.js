define(['jquery'], function($){

	// 弹窗使用jq自带的fadeIn、fadeOut控制显示隐藏
	// 打开弹窗
	$(document).on('click', '.btn-open', function () {
		$('#pop-name').fadeIn('fast');
	});
	// 确定按钮
	$('#pop-name .btn-yes').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});
	// 取消or关闭按钮
	$('#pop-name .btn-no, #pop-name .header-close').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});

});