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

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-yes,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});

	/*取消退款*/
	$(document).on('click', '.cancel-refund', function() {
		$('#pop-tip-txt .ctn-txt').text('确定要取消退款吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'cancel-refund-confirm');
		$('#pop-tip-txt').show();
	});

	/*申请客服介入*/
	$(document).on('click', '.apply-service', function() {
		$('#pop-tip-txt .ctn-txt').text('申请客服介入吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'apply-service-confirm');
		$('#pop-tip-txt').show();
	});

	// 验收
	$(document).on('click', '.check-accept.active', function() {
		$('#pop-tip-txt .ctn-txt').text('确认验收当前批次？');
		$('#pop-tip-txt .btn-yes').attr('data', 'check-accept-confirm');
		$('#pop-tip-txt').show();
	});

	//查看物流
	$(document).on('click', '.logistics-check', function() {
		$('#pop-logistics-detail').show();
	});

	//查看第三方物流
	$(document).on('click', '.logistics-third', function() {
		$('#pop-logistics-third').show();
	});

	//确定提示框按钮
	$('.pop-shade .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'cancel-refund-confirm':
				//取消退款
				console.log('取消退款');
				break;
			case 'apply-service-confirm':
				//申请客服介入
				console.log('申请客服介入');
				break;
			case 'check-accept-confirm':
				//验收
				console.log('验收');
				break;
		}
	});
});