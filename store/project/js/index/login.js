define(['jquery'], function($){

	// 是否是英文or数字
	// $('.login-input').on('blur', function (){
	// 	//  && !(/^[0-9a-zA-Z]+$/.test($(this).val()))
	// 	if ($(this).val() != '') {
	// 		$(this).next('.warn-tip').show();
	// 	}
	// 	else{
	// 		$(this).next('.warn-tip').hide();
	// 	}
	// });
	// 登录
	$('.btn-login').on('click', function (event) {
		var e = event || window.event;
		// 验证项
		var verify = false;
		var verifyNum = 0;
		$('.warn-tip').each(function (){
			if($(this).is(':hidden')){
				verifyNum ++;
			}
		});
		if (verifyNum == $('.warn-tip').length) {
			verify = true;
		}
		// 必填项
		var must = false;
		var mustArr = [];
		$('input').each(function () {
			var mustVal = $.trim($(this).val());
			mustArr.push(mustVal);
		});
		if (mustArr.indexOf('') < 0) {
			must = true;
		}
		// 判断数据是否符合要求
		console.log(verify);
		console.log(must);
		if (verify && must) {
			alert('可以提交！');
		}
		else {
			alert('请检查是否有未填写项或者输入格式是否有误！')
		}
		e.preventDefault();
	});
});