define(['jquery', 'datetime', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	// 新增
	$('.btn-add').on('click', function () {
		$('.type-add').modal('show');
	});

	// 编辑
	$('.icon-edit').on('click', function () {
		$('.type-edit').modal('show');
	});

	// 删除
	var _self = null;
	$('.icon-del').on('click', function () {
		_self = $(this).closest('tr');
		$('.type-del').modal('show');
	});
	$('.type-del .btn-yes').on('click', function () {
		_self.remove();
	});

});