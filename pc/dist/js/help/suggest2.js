define(['jquery', 'popwin', 'yhw-nav2', 'yhw-header2', 'yhw-topbar2', 'yhw-sidebar2', 'verify2', 'ie-tip'], function($){
	

	// 是否可以提交
	var submitFn = function () {
		// 警告提示
		var warnHide = 0;
		var warnResult = false;
		// 如果警告提示隐藏了+1
		$('.warn-tip').each(function () {
			if($(this).is(':hidden')){
				warnHide ++;
			}
		});
		// 判断警告提示是否全部隐藏
		if (warnHide === $('.warn-tip').length) {
			warnResult = true;
		}
		else {
			warnResult = false;
		}
		// 错误提示
		var errorHide = 0;
		var errorResult = false;
		// 如果错误提示隐藏了+1
		$('.error-tip').each(function () {
			if($(this).is(':hidden')){
				errorHide ++;
			}
		});
		// 判断错误提示是否全部隐藏
		if (errorHide === $('.error-tip').length) {
			errorResult = true;
		}
		else {
			errorResult = false;
		}
		// 判断必填项是否为空
		var mustResult = false;
		var mustArr = [];
		$('.must').each(function () {
			mustArr.push($(this).val());
		});
		if(mustArr.indexOf('') < 0) {
			mustResult = true;
		}
		else {
			mustResult = false;
		}
		// 如果没有错误或警告，而且必填的都已经填写了
		if (warnResult && errorResult && mustResult) {
			$('.btn-submit').addClass('active');
		}
		else {
			$('.btn-submit').removeClass('active');
		}
	}
	// 手机号码验证
	$('.input-mobile').on('input propertychange', function () {
		var formCtnDom = $(this).closest('.form-ctn');
		var newVal = $(this).val().replace(/\D/g, '').substr(0, 11);
		$(this).val(newVal);
		// 判断内容是否为空，是否显示警告提示
		if ($(this).val() === '') {
			formCtnDom.addClass('warn');
		}
		else {
			formCtnDom.removeClass('warn');
		}
		// 判断内容格式是否正确，是否显示错误提示
		if (verifyArg.mobile($(this).val())) {
			formCtnDom.removeClass('error');
		}
		else {
			formCtnDom.addClass('error');
		}
		submitFn();
	});
	// 邮箱验证
	$('.input-mail').on('input propertychange', function () {
		var selfVal = $.trim($(this).val());
		var formCtnDom = $(this).closest('.form-ctn');
		// 判断内容格式是否正确，是否显示错误提示
		if (verifyArg.mail(selfVal)) {
			formCtnDom.removeClass('error');
		}
		else {
			formCtnDom.addClass('error');
		}
		submitFn();
	});
	// 内容验证
	$('.suggest-ctn').on('blur input propertychange', function () {
		var suggestDom = $(this).closest('.suggest');
		var newVal = $.trim($(this).val()).substr(0, 20);
		$(this).val(newVal);
		// 判断内容是否为空，是否显示警告提示
		if (newVal === '') {
			suggestDom.addClass('warn');
		}
		else {
			suggestDom.removeClass('warn');
		}
		// 判断内容格式是否正确，是否显示错误提示
		var suggestCtn = $(this).val().replace('/\s\r\n/g', 1);
		if (suggestCtn.length <= 20) {
			suggestDom.removeClass('error');
		}
		else {
			suggestDom.addClass('error');
		}
		suggestDom.find('.total-num').text(suggestCtn.length);
		submitFn();
	});
	// 验证码
	$('.input-code').on('input propertychange', function () {
		var formCtnDom = $(this).closest('.form-ctn');
		var newVal = $.trim($(this).val()).substr(0, 4);
		$(this).val(newVal);
		// 判断内容是否为空，是否显示警告提示
		if (newVal === '') {
			formCtnDom.addClass('warn');
		}
		else {
			formCtnDom.removeClass('warn');
		}
		// 判断内容格式是否正确，是否显示错误提示
		if (verifyArg.code(newVal)) {
			formCtnDom.removeClass('error');
		}
		else {
			formCtnDom.find('.error-tip').text('验证码格式不正确');
			formCtnDom.addClass('error');
		}
		submitFn();
		// if ($(this).val() !== '1111') {
		// 	formCtnDom.find('.error-tip').text('验证码错误，请重新输入');
		// 	formCtnDom.addClass('error');
		// }
	});

	// 更换验证码
	$('.code-change').on('click', function () {
		console.log('更换成功！');
	});

	// 提交
	$('.btn-submit').on('click', function (event) {
		var e = event || window.event;
		if ($(this).hasClass('active')) {
			console.log('你很棒棒哦！');
		}
		e.preventDefault();
	});


});

