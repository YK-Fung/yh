define(['jquery', 'datetime', 'pagination'], function($){

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
		// 判断是商品券还是店铺券
		switch (_txt) {
			case '商品优惠券':
				$('.discounts-scope').html('<div class="scope-text goods-select">选择产品</div>');
				$('.discounts-view').attr('class', 'discounts-view discounts-sp');
				$('.discounts-view .view-goods').html($('.discounts-scope .scope-text').text());
				$('.discounts-view .view-type').html('商品优惠券');
				break;
			case '店铺优惠券':
				$('.discounts-scope').html('<div class="scope-text goods-all">全部产品</div>');
				$('.discounts-view').attr('class', 'discounts-view discounts-dp');
				$('.discounts-view .view-goods').html($('.discounts-scope .scope-text').text());
				$('.discounts-view .view-type').html('店铺优惠券');
				break;
			default:
				break;
		}
		//隐藏下拉列表
		$(this).closest('.select-box').removeClass('down');
		e.stopPropagation();
	});	

	// 优惠券名称
	$('.discounts-name').on('blur', function () {
		$(this).removeClass('warn');
		var newVal = $(this).val().replace(/\s/g, '');
		if (newVal.length > 6) {
			newVal = newVal.substr(0, 6);
		}
		$(this).val(newVal);
		// 设置
		if (newVal !== '') {
			$('.discounts-view .view-name').text(newVal);
		} else {
			$('.discounts-view .view-name').text('优惠券名称');
		}
	});

	// 有效期类型
	$('.date-type li').on('click', function () {
		var idx = $(this).index();
		$(this).addClass('active').siblings('li').removeClass('active');
		$(this).find('input').prop('checked', true);
		$('.date-type-ctn li').eq(idx).show().siblings('li').hide();
		if (idx) {
			if ($('.date-day').val() !== '') {
				$('.discounts-view .view-time').text($('.date-day').val() + '天内有效');
			}
		} else {
			if ($('.date-start').val() !== '' && $('.date-end').val() !== '') {
				$('.discounts-view .view-time').text($('.date-start').val() + '-' + $('.date-end').val() + '有效');
			}
		}
	});
	// 日期
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});
	// 有效期范围
	$('.date-time').on('change', function () {
		$(this).removeClass('warn');
		if ($('.date-start').val() !== '' && $('.date-end').val() !== '') {
			// 如果开始日期大于结束日期，报错
			if ($('.date-start').val() > $('.date-end').val()) {
				$(this).closest('li').addClass('error');
			} else {
				$(this).closest('li').removeClass('error');
				$('.discounts-view .view-time').text($('.date-start').val() + '-' + $('.date-end').val() + '有效');
			}
		}
	});
	// 固定天数
	$('.date-day').on('input propertychange', function () {
		$(this).removeClass('warn');
		// 新的val值，如果有非数字都替换成空，如果大于6个字符则截断
		var newVal = $(this).val().replace(/\D/g, '');
		if (parseInt(newVal, 10) > 99) {
			newVal = 99;
		}
		$(this).val(newVal);
		// 设置
		if (newVal !== '') {
			$('.discounts-view .view-time').text(newVal+'天内有效');
		} else {
			$('.discounts-view .view-time').text('有效时间');
		}
	});

	// 单张面值
	var discountsCondition = 1;
	$('.discounts-money').on('input propertychange', function () {
		$(this).removeClass('warn');
		// 新的val值，如果有非数字都替换成空，如果大于6个字符则截断
		var newVal = $(this).val().replace(/\D/g, '');
		if (parseInt(newVal, 10) < 1) {
			newVal = 1;
		}
		if (parseInt(newVal, 10) > 999) {
			newVal = 999;
		}

        //优惠券金额大于100改变文字大小
        if(parseInt(newVal, 10) >= 100){
            $('.discounts-view .view-money .view-opt').addClass('length3');
        }else{
            $('.discounts-view .view-money .view-opt').removeClass('length3');
        }

		$(this).val(newVal);
		// 设置
		if (newVal !== '') {
			$('.discounts-view .view-money .view-opt').text(newVal);
		} else {
			$('.discounts-view .view-money .view-opt').text('0');
		}
		// 设置使用条件范围
		discountsCondition = parseInt($(this).val(), 10) + 1;
		if (!discountsCondition) {
			discountsCondition = 1;
		}
		// 调整使用范围的时候检测优惠券的使用条件还是否合格,不合格报错
		if (parseInt($('.discounts-condition').val(), 10) < discountsCondition) {
			$('.discounts-condition').addClass('warn');
			$('.discounts-condition').closest('.form-ctn').find('.warn-tip').show();
		} else {
			$('.discounts-condition').removeClass('warn');
			$('.discounts-condition').closest('.form-ctn').find('.warn-tip').hide();
		}
		$('.discounts-condition').attr('placeholder', '大于或等于' + discountsCondition + '元且不超过9999');
	});


	// 总发行量
	$('.discounts-amount').on('input propertychange', function () {
		$(this).removeClass('warn');
		// 新的val值，如果有非数字都替换成空，如果大于6个字符则截断
		var newVal = $(this).val().replace(/\D/g, '');
		if (parseInt(newVal, 10) > 1000) {
			newVal = 1000;
		}
		$(this).val(newVal);
	});

	// 使用条件
	$('.discounts-condition').on('input propertychange', function () {
		$(this).removeClass('warn');
		// 新的val值，如果有非数字都替换成空，如果大于6个字符则截断
		var newVal = $(this).val().replace(/\D/g, '');
		if (parseInt(newVal, 10) < discountsCondition) {
			$(this).addClass('warn');
			$(this).closest('.form-ctn').find('.warn-tip').show();
		} else {
			$(this).removeClass('warn');
			$(this).closest('.form-ctn').find('.warn-tip').hide();
		}
		if (parseInt(newVal, 10) > 9999) {
			newVal = 9999;
		}
		$(this).val(newVal);
		// 设置
		if (newVal !== '') {
			$('.discounts-view .view-condition').text('满' + newVal + '元可用');
		} else {
			$('.discounts-view .view-condition').text('可用条件');
		}
	});

	// 推广方式
	$('.generalize-type li').on('click', function () {
		$(this).addClass('active').siblings('li').removeClass('active');
		$(this).find('input').prop('checked', true);
		if ($(this).index()) {
			$('.channel').hide();
		} else {
			$('.channel').show();
		}
	});
	// 推广渠道
	$('.channel-type li').on('click', function () {
		$(this).addClass('active').siblings('li').removeClass('active');
		$(this).find('input').prop('checked', true);
	});

	// 创建优惠券
	$('.btn-new').on('click', function () {
		$('.must:visible').each(function () {
			if ($(this).val() == '') {
				$(this).addClass('warn');
			}
		});
		if ($('.discounts-scope .scope-text').text() == '选择产品') {
			$('.discounts-scope').addClass('warn');
		}
		if ($('.warn').length <= 0) {
			console.log('可以创建');
		}
	});

	// 返回
	$('.btn-back').on('click', function () {
		window.history.back();
	});

});