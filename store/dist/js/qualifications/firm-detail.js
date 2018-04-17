define(['jquery', 'datetime'], function($){

	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	// 页面初始化
	var init = function () {
		if ($('.wrap-ctn').hasClass('edit')) {
			$('.wrap-ctn .disabled').removeClass('disabled');
			$('.wrap-ctn input').attr('disabled', false);
		}
		else {
			$('.wrap-ctn input').addClass('disabled');
			$('.wrap-ctn input').attr('disabled', true);
		}
	};
	init();

	// 点击查看图片
	$('.detail-img img').on('click', function () {
		$('.view-img img').attr('src', $(this).attr('src'));
		$('.view-img').modal('show');
	});

	// 修改按钮点击
	$('.btn-edit').on('click', function () {
		$('.wrap-ctn').addClass('edit');
		init();
	});
	// 保存按钮点击
	$('.btn-save').on('click', function () {
		$('.wrap-ctn').removeClass('edit');
		init();
		// history.back();
	});
	// 取消按钮点击
	$('.btn-cancel').on('click', function () {
		$('.wrap-ctn').removeClass('edit');
		init();
		history.back();
	});
});