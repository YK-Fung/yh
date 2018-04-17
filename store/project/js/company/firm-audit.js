define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){
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
	            return false;
	        }
	        // 地区类型切换
	        $(this).closest('.select-drop').find('.select-type li').removeClass('active');
	        $(this).closest('.select-drop').find('.select-type li').eq(idx + 1).addClass('active');
	        // 内容切换
	        $(this).closest('.select-drop').find('.type-main').hide();
	        $(this).closest('.select-drop').find('.type-main').eq(idx + 1).show();
	        e.stopPropagation();
	    });
	}());

	/*
	 *删除
	 */
	var _self = null;
	$(document).on('click','.icon-del',function () {
		_self = $(this).closest('tr');
		$('#member-delete').modal('show');
	});
	$('#member-delete .btn-yes').on('click', function () {
		_self.remove();
	});

	/*
	 *新增会员
	 */
	$('.add-member').on('click', function() {
		// 重置表单
		$('#pop-add-member input').val('');
		$('#pop-add-member').modal('show');
	});

	//用户账号
	$('.user-name').on('input propertychange', function() {
		var _val = $(this).val().trim();
		if(!(/^[A-Za-z0-9_]{6,20}$/.test(_val))){
			$(this).addClass('error');
		}else {
			$(this).removeClass('error');
		}
	});

	//登录密码
	$('.new-password').on('input propertychange', function() {
		var _val = $(this).val().trim();
		if(!(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(_val))){
			$(this).addClass('error');
		}else {
			$(this).removeClass('error');
		}
		validate();
	});

	//确认密码
	$('.confirm-password').on('input propertychange', function() {
		var _val = $(this).val().trim();
		if(!(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(_val))){
			$(this).addClass('error');
		}else {
			$(this).removeClass('error');
		}
		validate();
	});

	function validate(){
		var pwd1 = $('.new-password').val();
		var pwd2 = $('.confirm-password').val();
		if(pwd1 === pwd2 && pwd1 !== '' && pwd2 !== ''){
			//两次输入密码一致
			$('.confirm-password').removeClass('error');
		}else if(pwd1 !== pwd2 && pwd1 !== '' && pwd2 !== ''){
			//两次输入密码不一致
			$('.confirm-password').addClass('error');
		}
	}

	//公司名称
	$('.company-name').on('input propertychange', function() {
		var _val = $(this).val().trim();
		if(!(/^[\u4e00-\u9fa5_a-zA-Z0-9\(\)\（\）]{4,50}$/.test(_val))){
			$(this).addClass('error');
		}else {
			$(this).removeClass('error');
		}
	});

	//联系人姓名
	$('.contact-name').on('input propertychange', function() {
		var _val = $(this).val().trim();
		if(!(/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/.test(_val))){
			$(this).addClass('error');
		}else {
			$(this).removeClass('error');
		}
	});

	//手机号码
	$('.mobile').on('input propertychange', function() {
		var _val = $(this).val().trim();
		if(!(/^1[0-9]{10}$/.test(_val))){
			$(this).addClass('error');
		}else {
			$(this).removeClass('error');
		}
	});
	
	//新增-保存
	$('#pop-add-member .btn-yes').on('click', function() {
		var trueNum = 0;
		$('#pop-add-member .mustWrite').each(function() {
			if(!$(this).hasClass('error') && $(this).val()){
				trueNum++;
			}
		});
		if(trueNum == $('#pop-add-member .mustWrite').length){
			//发送请求 成功执行
			$('#pop-add-member').modal('hide');
		}else {
			alert('请检查是否有填写错误或未填写！')
		}
	});

	/*
	 *重置密码
	 */
	$('.reset-password').on('click', function() {
		alert('密码重置成功');
	});
});