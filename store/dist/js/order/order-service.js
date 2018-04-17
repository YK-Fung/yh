define(['jquery'], function($){

	//展开收起内容
	$('.arrow').click(function() {
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).closest('.type-name').next('.toggle-ctn').removeClass('active');
		}else {
			$(this).addClass('active');
			$(this).closest('.type-name').next('.toggle-ctn').addClass('active');
		}
	});

	//查看物流
	$(document).on('click', '.logistics-check', function() {
		$('#pop-logistics-detail').modal('show');
	});

	//查看第三方物流
	$(document).on('click', '.logistics-third', function() {
		$('#pop-logistics-third').modal('show');
	});

	// 同意退款
	$(document).on('click', '.agree-refund', function() {
		$('#pop-tip-txt .text-primary').text('同意退款');
		$('#pop-tip-txt .text-muted').text('是否同意退款？');
		$('#pop-tip-txt .btn-yes').attr('data', 'agree-refund');
		$('#pop-tip-txt').modal('show');
	});

	// 拒绝退款
	$(document).on('click', '.refuse-refund', function() {
		$('#pop-refuse-refund .btn-yes').attr('data', 'refuse-refund');
		$('#pop-refuse-refund').modal('show');
	});

	//确定提示框按钮
	$('.modal .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'refuse-refund':
				//拒绝退款
				console.log('拒绝退款');
				break;
			case 'agree-refund':
				//同意退款
				console.log('同意退款');
				break;
		}
	});
});