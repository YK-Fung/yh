define(['jquery'], function($){
	var customView = function(targetEl, moveRange, moveEl){
		var obj = {
			// 鼠标点击的目标
			'targetEl': targetEl,
			// 移动的范围
			'moveRange': moveRange,
			// 移动的小方块、宽、高
			'moveEl': moveEl,
			'moveElW': $(moveEl).outerWidth(true) / 2,
			'moveElH': $(moveEl).outerHeight(true) / 2,
			// 模块提示
			'tipHtml': '<span class="tip">在此处添加模块</span>'
		};
		return obj;
	};
	var _customView = new customView('.module-ctn', window, '.rectangle');
});