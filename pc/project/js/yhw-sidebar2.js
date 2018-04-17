define(['jquery'], function($){
	//自定义高度
	function heightAuto(){
		/*会员中心*/
		var _height_a = $(window).height()-36;
		$('.member-center .overflow-auto').css('height', _height_a);

		/*我的收藏*/
		var _height_b = $(window).height()-67;
		$('.collect .overflow-auto').css('height', _height_b);

		/*我的优惠券*/
		$('.coupon .overflow-auto').css('height', _height_b);

		/*采购单*/
		var _height_c = $(window).height()-126;
		$('.cg-list .buy-list').css('height', _height_c);
	}
	heightAuto();

	$(window).resize(function() {
	 heightAuto();
	});

	//禁止页面滚动
	var scrollTop = -1; // 鼠标进入到区域后，则存储当前window滚动条的高度
	$('.yhw-sidebar').hover(function() {
		scrollTop = $(window).scrollTop();
	}, function() {
		 scrollTop = -1;
	});
		 
	// 鼠标进入到区域后，则强制window滚动条的高度
	$(window).scroll(function(){
	scrollTop!==-1 && $(this).scrollTop(scrollTop);
	})


	//判断是否登录
	//if($('.top-bar #if-login>div').hasClass('already-login')){
		 $('.side-close').addClass('side-toggle-btn');
	//}
	//如果没有登录跳到登录页面
	// $('.side-close').on('click', function() {
	//  	if(!$('.top-bar #if-login>div').hasClass('already-login')){
	// 		//登录
	//  		window.location.href = "https://www.baidu.com/";
	//  	}
	// });

	//icon鼠标移上
	$('.side-close').mouseover(function() {
		if($('.yhw-sidebar').attr('data') == 0){
			$(this).addClass('active').siblings().removeClass('active');
		}
	});

	$('.side-close').mouseout(function() {
		if($('.yhw-sidebar').attr('data') == 0){
			$(this).removeClass('active');
		}
	});

	//展开
	function openSidebar(){
		//展开 
		$('.yhw-sidebar').animate({'right': '0'}, 30);
		// 箭头切换
		$('.put-away').removeClass('open-icon');
		$('.yhw-sidebar').attr('data','1');
	}

	
	//收起
	function putAway(){
		$('.yhw-sidebar').animate({'right': '-254px'}, 30);
		$('.yhw-sidebar').attr('data','0');
		// 箭头切换
		$('.put-away').addClass('open-icon');
		$('.side-close').removeClass('active');
	}

	// 鼠标点击离开来目标，菜单栏隐藏
	$(document).on('click', function() {
		putAway();//收起
	});

	//侧边栏停止冒泡
	$(document).on('click','.yhw-sidebar ',function(event) {
		var e = event || window.event;
		e.stopPropagation();
	});

	//点击展开
	$(document).on('click', '.side-toggle-btn',function(event) {
		var e = event || window.event;
		var dataNum =$('.yhw-sidebar').attr('data');
		if(dataNum == 0){
			openSidebar();
		}
		var _index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.list-ctn .toggle-ctn').eq(_index).show().siblings('.toggle-ctn').hide();
		
		if($(this).hasClass('into-cg-list')){
			//采购历史-点击展开
			$('.cg-list-click').click();
		}
		e.stopPropagation();
	});

	// 点击收起
	$('.put-away').on('click', function(event) {
		var e = event || window.event;
		if(!$('.top-bar #if-login>div').hasClass('already-login')){
			//登录
	 		window.location.href = "https://www.baidu.com/";
	 	}else {
	 		var dataNum =$(this).closest('.yhw-sidebar').attr('data');
			if(dataNum == 1){
				//收起
				putAway();
			}else {
				//展开 
				openSidebar();
			}
	 	}
		e.stopPropagation();
	});

	//我的收藏
	//商品和供应商切换
	$('.collect .tab').on('click', 'li', function() {
		var _data = $(this).attr('data');
		$(this).addClass('active').siblings('li').removeClass('active');
		if(_data == 0){
			$('.ctn-list .tab-ctn').eq(0).show().siblings('.tab-ctn').hide();
		}else if (_data == 1) {
			$('.ctn-list .tab-ctn').eq(1).show().siblings('.tab-ctn').hide();
		}
	});

	//我的优惠券
	//新领取和即将过期
	$('.coupon .tab').on('click', 'li', function() {
		var _data = $(this).attr('data');
		$(this).addClass('active').siblings('li').removeClass('active');
		if(_data == 0){
			$('.coupon .tab-ctn').eq(0).show().siblings('.tab-ctn').hide();
		}else if (_data == 1) {
			$('.coupon .tab-ctn').eq(1).show().siblings('.tab-ctn').hide();
		}
	});

	//采购单
	// 商品总额
	var totalFn = function () {
		var total = 0;
		$('.yhw-sidebar .plan-product').each(function () {
			total += parseFloat($(this).find('.total-prices span').text());
		});
		// 判断有没有选中的商品并且选中的商品数量足够,如果没有,不给提交
		if ($('.yhw-sidebar .good-list.active').length > 0 && $('.yhw-sidebar .good-list.active .inventory:visible').length <= 0) {
			$('.yhw-sidebar .cg-confirm').addClass('active');
		} else {
			$('.yhw-sidebar .cg-confirm').removeClass('active');
		}
		$('.yhw-sidebar .total-num span').text(total.toFixed(2));
	};
	// 小计
	var subtotalFn = function (planProduct) {
		//判断是否超出库存
		planProduct.each(function() {
			$(this).find('.good-list').each(function() {
				var val = parseInt($(this).find('.amount-num').val(),10);
				// 如果超出了库存，显示警告
				if (val > parseInt($(this).find('.inventory-num').text(), 10)) {
					$(this).find('.inventory').show();
				} else {
					$(this).find('.inventory').hide();
				}
			});
			//计算小计
			var subtotalNum = 0;
			$(this).find('.good-list.active').each(function() {
				var priceNum = parseFloat($(this).find('.price-num span').text());
				var val = parseInt($(this).find('.amount-num').val(),10);
				subtotalNum += priceNum * val;
			});
			$(this).find('.total-prices span').text(subtotalNum.toFixed(2));
		});
		// 选中商品和取消选中商品,价格记入商品总额
		totalFn();
	};
	// 多选框
	var checkboxFn = function (planProduct) {
		$('.cg-list .plan-product').each(function() {
			// 商品数量
			var planDetailLen = $(this).find('.good-list,.product-cancel').length;
			// 选择的商品数量
			var planDetailActive = $(this).find('.good-list.active,.product-cancel.active').length;
			// 如果已经选择了该供应商的全部商品,供应商的多选框勾选
			if(planDetailActive >= planDetailLen){
				$(this).addClass('active');
				$(this).find('.cg-checkbox-that input').prop('checked', true);
			}else {
				$(this).removeClass('active');
				$(this).find('.cg-checkbox-that input').prop('checked', false);
			}
		});
		// 商品种类
		$('.cg-choose-num span').text($('.good-list.active,.product-cancel.active').length);
		// 供应商数量
		var planGysLen = $('.cg-list .plan-product').length;
		// 选择的供应商数量
		var planGysActive = $('.cg-list .plan-product.active').length;
		// 如果有商品,而且已经选择了全部商品,全选框勾选
		if (planGysLen > 0 && planGysActive >= planGysLen) {
			// 全选
			$('.cg-checkbox-all').addClass('active');
			$('.cg-checkbox-all .checkbox input').prop('checked', true);
		} else {
			// 取消全选框
			$('.cg-checkbox-all').removeClass('active');
			$('.cg-checkbox-all .checkbox input').prop('checked', false);
		}
		subtotalFn(planProduct);
	};

	// 选择商品
	$('.cg-list').on('click', '.good-list,.product-cancel .cg-checkbox-that', function () {
		var planProduct = $(this).closest('.plan-product');
		var goodList = $(this).closest('.good-list').length?$(this).closest('.good-list'):$(this).closest('.product-cancel');
		if (goodList.hasClass('active')) {
			goodList.removeClass('active');
			$(this).find('input').prop('checked', false);
		} else {
			goodList.addClass('active');
			$(this).find('input').prop('checked', true);
		}
		checkboxFn(planProduct);
	});

	// 选择供应商
	$('.cg-list').on('click', '.supplier .cg-checkbox-that',function () {
		var planProduct = $(this).closest('.plan-product');
		if (planProduct.hasClass('active')) {
			//商品取消选中
            planProduct.find('.good-list,.product-cancel').removeClass('active');
			planProduct.find('input[type="checkbox"]').prop('checked', false);
		} else {
            planProduct.find('.good-list,.product-cancel').addClass('active');
			planProduct.find('input[type="checkbox"]').prop('checked', true);
		}
		checkboxFn(planProduct);
	});
	// 全选
	$('.cg-list').on('click', '.cg-checkbox-all' ,function () {
		var planProduct = $(this).closest('.buy-list').find('.plan-product');
		if ($(this).hasClass('active')) {
			$('.plan-product').removeClass('active');
			$('.plan-product input[type="checkbox"]').prop('checked', false);
			$('.good-list,.product-cancel').removeClass('active');
			$('.good-list,.product-cancel input[type="checkbox"]').prop('checked', false);
		} else {
			$('.plan-product').addClass('active');
			$('.plan-product input[type="checkbox"]').prop('checked', true);
			$('.good-list,.product-cancel').addClass('active');
			$('.good-list,.product-cancel input[type="checkbox"]').prop('checked', true);
		}
		checkboxFn(planProduct);
	});

	// 数量调整-增加
	$('.cg-list').on('click', '.plan-product .amount-add',function () {
		var planProduct = $(this).closest('.plan-product');
		var input = $(this).closest('.price').find('.amount-num');
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= 999999) {
			newVal = 999999;
		}
		input.val(newVal);
		subtotalFn(planProduct);
	});
	// 数量调整-减少
	$('.cg-list').on('click','.plan-product .amount-reduce', function () {
		var planProduct = $(this).closest('.plan-product');
		var input = $(this).closest('.price').find('.amount-num');
		// 数量,不得小于最小值
		var minimum = parseInt($(this).closest('.good-list').find('.minimum').text(), 10);
		var newVal = parseInt(input.val(), 10) - 1;
		if (newVal <= minimum) {
			newVal = minimum;
		}
		input.val(newVal);
		subtotalFn(planProduct);
	});
	// 数量调整-输入
	$('.cg-list').on('input propertychange', '.plan-product .amount-num' ,function () {
		var planProduct = $(this).closest('.plan-product');
		// 新的val值，如果有非数字都替换成空
		var newVal = $(this).val().replace(/[^\d.]/g, '');
		// 数量,不得小于最小值
		var minimum = parseInt($(this).closest('.good-list').find('.minimum').text(), 10);
		if (parseInt(newVal, 10) <= minimum) {
			newVal = minimum;
		}
		if (newVal.length > 6) {
			newVal = newVal.substr(0, 6);
		}
		$(this).val(newVal);
		subtotalFn(planProduct);
	});
	// 如果失焦的时候,空值,则设置为1
	$('.cg-list').on('blur','.plan-product .amount-num', function () {
		var planProduct = $(this).closest('.plan-product');
		if ($(this).val() == '') {
			$(this).val(1);
			subtotalFn(planProduct);
		}
	});

	//确认采购单
	$(document).on('click', '.cg-confirm.active', function() {
		
	});

    // 删除购物车
    $(document).on("click", ".yhw-sidebar .cg-plan-empty", function () {
    	//移除已选择的样式和清空数量、金额
       $('.yhw-sidebar .cg-confirm').removeClass('active');
       $('.yhw-sidebar .total-num span').text('0.00');
       $('.yhw-sidebar .cg-choose-num span').text('0');
    });

	//回到顶部
	$(document).on('click', '.top-back', function() {
		$('body,html').animate({ scrollTop: 0 }, 400);
	});
	
});