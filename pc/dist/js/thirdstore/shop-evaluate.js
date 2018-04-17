define(['jquery', 'yhw-nav2', 'yhw-header2', 'yhw-topbar2', 'yhw-sidebar2', 'pagination2', 'ie-tip'], function($){

	// 初始化页码
	paginationArg.init($('.wrap'), $('.page-amount').text());

	// 评论类型选择
	$('.evaluate-select li').on('click', function (){
		$(this).addClass('active').siblings('li').removeClass('active');
		// 初始化页码
		paginationArg.init($('.wrap'), $('.page-amount').text());
		paginationArg.ajaxFn = function () {
			console.log(paginationArg.viewNum);
		};
	});

});

