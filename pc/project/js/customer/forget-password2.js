define(['jquery', 'popwin', 'yhw-nav', 'yhw-header', 'yhw-sidebar','ie-tip','verify2'], function($){

	//如果没有邮箱
	var show = true;
	//发送请求 给show赋值
	if(!show){
		$('.email-check').hide();
	}else {
		$('.email-check').show();
	}

	//切换表单
	$('.toggle-btn').on('click', function() {
		//获取索引
		var _index = $(this).index();
		// 按钮样式切换
		$(this).addClass('active').siblings().removeClass('active');
		// 内容的切换
		$('.toggle-ctn').eq(_index).addClass('active').siblings('.toggle-ctn').removeClass('active');
	});

	//通过手机验证

	//手机号码是否正确
	var iphoneNum = false;
	var newVal = null;
	var oldVal = null;
	//聚焦
	$('.phone-info').on('focus', function() {
		if($(this).hasClass('true')){
			oldVal = $(this).val();
		}
	});
	//失焦
	$('.phone-info').on('input propertychange', function() {
		// 截取至11位
		var selfVal = $.trim($(this).val()).substr(0, 11);
		$(this).val(selfVal);
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		// 验证为空和字符串
		if(selfVal === ''){
			//提示语
			iphoneNum = false;
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');

		}else if(!(verifyArg.mobile(selfVal))){
			//提示语
			iphoneNum = false;
			showTip.find('p').hide();
			showTip.find('.error').show();
			showTip.find('.error').html('手机号码格式不正确')
			$(this).addClass('error').removeClass('true');
		}else {

			//成功 执行
			iphoneNum = true;
			showTip.find('p').hide();
			showTip.find('.true').show();
			$(this).addClass('true').removeClass('error');
			$('.code-text').siblings('.tip-words').find('p').hide();
			$('.code-text').removeClass('error');
			//手机号码发生变化 清空已验证成功的验证码
			if(newVal !== oldVal && oldVal !== null){
				code = false;
				$('.code-text').val('');
				$('.code-text').removeClass('true');
				$('.code-text').siblings('.tip-words').find('.true').hide();
			}

			// //失败执行
			//iphoneNum = false;
			// showTip.find('p').hide();
			// showTip.find('.error').show();
			//showTip.find('.error').text('手机号码不存在');
			// $(this).addClass('error').removeClass('true');
		}
		if(iphoneNum && code){
			//发送请求
			$('.phone-send').addClass('active');
		}else {
			$('.phone-send').removeClass('active');
		}		
	});

	//发送验证码
	var sendCode = false;//是否发生成功验证码
	var InterValObj;//timer变量，控制时间
	var count = 60; //间隔函数，1秒执行
	var curCount;//当前剩余秒数
	$('.verification-code').on('click',function(event) {
		if(!iphoneNum){
			$('.pop-body').text('请完成手机验证!');
			$('.pop-shade').popShow();
		}else {
			var _this = $(this);
			//获取提示框的对象
			var showTip = $(this).siblings('.tip-words');
			curCount = count;
			//禁用按钮
			$(this).attr("disabled", "true");
			$(this).text(curCount + "秒重新发送");
			_this.css({'background-color': '#ccc','color':'#fff'});
			 //启动计时器，1秒执行一次
			InterValObj = window.setInterval(SetRemainTime, 1000);
			//发送请求
			//手机发送验证码
	        showTip.find('p').hide();
			showTip.find('.gray').show();
	        sendCode = true;
		}
	});

	//timer计时器处理函数
	function SetRemainTime(){
		if (curCount == 0) {                
            window.clearInterval(InterValObj);//停止计时器
            $('.verification-code').css({'background-color': '#00a0e9','color':'#fff'});
            $('.verification-code').removeAttr("disabled");//启用按钮
            $('.verification-code').text("重新发送");
            $('.verification-code').siblings('.tip-words').find('p').hide();
			$('.verification-code').siblings('.tip-words').find('.exist').show();
        }
        else {
            curCount--;
            $('.verification-code').text(curCount + "秒重新发送");
        }
	}

	//验证码请求
	var code = false;//验证码填写成功
	$('.code-text').on('input propertychange', function() {
		// 截取至6位
		var selfVal = $.trim($(this).val()).substr(0, 6);
		$(this).val(selfVal);
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		// 验证为空和字符串
		if(iphoneNum){
			if(selfVal === ''){
				code = false;
				showTip.find('p').hide();
				showTip.find('.empty').show();
				$(this).addClass('error').removeClass('true');
			}else if(!(verifyArg.codeNote(selfVal))){
				code = false;
				showTip.find('p').hide();
				showTip.find('.error').show();
				showTip.find('.error').html('验证码格式不正确');
				$(this).addClass('error').removeClass('true');
			}else{
				//验证码正确 发生请求
				//成功 执行
				//提示语
				code = true;
				showTip.find('p').hide();
				showTip.find('.true').show();
				$(this).addClass('true').removeClass('error');

				//失败执行 用户不存在
				//code = false;
				//showTip.find('p').hide();
				//showTip.find('.error').show();
				//showTip.find('.error').html('验证码不正确');
				//$(this).addClass('error').removeClass('true');
			}
		}else {
			code = false;
			showTip.find('p').hide();
			showTip.find('.error').show();
			showTip.find('.error').html('请输入正确的手机号码然后获取验证码');
			$(this).addClass('error').removeClass('true');
		}	
		if(iphoneNum && code){
			$('.phone-send').addClass('active');
		}else {
			$('.phone-send').removeClass('active');
		}		
	});

	//下一步
	$('.phone-send.active').on('click',function() {
		//成功
		window.location.href='../html/forget-password3.html';
	});

	//通过邮箱验证

	//发送验证码
	var sendCode2 = false;//是否发生成功验证码
	var InterValObj2;//timer变量，控制时间
	var count2 = 60; //间隔函数，1秒执行
	var curCount2;//当前剩余秒数
	$('.verification-code2').on('click',function(event) {
			var _this = $(this);
			//获取提示框的对象
			var showTip = $(this).siblings('.tip-words');
			curCount2 = count2;
			//禁用按钮
			$(this).attr("disabled", "true");
			$(this).text(curCount2 + "秒重新发送");
			_this.css({'background-color': '#ccc','color':'#666'});
			 //启动计时器，1秒执行一次
			InterValObj2 = window.setInterval(SetRemainTime2, 1000);
			//发送请求

			//成功执行
			showTip.find('p').hide();
			showTip.find('.gray').show();
			sendCode2 = true;
	});

	//timer计时器处理函数
	function SetRemainTime2(){
		if (curCount2 == 0) {                
            window.clearInterval(InterValObj2);//停止计时器
            $('.verification-code2').css({'background-color': '#00a0e9','color':'#fff'});
            $('.verification-code2').removeAttr("disabled");//启用按钮
            $('.verification-code2').text("重新发送");
            $('.verification-code2').siblings('.tip-words').find('p').hide();
			$('.verification-code2').siblings('.tip-words').find('.exist').show();
        }
        else {
            curCount2--;
            $('.verification-code2').text(curCount2 + "秒重新发送");
        }
	}
	//验证码
	var code2 = false;
	$('.code-text2').on('input propertychange', function() {
		// 截取至6位
		var selfVal = $.trim($(this).val()).substr(0, 6);
		$(this).val(selfVal);
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		// 验证为空和字符串
		if(selfVal === ''){
			code2 = false;
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');
		}else if(!(verifyArg.codeNote(selfVal))){
			code2 = false;
			showTip.find('p').hide();
			showTip.find('.error').show();
			showTip.find('.error').html('验证码格式不正确');
			$(this).addClass('error').removeClass('true');
		}else{
			//验证码正确 发生请求
			//成功 执行
			//提示语
			code2 = true;
			showTip.find('p').hide();
			showTip.find('.true').show();
			$(this).addClass('true').removeClass('error');

			//失败执行 用户不存在
			//code2 = false;
			//showTip.find('p').hide();
			//showTip.find('.error').show();
			//showTip.find('.error').html('验证码不正确');
			//$(this).addClass('error').removeClass('true');
		}	
		if(code2){
			$('.email-send').addClass('active');
		}else {
			$('.email-send').removeClass('active');
		}
	});

	//下一步
	$('.email-send.active').on('click',function() {
		window.location.href='../html/forget-password3.html';
	});

});