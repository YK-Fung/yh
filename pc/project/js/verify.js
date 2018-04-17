define(['jquery'], function($){
	// 固话输入框
	$('.input-phone').on('blur', function (){
		if ($(this).val() != '' && !(/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 手机输入框
	$('.input-mobile').on('blur', function (){
		if ($(this).val() != '' && !( /^1[0-9]{10}$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// QQ输入框
	$('.input-qq').on('blur', function (){
		if ($(this).val() != '' && !(/^[1-9]\d{4,9}$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 微信输入框
	$('.input-wx').on('blur', function (){
		if ($(this).val() != '' && !(/^[a-zA-Z\d_]{5,}$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 邮箱输入框
	$('.input-mail').on('blur', function (){
		if ($(this).val() != '' && !(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 邮政编码输入框
	$('.input-postal').on('blur', function (){
		if ($(this).val() != '' && $(this).val() != '000000' && !(/^[1-9][0-9]{5}$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 密码输入框
	$('.input-pwd').on('blur', function (){
		if ($(this).val() != '' && !(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 银行账号
	$('.input-bank').on('blur', function (){
		if ($(this).val() != '' && !(/^([1-9]{1})(\d{14}|\d{18})$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 银行卡户名
	$('.input-name').on('blur', function (){
		if ($(this).val() != '' && !(/^([\u4e00-\u9fa5]{2,5}|[A-z]{1,26})$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 开户网点
	$('.input-wd').on('blur', function (){
		if ($(this).val() != '' && !(/^[\u4e00-\u9fa5]{2,}$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 工商注册号
	$('.input-gs').on('blur', function (){
		if ($(this).val() != '' && !(/^[a-zA-Z0-9\u4e00-\u9fa5]{1,}$/.test($(this).val()))) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
});