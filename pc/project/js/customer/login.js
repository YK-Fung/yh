define(['jquery', 'verify2','ie-tip'], function($){
	var canSubmit;
	;(function refresh () {
		var userResult = false;
		var pwdResult = false;
		var userVal = $.trim($('.login-user').val());
		var pwdVal = $.trim($('.login-pwd').val());

		// 判断内容格式是否正确，是否显示错误提示
		if(userVal != ''){
			if (verifyArg.user(userVal) || verifyArg.mobile(userVal) || verifyArg.mail(userVal)) {
				userResult = true;
			}
			else {
				userResult = false;
			}
		}
		
		if(pwdVal != ''){
			if (verifyArg.pwd(userVal)) {
				pwdResult = true;
			}
			else {
				pwdResult = false;
			}
		}

		if(userResult && pwdResult){
			canSubmit = true;
		}else {
			canSubmit = false;
		}
	}());

	// 是否可以提交
	var submitFn = function () {
		// 为空
		var empty = false;
		// 警告提示
		var warnHide = 0;
		var warnResult = false;
		// 错误提示
		var errorHide = 0;
		var errorResult = false;
		if ($('.login-user').val() != '' && $('.login-pwd').val() != '') {
			empty = true;
		} else {
			empty = false;
		}
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
		if (empty && warnResult && errorResult) {
			canSubmit = true;
		}
		else {
			canSubmit = false;
		}
	}

	// 下拉列表动效
	function pullDown(){
		//下拉列表切换
		$('.select-box a').on('click', function(event) {
			var e = event || window.event;
			//其它下拉隐藏
			$(this).closest('.select').siblings('.select').children('.select-box').removeClass('down');
			//下拉效果切换
			$(this).parent().toggleClass('down');
			//停止冒泡
			e.stopPropagation();
		});

		// 鼠标点击离开来目标，菜单栏隐藏
		$(document).on('click', function() {
			$('.select-box').removeClass('down');
		});

		//下拉菜单停止冒泡
		$('.select-drop').on('click',function(event) {
			var e = event || window.event;
			e.stopPropagation();
		});

		//选中下拉选项
		$('.select-drop').on('click', 'li', function() {
			var _txt = $(this).text();
			var _data = $(this).attr('data');
			//添加选中select值
			$(this).closest('.select-box').find('.show').text(_txt);
			$(this).closest('.select-box').find('.select-chosen').val(_data);
			//隐藏下拉列表
			$(this).closest('.select-box').removeClass('down');
		});	

		$('.select-chosen').each(function() {
			var _val = $(this).val();
			var txt = null;
			if(!_val){
				$(this).siblings('.show').text('请选择');
			}else {
				$(this).closest('.select-box').find('li').each(function() {
					if($(this).attr('data') == _val){
						txt = $(this).text();
					}
				});
				$(this).siblings('.show').text(txt);
			}
		});
	}
	pullDown();
	// 登录类型选择
	$('.login-select').on('click', function () {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$('.login-type').text('账号登录');
			$('.login-footer .register').hide();
		}
		else {
			$(this).addClass('active');
			$('.login-type').text('CA证书登录');
			$('.login-footer .register').show();
		}
		$('.login-zh, .login-ca').toggle();
	});


	// 账号验证
	$('.login-user').on('input propertychange', function () {
		// 如果登陆失败的提示显示，则隐藏
		if ($('.login-tip').is(':visible')) {
			$('.login-tip').hide();
		}
		var selfVal = $.trim($(this).val());
		var formGroupDom = $(this).closest('.form-group');
		// 判断内容是否为空，是否显示警告提示
		if (selfVal === '') {
			formGroupDom.addClass('warn');
		}
		else {
			formGroupDom.removeClass('warn');
		}
		// 判断内容格式是否正确，是否显示错误提示
		if (verifyArg.user(selfVal) || verifyArg.mobile(selfVal) || verifyArg.mail(selfVal)) {
			formGroupDom.removeClass('error');
		}
		else {
			formGroupDom.addClass('error');
		}
		submitFn();
	});

	// 密码验证
	$('.login-pwd').on('input propertychange', function () {
		// 如果登陆失败的提示显示，则隐藏
		if ($('.login-tip').is(':visible')) {
			$('.login-tip').hide();
		}
		var selfVal = $.trim($(this).val());
		var formGroupDom = $(this).closest('.form-group');
		// 判断内容是否为空，是否显示警告提示
		if (selfVal === '') {
			formGroupDom.addClass('warn');
		}
		else {
			formGroupDom.removeClass('warn');
		}
		submitFn();
	});


	// 账号登录
	$('.login-zh .btn-submit').on('click', function (event) {
		var e = event || window.event;
		if(canSubmit){
			console.log('你很棒棒哦！');
			// 登陆失败
			$('.login-tip').show();
		}
		e.preventDefault();
	});
	
});