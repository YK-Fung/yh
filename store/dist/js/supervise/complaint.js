define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 查看
	$('.view').on('click', function () {
		$('.complaint-view').modal('show');
	});
	// 回复
	$('.answer').on('click', function () {
		$('.complaint-answer').modal('show');
	});

	// 删除
	// var _self = null;
	// $('.icon-del').on('click', function () {
	// 	_self = $(this).closest('tr');
	// 	$('.supervise-del').modal('show');
	// });
	// $('.supervise-del .btn-yes').on('click', function () {
	// 	_self.remove();
	// });

});