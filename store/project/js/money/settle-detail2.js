define(['jquery'], function($){

	// 表格显示or隐藏
	$('.order-header').on('click', function () {
		$(this).closest('.order-table').toggleClass('active');
	});
	// 返回按钮点击
	$('.btn-back').on('click', function () {
		history.back();
	});

});