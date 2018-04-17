define(['jquery', 'datetime', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	//全选
	$(document).on('click', '.select-all', function() {
		if($(this).prop("checked")){
			//全选
			$('.main-table input[type="checkbox"]').prop("checked", true);
		}else {
			//取消全选
			$('.main-table input[type="checkbox"]').prop("checked", false);
		}
	});

	//单选
	$(document).on('change', '.select-this',function() {
		if($('tbody input[type="checkbox"]').length == $('tbody input[type=checkbox]:checked').length){
			$('.select-all').prop("checked", true);
		}else{
			$('.select-all').prop("checked", false);
		}
	});

	//审核
	$(document).on('click', '.check-order', function() {
		$('.pop-tips .text-primary').text('审核');
		$('.pop-tips .text-muted').text('是否确认审核？');
		$('.pop-tips .btn-yes').attr('data','check-order');
		$('.pop-tips').modal('show');
	});

	//结算
	$(document).on('click', '.settle-accounts', function() {
		$('.pop-tips .text-primary').text('结算');
		$('.pop-tips .text-muted').text('是否确认结算？');
		$('.pop-tips .btn-yes').attr('data','settle-accounts');
		$('.pop-tips').modal('show');
	});

	//服务费率详情
	$(document).on('click', '.cost-detail', function() {
		$('.pop-cost-detail').modal('show');
	});

	//弹窗确定
	$('.pop-tips .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'check-order':
				//审核
				console.log('审核');
				break;
			case 'settle-accounts':
				//结算
				console.log('结算');
				break;
		}
	});
});