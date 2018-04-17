define(['jquery', 'bar-slider', 'bar-header','ie-tip'], function($){
	;(function selectBoxFn () {
		//下拉列表切换
		$(document).on('click', '.select-box .select-choice', function(event) {
			var e = event || window.event;
			//其它下拉隐藏
			$('.select-box').removeClass('down');
			//下拉效果切换
			$(this).parents('.select-box').toggleClass('down');
			//停止冒泡
			e.stopPropagation();
		});

		// 鼠标点击离开来目标，菜单栏隐藏
		$(document).on('click', function() {
			$('.select-box').removeClass('down');
		});

		//选中下拉选项
		$(document).on('click', '.select-box .select-drop li', function(event) {
			var e = event || window.event;
			var _txt = $(this).text();
			var _data = $(this).attr('data');
			//添加选中select值
			$(this).closest('.select-box').find('.select-text').text(_txt);
			$(this).closest('.select-box').find('.select-input').val(_data);
			//隐藏下拉列表
			$(this).closest('.select-box').removeClass('down');
			e.stopPropagation();
		});	
	}());
	
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

	//切换退款 和 退货
	$(document).on('click', '.operate .select-box .select-drop li', function() {
		var _txt = $(this).text();
		$(this).closest('.return-list').find('.return-name').text(_txt);
		if(_txt == '退货'){
			$(this).closest('.return-list').removeClass('return-sum-list').addClass('return-good-list');
		}else if (_txt == '退款') {
			$(this).closest('.return-list').removeClass('return-good-list').addClass('rreturn-sum-list');
		}
		totalFn();
	});

	// 退款总数 退款总额
	var totalFn = function () {
		var totalNum = 0;
		var totalSum = 0;
		$('.return-order .return-good-list').each(function () {
			totalNum += parseFloat($(this).find('.amount-num').val());
		});

		$('.return-order .return-list').each(function () {
			totalSum += parseFloat($(this).find('.return-prices').text());
		});

		// 退货总数
		$('.return-order .refund-num').text(totalNum);
		// 退款总额
		$('.return-order .refund-sum').text(totalSum.toFixed(2));
		//实付金额
		var actuallyPaid = $('.return-order .actually-paid').text();
		//订单总额
		var payTotalSum = $('.order-ctn .pay-total-sum').text();
		//实际退款 [ 实际退款 = 实付金额-（ 订单总额 - 退款总额 ）]
		var actuallyBack = actuallyPaid-(payTotalSum-totalSum);
		if(actuallyBack <=0 ){
			actuallyBack = 0;
		}
		$('.return-order .actually-back').text(actuallyBack.toFixed(2));
	};

	// 小计
	var subtotalFn = function (parent, val) {
		//单价
		var priceNum = parseFloat(parent.find('.price-num').text());
		var subtotalNum = (priceNum * val).toFixed(2);
		parent.find('.return-prices').text(subtotalNum);
		//退款总数 退款总额
		totalFn();
	};

	// 数量调整-增加
	$('.return-order .product-list').on('click', '.amount-add', function () {
		var parent = $(this).closest('li');
		//输入数量
		var input = $(this).siblings('.amount-num');
		//采购总数
		var quantity = $(this).siblings('.quantity').find('span').text();
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= quantity) {
			newVal = quantity;
		}
		input.val(newVal);
		subtotalFn(parent, newVal);
	});

	// 数量调整-减少
	$('.return-order .product-list').on('click', '.amount-reduce', function () {
		var parent = $(this).closest('li');
		//输入数量
		var input = $(this).siblings('.amount-num');
		// 数量,最小1
		var newVal = parseInt(input.val(), 10) - 1;
		if (newVal <= 1) {
			newVal = 1;
		}
		input.val(newVal);
		subtotalFn(parent, newVal);
	});

	// 数量调整-输入
	$('.return-order .product-list').on('input propertychange', '.amount-num', function () {
		var parent = $(this).closest('li');
		// 新的val值，如果有非数字都替换成空
		var newVal = $(this).val().replace(/[^\d.]/g, '');
		//采购总数
		var quantity = $(this).siblings('.quantity').find('span').text();
		if (parseInt(newVal, 10) <= 1) {
			newVal = 1;
		}
		if (parseInt(newVal, 10) > quantity) {
			newVal = quantity;
		}
		$(this).val(newVal);
		subtotalFn(parent, newVal);
	});

	// 如果失焦的时候,空值,则设置为1
	$('.return-order .product-list').on('blur', '.amount-num', function () {
		var parent = $(this).closest('li');
		if ($(this).val() == '') {
			$(this).val(1);
			subtotalFn(parent, 1);
		}
	});

	//申请退货
	var poPquantity = null;
	$(document).on('click', '.return-good', function() {
		poPquantity = $(this).closest('.order-list').find('.quantity').text();
		$('#pop-return-goods .maxlenth').text(poPquantity);
		//清空原来的值
		$('#pop-return-goods .select-text').text('请选择');
		$('#pop-return-goods .btn-yes').removeClass('active');
		$('#pop-return-goods .select-input').val($('#pop-return-goods .select-drop li').eq(0).attr('data'));
		$('#pop-return-goods').show();
	});

	//申请退款
	$(document).on('click', '.return-money', function() {
		poPquantity = $(this).closest('.order-list').find('.quantity').text();
		$('#pop-return-money .maxlenth').text(poPquantity);
		//清空原来的值
		$('#pop-return-money .select-text').text('请选择');
		$('#pop-return-money .btn-yes').removeClass('active');
		$('#pop-return-money .select-input').val($('#pop-return-goods .select-drop li').eq(0).attr('data'));
		$('#pop-return-money').show();
	});

	//原因为必选
	$(document).on('click', '.pop-shade .select-drop li', function() {
		var _txt = $(this).text();
		if(_txt == '请选择'){
			$(this).closest('.pop-shade').find('.btn-yes').removeClass('active');
		}else {
			$(this).closest('.pop-shade').find('.btn-yes').addClass('active');
		}
	});	

	///编辑原因
	$(document).on('click', '.edit-reason', function() {
		var chooseTxt = $(this).siblings('.select-box').find('.select-text').text();
		if(chooseTxt == '退货'){
			//退货 插入原内容

			$('#pop-return-goods').show();
		}else if (chooseTxt == '退款') {
			//退款 插入原内容

			$('#pop-return-money').show();
		}
	});	

	// 数量调整-增加
	$('.pop-shade').on('click', '.amount-add', function () {
		//输入数量
		var input = $(this).siblings('.amount-num');
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= poPquantity) {
			newVal = poPquantity;
		}
		input.val(newVal);
	});

	// 数量调整-减少
	$('.pop-shade').on('click', '.amount-reduce', function () {
		//输入数量
		var input = $(this).siblings('.amount-num');
		// 数量,最小1
		var newVal = parseInt(input.val(), 10) - 1;
		if (newVal <= 1) {
			newVal = 1;
		}
		input.val(newVal);
	});

	// 数量调整-输入
	$('.pop-shade').on('input propertychange', '.amount-num', function () {
		// 新的val值，如果有非数字都替换成空
		var newVal = $(this).val().replace(/[^\d.]/g, '');
		if (parseInt(newVal, 10) <= 1) {
			newVal = 1;
		}
		if (parseInt(newVal, 10) > poPquantity) {
			newVal = poPquantity;
		}
		$(this).val(newVal);
	});

	// 如果失焦的时候,空值,则设置为1
	$('.pop-shade').on('blur', '.amount-num', function () {
		if ($(this).val() == '') {
			$(this).val(1);
		}
	});

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});

	//确定按钮 申请退货
	$('#pop-return-goods').on('click', '.btn-yes.active', function() {
		//成功
		$(this).closest('.pop-shade').hide();
	});

	//确定按钮 申请退款
	$('#pop-return-money').on('click', '.btn-yes.active', function() {
		//成功
		$(this).closest('.pop-shade').hide();
	});
});