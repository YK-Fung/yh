define(['jquery'], function($){

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

	//判断是否为空
	$('.confirm-order-edit .position').on('blur', '.must', function() {
		// 判断是地址 还是 姓名手机号
		if($(this).parent().hasClass('address')){
			//地址
			if(!$(this).val()){
				$(this).parent('.input-toggle').siblings('.tip').show();
			}else {
				$(this).parent('.input-toggle').siblings('.tip').hide();
			}
		}
		//姓名和手机号都必填
		if($(this).parent().hasClass('name-or-num')){
			var emptyDom = 0;
			$('.name-or-num').each(function() {
				if(!$(this).find('input').val()){
					emptyDom ++;
				}
			});
			if(emptyDom > 0){
				$(this).parent('.input-toggle').siblings('.tip').show();
			}else {
				$(this).parent('.input-toggle').siblings('.tip').hide();
			}
		}
	});
	//编辑订单信息
	$(document).on('click', '.order-massage-title .edit-btn', function() {
		//输入框 与 文本的切换
		$('.order-infor').addClass('order-infor-edit');
		$('.order-massage-title').addClass('title-edit');
	});

	//取消订单信息
	$(document).on('click', '.order-massage-title .cancel-btn', function() {
		$('.order-infor .input-toggle').each(function() {
			//赋值
			var changeVal = $(this).find('.fixedly-dom').text();
			if($(this).find('.edit-dom').hasClass('select-box')){
				//获取选中下拉框的值
				$(this).find('.edit-dom .select-text').text(changeVal);
			}else {
				//获取输入框的值
				$(this).find('.edit-dom').val(changeVal);
			}
			
		});
		//输入框 与 文本的切换
		$('.order-infor').find('.tip').hide();
		$('.order-infor').removeClass('order-infor-edit');
		$('.order-massage-title').removeClass('title-edit');
	});
	
	//保存订单信息
	$(document).on('click', '.order-massage-title .sava-btn', function() {
		var mustLenth = 0;
		$('.order-infor .must').each(function() {
			var changeVal = $(this).val();
			if(changeVal != ''){
				mustLenth += 1;
			}else {
				//判断是否为空
				$(this).parent('.input-toggle').siblings('.tip').show();
			}	
		});
		//必填项验证
		if(mustLenth == $('.order-infor .must').length){
			$('.order-infor .input-toggle').each(function() {
				//赋值
				var changeVal;
				if($(this).find('.edit-dom').hasClass('select-box')){
					//获取选中下拉框的值
					changeVal = $(this).find('.edit-dom .select-text').text();
				}else {
					//获取输入框的值
					changeVal = $(this).find('.edit-dom').val();
				}
				$(this).find('.fixedly-dom').text(changeVal);
			});
			//输入框 与 文本的切换
			$('.order-infor').removeClass('order-infor-edit');
			$('.order-massage-title').removeClass('title-edit');
		}
	});

	// 应付总额
	var totalPayFn = function () {
		var logistics = parseFloat($('.order-ctn .logistics-sum').val());//物流费用
		var discounts = parseFloat($('.order-ctn .discounts-sum').text());//优惠金额
		var totalSum = parseFloat($('.order-ctn .total-sum-input').val());//货品总金额
		// 如果物流费用为空 设为0
		if(!logistics){
			logistics = 0;
		}
		// 如果货品总金额为空 设为0
		if(!totalSum){
			totalSum = 0;
		}
		// 如果货品总金额<优惠金额 设为0
		if(totalSum <= discounts){
			$('.order-ctn .pay-total-amount').text(0);//应付总额
		}else {
			$('.order-ctn .pay-total-amount').text((logistics+totalSum-discounts).toFixed(2));//应付总额
		}
	};

	//货品总金额
	var totalFn = function(){
		var totalSum = 0;
		$('.product-list>ul>li').each(function () {
			var sums = parseFloat( $(this).find('.subtotal-num').val());
			if(!sums){
				sums = 0;
			}
			totalSum += sums;
		});
		$('.order-ctn .total-sum-txt').text(totalSum);
		$('.order-ctn .total-sum-input').val(totalSum);
		totalPayFn();
	}

	//货品总金额调整 物流费用调整
	$(document).on('input propertychange', '.logistics-sum,.total-sum-input', function() {
		var price = $(this).val().replace(/[^\d.]/g, '');
		//采购总数
		if (parseInt(price, 10) <= 0) {
			price = 0;
		}
		if (parseInt(price, 10) > 100000) {
			price = 100000;
		}
		$(this).val(price);
		//应付总额
		totalPayFn();
	});

	// 总金额 物流费用如果失焦的时候,空值,则设置为0
	$(document).on('blur', '.logistics-sum,.total-sum-input', function () {
		var parent = $(this).closest('li');
		if ($(this).val() == '') {
			$(this).val(0);
			totalFn();
		}
	});

	// 小计
	var subtotalFn = function (parent, val) {
		//单价
		var priceNum = parseFloat(parent.find('.unit-price-num').val());
		var subtotalNum = (priceNum * val).toFixed(2);
		parent.find('.subtotal-num').val(subtotalNum);
		//应付总额
		totalFn();
	};

	//小计输入调整
	$(document).on('input propertychange', '.subtotal-num', function() {
		var price = $(this).val().replace(/[^\d.]/g, '');
		//采购总数
		if (parseInt(price, 10) <= 0) {
			price = 0;
		}
		if (parseInt(price, 10) > 999999) {
			price = 999999;
		}
		$(this).val(price);
		//应付总额
		totalFn();
	});

	// 小计如果失焦的时候,空值,则设置为0
	$(document).on('blur', '.subtotal-num', function () {
		var parent = $(this).closest('li');
		if ($(this).val() == '') {
			$(this).val(0);
			totalFn();
		}
	});

	//单价调整
	$('.order-ctn .product-list').on('input propertychange', '.unit-price-num', function() {
		var parent = $(this).closest('li');
		var price = $(this).val().replace(/[^\d.]/g, '');
		//输入数量
		var newVal = parseInt($(this).closest('li').find('.amount-num').val(), 10);
		//采购总数
		if (parseInt(price, 10) <= 0) {
			price = 0;
		}
		if (parseInt(price, 10) > 999999) {
			price = 999999;
		}
		$(this).val(price);
		subtotalFn(parent, newVal);
	});

	// 如果失焦的时候,空值,则设置为0
	$(document).on('blur', '.unit-price-num', function () {
		var parent = $(this).closest('li');
		var newVal = parseInt($(this).closest('li').find('.amount-num').val(), 10);
		if ($(this).val() == '') {
			$(this).val(0);
			subtotalFn(parent, newVal);
		}
	});

	// 数量调整-增加
	$('.order-ctn .product-list').on('click', '.amount-add', function () {
		var parent = $(this).closest('li');
		//输入数量
		var input = $(this).siblings('.amount-num');
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= 999999) {
			newVal = 999999;
		}
		input.val(newVal);
		subtotalFn(parent, newVal);
	});

	// 数量调整-减少
	$('.order-ctn .product-list').on('click', '.amount-reduce', function () {
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
	$('.order-ctn .product-list').on('input propertychange', '.amount-num', function () {
		var parent = $(this).closest('li');
		// 新的val值，如果有非数字都替换成空
		var newVal = $(this).val().replace(/[^\d.]/g, '');
		//采购总数
		if (parseInt(newVal, 10) <= 1) {
			newVal = 1;
		}
		if (parseInt(newVal, 10) > 999999) {
			newVal = 999999;
		}
		$(this).val(newVal);
		subtotalFn(parent, newVal);
	});

	// 如果失焦的时候,空值,则设置为1
	$('.order-ctn .product-list').on('blur', '.amount-num', function () {
		var parent = $(this).closest('li');
		if ($(this).val() == '') {
			$(this).val(1);
			subtotalFn(parent, 1);
		}
	});

	//编辑采购清单
	$(document).on('click', '.product-list .edit-btn', function() {
		$(this).closest('li').addClass('buyer-table-edit');
	});

	//取消采购清单
	$(document).on('click', '.product-list .cancel-btn', function() {
		$(this).closest('li').find('.input-toggle').each(function() {
			//获取输入框的值
			var changeVal = $(this).find('.fixedly-dom span').text();
			if($(this).find('.edit-dom').hasClass('select-box')){
				//获取选中下拉框的值
				$(this).find('.edit-dom .select-text').text(changeVal);
			}else {
				//获取输入框的值
				$(this).find('.edit-dom input').val(changeVal);
			}
			
		});
		totalFn();
		$(this).closest('li').removeClass('buyer-table-edit');
	});

	//保存采购清单
	$(document).on('click', '.product-list .save-btn', function() {
		$(this).closest('li').find('.input-toggle').each(function() {
			var changeVal;
			if($(this).find('.edit-dom').hasClass('select-box')){
				//获取选中下拉框的值
				changeVal = $(this).find('.edit-dom .select-text').text();
			}else {
				//获取输入框的值
				changeVal = $(this).find('.edit-dom input').val();
			}
			$(this).find('.fixedly-dom span').text(changeVal);
		});
		$(this).closest('li').removeClass('buyer-table-edit');
	});
	//编辑总金额数量
	$(document).on('click', '.order-total .edit-btn', function() {
		$(this).closest('.order-total').addClass('order-total-edit');
	});

	//取消采购清单
	$(document).on('click', '.order-total .cancel-btn', function() {
		$('.order-total .input-toggle').each(function() {
			var changeVal = $(this).find('.fixedly-dom span').text();
			$(this).find('.edit-dom input').val(changeVal);
		});
		//应付总额
		totalPayFn();
		$(this).closest('.order-total').removeClass('order-total-edit');
	});

	//保存采购清单
	$(document).on('click', '.order-total .save-btn', function() {
		$('.order-total .input-toggle').each(function() {
			var changeVal = $(this).find('.edit-dom input').val();
			$(this).find('.fixedly-dom span').text(changeVal);
		});
		$(this).closest('.order-total').removeClass('order-total-edit');
	});

	//删除采购清单
	var objDom;
	$(document).on('click', '.delete-order', function() {
		objDom = $(this).closest('li');
		$('#pop-tip-txt .text-primary').text('删除商品？');
		$('#pop-tip-txt .text-muted').text('确定要删除该商品吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'delete-order');
		$('#pop-tip-txt').modal('show');
	});

	// 确认订单
	$(document).on('click', '.order-confirm', function() {
		$('#pop-tip-txt .text-primary').text('确认订单');
		$('#pop-tip-txt .text-muted').text('是否确认订单？');
		$('#pop-tip-txt .btn-yes').attr('data', 'order-confirm');
		$('#pop-tip-txt').modal('show');
	});

	//取消订单
	$(document).on('click', '.cancel-order', function() {
		$('#pop-cancel-order .btn-yes').attr('data', 'cancel-order-confirm');
		$('#pop-cancel-order').modal('show');
	});

	//单选框切换
	$('.radio').click(function() {
		$(this).addClass('active').parent().siblings().find('.radio').removeClass('active');
		$(this).children('input').prop('checked', true);
		$(this).parent().siblings().find('input').prop('checked', false);
	});

	//确定提示框按钮
	$('.modal .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'order-confirm':
				//确认订单
				console.log('确认订单');
				break;
			case 'cancel-order-confirm':
				//取消退款
				console.log('取消订单');
				break;
			case 'delete-order':
				//删除采购清单
				objDom.remove();
				//货品总金额
				totalFn();
				break;
		}
	});
});