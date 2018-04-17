define(['jquery', 'popwin', 'yhw-nav', 'yhw-header', 'yhw-sidebar','ie-tip','verify2'], function($){	
	//手机/邮箱/用户名
	var userInfo = false;
	//input propertychange
	$('.user-info').on('blur', function() {
		var selfVal = $.trim($(this).val());
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		// 验证为空和字符串
		if(selfVal === ''){
			//提示语
			userInfo = false;
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');
		}else if(!(verifyArg.account(selfVal)) ){
			//格式不正确
			//提示语
			userInfo = false;
			showTip.find('p').hide();
			showTip.find('.error').show();
			$(this).addClass('error').removeClass('true');
		}else {
			//发送请求

			//成功 执行
			//提示语
			userInfo = true;
			showTip.find('p').hide();
			showTip.find('.true').show();
			$(this).addClass('true').removeClass('error');

			//失败执行 用户不存在
			//userInfo = false;
			//showTip.find('p').hide();
			//showTip.find('.exist').show();
			//$(this).addClass('error').removeClass('true');
		}
		if(userInfo && code1){
			//发送请求
			$('.next-btn').addClass('active');
		}else {
			$('.next-btn').removeClass('active');
		}
	});

	//验证码
	var code1 = false;
	$('.code-info').on('input propertychange', function() {
		// 截取至四位
		var selfVal = $.trim($(this).val()).substr(0, 4);
		$(this).val(selfVal);
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		// 验证为空和字符串
		if(selfVal === ''){
			//提示语
			code1 = false;
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');
		}else if(!(verifyArg.code(selfVal))){
			//格式不正确
			//失败
			code1 = false;
			showTip.find('p').hide();
			showTip.find('.error').show();
			showTip.find('.error').text('验证码格式不正确');
			$(this).addClass('error').removeClass('true');
		}else {
			//发送请求

			//成功 执行
			code1 = true;
			showTip.find('p').hide();
			showTip.find('.true').show();
			$(this).addClass('true').removeClass('error');

			// //失败执行
			//code1 = false;
			// showTip.find('p').hide();
			// showTip.find('.error').show();
			//showTip.find('.error').text('验证码不正确');
			// $(this).addClass('error').removeClass('true');
		}
		if(userInfo && code1){
			//发送请求
			$('.next-btn').addClass('active');
		}else {
			$('.next-btn').removeClass('active');
		}	
	});

	//下一步
	$(document).on('click','.next-btn.active',function() {
		console.log('下一步');
	});
});
  