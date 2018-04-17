define(['jquery'], function($){
	//导航鼠标移上
	$('.classify-btn').on('mouseenter', function() {
		$('.yhw-nav .classify-title').show();
	});
	// 查看分类
	$('.yhw-nav .classify-title').on('mouseenter', 'li', function() {
		$('.yhw-nav .classify-ctn').show();
	});
	//鼠标离开
	$('.yhw-nav .classify-btn').on('mouseleave', function() {
		$('.yhw-nav .classify-title').hide();
		$('.yhw-nav .classify-ctn').hide();
	});
});