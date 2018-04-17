define(['jquery', 'datetime', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){
	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	// 删除
	var _self = null;
	$(document).on('click', '.icon-del',function () {
		_self = $(this).closest('tr');
		$('.delete-page').modal('show');
	});
	$('.delete-page .btn-yes').on('click', function () {
		_self.remove();
	});

	//全选
	$(document).on('click', '.checkall', function() {
		var checkBox = $('tbody input[type=checkbox]');//单选框
		checkBox.prop('checked',this.checked);
	});

	//单选
	$(document).on('click', 'tbody input[type=checkbox]',function() {
		$('.checkall').prop('checked',$('tbody input[type=checkbox]').length == $('tbody input[type=checkbox]:checked').length ? true : false);
	});

	//批量删除
	$('.del-btn').on('click', function() {
		$('.delete-all').modal('show');
	});
	
	//确定批量删除
	$('.delete-all .btn-yes').on('click', function() {
		if($('tbody input[type=checkbox]:checked').length > 0){
			//删除DOM节点
			$('tbody input[type=checkbox]:checked').closest('tr').remove();
			$('.delete-all').modal('hide');
		}else {
			alert('请选择要删除的资讯详情！')
		}
	});
});