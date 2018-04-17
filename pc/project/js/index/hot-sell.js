define(['jquery', 'yhw-nav2', 'yhw-header2', 'yhw-topbar2', 'yhw-sidebar2','ie-tip'], function($){

	// 本周or本月类型选择
	$('.type-select li').on('click', function () {
		$(this).addClass('active').siblings('li').removeClass('active');
	});

});