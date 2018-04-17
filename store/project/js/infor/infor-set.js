define(['jquery','ZeroClipboard'],function($,ZeroClipboard){

	//ZeroClipboard is not defined 的解决方法
	window['ZeroClipboard'] = ZeroClipboard;

	// 选择接收人
	$('.receive-select').on('click', function () {
		var idx = $(this).parent().index();
		$('.receive-ctn').eq(idx).show().siblings().hide();
	});

	// 返回
	$('.btn-back').on('click', function () {
		window.history.back();
	});

});