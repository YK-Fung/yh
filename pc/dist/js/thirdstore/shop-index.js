define(['jquery', 'yhw-nav2', 'yhw-header2', 'yhw-topbar2', 'yhw-sidebar2','ie-tip'], function($){

	// 收藏店铺
	$('.btn-collect').on('click', function () {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).html('<input name="" type="checkbox" value="1">收藏店铺');
		} else {
			$(this).addClass('active');
			$(this).html('<input name="" type="checkbox" value="1" checked>已收藏');
		}
	});

	console.log('供应商店铺首页！');

});

