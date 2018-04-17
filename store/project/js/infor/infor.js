define(['jquery', 'datetime', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	//全选
	var checkBox = $('tbody input[type=checkbox]');//单选框
	$(document).on('click', '.checkall', function() {
		checkBox.prop('checked', $(this).find('input')[0].checked);
	});

	//单选
	checkBox.on('click', function() {
		$('.checkall').prop('checked',checkBox.length == $('tbody input[type=checkbox]:checked').length ? true : false);
	});

	//批量删除
	$('.btn-del').on('click', function() {
		$('.infor-del').modal('show');
	});
	

	// 删除
	var _self = null;
	$('.icon-del').on('click', function () {
		_self = $(this).closest('tr');
		$('.infor-del').modal('show');
	});
	$('.infor-del .btn-yes').on('click', function () {
		if (_self) {
			_self.remove();
		}
		else{
			$('tbody input[type=checkbox]:checked').closest('tr').remove();
			$('.delete-all').modal('hide');
		}
	});

});