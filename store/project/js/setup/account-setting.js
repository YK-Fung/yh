define(['jquery'], function($){
	//确认新密码校对
	function validate(){
		var pwd1 = $('.new-password').val();
		var pwd2 = $('.confirm-password').val();
		if(pwd1 === pwd2 && pwd1 !== '' && pwd2 !== ''){
			//两次输入密码一致
			$('.confirm-password').siblings('.icon-true').show();
			$('.confirm-password').siblings('.tips').hide();
		}else if(pwd1 !== pwd2 && pwd1 !== '' && pwd2 !== ''){
			//两次输入密码不一致
			$('.confirm-password').siblings('.icon-true').hide();
			$('.confirm-password').siblings('.tips').text('两次输入的密码不一致！');
			$('.confirm-password').siblings('.tips').show();
		}
	}

	//监听密码的格式
	$('input[type="password"]').on('input propertychange', function() {
		var _val = $(this).val().trim();
		if(!(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(_val))){
			$(this).addClass('error');
		}else {
			$(this).removeClass('error');
		}
		//新密码
		if($(this).hasClass('new-password')){
			if(!$(this).hasClass('error') && $(this).val()){
				$(this).siblings('.icon-true').show();
				$(this).siblings('.tips').hide();
				validate();
			}else {
				$(this).siblings('.icon-true').hide();
				$(this).siblings('.tips').show();
			}
		}
		//确认新密码
		if($(this).hasClass('confirm-password')){
			if(!$(this).hasClass('error') && $(this).val()){
				validate();
			}else {
				$(this).siblings('.tips').show();
				$(this).siblings('.tips').text('密码格式不正确！');
			}
		}
	});

	//旧密码
	$('.old-password').on('blur', function() {
		var _val = $(this).val();
		if(!$(this).hasClass('error') && _val){
			//发送请求
			//成功
			//$(this).siblings('.icon-true').show();
			//$(this).siblings('.tips').hide();
			//失败
			// $(this).siblings('.icon-true').hide();
			// $(this).siblings('.tips').show();
		}
	});

	//保存
	$('.btns button').on('click', function() {
		var trueNum = 0;
		$('.icon-true').each(function() {
			if($(this).is(':visible')){
				trueNum++;
			}
		});
		if(trueNum == $('.icon-true').length){
			//执行
			alert('提交')
		}
	});
});