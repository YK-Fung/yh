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

	// 验收
	$(document).on('click', '.check-accept.active', function() {
		$('#pop-tip-txt .ctn-txt').text('确认验收当前批次？');
		$('#pop-tip-txt .btn-yes').attr('data', 'check-accept-confirm');
		$('#pop-tip-txt').show();
	});

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-yes,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});

	//确定提示框按钮
	$('.pop-shade .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'check-accept-confirm':
				//验收
				console.log('验收');
				break;
		}
	});
});