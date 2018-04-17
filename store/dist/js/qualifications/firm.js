define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 删除
	var _self = null;
	$('.icon-del').on('click', function () {
		_self = $(this).closest('tr');
		$('.qualifications-detail').modal('show');
	});
	$('.qualifications-detail .btn-yes').on('click', function () {
		_self.remove();
	});

});