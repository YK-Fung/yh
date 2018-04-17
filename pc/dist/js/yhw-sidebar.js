define(['jquery'], function($){
	// 切换侧边栏
	//判断是否登录
	if($('.top-bar .left').hasClass('succeed')){
		$('.side-close').addClass('side-toggle-btn');
	}
	//如果没有登录跳到登录页面
	$('.side-close').on('click', function() {
		if(!$('.top-bar .left').hasClass('succeed')){
			//登录
			window.location.href = "https://www.baidu.com/";
		}
	});

	//展开
	function openSidebar(){
		//展开 
		$('.yhw-sidebar').animate({'right': '0'}, 30);
		// 箭头切换
		$('.lr-arrows').children('i').removeClass('fa-reply').addClass('fa-share');
		$('.yhw-sidebar').attr('data','1');
	}

	
	//收起
	function putAway(){
		$('.yhw-sidebar').animate({'right': '-245px'}, 30);
		$('.yhw-sidebar').attr('data','0');
		// 箭头切换
		$('.lr-arrows').children('i').removeClass('fa-share').addClass('fa-reply');
	}


	//点击展开
	$(document).on('click', '.side-toggle-btn',function(event) {
		var e = event || window.event;
		var dataNum =$('.yhw-sidebar').attr('data');
		if(dataNum == 0){
			openSidebar();
		}
		var _index = $(this).index();
		$('.list-ctn .toggle-ctn').eq(_index).show().siblings('.toggle-ctn').hide();
		
		if($(this).hasClass('cg-history-open')){
			//采购历史-点击展开
			$('.list-ctn .cg-history').show().siblings('.toggle-ctn').hide();
			$('.aa').click();
		}else if ($(this).hasClass('cg-list-open')) {
			//采购历史-点击展开
			$('.list-ctn .cg-list').show().siblings('.toggle-ctn').hide();
		}
		e.stopPropagation();
	});

	// 点击收起
	$('.put-away').on('click', function(event) {
		var e = event || window.event;
		var dataNum =$(this).closest('.yhw-sidebar').attr('data');
		if(dataNum == 1){
			//收起
			putAway();
		}else {
			//展开 
			openSidebar();
		}
		e.stopPropagation();
	});

	// 鼠标点击离开来目标，菜单栏隐藏
	$(document).on('click', function() {
		putAway();//收起
	});

	//侧边栏停止冒泡
	$(document).on('click','.yhw-sidebar ',function(event) {
		var e = event || window.event;
		e.stopPropagation();
	});

	//我的收藏
	//商品和供应商切换
	$('.collect .tab').on('click', 'li', function() {
		var _index = $(this).index();
		$(this).addClass('active').siblings('li').removeClass('active');
		$('.ctn-list .tab-ctn').eq(_index).show().siblings('.tab-ctn').hide();
	});

	//自定义复选框
	$.fn.toggleCheckbox = function () {
	 this.attr("checked", !this.attr("checked"));
	};
	$('.yhw-sidebar').on('click', '.checkbox', function() {
		//切换attr属性
		$(this).find(':checkbox').toggleCheckbox();
		//切换样式
		$(this).toggleClass('active');

		if(!$(this).find(':checkbox').attr("checked")){
			//取消全选
			$('.checkbox-all').removeClass('active');
			$('.checkbox-all').find(':checkbox').attr("checked", false);
		}
	});

	//采购历史 全选
	$('.cg-history .checkbox-all').on('click', function() {
		if(!$(this).find(':checkbox').attr("checked")){
			//全选
			$(this).addClass('active');
			$(this).find(':checkbox').attr("checked", true);
			$('.history-list').find('.checkbox').addClass('active');
			$('.history-list').find(':checkbox').attr("checked", true);
		}else {
			//取消全选
			$(this).removeClass('active');
			$(this).find(':checkbox').attr("checked", false);
			$('.history-list').find('.checkbox').removeClass('active');
			$('.history-list').find(':checkbox').attr("checked", false);
		}
	});

	//清空采购历史
	$('.Empty-record').on('click', function() {
		$('input[name=historys]').each(function() {
			if($(this).attr('checked')){
				$(this).closest('li').remove();
			}
		});
	});
	

	var cgPlan = function () {
		var o = {
			// 商品数量最小值
			'amountMin': 0
		};
		// 数量总计and商品总额
		o.totalFn = function () {
			// 商品总额
			var priceNum = $('.plan-product').find('.subtotal-num span');
			var total = 0;
			priceNum.each(function () {
				total += parseInt($(this).text(), 10);
			});
			$('.total-num span').text(total);
		};
		// 小计商品总额
		o.liTotalFn = function (self) {
			// 商品总额
			var priceNum = self.closest('.plan-product').find('.subtotal-num span');
			var liTotal = 0;
			priceNum.each(function () {
				liTotal += parseInt($(this).text(), 10);
			});
			self.closest('.plan-product').find('.li-price span').text(liTotal);
		};
		// 数量调整
		o.amountFn = function (self, idx, newVal) {
			// 当前产品
			var product = self.closest('.plan-product');
			// 设置新的值
			self.closest('.amount-opt').find('.amount-num').val(newVal);
			// 小计
			var subTotal = parseInt(product.find('.price-num').eq(idx).text(), 10) * newVal;
			product.find('.subtotal-num').eq(idx).find('span').text(subTotal);
			o.liTotalFn(self);
			o.totalFn();
		};
		// 整件转换
		o.amountWholeFn = function (self, newVal) {
			// 当前产品
			var product = self.closest('.plan-product');
			// 整件dom
			var wholeDom = self.closest('.prices').find('.amount-whole .amount-num');
			// 设置新的值
			wholeDom.val(parseInt(wholeDom.val(), 10) + newVal);
			// 小计
			var subTotal = parseInt(product.find('.price-whole').text(), 10) * parseInt(wholeDom.val(), 10);
			product.find('.subtotal-whole span').text(subTotal);
			o.liTotalFn(self);
			o.totalFn();
		};
		//数量调整-增加
		$('.prices .amount-add').on('click', function () {
			o.self = $(this);
			o.idx = o.self.closest('.amount-opt').index();
			// 整件数量
			var wholeAmount = parseInt(o.self.closest('.plan-product').attr('data'), 10);
			// 原本的值+1
			o.newVal = parseInt($(this).closest('.amount-opt').find('.amount-num').val(), 10) + 1;
			// 如果已经达到一件的数量
			if($(this).closest('.amount-opt').hasClass('amount-one')){
				if (o.self.closest('.amount-one').length > 0 && o.newVal >= wholeAmount) {
					var wholeVal = parseInt(o.newVal/wholeAmount, 10);
					o.newVal = o.newVal%wholeAmount;
					o.amountWholeFn(o.self, wholeVal);
				}
			}
			o.amountFn(o.self, o.idx, o.newVal);
		});
		// 数量调整-减少
		$('.prices .amount-reduce').on('click', function () {
			o.self = $(this);
			o.idx = o.self.closest('.amount-opt').index();
			// 原本的值+1
			o.newVal = parseInt($(this).closest('.amount-opt').find('.amount-num').val(), 10) - 1;
			// 如果已经是最小值，则不会继续变化
			if (o.newVal <= o.amountMin) {
				o.newVal = o.amountMin;
			}
			o.amountFn(o.self, o.idx, o.newVal);
		});
		// 数量调整-输入
		$('.prices .amount-num').on('change', function () {
			o.self = $(this);
			o.idx = o.self.closest('.amount-opt').index();
			// 一箱有多少件
			var wholeAmount = parseInt(o.self.closest('.plan-product').attr('data'), 10);
			// 新的值
			o.newVal = parseInt($(this).val(), 10);
			console.log(o.newVal)
			if ($(this).val() == '') {
				o.newVal = 0;
			}
			// 如果已经是最小值，则不会继续变化
			if (o.newVal <= o.amountMin) {
				o.newVal = o.amountMin;
			}
			// 如果已经达到一件的数量
			if($(this).closest('.amount-opt').hasClass('amount-one')){
				if (o.newVal >= wholeAmount) {
					var wholeVal = parseInt(o.newVal/wholeAmount, 10);
					o.newVal = o.newVal%wholeAmount;
					o.amountWholeFn(o.self, wholeVal);
				}
			}

			o.amountFn(o.self, o.idx, o.newVal);
		});

		//清空采购计划
		$('.cg-plan-empty').on('click', function() {
			//成功执行
			//清空已选中的商品
			$('.yhw-sidebar .cg-choose-num span').text('0')
			//清空总金额
			$('.yhw-sidebar .total-num span').text('0');
			// 移除采购订单
			$('.buy-list').find('.plan-product').remove();
		});

	};
	var newCgPlan = new cgPlan();
});