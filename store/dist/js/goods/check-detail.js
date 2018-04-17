define(['jquery', 'bootstrap'], function($){

	// 基础库数据是否完整
	$('.modal-inspect').modal({
		backdrop: 'static',
		keyboard: false,
		show: true
	});

	// 图片预览
	$(document).on('click', 'img', function () {
		var imgSrc = $(this).attr('src');
		$('.modal-view img').attr('src', imgSrc);
		$('.modal-view').modal('show');
	});
	// 提交
	$('.btn-submit').on('click', function (event) {
		var e = event || window.event;
		// 不通过的时候，原因必填
		var idx = $('.audit .radio-inline input:checked').closest('.radio-inline').index();
		if (idx && $.trim($('.must').val()) === '') {
			$('.modal-submit').modal('show');
		}
		else {
			alert('提交成功！');
		}
		e.preventDefault();
	});
	// 返回
	$('.btn-back').on('click', function (event) {
		var e = event || window.event;
		alert('返回成功！');
		e.preventDefault();
	});
});
