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
			console.log(123)
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

		// 地址下拉框
	    $('.address-select .select-choice').on('click', function(event) {
	        var e = event || window.event;
	        //其它下拉隐藏
	        $('.address-select').removeClass('down');
	        //下拉效果切换
	        $(this).parent().addClass('down');
	        //停止冒泡
	        e.stopPropagation();
	    });
	    // 鼠标点击离开来目标，菜单栏隐藏
	    $(document).on('click', function() {
	        $('.address-select').removeClass('down');
	    });
	    //下拉菜单停止冒泡
	    $('.address-select .select-drop').on('click',function(event) {
	        var e = event || window.event;
	        e.stopPropagation();
	    });
	    // 地区类型选择
	    $('.address-select .select-type li').on('click', function () {
	        // 获取索引值
	        var idx = $(this).index();
	        // 前面的区域已选的情况下，才可以选择再小一些的区域
	        if (idx == 0 || $('.address-arr input').eq(idx - 1).val() != '') {
	            // 设置活动状态，以及显示对应的内容
	            $(this).addClass('active').siblings().removeClass('active');
	            $('.select-type-ctn .type-main').eq(idx).show().siblings('.type-main').hide();
	        }
	    });
	    // 地区选择
	    $('.address-select .zm-ctn li').on('click', function () {
	        // 获取索引值
	        var idx = $(this).closest('.type-main').index();
	        // 如果是之前选择的，则不向下执行
	        if ($(this).hasClass('active')) {
	            return false;
	        }
	        // 清除其他的活动状态，给当前添加活动状态
	        $(this).closest('.type-main').find('.active').removeClass('active');
	        $(this).addClass('active');
	        // 设置并获取相应的text
	        $('.address-arr input').eq(idx).attr('value', $(this).text() + '/');
	        $('.address-arr input').eq(idx).nextAll('input').attr('value', '');
	        var addressText = '';
	        $('.address-arr input').each(function () {
	            addressText += $(this).attr('value');
	        });
	        // 设置省市的值
	        $(this).closest('.address-select').find('.select-chosen').val(addressText.substr(0, addressText.length-1));
	        // 显示下一级地区,如果已经是最后一级了则隐藏下拉列表
	        if (idx == $('.select-type li').length - 1) {
	            $('.address-select').removeClass('down');
	            return false;
	        }
	        // 地区类型切换
	        $(this).closest('.select-drop').find('.select-type li').removeClass('active');
	        $(this).closest('.select-drop').find('.select-type li').eq(idx + 1).addClass('active');
	        // 内容切换
	        $(this).closest('.select-drop').find('.type-main').hide();
	        $(this).closest('.select-drop').find('.type-main').eq(idx + 1).show();
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
		returnTotalFn();
	});

	// 退款总数 退款总额
	var returnTotalFn = function () {
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

	// 退款小计
	var returnSubtotalFn = function (parent, val) {
		//单价
		var priceNum = parseFloat(parent.find('.price-num').text());
		var subtotalNum = (priceNum * val).toFixed(2);
		parent.find('.return-prices').text(subtotalNum);
		//退款总数 退款总额
		returnTotalFn();
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
		returnSubtotalFn(parent, newVal);
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
		returnSubtotalFn(parent, newVal);
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
		returnSubtotalFn(parent, newVal);
	});

	// 如果失焦的时候,空值,则设置为1
	$('.return-order .product-list').on('blur', '.amount-num', function () {
		var parent = $(this).closest('li');
		if ($(this).val() == '') {
			$(this).val(1);
			returnSubtotalFn(parent, 1);
		}
	});

	//申请退货
	$(document).on('click', '.return-good', function() {
		//清空原来的值
		var poPquantity = $(this).closest('.order-list').find('.quantity').text();
		$('#pop-return-goods .maxlenth').text(poPquantity);
		$('#pop-return-goods .select-text').text('请选择');
		$('#pop-return-goods .btn-yes').removeClass('active');
		$('#pop-return-goods .select-input').val($('#pop-return-goods .select-drop li').eq(0).attr('data'));
		$('#pop-return-goods').show();
	});

	//申请退款
	$(document).on('click', '.return-money', function() {
		var poPquantity = $(this).closest('.order-list').find('.quantity').text();
		$('#pop-return-goods .maxlenth').text(poPquantity);
		//清空原来的值
		$('#pop-return-goods .select-text').text('请选择');
		$('#pop-return-goods .btn-yes').removeClass('active');
		$('#pop-return-goods .select-input').val($('#pop-return-goods .select-drop li').eq(0).attr('data'));
		$('#pop-return-goods').show();
	});

	//原因为必选
	$(document).on('click', '.pop-return .select-drop li', function() {
		var _txt = $(this).text();
		if(_txt == '请选择'){
			$(this).closest('.pop-return').find('.btn-yes').removeClass('active');
		}else {
			$(this).closest('.pop-return').find('.btn-yes').addClass('active');
		}
	});	

	///编辑原因
	$(document).on('click', '.edit-reason', function() {
		var poPquantity = $(this).closest('.return-list').find('.quantity').text();
		console.log(poPquantity)
		$('#pop-return-goods .maxlenth').text(poPquantity);
		$('#pop-return-goods').show();
		$('#pop-return-goods .btn-yes').addClass('active');
	});	

	// 数量调整-增加
	$('.pop-return').on('click', '.amount-add', function () {
		//输入数量
		var input = $(this).siblings('.amount-num');
		// 数量最大值
		var maxLength = $(this).attr('data');

		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= maxLength) {
			newVal = maxLength;
		}
		input.val(newVal);
	});

	// 数量调整-减少
	$('.pop-return').on('click', '.amount-reduce', function () {
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
	$('.pop-return').on('input propertychange', '.amount-num', function () {
		// 新的val值，如果有非数字都替换成空
		var newVal = $(this).val().replace(/[^\d.]/g, '');
		// 数量最大值
		var maxLength = $(this).siblings('.amount-add').attr('data');
		if (parseInt(newVal, 10) <= 1) {
			newVal = 1;
		}
		if (parseInt(newVal, 10) > maxLength) {
			newVal = maxLength;
		}
		$(this).val(newVal);
	});

	// 如果失焦的时候,空值,则设置为1
	$('.pop-return').on('blur', '.amount-num', function () {
		if ($(this).val() == '') {
			$(this).val(1);
		}
	});

	//确定按钮 申请退货
	$('#pop-return-goods').on('click', '.btn-yes.active', function() {
		//成功
		$(this).closest('.pop-return').hide();
	});

	//确定按钮 申请退款
	$('#pop-return-money').on('click', '.btn-yes.active', function() {
		//成功
		$(this).closest('.pop-return').hide();
	});


	//关弹窗
	$('.pop-return .btn-no,.pop-return .header-close').on('click', function() {
		//成功
		$(this).closest('.pop-return').hide();
	});

	//隐藏超过五条的数据
	var onloadList = function (){
		var liLenth = $('#buyer-list').find('li').length;
		if(liLenth >= 5){
			$('#buyer-list li:gt(4)').hide();
		}
	}
	onloadList();

	//查看更多商品
	$(document).on('click', '.more-link', function() {
		$('#buyer-list li').show();
	});



	/**********************   待支付  ***************************/
	//补全凭证 弹窗
	$(document).on('click', '.onload-proof', function() {
		$('#pop-onload-proof .btn-yes').attr('data', 'onload-proof-confirm');
		//剩余尾款
		if($('#tailSection').text()){
			$('#pop-onload-proof .residue-payment span').text(parseFloat($('#tailSection').text()).toFixed(2));
		}else {
			$('#pop-onload-proof .residue-payment span').text(parseFloat($('.pay-total-sum').text()).toFixed(2));
		}
		
		//清空表单
		$('#pop-onload-proof input').val('');
		$('#pop-onload-proof img').attr('src', '');
		$('#pop-onload-proof .file-img').addClass('img-add');
		$('#pop-onload-proof').show();
	});

	//文本失焦
	$('#pop-onload-proof .txt').on('blur', function() {
		if($(this).hasClass('transfer-amount')){
			//本次转账金额
			var _val = parseFloat($.trim($(this).val())).toFixed(2);//当前值
			var maxVal = parseFloat($('#pop-onload-proof .residue-payment span').text());//最大值
			if(_val > maxVal){
				$(this).val(maxVal.toFixed(2));
			}else if(_val < 0.01){
				$(this).val(0.01);
			}else {
				$(this).val(_val);
			}
		}
		addActive();
	});

	//点击上传图片
	$(document).on('click', '.file-img', function() {
		$(this).find('.img-onload').click();
	});

	$(document).on('click', '.file-img .img-onload',function (event) {
		var e = event || window.event;
		e.stopPropagation();
	});

	// 上传图片and预览
	var imgSrc;
	$(document).on('change', '.file-img .img-onload', function(){
		var self = $(this).closest('.file-img');
		//判断是否支持FileReader
		if (window.FileReader) {
		    var reader = new FileReader();
		} else {
			alert('您的设备不支持图片预览功能，如需该功能请升级您的设备！');
		    return false;
		}
		//获取文件
		var file = this.files[0];
		var imageType = /^image\//;
		//是否是图片
		if (!imageType.test(file.type)) {
			alert('请选择图片文件！')
		    return false;
		}
		//读取完成
		reader.onload = function(e) {
			// 图片路径设置为读取的图片
			imgSrc = e.target.result;
			self.find('img').attr('src', imgSrc);
			// 移除img-add
			self.removeClass('img-add');
			addActive();
		};
		reader.readAsDataURL(file);
	});

	function addActive(){
		var num = $('#pop-onload-proof .ticket-num').val();
		var amount = $('#pop-onload-proof .transfer-amount').val();
		if(num && amount && imgSrc){
			$('#pop-onload-proof .btn-yes').addClass('active');
		}else {
			$('#pop-onload-proof .btn-yes').removeClass('active');
		}
	}

	//删除图片
	var _this;
	$(document).on('click', '.delete-icon', function(event) {
		var e = event || window.event;
		_this = $(this);
		$('#pop-tip-txt .ctn-txt').text('确定要删除图片吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'delete-confirm');
		$('#pop-tip-txt').show();
		e.stopPropagation();
	});

	//查看图片
	$(document).on('click', '.certificate .proof-list li', function() {
		var srcPhoto = $(this).find('img').attr('src');	
		if(srcPhoto){
			$('.check-photo img').attr('src', srcPhoto);
			$('.check-photo').show();
		}
	});

	//关闭查看图片
	$('.check-photo .close').click(function() {
		$(this).parent().hide();
	});
	/**********************   待支付  ***************************/


	/**********************   待确定  ****************************/
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
			if($(this).find('.edit-dom').hasClass('select-box')){
				//获取选中下拉框的值
				var changeVal = $(this).find('.fixedly-dom').text();
				$(this).find('.edit-dom .select-text').text(changeVal);
			}else if($(this).find('.edit-dom').hasClass('address-select')){
				//获取地址下拉框的值
				var addressVal = '';
				for (var i = 0; i <= 3; i++) {
					$(this).find('.address').eq(i).val($(this).find('.fixedly-dom').find('span').eq(i).text());
					if(i < 3){
						//拼接省市区
						addressVal += $(this).find('.fixedly-dom').find('span').eq(i).text();
					}
				}
				$(this).find('.address-select .select-chosen').val(addressVal);
			}else {
				//获取输入框的值
				var changeVal = $(this).find('.fixedly-dom').text();
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
				$(this).closest('.input-toggle').siblings('.tip').show();
			}	
		});
		//必填项验证
		if(mustLenth == $('.order-infor .must').length){
			$('.order-infor .input-toggle').each(function() {
				//赋值
				if($(this).find('.edit-dom').hasClass('select-box')){
					//获取选中下拉框的值
					var changeVal = $(this).find('.edit-dom .select-text').text();
					$(this).find('.fixedly-dom').text(changeVal);
				}
				else if($(this).find('.edit-dom').hasClass('address-select')){
					//获取地址下拉框的值
					for (var i = 0; i <= 3; i++) {
						$(this).find('.fixedly-dom').find('span').eq(i).text($(this).find('.address').eq(i).val());
					}
				}
				else {
					//获取输入框的值
					var changeVal = $(this).find('.edit-dom').val();
					$(this).find('.fixedly-dom').text(changeVal);
				}
			});
			//输入框 与 文本的切换
			$('.order-infor').removeClass('order-infor-edit');
			$('.order-massage-title').removeClass('title-edit');
			$('.order-infor .input-toggle').siblings('.tip').hide();
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
		$('.order-ctn .total-sum-txt').text(totalSum.toFixed(2));
		$('.order-ctn .total-sum-input').val(totalSum.toFixed(2));
		totalPayFn();
	}

	//货品总金额调整 物流费用调整
	$(document).on('input propertychange', '.logistics-sum,.total-sum-input', function() {
		var price = $(this).val();
		//采购总数
		if (price < 0) {
			price = 0;
			$(this).val(price);
		}
		if (price > 100000) {
			price = 100000;
			$(this).val(price);
		}
		//应付总额
		totalPayFn();
	});

	// 总金额 物流费用如果失焦的时候,空值,则设置为0
	$(document).on('blur', '.logistics-sum', function () {
		var parent = $(this).closest('li');
		if ($(this).val() == '') {
			$(this).val(0);
			totalFn();
		}else {
			$(this).val(parseFloat($(this).val()).toFixed(2));
		}
	});

	// 总金额 物流费用如果失焦的时候,空值,则设置为0
	$(document).on('blur', '.total-sum-input', function () {
		var parent = $(this).closest('li');
		if ($(this).val() == '') {
			$(this).val(0);
			totalFn();
		}else if ($(this).val() <= 0.01) {
			$(this).val(0.01)
		}else {
			$(this).val(parseFloat($(this).val()).toFixed(2));
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
		var price = $(this).val();
		//采购总数
		if (price < 0) {
			price = 0;
			$(this).val(price);
		}
		if (price > 999999) {
			price = 999999;
			$(this).val(price);
		}
		//应付总额
		totalFn();
	});

	// 小计如果失焦的时候,空值,则设置为0
	$(document).on('blur', '.subtotal-num', function () {
		var parent = $(this).closest('li');
		if ($(this).val() == '') {
			$(this).val(0);
			totalFn();
		}else {
			$(this).val(parseFloat($(this).val()).toFixed(2));
		}
	});

	//单价调整
	$('.order-ctn .product-list').on('input propertychange', '.unit-price-num', function() {
		var parent = $(this).closest('li');
		var price = $(this).val();
		//输入数量
		var newVal = parseInt($(this).closest('li').find('.amount-num').val(), 10);
		//采购总数
		if (price < 0) {
			price = 0;
			$(this).val(price);
		}
		if (price > 999999) {
			price = 999999;
			$(this).val(price);
		}
		subtotalFn(parent, newVal);
	});

	// 如果失焦的时候,空值,则设置为0
	$(document).on('blur', '.unit-price-num', function () {
		var parent = $(this).closest('li');
		var newVal = parseInt($(this).closest('li').find('.amount-num').val(), 10);
		if ($(this).val() == '') {
			$(this).val(0);
		}else if ($(this).val() <= 0.01) {
			$(this).val(0.01);
		}else{
			$(this).val(parseFloat($(this).val()).toFixed(2));
		}
		subtotalFn(parent, newVal);
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
		$('#pop-tip-txt .ctn-txt').text('确定要删除该商品吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'delete-order');
		$('#pop-tip-txt').show();
	});

	// 确认订单
	$(document).on('click', '.order-confirm', function() {
		$('#pop-tip-txt .ctn-txt').text('确定要确认订单吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'order-confirm');
		$('#pop-tip-txt').show();
	});

	/**********************   待确定  ****************************/


	/**********************   发货start  *********************/
	//全选
	$('#pop-immediately-deliver .checkbox-all').click(function() {
		//切换attr属性
		if(!$(this).find(':checkbox').prop("checked")){
			//全选
			$(this).addClass('active');
			$('#pop-immediately-deliver .tbody').find('.checkbox').addClass('active');
			$('#pop-immediately-deliver .tbody').find(':checkbox').prop("checked", true);
		}else {
			//取消全选
			$(this).removeClass('active');
			$('#pop-immediately-deliver .tbody').find('.checkbox').removeClass('active');
			$('#pop-immediately-deliver .tbody').find(':checkbox').prop("checked", false);
		}
		$(this).find(':checkbox').prop("checked", !$(this).find(':checkbox').prop("checked"));
	});

	// 判断全选或单选
	function selectFn(){
		if($('#pop-immediately-deliver .tbody input[type="checkbox"]').length == $('#pop-immediately-deliver .tbody input[type=checkbox]:checked').length){
			//全选
			$('#pop-immediately-deliver .checkbox-all').addClass('active');
			$('#pop-immediately-deliver .checkbox-all').find(':checkbox').prop("checked", true);
		}else {
			//取消全选
			$('#pop-immediately-deliver .checkbox-all').removeClass('active');
			$('#pop-immediately-deliver .checkbox-all').find(':checkbox').prop("checked", false);
		}
	}

	//单选
	$('#pop-immediately-deliver .tbody').on('click', '.checkbox', function() {
		//切换attr属性
		$(this).find(':checkbox').prop("checked", !$(this).find(':checkbox').prop("checked"));
		$(this).toggleClass('active');
		
		selectFn();
	});

	//选择发货方式
	$('.choose-way').on('click', 'li', function() {
		var _index = $(this).index();
		$(this).find('.radio').addClass('active');
		$(this).find('input').prop("checked", true);
		$(this).siblings().find('.radio').removeClass('active');
		$(this).siblings().find('input').prop("checked", false);
		$('.logisitic-del>div').eq(_index).show().siblings().hide();
	});
	
	$('#pop-immediately-deliver .radio').click(function() {
		$(this).addClass('active').parent().siblings().find('.radio').removeClass('active');
		$(this).children('input').prop('checked', true);
		$(this).parent().siblings().find('input').prop('checked', false);
	});
	//立即发货 如果失焦的时候,空值,则设置为0
    $('#pop-immediately-deliver').on('blur', '.price-num input', function () {
        var num = parseInt($(this).val(), 10);
        if ($(this).val() == '') {
            $(this).val(0);
            $(this).closest('li').find(':checkbox').prop("checked",false);
            $(this).closest('li').find('.checkbox').removeClass('active');
            selectFn();
        }
    });

    //立即发货 数量变化
    $('#pop-immediately-deliver').on('input propertychange', ' .price-num input', function() {
        var num = $(this).val().replace(/[^\d.]/g, '');
        var maxNum = $(this).attr('data').replace(/[^\d.]/g, '');
        if (parseInt(num, 10) <= 0) {
            num = 0;
            $(this).closest('li').find(':checkbox').prop("checked",false);
            $(this).closest('li').find('.checkbox').removeClass('active');
        }else if (parseInt(num, 10) >= maxNum) {
            num = maxNum;
        }else {
            $(this).closest('li').find(':checkbox').prop("checked",true);
            $(this).closest('li').find('.checkbox').addClass('active');
        }
        $(this).val(num);
        selectFn();
    });

    //立即发货 表单验证
    // 姓名
    $('#pop-immediately-deliver').on('input propertychange', ' .deliver-name', function() {
        var val = $.trim($(this).val());
        console.log(val)
        if (val == '' || !(/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/.test(val))) {
        	
        	$(this).siblings('.error').show();
        }else {
        	$(this).siblings('.error').hide();
        }
    });
    // 电话
    $('#pop-immediately-deliver').on('input propertychange', ' .phone-num', function() {
        var val = $.trim($(this).val());
        if (val == '' || !(/^1[0-9]{10}$/.test(val))) {
        	$(this).siblings('.error').show();
        }else {
        	$(this).siblings('.error').hide();
        }
    });

    //模糊搜索列表
    $('.logisitic-del .search input,#pop-logistics-form .search input').on('input propertychange', function() {
        if($(this).val()){
            $(this).siblings('.search-list').show();
        }else {
            $(this).siblings('.search-list').hide();
        }
    });

    //选中下拉框
    $('.search-list').on('click', 'li', function(event) {
        var e = event || window.event;
        var _txt = $(this).text();
        $(this).parent('.search-list').siblings('input').val(_txt);
        $(this).parent().hide();
        e.stopPropagation();
    });

    // 鼠标点击离开来目标，隐藏
    $(document).on('click', function() {
        $('.search-list').hide();
    });
    /**********************   发货end  *********************/

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

	//取消退款
	$(document).on('click', '.cancel-refund', function() {
		$('#pop-tip-txt .ctn-txt').text('确定要取消退款吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'cancel-refund-confirm');
		$('#pop-tip-txt').show();
	});

	//退货
	$(document).on('click', '.sales-return', function() {
		$('#pop-logistics-form .btn-yes').attr('data', 'sales-return');
		$('#pop-logistics-form').show();
	});

	//取消订单
	$(document).on('click', '.cancel-order', function() {
		$('#pop-cancel-order .btn-yes').attr('data', 'cancel-order-confirm');
		$('#pop-cancel-order').show();
	});

	//提醒发货
	$(document).on('click', '.warn-deliver', function() {
		$('#pop-tip-txt .ctn-txt').text('提醒发货成功！');
		$('#pop-tip-txt .btn-yes').attr('data', 'warn-deliver-confirm');
		$('#pop-tip-txt').show();
	});

	//延期收货
	$(document).on('click', '.defer-receiving', function() {
		$('#pop-tip-txt .ctn-txt').text('确定要延期收货吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'defer-receiving-confirm');
		$('#pop-tip-txt').show();
	});

	//确认收货
	$(document).on('click', '.confirm-receipt', function() {
		$('#pop-tip-txt .ctn-txt').html('请收到货后，先验货，再确认收货！<br>如对实收货品有异议，请点击<a href="#" class="blue">申请售后</a>');
		$('#pop-tip-txt .btn-yes').attr('data', 'confirm-receipt-confirm');
		$('#pop-tip-txt').show();
	});

	/*申请客服介入*/
	$(document).on('click', '.apply-service', function() {
		$('#pop-tip-txt .ctn-txt').text('申请客服介入吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'apply-service-confirm');
		$('#pop-tip-txt').show();
	});

	//单选框切换
	$('#pop-cancel-order .radio').click(function() {
		$(this).addClass('active').parent().siblings().find('.radio').removeClass('active');
		$(this).children('input').prop('checked', true);
		$(this).parent().siblings().find('input').prop('checked', false);
	});

	// 确认收款
	$(document).on('click', '.confirm-gathering', function() {
		$('#pop-tip-txt .ctn-txt').text('是否确认收款？');
		$('#pop-tip-txt .btn-yes').attr('data', 'confirm-gathering');
		$('#pop-tip-txt').show();
	});

	// 弹窗 立即发货
	$(document).on('click', '.immediate-delivery', function() {
		$('#pop-immediately-deliver').show();
		$('#pop-immediately-deliver .btn-yes').attr('data', 'immediate-delivery');
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

	//确定提示框按钮
	$('.pop-shade .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'cancel-refund-confirm':
				//取消退款
				console.log('取消退款');
				$('.pop-shade').hide();
				break;
			case 'check-accept-confirm':
				//验收
				console.log('验收');
				$('.pop-shade').hide();
				break;
			case 'sales-return':
				//退货
				console.log('退货');
				$('.pop-shade').hide();
				break;
			case 'cancel-order-confirm':
				//取消订单
				console.log('取消订单');
				$('.pop-shade').hide();
				break;
			case 'warn-deliver-confirm':
				//提醒发货
				console.log('提醒发货');
				$('.pop-shade').hide();
				break;
			case 'delete-confirm':
				//删除图片
				_this.closest('li').remove();
				$('.pop-shade').hide();
				break;
			case 'onload-proof-confirm':
				//补全凭证
				if($(this).hasClass('active')){
					var sum = $(this).closest('#pop-onload-proof').find('.transfer-amount').val();
					$('.proof-list').append('<li><div class="img"><img src="'+imgSrc+'"><div class="magnifying-icon"></div><span class="delete-icon"></span></div><p class="sum">本次转账￥<span>'+sum+'</span></p></li>');
					$('.pop-shade').hide();
				}
				break;
			case 'defer-receiving-confirm':
				//延期收货
				console.log('延期收货');
				$('.pop-shade').hide();
				break;
			case 'confirm-receipt-confirm':
				//确认收货
				console.log('确认收货');
				$('.pop-shade').hide();
				break;
			case 'apply-service-confirm':
				//申请客服介入
				console.log('申请客服介入');
				$('.pop-shade').hide();
				break;
			case 'order-confirm':
				//确认订单
				console.log('确认订单');
				$('.pop-shade').hide();
				break;
			case 'delete-order':
				//删除采购清单
				objDom.remove();
				//货品总金额
				totalFn();
				$('.pop-shade').hide();
				break;
			case 'immediate-delivery':
				//立即发货
				console.log('立即发货');
				$('.pop-shade').hide();
				break;
			case 'confirm-gathering':
				//确认收款
				console.log('确认收款');
				$('.pop-shade').hide();
				break;

		}
	});

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});
});