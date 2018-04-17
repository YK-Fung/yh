define(['jquery', 'jquery-migrate-1.1.0.min', 'jquery.jqprint', 'bar-slider', 'bar-header', 'popwin','ie-tip'], function($){

	//展开收起内容
	$('.arrow').click(function() {
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).parent('.type-name').next('.toggle-ctn').removeClass('active');
		}else {
			$(this).addClass('active');
			$(this).parent('.type-name').next('.toggle-ctn').addClass('active');
		}
	});

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-yes,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});

	//选择银行卡-弹窗
	var objDom;
	$(document).on('click', '.binding', function() {
		objDom = $(this).closest('li');
		$('#pop-choose-bank').show();
	});

	//选择银行卡-选中
	$(document).on('click', '#pop-choose-bank li', function() {
		$(this).addClass('active').siblings().removeClass('active');
	});

	//选择银行卡-确定
	$(document).on('click', '#pop-choose-bank .btn-yes', function() {
		//有选中银行卡
		if($('#pop-choose-bank li').hasClass('active')){
			//发送请求 成功返回
			$('.binding').text('修改');//绑定按钮变成修改按钮
			$('.binding').addClass('already');//已经绑定样式
			objDom.find('.account-ntm').text('123456');//填充银行账号
			objDom.find('.bank-name').text('广州xxx银行支行');//填充银行账号
		}
	});
	// 预览合同
	$('.btn-view').on('click', function () {
		// 隐藏原本的内容
		$('.main-ctn').hide();
		// 克隆合同的内容，并显示。
		var contractHtml = $('.contract').clone();
		$('.contract-view .contract-print').html(contractHtml);
		$('.contract-view input').attr('readonly', true);
		$('.contract-view').show();
	});
	// 打印合同
	$('.btn-print').on('click', function () {
		// 如果是直接打印，不是在预览页面打印
		if ($(this).closest('.contract-view').length <= 0) {
			var contractHtml = $('.contract').clone();
			$('.contract-view .contract-print').html(contractHtml);
			$('.contract-view input').attr('readonly', true);
		}
		$('.contract-print').jqprint();
	})
	// 预览合同返回
	$('.contract-view .btn-back').on('click', function () {
		// 清空打印的内容并且隐藏
		$('.contract-print').html('');
		$('.contract-view').hide();
		// 显示原本的内容
		$('.main-ctn').show();
	});
});