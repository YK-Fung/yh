define(['jquery', 'bar-slider', 'bar-header', 'popwin','ie-tip'], function($){
		


	// 打款金额
	$('.input-money').on('blur', function (){
		console.log($(this).val() == '')
		console.log((!(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test($(this).val())) || !parseFloat($(this).val()) > 1))
		if ($(this).val() != '' && (!(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test($(this).val())) || parseFloat($(this).val()) > 1)) {
			$(this).parent().find('.error-tip').show();
		}
		else{
			$(this).parent().find('.error-tip').hide();
		}
	});

	// 提交
	$('.step2-ctn .btn-submit').on('click', function (event) {
		var e = event || window.event;
		// 验证项
		var verify = false;
		var verifyNum = 0;
		$('.step2-ctn .error-tip').each(function (){
			if( $(this).is(':hidden') ){
				verifyNum ++;
			}
		});
		if (verifyNum == $('.error-tip').length) {
			verify = true;
		}
		// 必填项
		var must = false;
		var mustArr = [];
		$('.must').each(function () {
			var mustVal = $.trim($(this).val());
			mustArr.push(mustVal);
		});
		console.log(mustArr);
		if (mustArr.indexOf('') < 0) {
			must = true;
		}
		// 判断数据是否符合要求
		if (verify && must) {
			alert('可以提交！');
		}
		else {
			alert('请检查是否选项未填写以及填写的内容格式是否有误！')
		}
		e.preventDefault();
	});

});