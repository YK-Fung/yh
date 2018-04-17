define(['jquery', 'pagination'], function($){


	// 返回按钮点击
	$('.btn-back').on('click', function () {
		history.back();
	});

	// 页码默认事件取消
	$('.pagination a').on('click', function (e) {
		e.preventDefault();
	});
	// 初始化页码
	paginationArg.init($('.wrap'), $('.pagination .active').text(), $('.page-amount').text());
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};

});