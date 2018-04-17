define(['jquery', 'datetime' ,'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	//取消违禁
	var obj = null;
	$(document).on('click', '.cancel-violate', function() {
		obj = $(this).closest('tr');
		$('.pop-cancel').modal('show');
	});

	//确定取消违禁
	$('.pop-cancel .btn-yes').on('click', function() {
		//请求成功
		obj.remove();
	});
	
	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});
});