define(['jquery', 'pagination'], function($){
	// 删除
	var _self = null;
	$(document).on('click', '.icon-del',function () {
		_self = $(this).closest('tr');
		$('.delete-link').modal('show');
	});
	$('.delete-link .btn-yes').on('click', function () {
		_self.remove();
	});

	//是否启用
	$(document).on('click', '.icon-yes', function() {
		var _data = $(this).closest('tr').data('use');
		//如果已启用去掉勾  如果未启用打上勾
		if(_data){
			$(this).closest('tr').find('.using').children('img').remove();
		}else if (!_data){
			$(this).closest('tr').find('.using').append('<img src="../../img/iframe/yes.png">');
		}
		$(this).closest('tr').data('use',!_data);
	});

	// 初始化页码
	paginationArg.init($('.wrap'), $('.pagination .active').text(), $('.page-amount').text());
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});