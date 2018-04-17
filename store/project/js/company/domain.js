define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	//不通过弹窗
	$(document).on('click', '.btn-no', function() {
		$('.model-no').modal('show');
	});
	// 不通过原因
	$(document).on('input propertychange', '.nopass-reason', function () {
		var newVal = $(this).val();
		if (newVal.length > 30) {
			newVal = newVal.substr(0, 30);
		}
		$(this).val(newVal);
	});

	//提交不通过原因
	$('.model-no').on('click', '.btn-yes', function() {
		$('.model-no').modal('hide');
	});
});