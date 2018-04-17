define(['jquery', 'datetime', 'bar-slider', 'bar-header', 'pagination2','ie-tip'], function($){

	// 优惠券类型
	$('.discounts-type li').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
		paginationArg.init($('.wrap'), $('.wrap .page-amount').text());
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
		var tableBody = $(this).closest('.table-body');
		arg.minAmount = parseInt(tableBody.find('.amount-input').val(), 10);
		arg.ctnRecord = tableBody.find('.btn').html();
		tableBody.addClass('status-edit');
		tableBody.find('.amount-input').removeAttr('readonly');
		tableBody.find('.btn').html('<a class="btn-ok">完成</a> <a class="btn-end">结束</a>');
	});
	// 数量调整-增加
	$('.li-ctn .amount-add').on('click', function () {
		var tableBody = $(this).closest('.table-body');
		// 库存
		var inventoryNum = parseInt(tableBody.find('.inventory-num').text(), 10);
		var input = $(this).closest('.li-ctn').find('.amount-input');
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= arg.maxAmount) {
			newVal = arg.maxAmount;
		}
		input.val(newVal);
	});
	// 数量调整-减少
	$('.li-ctn .amount-reduce').on('click', function () {
		var tableBody = $(this).closest('.table-body');
		var input = $(this).closest('.li-ctn').find('.amount-input');
		// 数量,最小1
		var newVal = parseInt(input.val(), 10) - 1;
		if (newVal <= arg.minAmount) {
			newVal = arg.minAmount;
		}
		input.val(newVal);
	});
	// 数量调整-输入
	$('.li-ctn .amount-input').on('blur', function () {
		var tableBody = $(this).closest('.table-body');
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
	$('.li-ctn .amount-input').on('blur', function () {
		var tableBody = $(this).closest('.table-body');
		if ($(this).val() == '') {
			$(this).val(arg.minAmount);
		}
	});

	// 完成
	$(document).on('click', '.btn-ok', function () {
		var tableBody = $(this).closest('.table-body');
		tableBody.removeClass('status-edit');
		tableBody.find('.amount-input').attr('readonly', true);
		tableBody.find('.btn').html(arg.ctnRecord);
	});

	// 结束
	$(document).on('click', '.btn-end', function () { 
		arg.selfEnd = $(this);
		$('#pop-end').fadeIn('fast');
	});
	$('#pop-end .btn-yes').on('click', function () {
		var tableBody = arg.selfEnd.closest('.table-body');
		tableBody.attr('class', 'table-body status-end');
		tableBody.find('.status').html('已结束');
		tableBody.find('.btn').html('<a class="btn-view">查看</a> <a class="btn-del">删除</a>')
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	// 发放
	$(document).on('click', '.btn-give', function () {
		paginationArg.init($('#pop-give'), $('#pop-give .page-amount').text());
		$('#pop-give').fadeIn('fast');
	});

	//查看原因
	$(document).on('click','.btn-check',function(){
        $('#pop-check').fadeIn('fast');
	})


	// 我的客户
	$('.my-client').on('click', function () {
		$(this).toggleClass('active');
		$(this).find('input').prop('checked', !$(this).find('input').prop('checked'));
	});
	// 全选判断
	var checkboxAllFn = function () {
		// 多选框
		var checkLen = $('#pop-give .checkbox').length;
		// 选中的多选框
		var checkActiveLen = $('#pop-give .checkbox.active').length;
		// console.log(`${checkLen}-${checkActiveLen}`);
		// 如果已经全部选中了,则全选
		if (checkActiveLen == checkLen) {
			$('#pop-give .checkbox-all').addClass('active');
			$('#pop-give .checkbox-all input').prop('checked', true);
		} else {
			$('#pop-give .checkbox-all').removeClass('active');
			$('#pop-give .checkbox-all input').prop('checked', false);
		}
	};
	// 单选
	$('#pop-give .checkbox').on('click', function () {
		$(this).toggleClass('active');
		$(this).find('input').prop('checked', !$(this).find('input').prop('checked'));
		checkboxAllFn();
	});
	// 全选
	$('#pop-give .checkbox-all').on('click', function () {
		if ($(this).hasClass('active')) {
			$('#pop-give .checkbox').removeClass('active');
			$('#pop-give .checkbox input').prop('checked', false);
		} else {
			$('#pop-give .checkbox').addClass('active');
			$('#pop-give .checkbox input').prop('checked', true);
		}
		checkboxAllFn();
	});

	// 链接
	$(document).on('click', '.btn-link', function () { 
		$('#pop-link').fadeIn('fast');
	});
	// 复制
	$(document).on('click', '.btn-copy', function () {
		var copyObj = $(this).closest('.pop-shade').find('.pop-body textarea')[0];
		console.log(copyObj);
		copyObj.select();
		document.execCommand("Copy");
	});

	// 删除
	$(document).on('click', '.btn-del', function () { 
		arg.selfDel = $(this);
		$('#pop-del').fadeIn('fast');
	});
	$('#pop-del .btn-yes').on('click', function () {
		arg.selfDel.closest('.table-body').remove();
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});


	// 初始化页码
	paginationArg.init($('.wrap'), $('.wrap .page-amount').text());
	// paginationArg.ajaxFn = function () {
	// 	console.log(paginationArg.viewNum);
	// };

});