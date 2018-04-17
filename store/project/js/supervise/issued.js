define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 查看
	$('.view').on('click', function () {
		$('.issued-view').modal('show');
	});
	// 回复
	$('.answer').on('click', function () {
		$('.issued-answer').modal('show');
	});

	// 删除
	var _self = null;
	$('.icon-del').on('click', function () {
		_self = $(this).closest('tr');
		$('.issued-del').modal('show');
	});
	$('.issued-del .btn-yes').on('click', function () {
		_self.remove();
	});

});