define(['jquery'], function($){
	// 切换左侧导航
	$('.toggle-ctn').on('click', function() {
		$(this).siblings('ul').toggle();
		if($(this).hasClass('glyphicon-minus-sign')){
			$(this).addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
		}else {
			$(this).addClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign');
		}

	});
	
});
