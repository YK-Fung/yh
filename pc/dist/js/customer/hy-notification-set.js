define(['jquery', 'bar-slider', 'bar-header','ie-tip'], function($){
	//订阅选项
	$('.dy-options li').on('click', function () {
		$(this).toggleClass('active');
	});
	//推送选项
	$('.ts-options li').on('click', function () {
		$(this).addClass('active').siblings('li').removeClass('active');
	});
});