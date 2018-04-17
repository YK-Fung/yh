define(['jquery', 'yhw-nav2', 'yhw-header2', 'yhw-topbar2', 'yhw-sidebar2', 'ie-tip', 'pagination2'], function($){


	// 多选按钮
	$('.btn-checkbox').on('click', function () {
		var conditionLi = $(this).closest('.condition-li');
		// 切换选择模式的时候,清空所有状态和选中
		conditionLi.find('.condition-select li').removeClass('active');
		conditionLi.find('.condition-select .checkbox input').prop('checked', false);
		if ($(this).text() == '多选') {
			$(this).text('单选');
			conditionLi.find('.select-all-text').text('全部');
			conditionLi.find('.condition-select').removeClass('condition-radio');
			conditionLi.find('.condition-select').addClass('condition-checkbox');
		} else {
			$(this).text('多选');
			conditionLi.find('.select-all-text').text('不限');
			conditionLi.find('.condition-select').removeClass('condition-checkbox');
			conditionLi.find('.condition-select').addClass('condition-radio');
		}
	});
	// 更多
	$(document).on('click', '.btn-more', function() {
		if ($(this).text() == '更多') {
			$(this).html('收起<span class="sjx"></span>');
			$(this).closest('.condition-li').css('height', 'auto');
			$(this).addClass('active');
		} else {
			$(this).html('更多<span class="sjx"></span>');
			$(this).closest('.condition-li').css('height', '39px');
			$(this).removeClass('active');
		}
	});
	// 条件选择,单选
	$(document).on('click', '.condition-radio li', function () {
		if (!$(this).hasClass('active')) {
			var parentDom = $(this).closest('.condition-li');
			// 添加活动样式
			$(this).addClass('active').siblings('li').removeClass('active');
			// 其他的选中
			parentDom.find('.checkbox input').prop('checked', false);
			// 选中当前
			$(this).find('.checkbox input').prop('checked', true);
		};
	});
	// 条件选择,多选
	var checkboxAll = function (self) {
		var conditionSelect = self.closest('.condition-select');
		if (conditionSelect.find('.select-one.active').length >= conditionSelect.find('.select-one').length) {
			conditionSelect.find('.select-all').addClass('active');
		} else {
			conditionSelect.find('.select-all').removeClass('active');
		}
	};
	$(document).on('click', '.condition-checkbox .select-one', function () {
		if ($(this).hasClass('active')) {
			// 移除活动样式
			$(this).removeClass('active');
			// 取消选中
			$(this).find('.checkbox input').prop('checked', false);
		} else {
			// 添加活动样式
			$(this).addClass('active');
			// 选中当前
			$(this).find('.checkbox input').prop('checked', true);
		}
		checkboxAll($(this));
	});
	$(document).on('click', '.condition-checkbox .select-all', function () {
		var selectOne = $(this).closest('.condition-select').find('.select-one');
		if ($(this).hasClass('active')) {
			// 移除活动样式
			selectOne.removeClass('active');
			// 取消选中
			selectOne.find('.checkbox input').prop('checked', false);
		} else {
			// 添加活动样式
			selectOne.addClass('active');
			// 选中当前
			selectOne.find('.checkbox input').prop('checked', true);
		}
		checkboxAll($(this));
	});

	// 筛选
	$('.filtrate ul li').on('click', function () {
		if ($(this).hasClass('active')) {
			$(this).find('.sjx').toggleClass('active');		
		} else {
			$(this).addClass('active').siblings('li').removeClass('active');
			$(this).find('input').prop('checked', true);
		}
	});
	// 只看有货
	$('.filtrate-type').on('click', function () {
		$(this).toggleClass('active');
		$(this).find('input').prop('checked', !$(this).find('input').prop('checked'));
	});

	// 小计
	var subtotalFn = function (tableBody, val) {
		var priceNum = parseFloat(tableBody.find('.price-num').text());
		if (!priceNum) {
			priceNum = 0.00;
		}
		var subtotalNum = (priceNum * val).toFixed(2);
		tableBody.find('.subtotal-num').text(subtotalNum);
		// 如果超出了库存，显示警告
		if (val > parseInt(tableBody.find('.inventory-num').text(), 10)) {
			tableBody.find('.inventory').show();
		} else {
			tableBody.find('.inventory').hide();
		}
	};
	// 数量调整-增加
	$('.li-ctn .amount-add').on('click', function () {
		var tableBody = $(this).closest('.table-body');
		// 库存
		var inventoryNum = parseInt(tableBody.find('.inventory-num').text(), 10);
		var input = $(this).closest('.li-ctn').find('.amount-input');
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= 999999) {
			newVal = 999999;
		}
		input.val(newVal);
		subtotalFn(tableBody, newVal);
	});
	// 数量调整-减少
	$('.li-ctn .amount-reduce').on('click', function () {
		var tableBody = $(this).closest('.table-body');
		var input = $(this).closest('.li-ctn').find('.amount-input');
		// 数量,最小1
		var newVal = parseInt(input.val(), 10) - 1;
		if (newVal <= 1) {
			newVal = 1;
		}
		input.val(newVal);
		subtotalFn(tableBody, newVal);
	});
	// 数量调整-输入
	$('.li-ctn .amount-input').on('input propertychange', function () {
		var tableBody = $(this).closest('.table-body');
		// 新的val值，如果有非数字都替换成空
		var newVal = $(this).val().replace(/[^\d.]/g, '');
		if (parseInt(newVal, 10) <= 1) {
			newVal = 1;
		}
		if (newVal.length > 6) {
			newVal = newVal.substr(0, 6);
		}
		$(this).val(newVal);
		subtotalFn(tableBody, newVal);
	});
	// 如果失焦的时候,空值,则设置为1
	$('.li-ctn .amount-input').on('blur', function () {
		var tableBody = $(this).closest('.table-body');
		if ($(this).val() == '') {
			$(this).val(1);
			subtotalFn(tableBody, 1);
		}
	});

	
	// 初始化页码
	paginationArg.init($('.wrap'), $('.page-amount').text());
	paginationArg.ajaxFn = function () {
		console.log(paginationArg.viewNum);
	};


});