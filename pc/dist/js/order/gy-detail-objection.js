define(['jquery', 'bar-slider', 'bar-header','ie-tip'], function($){

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
		$('#pop-logistics-detail').show();
	});

	//查看第三方物流
	$(document).on('click', '.logistics-third', function() {
		$('#pop-logistics-third').show();
	});

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-yes,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});

	//同意退款
	$(document).on('click', '.agree-refund', function() {
		$('#pop-tip-txt .ctn-txt').text('确定要同意退款吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'agree-refund-confirm');
		$('#pop-tip-txt').show();
	});

	//拒绝退款
	$(document).on('click', '.refuse-refund', function() {
		$('#pop-refuse-refund .btn-yes').attr('data', 'refuse-refund-confirm');
		$('#pop-refuse-refund').show();
	});
	
	//确认收货
	$(document).on('click', '.confirm-delivery', function() {
		$('#pop-tip-txt .ctn-txt').text('确定要确认收货吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'confirm-deliver');
		$('#pop-tip-txt').show();
	});
	//确定提示框按钮
	$('.pop-shade .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'agree-refund-confirm':
				//同意退款
				console.log('同意退款');
				break;
			case 'refuse-refund-confirm':
				//拒绝退款
				console.log('拒绝退款');
				break;
			case 'confirm-deliver':
				//确认收货
				console.log('确认收货');
				break;
		}
	});
});