define(['jquery', 'datetime', 'pagination', 'bootstrap'], function($){

	// 日期
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	var arg = {
		// 最大数量
		maxAmount: 999999,
		// 最小数量
		minAmount: 0,
		// 原来的内容
		ctnRecord: ''
	};

	// 编辑
	$(document).on('click', '.btn-edit', function () {
		var tableTr = $(this).closest('tr');
		arg.minAmount = parseInt(tableTr.find('.amount-input').val(), 10);
		arg.ctnRecord = tableTr.find('.opt').html();
		tableTr.addClass('status-edit');
		tableTr.find('.amount-input').removeAttr('readonly');
		tableTr.find('.opt').html('<a class="btn-ok">完成</a><a class="btn-end">结束</a>');
	});
	// 数量调整-增加
	$('.amount .amount-add').on('click', function () {
		var tableTr = $(this).closest('tr');
		// 库存
		var inventoryNum = parseInt(tableTr.find('.inventory-num').text(), 10);
		var input = $(this).closest('.amount').find('.amount-input');
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= arg.maxAmount) {
			newVal = arg.maxAmount;
		}
		input.val(newVal);
	});
	// 数量调整-减少
	$('.amount .amount-reduce').on('click', function () {
		var tableTr = $(this).closest('tr');
		var input = $(this).closest('.amount').find('.amount-input');
		// 数量,最小1
		var newVal = parseInt(input.val(), 10) - 1;
		if (newVal <= arg.minAmount) {
			newVal = arg.minAmount;
		}
		input.val(newVal);
	});
	// 数量调整-输入
	$('.amount .amount-input').on('blur', function () {
		var tableTr = $(this).closest('tr');
		// 新的val值，如果有非数字都替换成空
		var newVal = $(this).val().replace(/[^\d.]/g, '');
		if (parseInt(newVal, 10) <= arg.minAmount) {
			newVal = arg.minAmount;
		}
		if (parseInt(newVal, 10) >= arg.maxAmount) {
			newVal = arg.maxAmount;
		}
		$(this).val(newVal);
	});
	// 如果失焦的时候,空值,则设置为原先的值
	$('.amount .amount-input').on('blur', function () {
		var tableTr = $(this).closest('tr');
		if ($(this).val() == '') {
			$(this).val(arg.minAmount);
		}
	});

	// 完成
	$(document).on('click', '.btn-ok', function () {
		var tableTr = $(this).closest('tr');
		tableTr.removeClass('status-edit');
		tableTr.find('.amount-input').attr('readonly', true);
		tableTr.find('.opt').html(arg.ctnRecord);
	});

	// 结束
	$(document).on('click', '.btn-end', function () { 
		arg.selfEnd = $(this);
		$('.modal-end').modal('show');
	});
	$('.modal-end .btn-yes').on('click', function () {
		var tableTr = arg.selfEnd.closest('tr');
		tableTr.attr('class', 'table-body status-end');
		tableTr.find('.status').html('已结束');
		tableTr.find('.opt').html('<a class="btn-view">查看</a><a class="btn-del">删除</a>')
	});

	// 发放
	$(document).on('click', '.btn-give', function () {
		paginationArg.init($('.modal-give'), $('.modal-give .pagination .active').text(), $('.modal-give .page-amount').text());
		$('.modal-give').modal('show');
	});
	// 我的客户
	$('.my-client').on('click', function () {
		$(this).toggleClass('active');
		$(this).find('input').prop('checked', !$(this).find('input').prop('checked'));
	});
	// 全选判断
	var checkboxAllFn = function () {
		// 多选框
		var checkLen = $('.modal-give .checkbox').length;
		// 选中的多选框
		var checkActiveLen = $('.modal-give .checkbox.active').length;
		console.log(`${checkLen}-${checkActiveLen}`);
		// 如果已经全部选中了,则全选
		if (checkActiveLen == checkLen) {
			$('.modal-give .checkbox-all').addClass('active');
			$('.modal-give .checkbox-all input').prop('checked', true);
		} else {
			$('.modal-give .checkbox-all').removeClass('active');
			$('.modal-give .checkbox-all input').prop('checked', false);
		}
	};
	// 单选
	$('.modal-give .checkbox').on('click', function () {
		$(this).toggleClass('active');
		$(this).find('input').prop('checked', !$(this).find('input').prop('checked'));
		checkboxAllFn();
	});
	// 全选
	$('.modal-give .checkbox-all').on('click', function () {
		if ($(this).hasClass('active')) {
			$('.modal-give .checkbox').removeClass('active');
			$('.modal-give .checkbox input').prop('checked', false);
		} else {
			$('.modal-give .checkbox').addClass('active');
			$('.modal-give .checkbox input').prop('checked', true);
		}
		checkboxAllFn();
	});

	// 链接
	$(document).on('click', '.btn-alink', function () { 
		$('.modal-alink').modal('show');
	});
	// 复制
	$(document).on('click', '.btn-copy', function () {
		var copyObj = $(this).closest('.modal-alink').find('.modal-body textarea')[0];
		copyObj.select();
		document.execCommand("Copy");
		console.log(copyObj);
	});

	// 删除
	$(document).on('click', '.btn-del', function () { 
		arg.selfDel = $(this);
		$('.modal-del').modal('show');
	});
	$('.modal-del .btn-yes').on('click', function () {
		arg.selfDel.closest('tr').remove();
	});

	//查看原因
	$(document).on('click','.btn-check',function(){
        $('.modal-check').modal('show');
	})
});