define(['jquery', 'yhw-sidebar2', 'yhw-topbar2', 'ie-tip'], function($){


	//下拉列表
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

	// 地址下拉列表
	;(function addressBoxFn (){
	    // 地址下拉框
	    $('.address-select .select-input').on('click', function(event) {
	        var e = event || window.event;
	        //其它下拉隐藏
	        $('.address-select').removeClass('down');
	        //下拉效果切换
	        $(this).parents('.address-select').toggleClass('down');
	        //停止冒泡
	        e.stopPropagation();
	    });
	    // 鼠标点击离开来目标，菜单栏隐藏
	    $(document).on('click', function() {
	        $('.address-select').removeClass('down');
	    });
	    // 地区类型选择
	    $('.address-select .select-type li').on('click', function (event) {
	        var e = event || window.event;
	        // 获取索引值
	        var idx = $(this).index();
	        // 前面的区域已选的情况下，才可以选择再小一些的区域
	        if (idx == 0 || $('.address-arr input').eq(idx - 1).val() != '') {
	            // 设置活动状态，以及显示对应的内容
	            $(this).addClass('active').siblings().removeClass('active');
	            $('.select-type-ctn .type-main').eq(idx).show().siblings('.type-main').hide();
	        }
	        e.stopPropagation();
	    });
	    // 地区选择
	    $('.address-select .zm-ctn li').on('click', function (event) {
	        var e = event || window.event;
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
	        $(this).closest('.address-select').find('.select-input').val(addressText.substr(0, addressText.length-1));
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
	        e.stopPropagation();
	    });
	}());


	// 选择地址
	$('.address-ctn .address-select').on('click', function () {
		$(this).addClass('active').siblings('li').removeClass('active');
		$(this).find('.radio').click();
	});
	$('.address-ctn .radio').on('click', function (event) {
		var e = event || window.event;
		e.stopPropagation();
	});
	// 设置默认地址
	$('.address-ctn .btn-status').on('click', function () {
		var parentDom = $(this).closest('li');
		if (!parentDom.hasClass('address-default')) {
			parentDom.addClass('address-default').siblings('li').removeClass('address-default');
			// 地址状态修改
			$('.address-ctn .btn-status').text('设为默认');
			$(this).text('默认地址');
			// 按钮组修改
			$('.address-ctn .btn-group').html('<span class="btn-edit">修改</span><span class="btn-del">删除</span>');
			$(this).closest('li').find('.btn-group').html('<span class="btn-edit">修改</span>');
		}
	});
	// 删除地址
	var delSelf;
	$(document).on('click', '.address-ctn .btn-del', function () {
		delSelf = $(this);
		$('#pop-del').fadeIn('fast');
	});
	$('#pop-del .btn-yes').on('click', function () {
		delSelf.closest('li').remove();
		$('.address-default').addClass('active');
		$(this).closest('.pop-shade').fadeOut('fast');
	});
	// 添加地址
	$('.address-add').on('click', function () {
		$('#pop-address').fadeIn('fast');
	});
	// 如果没有输入错误，才可以添加地址
    var submitFn = function () {
        if ($('.verify-error:visible').length <= 0 && $('.verify-empty:visible').length <= 0) {
            $('#pop-address .btn-yes').addClass('active');
        }
        else {
            $('#pop-address .btn-yes').removeClass('active');
        }
    }
    // 地址输入框
    $('.input-address').on('blur', function (){
        //获取父级
        var parentDom = $(this).closest('.form-ctn');
        var val = $(this).val();
        if(val === ''){
            //为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        }else if(!(/^[A-Za-z0-9_\u4e00-\u9fa5]*$/.test(val))){
            //格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        }else {
            //正确
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
        }
        submitFn();
    });
    // 邮编输入框
    $('.input-postal').on('blur', function (){
        //获取父级
        var parentDom = $(this).closest('.form-ctn');
        var val = $(this).val();
        if(val === ''){
            //为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        }else if(!(/^(0{6})$|^([1-9][0-9]{5})$/.test(val))){
        	console.log(!(/^(0{6})|([1-9][0-9]{5})$/.test(val)));
            //格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        }else {
            //正确
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
        }
        submitFn();
    });
    // 长度输入框
    $('.input-len25').on('blur', function (){
        //获取父级
        var parentDom = $(this).closest('.form-ctn');
        var val = $(this).val();
        if(val === ''){
            //为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        }else if(val.length > 25){
            //格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        }else {
            //正确
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
        }
        submitFn();
    });
    // 手机输入框
    $('.input-mobile').on('blur', function (){
        //获取父级
        var parentDom = $(this).closest('.form-ctn');
        var val = $(this).val();
        if (val === '') {
            //为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        } else if (!(/^1[0-9]{10}$/.test(val))){
            //格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        } else {
            //正确
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
        }
        submitFn();
    });
    // 固话输入框
    $('.input-num').on('blur', function (){
        var inputNum = '';
        //获取父级
        var parentDom = $(this).closest('.form-ctn');
        var val = $(this).val();
        if ($.trim(parentDom.find('.fj').val()) !== '') {
            inputNum = parentDom.find('.qh').val() + '-' + parentDom.find('.phone-num').val() + '-' + parentDom.find('.fj').val();
        }
        else {
            inputNum = parentDom.find('.qh').val() + '-' + parentDom.find('.phone-num').val();
        }
        if(inputNum === '' || inputNum === '-'){
            //为空
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-error');
            parentDom.addClass('verify-empty');
        }
        else if (!(/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/.test(inputNum))) {
            //格式错误
            parentDom.removeClass('verify-success');
            parentDom.removeClass('verify-empty');
            parentDom.addClass('verify-error');
        }
        else{
            //正确
            parentDom.removeClass('verify-error');
            parentDom.removeClass('verify-empty');
        }
        submitFn();
    });
	// 设置默认地址
	$('.set-default .checkbox').on('click', function () {
		$(this).toggleClass('active');
		var inputDom = $(this).parent().find('input');
		inputDom.prop('checked', !inputDom.prop('checked'));
	});
	// 确定添加地址
	$('#pop-address .btn-yes').on('click', function () {
		if ($(this).hasClass('active')) {
			alert('可以提交！');
			$(this).closest('.pop-shade').fadeOut('fast');
		}
	});
	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});
	// 更多
	$('.address .btn-more').on('click', function () {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).text('更多');
			$('.address-ctn').css('height', '183px');
		} else {
			$(this).addClass('active')
			$(this).text('收起');
			$('.address-ctn').css('height', 'auto');
		}
	});

	// 供应商留言
	$('.leave-message textarea').on('input propertychange', function () {
		var val = $(this).val();
		if (val.length > 100) {
			$(this).val(val.substr(0, 100));
		}
	});

	// 交易方式
	$('.deal li').on('click', function () {
		$(this).addClass('active').siblings('li').removeClass('active');
		$(this).find('input').prop('checked', true);
	});

	// 优惠券-更多按钮
	$('.discounts .btn-more').on('click', function () {
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
			$(this).text('收起');
			$(this).closest('.discounts').find('.discounts-select').removeClass('close');
		} else {
			$(this).removeClass('active');
			$(this).text('更多');
			$(this).closest('.discounts').find('.discounts-select').addClass('close');
		}
	});

	// 选择优惠券
	$('.discounts-select li').on('click', function () {
		// 勾选
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).find('input').prop('checked', false);
		} else {
			$(this).addClass('active').siblings('li').removeClass('active');
			$(this).siblings('li').find('input').prop('checked', false);
			$(this).find('input').prop('checked', true);
		}

		// 优惠券父级
		var discountParent = $(this).closest('.discounts');
		// 货物总价格
		var productMoney = parseFloat($('.total .product-money-num').text());
		// 运费总价格
		var freightMoney = parseFloat($('.total .freight-money-num').text());
		// 优惠的总价格
		var discountsTotal = parseFloat(discountParent.find('.discounts-select li.active .coupon-price>span').text());
		// 优惠券处
		if (!discountsTotal) {
			discountsTotal = 0;
		}
		discountParent.find('.discounts-total').text(discountsTotal +'.00');
		// 优惠券数量
		discountParent.find('.discounts-amount').text(discountParent.find('.discounts-select li.active').length);
		// 价格统计处
		var discountsTotalAll = 0;
		$('.discounts .discounts-total').each(function () {
			discountsTotalAll += parseFloat($(this).text());
		});;
		$('.total .discounts-total').text('-¥' + discountsTotalAll +'.00');
		// 价格总计处
		var totalMoney = productMoney + freightMoney - discountsTotal;
		$('.total .total-money-num').text(totalMoney.toFixed(2));
	});

	// 下单按钮
	$('.btn-pay').on('click', function () {
		console.log('下单');
	});
	// 返回按钮
	$('.btn-back').on('click', function () {
		console.log('返回');
	});


});