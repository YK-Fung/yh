define(['jquery', 'datetime', 'bar-slider', 'bar-header', 'pagination2','ie-tip'], function($){

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

	//选中下拉选项--优惠券类型
	$(document).on('click', '.select-discounts .select-drop li', function(event) {
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
				break;
			case '店铺优惠券':
				$('.discounts-scope').html('<div class="scope-text goods-all">全部产品</div>');
				$('.discounts-view').attr('class', 'discounts-view discounts-dp');
				$('.discounts-view .view-goods').html($('.discounts-scope .scope-text').text());
				break;
			default:
				break;
		}
		//隐藏下拉列表
		$(this).closest('.select-box').removeClass('down');
		e.stopPropagation();
	});	
	//选中下拉选项--产品类别
	$(document).on('click', '.select-product .select-drop li', function(event) {
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
			console.log(idx);
			if ($('.date-day').val() !== '') {
				$('.discounts-view .view-time').text($('.date-day').val() + '天内有效');
			}
		} else {
			console.log(idx);
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

    //发布开始日期
    var date1 = {};
    //发布结束日期
    var date2 = {};
    $('.date1').on('change',function(){
        date1.val = $(this).val();
        date1.year = date1.val.substr(0,4);
        date1.month = date1.val.substr(5,2);
        date1.day = date1.val.substr(8,2);
        if(date2.val){
            if(date1.year * 1 > date2.year * 1){
                date1.val = date2.val;
                $(this).val(date1.val)
            }else if(date1.month * 1 > date2.month * 1){
                date1.val = date2.val;
                $(this).val(date1.val)
            }else if(date1.day * 1 > date2.day * 1){
                date1.val = date2.val;
                $(this).val(date1.val)
            }
        }
    });

    $('.date2').on('change',function(){
        date2.val = $(this).val();
        date2.year = date2.val.substr(0,4);
        date2.month = date2.val.substr(5,2);
        date2.day = date2.val.substr(8,2);
        if(date1.val){
            if(date2.year * 1 < date1.year * 1){
                date2.val = date1.val;
                $(this).val(date2.val)
            }else if(date2.month * 1 < date1.month * 1){
                date2.val = date1.val;
                $(this).val(date2.val)
            }else if(date2.day * 1 < date1.day * 1){
                date2.val = date1.val;
                $(this).val(date2.val)
            }
        }
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

	// 选择产品
	$(document).on('click', '.goods-select', function () {
		$('.discounts-scope').removeClass('warn');
		// 初始化页码
		paginationArg.init($('.goods-ctn-li').eq(0).find('.pagination'), $('.goods-ctn-li').eq(0).find('.page-amount').text());
		$('#pop-goods').fadeIn('fast');
	})
	// 产品类型
	$('.goods-type li').on('click', function (){
		var idx = $(this).index();
		$(this).addClass('active').siblings('li').removeClass('active');
		$('.goods-ctn .goods-ctn-li').eq(idx).show().siblings('.goods-ctn-li').hide();
		// 初始化页码
		paginationArg.init($('.goods-ctn-li').eq(idx).find('.pagination'), $('.goods-ctn-li').eq(idx).find('.page-amount').text());
		paginationArg.ajaxFn = function () {
			console.log(paginationArg.viewNum);
		};
	});
	// 全选判断
	var checkboxAllFn = function (self) {
		// 多选框
		var checkLen = self.closest('.goods-ctn-li').find('.checkbox').length;
		// 选中的多选框
		var checkActiveLen = self.closest('.goods-ctn-li').find('.checkbox.active').length;
		// 如果已经全部选中了,则全选
		if (checkActiveLen == checkLen) {
			self.closest('.goods-ctn-li').find('.checkbox-all').addClass('active');
			self.closest('.goods-ctn-li').find('.checkbox-all input').prop('checked', true);
		} else {
			self.closest('.goods-ctn-li').find('.checkbox-all').removeClass('active');
			self.closest('.goods-ctn-li').find('.checkbox-all input').prop('checked', false);
		}
	};
	// 全选
	$(document).on('click', '#pop-goods .checkbox-all', function () {
		if ($(this).hasClass('active')) {
			$(this).closest('.goods-ctn-li').find('.checkbox').removeClass('active');
			$(this).closest('.goods-ctn-li').find('.checkbox input').prop('checked', false);
		} else {
			$(this).closest('.goods-ctn-li').find('.checkbox').addClass('active');
			$(this).closest('.goods-ctn-li').find('.checkbox input').prop('checked', true);
		}
		checkboxAllFn($(this));
	});
	// 单选
	$(document).on('click', '#pop-goods .checkbox', function () {
		$(this).toggleClass('active');
		$(this).find('input').prop('checked', !$(this).find('input').prop('checked'));
		checkboxAllFn($(this));
	});
	// 保存
	$('#pop-goods .btn-yes').on('click', function () {
		// 在这里修改文字
		$('.discounts-scope .scope-text').text('999感冒令');
		$('.discounts-view .view-goods').html($('.discounts-scope .scope-text').text());

		$(this).closest('.pop-shade').fadeOut('fast');
	});
	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	// 撤销
	var selfRepeal;
	$(document).on('click', '.btn-repeal', function () { 
		selfRepeal = $(this);
		$('#pop-repeal').fadeIn('fast');
	});
	$('#pop-repeal .btn-yes').on('click', function () {
		selfRepeal.closest('ul').remove();
		$(this).closest('.pop-shade').fadeOut('fast');
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
		// 新的val值，如果有非数字都替换成空
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
		if ($('.warn').length <= 0 && $('.error').length <= 0) {
			console.log('可以创建');
		}
	});

	// 返回
	$('.btn-back').on('click', function () {
		window.history.back();
	});


});