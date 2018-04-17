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

	//提醒发货
	$(document).on('click', '.warn-deliver', function() {
		$('#pop-tip-txt .ctn-txt').text('提醒发货成功！');
		$('#pop-tip-txt .btn-yes').attr('data', 'warn-deliver-confirm');
		$('#pop-tip-txt').show();
	});

	//确定提示框按钮
	$('.pop-shade .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'warn-deliver-confirm':
				//提醒发货
				console.log('提醒发货');
				break;
		}
	});

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-yes,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});
});