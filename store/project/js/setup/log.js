define(['jquery','table', 'table-tool', 'table-export', 'tableExport', 'zh', 'pagination'], function($){
	// 删除
	var _self = null;
	$(document).on('click', '.icon-del',function () {
		_self = $(this).closest('tr');
		$('.delete-brand').modal('show');
	});
	$('.delete-brand .btn-yes').on('click', function () {
		_self.remove();
	});
	
	// 初始化页码
	paginationArg.init($('.wrap'), $('.pagination .active').text(), $('.page-amount').text());
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});