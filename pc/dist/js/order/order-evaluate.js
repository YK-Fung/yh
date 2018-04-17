define(['jquery', 'datetime', 'bar-slider', 'bar-header', 'verify', 'popwin','ie-tip'], function($){

	// 评论类型
	$('.comment-type li').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
		$(this).find('input').prop('checked', true);
	});

	//展开收起内容
	$('.arrow').click(function() {
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).closest('.type-name').next('.toggle-ctn').removeClass('active');
		}else {
			$(this).addClass('active');
			$(this).closest('.type-name').next('.toggle-ctn').addClass('active');
		}
	});

	//聚焦
	$('.comment-body textarea').select();
	$('.comment-body textarea').val('');

	//监控填写评价字数
	$('.comment-body textarea').on('input propertychange', function() {
		var _val = $(this).val();//评价内容
		var _length = _val.length//字的长度
		if(_length >= 300){
			_length = 300;
			$(this).val(_val.substring(0,299));
		}
		//还可以输入多少个字
		console.log(_length)
		$('.comment-body .word-num').text(300-_length);
	});

});