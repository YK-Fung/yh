define(['jquery', 'popwin', 'yhw-nav', 'yhw-header', 'yhw-sidebar','ie-tip','verify2'], function($){
//忘记密码3-重置密码 页面
	//账号密码
	$('.mima').on('blur', function() {
		// 截取至20位
		var selfVal = $.trim($(this).val()).substr(0, 20);
		$(this).val(selfVal);
		var _this = $(this);
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		// 验证为空和字符串
		if(selfVal == ''){
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');
		}else if(!(verifyArg.pwd(selfVal))){
			showTip.find('p').hide();
			showTip.find('.error').show();
			$(this).addClass('error').removeClass('true');
		}else {
			validate(showTip,_this);
		}
		//激活按钮
		btnShow();
	});
	//再次输入密码 
	$('.agin-mima').on('blur', function() {
		// 截取至20位
		var selfVal = $.trim($(this).val()).substr(0, 20);
		$(this).val(selfVal);
		var _this = $(this);
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		if(selfVal == ''){
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');
		}else if(!(verifyArg.pwd(selfVal))){
			showTip.find('p').hide();
			showTip.find('.error').show();
			$(this).addClass('error').removeClass('true');
		}else {
			validate(showTip,_this);
		}
		//激活按钮
		btnShow();
	});

	//对比两次输入的密码
	function validate(showTip,_this){
		var pwd1 = $('.mima').val();
		var pwd2 = $('.agin-mima').val();
		if(pwd1 == pwd2 || pwd1 == '' || pwd2 == ''){
			showTip.find('p').hide();
			showTip.find('.true').show();
			_this.addClass('true').removeClass('error');
		}else {
			showTip.find('p').hide();
			showTip.find('.exist').show();
			_this.addClass('error').removeClass('true');
		}
	}

	function btnShow(){	
		//激活按钮
		var verifyNum = 0;
		$('.form-group input').each(function() {
			if($(this).hasClass('true')){
				verifyNum ++;
			}
		});
		if(verifyNum == 2){
			$('.next-btn').addClass('active');
		}else {
			$('.next-btn').removeClass('active');
		}
		console.log(verifyNum)
	}
	//下一步
	$('.next-btn.active').on('click',function() {
		window.location.href='../html/forget-password4.html';
	});
});
  