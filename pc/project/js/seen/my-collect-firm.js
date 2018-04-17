define(['jquery', 'datetime','bar-slider', 'bar-header','popwin','ie-tip','pagination2'], function($){
	//屏幕小于1440导航栏收起
	function toggleClient(){
		var _width = document.body.clientWidth;
		if(_width < 1440){
			$('.bar-slider').addClass('close');
			$('.ctn-right').addClass('close');
		}
	};
	toggleClient();
	$(window).bind('resize', function() {
		toggleClient();
	});

	;(function selectBoxFn () {
		//下拉列表切换
		$(document).on('click', '.select-box .select-choice', function(event) {
			var e = event || window.event;
			//其它下拉隐藏
			$('.select-box').removeClass('down');
			//下拉效果切换
			$(this).parents('.select-box').toggleClass('down');
			//停止冒泡
			e.stopPropagation();
		});

		// 鼠标点击离开来目标，菜单栏隐藏
		$(document).on('click', function() {
			$('.select-box').removeClass('down');
		});

		//选中下拉选项
		$(document).on('click', '.select-box .select-drop li', function(event) {
			var e = event || window.event;
			var _txt = $(this).text();
			var _data = $(this).attr('data');
			//添加选中select值
			$(this).closest('.select-box').find('.select-text').text(_txt);
			$(this).closest('.select-box').find('.select-input').val(_data);
			//隐藏下拉列表
			$(this).closest('.select-box').removeClass('down');
			e.stopPropagation();
		});	
	}());

	//切换二级导航
	$('.nav2').on('click', 'li',function() {
		var Index = $(this).index();//获取索引
		$(this).addClass('active').siblings().removeClass('active');//导航的切换
		//获取当前的企业 本周上新 热销 优惠 的框框
		var carousel  = $(this).parent('.nav2').siblings('.product-box').children('.carousel');
		carousel.eq(Index).addClass('active').siblings().removeClass('active');//内容的切换
	});

	//判断是否全选
	function checkboxFn(){
		var activeL = $('.firm-list .checkbox.active').length;
		var originalL = $('.firm-list .checkbox').length;
		if(activeL >= originalL){
			$('.check-all').addClass('active');
			$('.check-all input').prop('checked', true);
		}else {
			$('.check-all').removeClass('active');
			$('.check-all input').prop('checked', false);
		}
	}
	
	//选中企业
	$(document).on('click', '.firm-list .checkbox', function() {
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).find('input').prop('checked', false);		
		}else{
			$(this).addClass('active');
			$(this).find('input').prop('checked', true);	
		}
		checkboxFn();
	});

	//全选
	$(document).on('click', '.check-all', function() {
		if($(this).hasClass('active')){
			// 取消全选
			$('.checkbox').removeClass('active');
			$('.checkbox input').prop('checked', false);
		}else {
			//全选
			$('.checkbox').addClass('active');
			$('.checkbox input').prop('checked', true);
		}
	});

	//产品轮播
	$('.carousel').each(function() {
		//同店铺收藏总个数
		var liLength = $(this).find('li').length;
		var remainder = liLength % 3;//余数
		var _left = 0;
		var liWidth = parseInt($(this).find('.carousel-list li').css('width'),10)+10;//一个产品的宽度
		var flag = true; //可以执行滚动
		console.log(liLength)
		if(liLength > 3){
			//当不是4的整数时填充空白
			if(remainder > 0){
				liLength += 3-remainder;
			}
			//向左按钮点击
			$(this).find('.carousel-left').click(function(){
				if(flag){
					flag = false;
					if(_left >= 0){
						_left = 0;
					}else {
						_left += 3 * liWidth;
					}
					$(this).siblings('.carousel-list').find('ul').stop().animate({'left': _left}, 500,function(){
						flag = true;
					});
				}
			});
			// 向右按钮点击
			$(this).find('.carousel-right').click(function(){
				if(flag){
					flag = false;
					if(_left <= -liWidth*(liLength-3)){
						_left = -liWidth*(liLength-3)
					}else {
						_left -= 3 * liWidth;
						$(this).siblings('.carousel-list').find('ul').append('');
						liLength = $(this).siblings('.carousel-list').find('li').length;
						remainder = liLength % 3;//余数
						if(remainder > 0){
							liLength += 3-remainder;
						}
					}
					$(this).siblings('.carousel-list').find('ul').stop().animate({'left': _left}, 500,function(){
						flag = true;
					});
				}
			});
		}
	});

	/***************** 
		批量删除
	******************/
	$(document).on('click', '.batch-delete', function() {
		var activeLen = 0;
		$('.firm-list').each(function() {
			if($(this).find('.checkbox').hasClass('active')){
				activeLen++;
			}
		});
		if(activeLen > 0){
			//选中产品>0
			$('#pop-cancel .main-text').text('你确定删除该产品吗？');
			$('#pop-cancel .btn-yes').attr('data','confirm-del');
		}else {
			//选中产品=0
			$('#pop-cancel .main-text').text('未选中要删除的产品！');
			$('#pop-cancel .btn-yes').attr('data','');
		}
		$('#pop-cancel').show();
	});
	
	//关闭弹窗
	$('.pop-shade .btn-no,.pop-shade .header-close,.pop-shade .btn-yes').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});

	//确定删除
	$('#pop-cancel .btn-yes').on('click', function() {
		if($(this).attr('data') == 'confirm-del'){
			$('.firm-list').each(function() {
			if($(this).find('.checkbox').hasClass('active')){
				//删除节点
				$(this).remove();
				//取消全选
				$('.check-all').removeClass('active');
				$('.check-all input').prop('checked', false);
			}
		});
		}
	});

	// 初始化页码
	paginationArg.init($('.wrap'), $('.page-amount').text(), $('.item-amount').text());
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});
