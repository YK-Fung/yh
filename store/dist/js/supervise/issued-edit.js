define(['jquery', 'datetime', 'ZeroClipboard'], function($, ZeroClipboard){

	//ZeroClipboard is not defined 的解决方法
	window['ZeroClipboard'] = ZeroClipboard;

	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	// 类型选择
	$('.type li').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
		$(this).find('input').prop('checked', true);
	});
	// 返回
	$('.btn-back').on('click', function () {
		history.back();
	});
});