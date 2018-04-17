define(['jquery', 'yhw-nav2', 'yhw-header2','yhw-topbar2',  'yhw-sidebar2','ie-tip', 'pagination2'], function($){

	// 立即领取弹窗
	// var useHref = '';
	$('.coupon-use-btn').on('click', function () {
		if($(this).html()=='立即使用'){
			return;
		}
        $(this).parent().siblings('.coupon-stamp').show();
        $(this).html('立即使用');
        $('#pop-use').fadeIn('fast');
        $('#pop-use .pop-tip>span').html($(this).siblings('.coupon-price').html())
        $('#pop-use .pop-limit>span:eq(0)').html($(this).parent().siblings('.coupon-l').find('.coupon-limit>span').html())
        $('#pop-use .pop-limit>span:eq(1)').html($(this).parent().siblings('.coupon-l').find('.coupon-info').html())
	});

	// 弹窗中立即使用按钮
	$('#pop-use').on('click', function () {
		// window.location.href = useHref;
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});
	
	// 初始化页码
	paginationArg.init($('.wrap'), $('.page-amount').text());
	paginationArg.ajaxFn = function () {
		console.log(paginationArg.viewNum);
	};

});