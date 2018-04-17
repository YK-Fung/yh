define(['jquery', 'bar-slider', 'bar-header', 'verify', 'ie-tip'], function($){
	
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
				$('.btn-code').text('获取邮箱验证码');
				clearInterval(codeTime);
			}
		}, 1000);
	});

	// 确认提交
	$('.btn-submit').on('click', function () {
		// 邮箱验证
		var input = false;
		if ($.trim($('.form-input input').val()) != '' && $('.error-tip').is(':hidden')) {
			input = true;
		}
		else {
			input = false;
		}
		// 验证码
		var code = false;
		var ajaxCode = 1234;
		if ($('.form-code input').val() == ajaxCode) {
			code = true;
		}
		else {
			code = false;
		}
		if (input && code) {
			$('#pop-success').fadeIn('fast')
		}
		else {
			$('#pop-fail').fadeIn('fast')
		}
	});

	// 取消or关闭按钮
	$('.pop-shade .btn-no, .pop-shade .header-close').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});
});