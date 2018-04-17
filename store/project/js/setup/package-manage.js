define(['jquery', 'datetime', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){
	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});
	
	/*
	 *删除
	 */
	 //全选
	$(document).on('click', '.checkbox-all', function() {
		var checkBox = $('tbody input[type="checkbox"]');//单选框
		checkBox.prop('checked',this.checked);
	});
	//单选
	$(document).on('click', 'tbody input[type=checkbox]',function() {
		$('.checkbox-all').prop('checked',$('tbody input[type="checkbox"]').length == $('tbody input[type="checkbox"]:checked').length ? true : false);
	});
	$('#package-delete .btn-yes').on('click', function () {
		if(_self){
			// 删除单个
			_self.remove();
		}else {
			// 批量刪除
			$('tbody tr').each(function() {
				if($(this).find('input[type=checkbox]').prop('checked')){
					$(this).remove();
				}
			});
		}
	});
	// 批量刪除
	$('.all-delete').on('click', function() {
		var deleteTable = 0;
		$('tbody tr').each(function() {
			if($(this).find('input[type=checkbox]').prop('checked')){
				deleteTable ++;
			}
		});
		if(deleteTable > 0){
			_self = null;
			$('#package-delete').modal('show');
		}
	});

	// 新增会员
	$('.add-package').on('click', function() {
		// 重置表单
		$('#pop-add-package input').val('');
		$('#pop-add-package textarea').val('');
		$('#pop-add-package').modal('show');
	});

	//保存
	$('#pop-add-member .btn-yes').on('click', function() {
		
	});
});