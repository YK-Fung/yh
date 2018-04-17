;(function($){
	// 父窗口
	var parentWin = $('.ctn-r', window.parent.document);
	// 窗口高度
	var winH = parseInt($(window).height(), 10);
	// link-btn
	$(document).on('click', '.link-btn', function(e){
		//动态tabname
		var parentIdx = $(this).closest('.box').index();
		var thisIdx = $(this).index();
		var tabName = 'center' + parentIdx + thisIdx;
		var tabSelect = '[tabname="' + tabName + '"]';
		// 是否有tabname
		if (!$(this).attr('tabname')) {
			// 给当前点击对象添加tabname
			$(this).attr('tabname', tabName);
			// 添加tab导航
			var thisText = $(this).find('span').text();
			parentWin.find('.tab-child').removeClass('active');
			var tabChild = '<div class="tab-child active" tabname="' + tabName + '"><span>' + thisText + '</span><span class="close"></span></div>'
			parentWin.find('.select').before(tabChild);
			// 添加iframe
			var iframeHtml = '<div class="iframe active" tabname="' + tabName + '"><iframe src="" width="100%" height="100%" frameborder="0"></iframe></div>'
			parentWin.find('.iframes').append(iframeHtml);
			// 调整iframe高度
			parentWin.find('.iframe').height(winH);
			parentWin.find(tabSelect).addClass('active').siblings().removeClass('active');
			// 链接跳转
			parentWin.find(tabSelect).find('iframe')[0].src = $(this).attr('href');
		}
		else {
			parentWin.find(tabSelect).addClass('active').siblings().removeClass('active');
		}
		e.preventDefault();
	});
}(jQuery));