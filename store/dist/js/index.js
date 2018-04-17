define(['jquery'], function($){
	//默认选中第一个目录 添加iframe
	(function(){
		var _src = $('.wrap-l>li.active li.active').find('a').attr('href');
		// 添加iframe
		var iframeHtml = '<div class="iframe active" ><iframe src="'+_src+'" width="100%" height="100%" frameborder="0"></iframe></div>'
		$('.iframes').html(iframeHtml);
	})();

	//二级目录点击
	$('.second-menu').on('click', 'li', function() {
		$(this).addClass('active').siblings().removeClass('active');
	});

	// 三级目录点击点击
	$(document).on('click', '.wrap-l .level-name',function (e) {
		var e = e || window.event;
		if($(this).parent().hasClass('active')){
			$(this).parent().removeClass('active');
		}else {
			$(this).parent().addClass('active').siblings().removeClass('active');
		}
		var _src = $(this).attr('href');
		// 添加iframe
		if(_src != '#' && _src != 'javascript:void(0)'){
			var iframeHtml = '<div class="iframe active" ><iframe src="'+_src+'" width="100%" height="100%" frameborder="0"></iframe></div>'
			$('.iframes').html(iframeHtml);
		}
		e.preventDefault();
	});

	// 四级目录点击点击
	$(document).on('click', '.wrap-l>li li',function (e) {
		var e = e || window.event;
		// 添加活动状态
		$('.wrap-l>li li').removeClass('active');
		$(this).addClass('active');
		var _src = $(this).find('a').attr('href');
		// 添加iframe
		var iframeHtml = '<div class="iframe active" ><iframe src="'+_src+'" width="100%" height="100%" frameborder="0"></iframe></div>'
		$('.iframes').html(iframeHtml);
		e.preventDefault();
	});
	
});