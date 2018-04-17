define(['jquery'], function($){
	// 搜索栏下拉
	$('.top-search .choose-btn').on('click', '.top', function(event) {
		var e = event || window.event;
		$(this).siblings('.btm').toggle();
		//停止冒泡
		e.stopPropagation();
	});
	//选择商品 或  店铺
	$('.top-search .choose-btn').on('click', '.btm', function() {
		//获取文本
		var topValue = $(this).children('span').text();
		var btmValue = $(this).siblings('li').children('span').text();
		//获取data
		var topData = $(this).children('span').attr('data');
		var btmData = $(this).siblings('li').children('span').attr('data');
		//赋值
		$(this).children('span').text(btmValue);
		$(this).siblings('li').children('span').text(topValue);
		$(this).children('span').attr('data',btmData);
		$(this).siblings('li').children('span').attr('data',topData);

	});
	// 鼠标点击离开来目标，隐藏
	$(document).on('click', function() {
		$('.top-search .choose-btn .btm').hide();
	});

	//确认搜索
	$('.top-search').on('click', '.btn',function() {
		var curData = $(this).siblings('.choose-btn').find('.top span').attr('data');
		//选中商品
		if(curData == 0){
			//请求
			
		}else if(curData == 1){
			//选中店铺
			//请求

		}
	});

	//搜索下拉菜单
	$('.top-search .pull-down').on('click', 'li', function() {
		//取值
		var txt = $(this).text();
		//赋值
		$('.top-search input').val(txt);
		//父级隐藏 和 清空
		$(this).closest('.pull-down').hide();
		$(this).parent('ul').html('');
	});
});