define(['jquery', 'datetime', 'bar-slider', 'bar-header', 'ie-tip','pagination2'], function($){
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

	// 日期控件
	//年月日
	$('.date-time').datetimepicker({
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d',
		beforeShowDay: function(date) {
			// 日期控件的年月日
			var dateYear = '' + date.getFullYear();
			var dateMonth = date.getMonth() >= 10 ? '' + date.getMonth() : '0' + date.getMonth();
			var dateDate = date.getDate() >= 10 ? '' + date.getDate() : '0' + date.getDate();
			var dateStr = dateYear + dateMonth + dateDate;
			// 当前年月日
			var dateNow = new Date();
			var dateNowYear = '' + dateNow.getFullYear();
			var dateNowMonth = dateNow.getMonth() >= 10 ? '' + dateNow.getMonth() : '0' + dateNow.getMonth();
			var dateNowDate = dateNow.getDate() >= 10 ? '' + dateNow.getDate() : '0' + dateNow.getDate();
			var dateNowStr = dateNowYear + dateNowMonth + dateNowDate;
			// console.log(dateStr + '----' + dateNowStr + '****' + '20180106');
			if (dateStr > dateNowStr) {
				return [false, ""]
			}
			return [true, ""];
		}
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

	//订单导航
	$('.toggle-navs li').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
	});

	//确认订单-弹窗
	$(document).on('click', '.confirm-order', function() {
		$('#pop-tip-txt .ctn-txt').text('确定要确认订单吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'confirm-order');
		$('#pop-tip-txt').show();
	});

	//取消订单
	$(document).on('click', '.cancel-order', function() {
		$('#pop-cancel-order .btn-yes').attr('data', 'cancel-order-confirm');
		$('#pop-cancel-order').show();
	});

	//单选框切换
	$('.radio').click(function() {
		$(this).addClass('active').parent().siblings().find('.radio').removeClass('active');
		$(this).children('input').prop('checked', true);
		$(this).parent().siblings().find('input').prop('checked', false);
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

	//确认收款
	$(document).on('click', '.confirm-gathering', function() {
		$('#pop-tip-txt .ctn-txt').text('确定要确认收款吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'confirm-gathering');
		$('#pop-tip-txt').show();
	});

	//同意退款
	$(document).on('click', '.agree-refund', function() {
		$('#pop-tip-txt .ctn-txt').text('确定要同意退款吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'agree-refund-confirm');
		$('#pop-tip-txt').show();
	});

	//拒绝退款
	$(document).on('click', '.refuse-refund', function() {
		$('#pop-refuse-refund .ctn-txt').text('确定要拒绝退款吗？');
		$('#pop-refuse-refund .btn-yes').attr('data', 'refuse-refund-confirm');
		$('#pop-refuse-refund').show();
	});

	//确认收货
	$(document).on('click', '.confirm-receiving', function() {
		$('#pop-tip-txt .ctn-txt').html('请收到货后，先验货，再确认收货！<br>如对实收货品有异议，请点击<a href="#" class="blue">申请售后</a>');
		$('#pop-tip-txt .btn-yes').attr('data', 'confirm-receiving');
		$('#pop-tip-txt').show();
	});

	//查看物流
	$(document).on('click', '.logistics-check', function() {
		$('#pop-logistics-detail').show();
	});

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-yes,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});


	// 弹窗 立即发货
	$(document).on('click', '.immediate-delivery', function() {
		$('#pop-immediately-deliver').show();
		$('#pop-immediately-deliver .btn-yes').attr('data', 'immediate-delivery');
	});
	
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

	//单选
	$('#pop-immediately-deliver .tbody').on('click', '.checkbox', function() {
		//切换attr属性
		$(this).find(':checkbox').prop("checked", !$(this).find(':checkbox').prop("checked"));
		$(this).toggleClass('active');
		
		if($('#pop-immediately-deliver .tbody input[type="checkbox"]').length == $('#pop-immediately-deliver .tbody input[type=checkbox]:checked').length){
			//全选
			$('#pop-immediately-deliver .checkbox-all').addClass('active');
			$('#pop-immediately-deliver .checkbox-all').find(':checkbox').prop("checked", true);
		}else {
			//取消全选
			$('#pop-immediately-deliver .checkbox-all').removeClass('active');
			$('#pop-immediately-deliver .checkbox-all').find(':checkbox').prop("checked", false);
		}
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
	$('.logisitic-del .search input').on('input propertychange', function() {
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

	//确定提示框按钮
	$('.pop-shade .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'confirm-order':
				//取消订单
				console.log('确认订单');
				break;
			case 'cancel-order-confirm':
				//取消订单
				console.log('取消订单');
				break;
			case 'confirm-gathering':
				//确认收款
				console.log('确认收款');
				break;
			case 'agree-refund-confirm':
				//同意退款
				console.log('同意退款');
				break;
			case 'refuse-refund-confirm':
				//拒绝退款
				console.log('拒绝退款');
				break;
			case 'confirm-receiving':
				//确认收货
				console.log('确认收货');
				break;
			case 'immediate-delivery':
				//立即发货
				console.log('立即发货');
				break;
		}
	});

	// 初始化页码
	paginationArg.init($('.wrap'), 10, 2);
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});