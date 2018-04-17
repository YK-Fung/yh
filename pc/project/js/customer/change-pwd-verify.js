define(['jquery', 'bar-slider', 'bar-header', 'verify','ie-tip'], function($){
	// 手机
	var mobile = '18312345678';
	// 邮箱
	var mail = '5964952362@qq.com';
	// 认证方式-手机
	$('.verify-mobile').on('click', function () {
		$(this).addClass('active').siblings('li').removeClass('active');
		$('.main-title').text('手机认证');
		$('.verify-save label').text('手机号码:');
		// 手机号码打星星
		var mobileStar = mobile.substr(0,3) + '****' + mobile.substr(7, 4);
		$('.verify-save span').text(mobileStar);		
	});
	// 认证方式-邮箱
	$('.verify-mail').on('click', function () {
		$(this).addClass('active').siblings('li').removeClass('active');
		$('.main-title').text('邮箱认证');
		$('.verify-save label').text('邮箱地址:');
		$('.verify-save span').text(mail);
	});
	// 获取验证码
	$('.btn-code').on('click', function () {
		// 判断是否有活动状态active
		if (!$(this).hasClass('active')) {
			return false;
		}
		$(this).removeClass('active');
		var time = 10;
		$('.btn-code').text(time + 's');
		var codeTime = setInterval(function () {
			time --;
			$('.btn-code').text(time + 's');
			if (time <= 0) {
				$('.btn-code').addClass('active');
				$('.btn-code').text('获取验证码');
				clearInterval(codeTime);
			}
		}, 1000);
	});
	// 下一步
	$('.btn-submit').on('click', function () {
		// 验证码
		var ajaxCode = 1234;
		if ($('.form-code input').val() == ajaxCode) {
			$('#pop-success').fadeIn('fast');
		}
		else {
			$('#pop-fail').fadeIn('fast');
		}
	});
	// 取消or关闭按钮
	$('.pop-shade .btn-no, .pop-shade .header-close').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});
});