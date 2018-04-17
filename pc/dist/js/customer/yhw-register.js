define(['jquery', 'popwin','ie-tip','verify2'], function($){
	//禁用回车键
    document.onkeypress = function(){
		if(event.keyCode == 13) {
			return false;
		}
	};

	// 地址下拉列表
	;(function addressBoxFn (){
	    // 地址下拉框
	    $('.address-select .select-input').on('click', function(event) {
	        var e = event || window.event;
	        //其它下拉隐藏
	        $('.address-select').removeClass('down');
	        //下拉效果切换
	        $(this).parents('.address-select').toggleClass('down');
	        //停止冒泡
	        e.stopPropagation();
	    });
	    // 鼠标点击离开来目标，菜单栏隐藏
	    $(document).on('click', function() {
	        if($('.address-select').hasClass('down')){
	        	var num = 0;
		        $('.address-arr').children('input').each(function() {
		        	if($(this).val() == ''){
		        		num ++;
		        	}
		        });
		        if(num == 3){
		        	//错误
		            $('.address-select').closest('.form-group').find('p').hide();
		          	$('.address-select').closest('.form-group').find('.empty').show();
		            $('.address-select').closest('.form-group').addClass('error').removeClass('true');
		        }else if (num > 0) {
		        	//错误
		            $('.address-select').closest('.form-group').find('p').hide();
		          	$('.address-select').closest('.form-group').find('.error').show();
		            $('.address-select').closest('.form-group').addClass('error').removeClass('true');
		        }
	        	$('.address-select').removeClass('down');
	        }
	    });
	    // 地区类型选择
	    $('.address-select .select-type li').on('click', function (event) {
	        var e = event || window.event;
	        // 获取索引值
	        var idx = $(this).index();
	        // 前面的区域已选的情况下，才可以选择再小一些的区域
	        if (idx == 0 || $('.address-arr input').eq(idx - 1).val() != '') {
	            // 设置活动状态，以及显示对应的内容
	            $(this).addClass('active').siblings().removeClass('active');
	            $('.select-type-ctn .type-main').eq(idx).show().siblings('.type-main').hide();
	        }
	        e.stopPropagation();
	    });
	    // 地区选择
	    $('.address-select .zm-ctn li').on('click', function (event) {
	        var e = event || window.event;
	        // 获取索引值
	        var idx = $(this).closest('.type-main').index();
	        // 如果是之前选择的，则不向下执行
	        if ($(this).hasClass('active')) {
	            return false;
	        }
	        // 清除其他的活动状态，给当前添加活动状态
	        $(this).closest('.type-main').find('.active').removeClass('active');
	        $(this).addClass('active');
	        // 设置并获取相应的text
	        $('.address-arr input').eq(idx).attr('value', $(this).text() + '/');
	        $('.address-arr input').eq(idx).nextAll('input').attr('value', '');
	        var addressText = '';
	        $('.address-arr input').each(function () {
	            addressText += $(this).attr('value');
	        });
	        // 设置省市的值
	        $(this).closest('.address-select').find('.select-input').val(addressText.substr(0, addressText.length-1));
	        // 显示下一级地区,如果已经是最后一级了则隐藏下拉列表
	        if (idx == $('.select-type li').length - 1) {
	            $('.address-select').removeClass('down');
	            //正确
	            $(this).closest('.form-group').find('p').hide();
	            $(this).closest('.address-select').siblings('.tip-true').show();
	            $(this).closest('.form-group').addClass('true').removeClass('error');
	            //验证表单
	    		verification();
	            return false;
	        }
	        // 地区类型切换
	        $(this).closest('.select-drop').find('.select-type li').removeClass('active');
	        $(this).closest('.select-drop').find('.select-type li').eq(idx + 1).addClass('active');
	        // 内容切换
	        $(this).closest('.select-drop').find('.type-main').hide();
	        $(this).closest('.select-drop').find('.type-main').eq(idx + 1).show();
	        //验证表单
	    	verification();
	        e.stopPropagation();
	    });
	}());



    //用户账号
	$('.user-name').on('blur', function() {
		var selfVal = $.trim($(this).val());

        //获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		// 验证为空和字符串
		if(verifyArg.user(selfVal) === ''){
			//为空
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.empty').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else if(!verifyArg.user(selfVal)){
			//格式错误
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.error').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else {
			// 提交数据

			//成功 打勾
			$(this).closest('.form-group').find('p').hide();
			$(this).siblings('.tip-true').show();
			$(this).closest('.form-group').addClass('true').removeClass('error');

			//失败
			//账号已存在
			// $(this).closest('.form-group').find('p').hide();
			// showTip.find('.exist').show();
			// $(this).closest('.form-group').addClass('error').removeClass('true');
		}
		verification();
	});

	//账号密码 
	$('.customer-password').on('blur', function() {
		var selfVal = $.trim($(this).val());
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		// 验证为空和字符串
		if(selfVal === ''){
			//为空
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.empty').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else if(!(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(selfVal))){
			//格式不正确
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.error').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else {
			//正确
			$(this).closest('.form-group').find('p').hide();
			$(this).siblings('.tip-true').show();
			$(this).closest('.form-group').addClass('true').removeClass('error');
			//对比再‘确认密码’框
			validate();
		}
		verification();
	});

	//确认密码 
	$('.confirm-password').on('blur', function() {
		//获取输入框的值
		var selfVal = $.trim($(this).val());
		var showTip = $(this).siblings('.tip-words');
		if(selfVal === ''){
			//为空
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.empty').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else if(!(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(selfVal))){
			//格式不正确
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.error').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else {
			//对比再‘确认密码’框
			validate();
		}
		verification();
	});

	//对比两次输入的密码
	var formPassword = $('.confirm-password').closest('.form-group');
	function validate(){
		var pwd1 = $('.customer-password').val();
		var pwd2 = $('.confirm-password').val();
		if(pwd1 === pwd2 && pwd1 !== '' && pwd2 !== ''){
			//两次输入密码一致
			formPassword.find('p').hide();
			formPassword.find('.tip-true').show();
			formPassword.addClass('true').removeClass('error');
		}else if(pwd1 !== pwd2 && pwd1 !== '' && pwd2 !== ''){
			//两次输入密码不一致
			formPassword.addClass('error').removeClass('true');
			formPassword.find('p').hide();
			formPassword.find('.error').show();
		}
	}

	//公司名称
	$('.company-name').on('blur', function() {
		var selfVal = $.trim($(this).val());
		var showTip = $(this).siblings('.tip-words');
		if(selfVal === ''){
			//为空
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.empty').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else if (!(/^[\u4e00-\u9fa5_a-zA-Z0-9\(\)\（\）]{4,50}$/.test(selfVal))) {
			//格式不正确
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.error').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else {
			$(this).closest('.form-group').find('p').hide();
			$(this).siblings('.tip-true').show();
			$(this).closest('.form-group').addClass('true').removeClass('error');
		}
		verification();
	});

	//联系人姓名 
	$('.info-name').on('blur', function() {
		var selfVal = $.trim($(this).val());
		var showTip = $(this).siblings('.tip-words');
		if(selfVal === ''){
			//为空
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.empty').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else if (!(/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/.test(selfVal))) {
			//格式不正确
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.error').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else {
			$(this).closest('.form-group').find('p').hide();
			$(this).siblings('.tip-true').show();
			$(this).closest('.form-group').addClass('true').removeClass('error');
		}
		verification();
	});

	//联系人手机
	var succeed = false;
	var newVal = null;
	var oldVal = null;
	//聚焦
	$('.info-mobile').on('focus', function() {
		if($(this).closest('.form-group').hasClass('true')){
			oldVal = $(this).val();
		}
	});
	//失焦
	$('.info-mobile').on('blur', function() {
		var selfVal = $.trim($(this).val());
		var showTip = $(this).siblings('.tip-words');
		if(selfVal === ''){
			//为空
			succeed = false;
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.empty').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else if(!(/^1[0-9]{10}$/.test(selfVal))){
			//格式不正确
			succeed = false;
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.error').show();
			showTip.find('.error').html('手机号码格式不正确');
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else {
			//正确
			// 成功
			succeed = true;
			newVal = $(this).val();
			$(this).closest('.form-group').find('p').hide();
			$(this).siblings('.tip-true').show();
			$(this).closest('.form-group').addClass('true').removeClass('error');
			//手机号码发生变化 重启已验证成功的验证码
			if(newVal !== oldVal && oldVal !== null){
				$('.code-input').val('');
				$('.code-input').closest('.form-group').removeClass('true');
				$('.code-input').siblings('.tip-true').hide();
			}
			//失败
			// succeed = false;
			// showTip.find('p').hide();
			// showTip.find('.error').show();
			// showTip.find('.error').html('请求失败或手机号码不存在');
			// $(this).closest('.form-group').addClass('error').removeClass('true');
		}
		verification();
	});

	//手机验证码 发送
	var InterValObj;//timer变量，控制时间
	var count = 60; //间隔函数，1秒执行
	var curCount;//当前剩余秒数
	$('.form-group .code').on('click', function() {
		var showTip = $(this).siblings('.tip-words');
		// 检验是否完成手机验证
		if(!succeed){
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.exist').show();
			showTip.find('.exist').html('请输入正确的手机号码');
		}else {
			//错误信息的div
			var showTip = $(this).siblings('.tip-words');
			curCount = count;
			//禁用按钮
			$(this).attr("disabled", "true");
			$(this).text(curCount + "秒重新发送");
			$('.form-group .code').css({'background': '#ccc'});
			 //启动计时器，1秒执行一次
			InterValObj = window.setInterval(SetRemainTime, 1000);
			//发送请求
			// 短信已发，请注意查在您的手机上查收
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.gray').show();
		}
		verification();
	});

	//timer计时器处理函数
	function SetRemainTime(){
		if (curCount == 0) {                
            window.clearInterval(InterValObj);//停止计时器
            $('.form-group .code').css({'background': '#00a0e9'});
            $('.form-group .code').removeAttr("disabled");//启用按钮
            $('.form-group .code').text("重新发送");
            //失败
			$('.code-tip').find('p').hide();
			$('.code-tip').find('.exist').show();
			$('.code-tip').find('.exist').html('验证码已超时，请重新获取');
        }
        else {
            curCount--;
            $('.form-group .code').text(curCount + "秒重新发送");
        }
	}

	//验证码内容限制6位截断
    $('.code-input').on('input propertychange',function(){
        if($(this).val().length > 6){
        	$(this).val($(this).val().substr(0,6))
		}
    })

	//验证码内容 验证
	$('.code-input').on('blur', function() {

		var selfVal = $.trim($(this).val());
		var showTip = $(this).siblings('.tip-words');

		if(selfVal === ''){
			//为空
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.empty').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else if(!(/^[0-9]{6}$/.test(selfVal))){
			//格式不正确
			$(this).closest('.form-group').find('p').hide();
			showTip.find('.error').show();
			$(this).closest('.form-group').addClass('error').removeClass('true');
		}else {
			// 验证码校验

			//成功 打勾
			$(this).closest('.form-group').find('p').hide();
			$(this).siblings('.tip-true').show();
			$(this).closest('.form-group').addClass('true').removeClass('error');
	   		//失败 
	  		//$(this).closest('.form-group').find('p').hide();
			// showTip.find('.error').show();
			// $(this).closest('.form-group').addClass('error').removeClass('true');	
					
		}
		verification();
	});

	//打开协议
	$('.open-agreement').on('click', function() {
		$('.openWindow').show();
	});

	//关闭弹窗
	$('.openWindow .return').on('click',function() {
		$('.openWindow').hide();
	});

	//验证必填项和是否有误
	var verification = function(){
		var verify = false;
		var verifyNum = 0;
		var must = false;
		var mustNum = 0;

		//必填项正确
		$('.tip-true').each(function() {
			if($(this).is(':visible')){
				mustNum++;
			}
		});

		if(mustNum == $('.mustWrite').length){
			must = true;
		}

		//所有表单无误
		$('.form-group').each(function() {
			if($(this).hasClass('error')){
				verifyNum ++;
			}
		});

		if(verifyNum == 0){
			verify = true;
		}

		// console.log(mustNum+'+'+verifyNum)

		if(verify && must){
			$('.submit-btn').addClass('active');
		}else {
			$('.submit-btn').removeClass('active');
		}
	}

	//提交
	$('.submit-btn.active').on('click', function(event) {
		var e = event || window.event;
		var agreeCheck = $('.checkbox').find(':checkbox').attr('checked');
		if(agreeCheck){
			//成功
			$('#pop-succeed').show('');
		    //失败
		    
		    return false;
		}
		e.preventDefault();
	});

	//自定义复选框
	$.fn.toggleCheckbox = function () {
	 this.attr("checked", !this.attr("checked"));
	};

	$('.checkbox').on('click',function() {
		//切换attr属性
		$(this).find(':checkbox').toggleCheckbox();
		//切换样式
		$(this).toggleClass('active');
	});

	
	$('#pop-succeed .btn-yes,#pop-succeed .header-close').on('click',  function() {
		//跳到登录
		$('#pop-succeed').hide();
	});

});
