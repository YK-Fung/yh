define(['jquery', 'pagination'], function($){
	//供应商和采购商的切换
	$('.tit-tab button').on('click', function() {
		//样式的切换
		$(this).addClass('btn-primary').removeClass('btn-default');
		$(this).siblings('button').addClass('btn-default').removeClass('btn-primary');
		var _index = $(this).index();
		//内容切换
		if(_index == 0){
			$('.num-line').text('采购量（件）');
			$('.money-line').text('支付总额');
		}else if(_index == 1){
			$('.num-line').text('销量（件）');
			$('.money-line').text('交易总额');
		}
		$('.tab-list>div').eq(_index).show().siblings().hide();
	});
	//按日期搜索切换
	$('.nav-inner button').on('click', function() {
		//样式的切换
		$(this).addClass('btn-primary').removeClass('btn-default');
		$(this).siblings('button').addClass('btn-default').removeClass('btn-primary');
	});

	// 初始化页码
	paginationArg.init($('.wrap'), $('.pagination .active').text(), $('.page-amount').text());
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});