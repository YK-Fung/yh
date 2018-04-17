define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 删除
	var _self = null;
	$(document).on('click', '.icon-del',function () {
		_self = $(this).closest('tr');
		$('.modal-del').modal('show');
	});
	$('.modal-del .btn-yes').on('click', function () {
		_self.remove();
	});

	// 新增
	$('.btn-add').on('click', function () {
		$('.modal-edit .modal-title').text('新增配置类型');
		$('.modal-edit').modal('show');
	});

	//编辑
	$(document).on('click', '.icon-edit', function() {
		$('.modal-edit .modal-title').text('编辑配置类型');
		$('.modal-edit').modal('show');
	});

});