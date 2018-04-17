define(['jquery', 'datetime', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	// 查看详情
	$('.detail').on('click', function () {
		$('.firm-detail .modal-title').text('详细信息');
		// 隐藏 确定、关闭。
		$('.firm-detail .btn-group2').hide();
		// 显示返回
		$('.firm-detail .btn-group1').show();
		// 禁用input
		$('.firm-detail input').attr('disabled', true);
		// 隐藏单选框
		$('.firm-detail .active').show().siblings().hide();
		$('.radio-inline input').hide();
		$('.firm-detail').modal('show');
	});
	// 编辑信息
	$('.icon-edit').on('click', function () {
		$('.firm-detail .modal-title').text('编辑信息');
		// 显示 确定、关闭。
		$('.firm-detail .btn-group2').show();
		// 隐藏 返回
		$('.firm-detail .btn-group1').hide();
		// 取消禁用input
		$('.firm-detail input').attr('disabled', false);
		// 显示单选框
		$('.radio-inline').show();
		$('.radio-inline input').show();
		$('.firm-detail').modal('show');
	});
	// 单选
	$('.radio-inline').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
	});

	// 删除
	var _self = null;
	$('.icon-del').on('click', function () {
		_self = $(this).closest('tr');
		$('.backdata-del').modal('show');
	});
	$('.backdata-del .btn-yes').on('click', function () {
		_self.remove();
	});

});