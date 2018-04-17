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
			$('.bar-slider').css('top', '40px');
			$('.ctn-right').css('padding-top', '40px');
		}else {
			$('.zoom-tip').hide();
			$('.bar-slider').css('top', '0');
			$('.ctn-right').css('padding-top', '0');
		}
	}
	zoomTip();
	$(window).resize(function() {
		zoomTip();
	});

	// 关闭浏览器伸缩提示
	$('.zoom-tip .icon-close').on('click', function() {
		$(this).closest('.zoom-tip').hide();
		$('.bar-slider').css('top', '0');
		$('.ctn-right').css('padding-top', '0');
	});

	//slide切换状态
	var toogleState = false;

	// 左侧slide左右切换
	$('.toggle-btn').on('click', 'a', function() {
		var _width = document.body.clientWidth;
		if(_width < 1400){
			return false;
		}
		$('.bar-slider').toggleClass('close');
		$('.ctn-right').toggleClass('close');
		$('.footer').toggleClass('extend');
		toogleState = !toogleState
	});

	// 屏幕尺寸发生变化时，右侧导航切换
	function toggleClient(){
		var _width = document.body.clientWidth;
		if(!toogleState){
			if(_width <= 1300){
				$('.bar-slider').addClass('close');
				$('.ctn-right').addClass('close');
				$('.footer').addClass('extend');
			}else if (_width > 1300) {
				$('.bar-slider').removeClass('close');
				$('.ctn-right').removeClass('close');
				$('.footer').removeClass('extend');
			}
		}
	};
	toggleClient();
	$(window).bind('resize', function() {
		toggleClient();
	});

	//一级导航标题
	var max = $('#navCur').attr('max-title');
	var maxClass = '.' + max;
	//二级导航标题
	var second = $('#navCur').attr('second-title');
	var secondClass = '.' + second;
	//一级导航标题选中
	if($('.menu-list .title').hasClass(max)){
		$(maxClass).addClass('active');
	}
	//二级导航标题选中
	if($('.inner-lis li').hasClass(second)){
		$(secondClass).addClass('active');
	}

	//点击选中状态
	$('.menu-list .title').on('click', function() {
		$(this).addClass('active').siblings().removeClass('active');
	});
});

