define(['jquery', 'popwin', 'yhw-topbar2','yhw-nav2', 'yhw-header2', 'yhw-sidebar2','ie-tip'], function($){
	//帮助中心导航切换
	$('.category-name').on('click', function() {
		if(!$(this).parent('.list').hasClass('cur')){
			$('.lf-nav .list').removeClass('cur');
			$(this).parent('.list').addClass('cur');
		}else {
			$('.lf-nav .list').removeClass('cur');
			$(this).parent('.list').removeClass('cur');
		}
	});

	//选中
	$('.list').on('click', 'li', function() {
		$(this).closest('.lf-nav').find('li').removeClass('active');
		$(this).addClass('active');
	});

});

