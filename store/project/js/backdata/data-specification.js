define(['jquery','ZeroClipboard', 'datetime' ,'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($,ZeroClipboard){

	//ZeroClipboard is not defined 的解决方法
	window['ZeroClipboard'] = ZeroClipboard;

	//取消
	var obj = null;
	$('.table').on('click', '.icon-del', function() {
		obj = $(this).closest('tr');
		$('.pop-cancel').modal('show');
	});

	//确定取消
	$('.pop-cancel .btn-yes').on('click', function() {
		//请求成功
		obj.remove();
	});
	
	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	//新增说明书
	$('.add-specification').on('click', function() {
		//清空内容
		$('.pop-add-specification input').val('');
		ue.setContent('')
		$('.pop-add-specification').modal('show');
	});

	//确定新增
	$('.pop-add-specification .btn-yes').on('click', function() {
		
	});

	//编辑说明书
	$(document).on('click', '.icon-edit', function() {
		$('.pop-add-specification').modal('show');
	});
});