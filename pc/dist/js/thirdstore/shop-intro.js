define(['jquery', 'yhw-nav2', 'yhw-header2', 'yhw-topbar2', 'yhw-sidebar2', 'ie-tip'], function($){

	// 资质滚动
	var aptitude = function (target, optLeft, optRight) {
		var obj = {
			target: target,
			optLeft: optLeft,
			optRight: optRight,
			moveAmount: 0,
		};

		obj.aptitude = obj.target.find('li');
		// 最大移动次数
		obj.moveMax = obj.aptitude.length - 4;
		// 内容宽度
		obj.aptitudeW = parseFloat(obj.aptitude.outerWidth(true));

		// 移动的距离
		obj.moveX = function() {
			return -(obj.aptitudeW * obj.moveAmount);
		};

		// 左键点击
		obj.optLeft.on('click', function () {
			obj.moveAmount --;
			// 最小值
			if (obj.moveAmount <= 0) {
				obj.moveAmount = 0;
			}
			obj.target.animate({
				marginLeft: obj.moveX()
			}, 100);
		});

		// 右键点击
		obj.optRight.on('click', function () {
			obj.moveAmount ++;
			// 最大值
			if (obj.moveAmount >= obj.moveMax) {
				obj.moveAmount = obj.moveMax;
			}
			obj.target.animate({
				marginLeft: obj.moveX()
			}, 100);
		});

		return obj;
	};
	var aptitudeFn = new aptitude($('.aptitude-ctn .aptitude-detail ul'), $('.aptitude-ctn .opt-left'), $('.aptitude-ctn .opt-right'));


	// 大图预览
	$(document).on('click', '.aptitude-img img', function () {
		$('.view-img img').attr('src', $(this).attr('src'));
		$('.view-img').fadeIn('fast');
	});
	// 关闭大图预览
	$('.view-img').on('click', function () {
		$(this).fadeOut('fast');
	});

});

