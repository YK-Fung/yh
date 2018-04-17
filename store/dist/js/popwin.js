define(['jquery'], function($){
	/*************************************/
	// 显示：popShow
	// 隐藏：popHide
	/*************************************/
	$.fn.popShow = function(_options){
		var _defaults = {
			'opacity': 0.5,
			'transition': true,
			'time': 200,
			'overlay': false
		};
		var _opts = $.extend({}, _defaults, _options);
		var _bgColor = 'rgba(0, 0, 0, ' + _opts.opacity + ')';
		$(this).css('background-color', _bgColor);
		if (_opts.transition) {
			$(this).fadeIn(_opts.time);
		} else {
			$(this).show();
		}
		$(this).on('click', function(){
			if (_opts.overlay) {
				$(this).popHide();
			}
		});
	};
	$.fn.popHide = function(_options){
		var _defaults = {
			'transition': true,
			'time': 200
		};
		var _opts = $.extend({}, _defaults, _options);
		if (_opts.transition) {
			$(this).fadeOut(_opts.time);
		} else {
			$(this).hide();
		}
	};
});