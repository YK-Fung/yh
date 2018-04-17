define(['jquery', 'datetime' ,'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	var obj = null;
	//取消违禁
	$(document).on('click', '.cancel-violate', function() {
		obj = $(this).closest('tr');
		$('.pop-cancel').modal('show');
	});

	//确定取消违禁
	$('.pop-cancel .btn-yes').on('click', function() {
		//请求成功
		obj.remove();
	});

	//批量新增
	$('.add-form').on('click', function() {
		$('.pop-backdata-add').modal('show');
	});

	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	//限制文件格式
	$('.file-updata').change(function() {
		var _val = $(this).val()
		var index1 = _val.lastIndexOf(".")
		var index2 = _val.length;
		var postf =_val.substring(index1,index2);//后缀名

		if(postf != ".xls" && postf != ".xlsx"){
			$(this).val('');
			alert('格式不符合需求，请上传‘.xls’‘.xlsx’格式的文件！')
		}
	});
});