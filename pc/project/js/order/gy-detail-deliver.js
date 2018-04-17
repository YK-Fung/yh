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

	//查看物流
	$(document).on('click', '.logistics-check', function() {
		$('#pop-logistics-detail').show();
	});

	//查看第三方物流
	$(document).on('click', '.logistics-third', function() {
		$('#pop-logistics-third').show();
	});

	// 确认收款
	$(document).on('click', '.confirm-gathering', function() {
		$('#pop-tip-txt .ctn-txt').text('是否确认收款？');
		$('#pop-tip-txt .btn-yes').attr('data', 'confirm-gathering');
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

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-yes,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});

	//确定提示框按钮
	$('.pop-shade .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'cancel-order-confirm':
				//取消订单
				console.log('取消订单');
				break;
			case 'confirm-gathering':
				//确认收款
				console.log('确认收款');
				break;
			case 'immediate-delivery':
				//立即发货
				console.log('立即发货');
				break;
		}
	});
});