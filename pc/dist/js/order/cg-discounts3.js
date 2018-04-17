define(['jquery', 'bar-slider', 'bar-header', 'ie-tip'], function($){


	// 优惠券操作
	$('.discount-opt ul li').on('click', function () {
		$(this).addClass('active').siblings('li').removeClass('active');
	});

	//下拉列表
	;(function selectBoxFn () {
		//下拉列表切换
		$(document).on('click', '.select-box2 .select-choice', function(event) {
			var e = event || window.event;
			//其它下拉隐藏
			$('.select-box2').removeClass('active');
			//下拉效果切换
			$(this).parents('.select-box2').addClass('active');
			//停止冒泡
			e.stopPropagation();
		});

		// 鼠标点击离开来目标，菜单栏隐藏
		$(document).on('click', function() {
			$('.select-box2').removeClass('active');
		});

		//选中下拉选项
		$(document).on('click', '.select-box2 .select-drop li', function(event) {
			var e = event || window.event;
			var _txt = $(this).text();
			var _data = $(this).attr('data');
			//添加选中select值
			$(this).closest('.select-box2').find('.select-text').text(_txt);
			$(this).closest('.select-box2').find('.select-input').val(_data);
			//隐藏下拉列表
			$(this).closest('.select-box2').removeClass('active');
			e.stopPropagation();
		});	
	}());


});