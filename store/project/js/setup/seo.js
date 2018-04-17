define(['jquery', 'pagination'], function($){

	// 新增
	$(document).on('click', '.btn-add', function () {
		$('.seo-add').modal('show');
	});
	// 确定新增
	$(document).on('click', '.seo-add .btn-yes', function () {
		console.log('新增成功！');
	});

	// 删除
	var _self = null;
	$(document).on('click', '.icon-del',function () {
		_self = $(this).closest('tr');
		$('.delete-brand').modal('show');
	});
	$('.delete-brand .btn-yes').on('click', function () {
		_self.remove();
	});

	//编辑
	$(document).on('click', '.icon-edit', function() {
		$('.seo-detail').modal('show');
		//复制td的值
		var object = $(this).closest('tr').find('td');
		var _length = object.length-2;
		for (var i = 0; i <= _length; i++) {
			var txts = object.eq(i).text();
			//传值给编辑弹窗
			$('.seo-detail').find('input').eq(i).val(txts);
		}
	});

	// 初始化页码
	paginationArg.init($('.wrap'), $('.pagination .active').text(), $('.page-amount').text());
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});