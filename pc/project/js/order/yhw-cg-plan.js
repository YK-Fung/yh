define(['jquery', 'yhw-sidebar2', 'yhw-topbar2', 'ie-tip'], function($){

	// 下单悬浮框
	var buyFixedFn = function (height) {
        // 滚动的实时距离
		var posT = height + $(document).scrollTop();
		// 底部部分的的位置
		var footT = $('.yhw-footer-top').offset().top - 40;
		// 当滚动的距离达到底部的位置
		if (posT >= footT) {
			$('.buy').css('bottom', (posT-footT));
			$('.buy').removeClass('fixed');
		}
		else {
			$('.buy').css('bottom', 0);
			$('.buy').addClass('fixed');
		}
	};
	var winH = $(window).height(); 
	buyFixedFn(winH);
	$(document).on('scroll', function () {
		winH = $(window).height();
		buyFixedFn(winH);
	});
	// 配合最顶部广告条对浮动条的影响。时间要与广告条时间一致
	setTimeout(function () {
		var setTime = setInterval(function () {
			winH = $(window).height();
			buyFixedFn(winH);
		}, 0);
		setTimeout(function () {
			clearInterval(setTime);
		}, 300)
	}, 500)



	// 商品总额
	var totalFn = function () {
		var total = 0;
		// 判断有没有选中的商品并且选中的商品数量足够,如果没有,不给提交
		if ($('.plan-detail.active').length > 0 && $('.plan-detail.active .inventory:visible').length <= 0) {
			$('.btn-submit').addClass('active');
		} else {
			$('.btn-submit').removeClass('active');
		}
		$('.plan-detail.active').each(function () {
			total += parseFloat($(this).find('.subtotal-num').text());
		});
		$('.total-num').text(total.toFixed(2));
	};
	// 小计
	var subtotalFn = function (planDetail, val) {
		var priceNum = parseFloat(planDetail.find('.price-num').text());
		var subtotalNum = (priceNum * val).toFixed(2);
		planDetail.find('.subtotal-num').text(subtotalNum);
		// 如果超出了库存，显示警告
		if (val > parseInt(planDetail.find('.inventory-num').text(), 10)) {
			planDetail.find('.inventory').show();
		} else {
			planDetail.find('.inventory').hide();
		}
		// 如果是已经选中了的商品,价格记入商品总额
		if (planDetail.hasClass('active')) {
			totalFn();
		}
	};
	// 多选框
	var checkboxFn = function () {
		// 采购计划内容
		$('.plan-body').each(function () {
			// 商品数量
			var planDetailLen = $(this).find('.plan-detail').length;
			// 选择的商品数量
			var planDetailActive = $(this).find('.plan-detail.active').length;
			var prodCancel = $(this).find('.prod-cancel').length;
			// 如果已经选择了该供应商的全部商品,供应商的多选框勾选

			if(planDetailLen < prodCancel){
				//如果供应商里面的正常商品已经少于失效商品
                if ($(this).find('.plan-gys').hasClass('active')) {
                    $(this).find('.plan-gys').removeClass('active');
                    $(this).find('.plan-gys .checkbox input').prop('checked', false);
                } else {
                    $(this).find('.plan-gys').addClass('active');
                    $(this).find('.plan-gys .checkbox input').prop('checked', true);
                }
			}else{
                if (planDetailActive >= planDetailLen ) {
                    $(this).find('.plan-gys').addClass('active');
                    $(this).find('.plan-gys .checkbox input').prop('checked', true);
                } else {
                    $(this).find('.plan-gys').removeClass('active');
                    $(this).find('.plan-gys .checkbox input').prop('checked', false);
                }
			}
		});
		// 商品种类
		$('.procuct-kind').text($('.plan-detail.active').length);
		// 供应商数量
		var planGysLen = $('.plan-gys').length;
		// 选择的供应商数量
		var planGysActive = $('.plan-gys.active').length;
		// 如果有商品,而且已经选择了全部商品,全选框勾选
		if (planGysLen >= 0 && planGysActive >= planGysLen) {
			// 头部全选框
			$('.plan-header').addClass('active');
			$('.plan-header .checkbox input').prop('checked', true);
			// 下单全选框
			$('.buy').addClass('active');
			$('.buy .checkbox input').prop('checked', true);
		} else {

			// 头部全选框
			$('.plan-header').removeClass('active');
			$('.plan-header .checkbox input').prop('checked', false);
			// 下单全选框
			$('.buy').removeClass('active');
			$('.buy .checkbox input').prop('checked', false);
		}
		totalFn();
	};

	// 选择商品
	$('.plan-detail .checkbox').on('click', function () {
		var liDom = $(this).closest('.plan-detail');
		if (liDom.hasClass('active')) {
			liDom.removeClass('active');
			$(this).find('input').prop('checked', false);
		} else {
			liDom.addClass('active');
			$(this).find('input').prop('checked', true);
		}

        addOrder($(this).closest('.plan-body'));
        checkboxFn();
	});
	// 选择供应商
	$('.plan-gys .checkbox').on('click', function () {
		var planBodyDom = $(this).closest('.plan-body');
		if ($(this).closest('.plan-gys').hasClass('active')) {
			planBodyDom.find('.plan-detail').removeClass('active');
			planBodyDom.find('.plan-detail .checkbox input').prop('checked', false);
		} else {
            console.log(planBodyDom.find('.plan-detail .checkbox input'));
            planBodyDom.find('.plan-detail').addClass('active');

			planBodyDom.find('.plan-detail .checkbox input').prop('checked', true);
		}

        addOrder($(this).closest('.plan-body'));
		checkboxFn();
	});
	// 全选
	$('.checkbox-all .checkbox').on('click', function () {
        if ($(this).closest('.checkbox-all').hasClass('active')) {
            $('.plan-detail').removeClass('active');
			$('.plan-detail .checkbox input').prop('checked', false);
		} else {
			$('.plan-detail').addClass('active');
			$('.plan-detail .checkbox input').prop('checked', true);
		}
		$('.plan-body').each(function(index,el){
            addOrder($(el));
		});
		checkboxFn();
	});

	// 数量调整-增加
	$('.detail-ctn .amount-add').on('click', function () {
		var planDetail = $(this).closest('.plan-detail');
		// 库存
		var inventoryNum = parseInt(planDetail.find('.inventory-num').text(), 10);
		var input = $(this).closest('.detail-ctn').find('.amount-input');
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= 999999) {
			newVal = 999999;
		}
		input.val(newVal);

		subtotalFn(planDetail, newVal);
        addOrder($(this).closest('.plan-body'));
	});
	// 数量调整-减少
	$('.detail-ctn .amount-reduce').on('click', function () {
		var planDetail = $(this).closest('.plan-detail');
		var input = $(this).closest('.detail-ctn').find('.amount-input');
		// 数量,最小1
		var newVal = parseInt(input.val(), 10) - 1;
		if (newVal <= 1) {
			newVal = 1;
		}
		input.val(newVal);
		subtotalFn(planDetail, newVal);
        addOrder($(this).closest('.plan-body'));
	});
	// 数量调整-输入
	$('.detail-ctn .amount-input').on('input propertychange', function () {
		var planDetail = $(this).closest('.plan-detail');
		// 新的val值，如果有非数字都替换成空
		var newVal = $(this).val().replace(/[^\d.]/g, '');
		if (parseInt(newVal, 10) <= 1) {
			newVal = 1;
		}
		if (newVal.length > 6) {
			newVal = newVal.substr(0, 6);
		}
		$(this).val(newVal);
		subtotalFn(planDetail, newVal);
        addOrder($(this).closest('.plan-body'));
	});
	// 如果失焦的时候,空值,则设置为1
	$('.detail-ctn .amount-input').on('blur', function () {
		var planDetail = $(this).closest('.plan-detail');
		if ($(this).val() == '') {
			$(this).val(1);
			subtotalFn(planDetail, 1);
		}
	});

	//当前供应商选中商品的总价
	function addOrder(planBody) {
        var gyTotalPrice = 0;
        planBody.children('.plan-detail').each(function(index,el){
            if($(el).hasClass('active')){
                gyTotalPrice += $(el).find('.subtotal-num').html()*1
            }
        });
        if(gyTotalPrice){
        	$('.order-tip').show();
			$('.gys-tip').hide();
		}else{
            $('.order-tip').hide();
            $('.gys-tip').show();
		}
        if(planBody.find('.gys-tip>span:first').html()*1<=gyTotalPrice){
            //够起配费
            planBody.find('.order-tip .buy-tip1').html('已满');
            planBody.find('.order-tip .store-money').html(planBody.find('.gys-tip>span:first').html())
        }else{
            //不够起配费
            planBody.find('.order-tip .buy-tip1').html('再购');
            planBody.find('.order-tip .store-money').html(planBody.find('.gys-tip>span:first').html()*1 - gyTotalPrice)
        }
        if(planBody.find('.gys-tip>span').eq(1).html()*1<=gyTotalPrice){
			//够运费
            planBody.find('.order-tip .buy-tip2').html('已满');
            planBody.find('.order-tip .free-money').html(planBody.find('.gys-tip>span').eq(1).html())
        }else{
        	//不够运费
            planBody.find('.order-tip .buy-tip2').html('再购');
            planBody.find('.order-tip .free-money').html(planBody.find('.gys-tip>span').eq(1).html()*1 - gyTotalPrice)
		}
        if(planBody.find('.gys-tip .coupon-tip span:first').html()*1<=gyTotalPrice){
            //够优惠
            planBody.find('.order-tip .buy-tip2').html('已满');
            planBody.find('.order-tip .coupon-money').html('已')
        }else{
            //不够优惠
            planBody.find('.order-tip .buy-tip2').html('再购');
            planBody.find('.order-tip .coupon-money').html('')
        }
		if(planBody.find('.order-tip .buy-tip1').html() == '再购'||planBody.find('.order-tip .buy-tip2').html() == '再购'){
            planBody.find('.add-order').show()
		}else{
            planBody.find('.add-order').hide()
		}

    }

	// 收藏
	$('.detail-ctn .opt-collect').on('click', function () {
		$(this).toggleClass('active');
		$(this).find('input').prop('checked', !$(this).find('input').prop('checked'));
	});

	// 删除,delType 0全部删除 1删除当前
	var delSelf, delType;
	$('.detail-ctn .opt-del').on('click', function () {
		delSelf = $(this);
		delType = 1;
		$('#pop-del').fadeIn('fast');
	});
	// 批量删除
	$('.buy .buy-del').on('click', function () {
		delType = 0;
		$('#pop-del').fadeIn('fast');
	});


	//弹出清空弹窗
    $('.buy .buy-cancel').on('click', function () {
        $('#pop-remove').fadeIn('fast');
    });

    //清空失效商品
	$('#pop-remove .btn-yes').on('click',function(){
			$('.prod-cancel').remove();
        // 如果采购计划的商品已经为空,删除该供应商
        $('.plan-body').each(function () {
            if ($(this).find('.plan-detail').length <= 0 && $(this).find('.prod-cancel').length <= 0) {
                $(this).remove();
            }
        });
        // 如果已经没有商品了变成空购物车,
        if ($('.plan-detail').length <= 0 && $('.prod-cancel').length <= 0) {
            $('.main-ctn').html('<a href="#">去购物</a>');
            $('.main-ctn').addClass('shop-empty');
        }
        $(this).closest('.pop-shade').fadeOut('fast');
	})

	// 删除地址
	$('#pop-del .btn-yes').on('click', function () {
		if (delType) {
            if(delSelf.closest('.plan-detail').length){
                delSelf.closest('.plan-detail').remove();
			}else{
                delSelf.closest('.prod-cancel').remove();
			}
		} else {
			$('.plan-detail.active').remove();
		}
		// 如果采购计划的商品已经为空,删除该供应商
		$('.plan-body').each(function () {
			if ($(this).find('.plan-detail').length <= 0 && $(this).find('.prod-cancel').length <= 0) {
				$(this).remove();
			}
		});
		checkboxFn();
		// 如果已经没有商品了变成空购物车,
		if ($('.plan-detail').length <= 0 && $('.prod-cancel').length <= 0) {
			$('.main-ctn').html('<a href="#">去购物</a>');
			$('.main-ctn').addClass('shop-empty');
		}
		$(this).closest('.pop-shade').fadeOut('fast');
        buyFixedFn(winH);
	});


	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	// 提交
	$('.buy .btn-submit').on('click', function () {
		if ($(this).hasClass('active')) {
			//供应商不满足起配价格
			var supplier = 0;
			//公司名称
			var companyName = '';
			$('.plan-body').each(function(index,value){
                var subtotalNum = $(value).find('.plan-detail.active .subtotal-num');
                var totalPrice = 0;
                subtotalNum.each(function(i,v){
                    totalPrice += $(v).html()*1;
                });
                if(totalPrice>0){
                	//供应商有选中商品
                	if($(value).find('.gys-tip>span:first').html()*1 > totalPrice){
                		//不满足起配费
                        supplier++;
                        companyName += '[' + $(value).find('.gys-firm').html() + '] ';
                    }
				}
            });

			if(supplier > 0){
                // alert(companyName + '订单总额未达到起订金额');
				$('#pop-money').fadeIn('fast').find('.pop-body>p').text(companyName + '订单总额未达到起订金额')
			}else{
                alert('提交成功！');
			}

		}
	});

	$('#pop-money .btn-yes').on('click',function(){
        $('#pop-money').fadeOut('fast')
	})

	//领券
	$('.plan-gys').on('click','.get-coupon',function(){
        $('#pop-coupon').fadeIn('fast')
    })

    $('#pop-coupon').on('click','.coupon-use-btn', function () {
        if($(this).html()=='立即使用'){
            return;
        }
        $(this).closest('li').addClass('is-received');
        $(this).html('立即使用');
    });

});