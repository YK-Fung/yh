define(['jquery','yhw-sidebar2','yhw-topbar2','yhw-header2','ie-tip','pagination2'], function($){
	// 初始化页码
	paginationArg.init($('.wrap'), $('.page-amount').text());
	paginationArg.ajaxFn = function () {
		console.log(paginationArg.viewNum);
	};
});
