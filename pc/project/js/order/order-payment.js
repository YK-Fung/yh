define(['jquery', 'datetime', 'bar-slider', 'bar-header','ie-tip'], function($){
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

	//切换付款类型
	var WeChatClick = null;
	$('.tab-toggle li').click(function() {
		var _index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.ctn-toggle>li').eq(_index).show().siblings().hide();
		if(_index == 1){
			//微信支付第一次点击
			if(!WeChatClick){
				//二维码获取成功 执行
				var minNum = $('.type02 .min').text();
				var secondNum = $('.type02 .second').text();
				payTimeWeChat(minNum,secondNum);
				WeChatClick = true;
			}
		}
	});

	// 微信二维码倒计时
	var payTimeWeChat = function (min, second) {
		var payTimeMin = min;
		var payTimeSecond = second;
		// 设置分
		var payTimeMinFn = function () {
			payTimeMin >= 10 ? payTimeMin = payTimeMin : payTimeMin = payTimeMin = '0' + payTimeMin;
			$('.type02 .min').text(payTimeMin);
		};
		// 设置秒
		var payTimeSecondFn = function () {
			payTimeSecond >= 10 ? payTimeSecond = payTimeSecond : payTimeSecond = payTimeSecond = '0' + payTimeSecond;
			$('.type02 .second').text(payTimeSecond);
		};
		payTimeMinFn();
		payTimeSecondFn();
		var payTimeSet = setInterval(function () {
			// 秒数
			payTimeSecond --;
			if (payTimeSecond < 0) {
				payTimeSecond = 59;
				// 分钟数
				payTimeMin --;
				// 设置分
				payTimeMinFn();
			}
			// 设置秒
			payTimeSecondFn();
			// 如果时间结束
			if (payTimeMin <= 0 && payTimeSecond <= 0) {
				clearInterval(payTimeSet);
			};
		}, 1000);
	};

	// 支付宝倒计时
	var payTimeAlipay = function (min, second) {
		var payTimeMin = min;
		var payTimeSecond = second;
		// 设置分
		var payTimeMinFn = function () {
			payTimeMin >= 10 ? payTimeMin = payTimeMin : payTimeMin = payTimeMin = '0' + payTimeMin;
			$('.type01 .min').text(payTimeMin);
		};
		// 设置秒
		var payTimeSecondFn = function () {
			payTimeSecond >= 10 ? payTimeSecond = payTimeSecond : payTimeSecond = payTimeSecond = '0' + payTimeSecond;
			$('.type01 .second').text(payTimeSecond);
		};
		payTimeMinFn();
		payTimeSecondFn();
		var payTimeSet = setInterval(function () {
			// 秒数
			payTimeSecond --;
			if (payTimeSecond < 0) {
				payTimeSecond = 59;
				// 分钟数
				payTimeMin --;
				// 设置分
				payTimeMinFn();
			}
			// 设置秒
			payTimeSecondFn();
			// 如果时间结束
			if (payTimeMin <= 0 && payTimeSecond <= 0) {
				clearInterval(payTimeSet);
			};
		}, 1000);
	};
	//二维码获取成功 执行
	var minNum = $('.type01 .min').text();
	var secondNum = $('.type01 .second').text();
	payTimeAlipay(minNum,secondNum);

	//选中个人网银和企业网银
	$('.bank-list').on('click', 'a', function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('#pop-login-pay').show();
		//通道编码
		var _data = $(this).attr('data');
	});

	//个人网银支付成功
	$('#pop-login-pay .btn-yes').on('click', function() {
		window.location.href="../../html/order/cg-order-manage2.html";
	});

	//个人网银支付成功
	$('#pop-login-pay .btn-no,#pop-login-pay .header-close').on('click', function() {
		$('.bank-list a').removeClass('active');
	});

	//支付成功
	// $('#pop-succeed-pay .price').text('300');
	// $('#pop-succeed-pay').show();

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});

});