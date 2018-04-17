define(['jquery'], function($){
	// 监测浏览器是否伸缩
	function detectZoom (){
		var ratio = 0,
		screen = window.screen,
		ua = navigator.userAgent.toLowerCase();
		if (window.devicePixelRatio !== undefined) {
	    	ratio = window.devicePixelRatio;
		}
		else if (~ua.indexOf('msie')) {
			if (screen.deviceXDPI && screen.logicalXDPI) {
				ratio = screen.deviceXDPI / screen.logicalXDPI;
	    	}
		}
		else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
			ratio = window.outerWidth / window.innerWidth;
		}
		if (ratio){
			ratio = Math.round(ratio * 100);
		}
	   return ratio;
	};
	// 浏览器伸缩提示
	function zoomTip(){
		if(detectZoom () != 100){
			$('.zoom-tip').show();
		}else {
			$('.zoom-tip').hide();
		}
	}
	zoomTip();
	$(window).resize(function() {
		zoomTip();
	});
	
	// 关闭浏览器伸缩提示
	$('.zoom-tip .icon-close').on('click', function() {
		$(this).closest('.zoom-tip').hide();
	});

});