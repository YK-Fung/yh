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
		$('.detail-lis>.toggle-ctn').eq(Index).addClass('active').siblings().removeClass('active');//内容的切换
		//获取点击对象的data
		var _data = $(this).attr('data');
		$(this).siblings('input[name="dataNum"]').val(_data);
	});

	//判断是否全选
	function checkboxFn(parentDom){
		var activeL = parentDom.find('.list .checkbox.active').length;
		var originalL = parentDom.find('.list .checkbox').length;
		if(activeL >= originalL){
			parentDom.find('.check-all').addClass('active');
			parentDom.find('.check-all input').prop('checked', true);
		}else {
			parentDom.find('.check-all').removeClass('active');
			parentDom.find('.check-all input').prop('checked', false);
		}
	}
	
	//选中商品
	$(document).on('click', '.list .checkbox', function() {
		//父级
		var parentDom = $(this).closest('.toggle-ctn');
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).find('input').prop('checked', false);
			$(this).closest('.checkbox').css('display', '');
			$(this).closest('.checkbox').siblings('.shadow').css('display', '');		
		}else{
			$(this).addClass('active');
			$(this).find('input').prop('checked', true);	
			$(this).closest('.checkbox').css('display', 'block');
			$(this).closest('.checkbox').siblings('.shadow').css('display', 'block');
		}
		checkboxFn(parentDom);
	});

	//全选
	$(document).on('click', '.check-all', function() {
		//父级
		var parentDom = $(this).closest('.toggle-ctn');
		if($(this).hasClass('active')){
			// 取消全选
			parentDom.find('.checkbox').removeClass('active');
			parentDom.find('.checkbox input').prop('checked', false);
			parentDom.find('.checkbox').css('display', '');
			parentDom.find('.shadow').css('display', '');
		}else {
			//全选
			parentDom.find('.checkbox').addClass('active');
			parentDom.find('.checkbox input').prop('checked', true);
			parentDom.find('.checkbox').css('display', 'block');
			parentDom.find('.shadow').css('display', 'block');
		}
	});

	/***************** 
		同店铺产品
	******************/
	var carouselFn = function(){
		$('.same-store>ul>li').each(function() {
			//同店铺收藏总个数
			var liLength = $(this).find('.carousel-list li').length;
			$(this).find('.collect-num').text(liLength);
			//同店铺收藏总个数为0，删除店铺记录
			if(liLength <= 0){
				$(this).remove();
			}
			//同店铺产品轮播图
			var _left = 0;
			var remainder = liLength % 4;//余数
			var liWidth = parseInt($(this).find('.carousel-list li').css('width'),10)+10;
			var flag = true; //可以执行滚动
			if(liLength > 4){
				//当不是4的整数时填充空白
				if(remainder > 0){
					liLength += 4-remainder;
				}
				//向左按钮点击
				$(this).find('.carousel-left').click(function(){
					if(flag){
						flag = false;
						if(_left >= 0){
							_left = 0;
						}else {
							_left += 4 * liWidth;
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
						if(_left <= -liWidth*(liLength-4)){
							_left = -liWidth*(liLength-4)
						}else {
							_left -= 4 * liWidth;
						}
						console.log(-liWidth*(liLength-4))
						$(this).siblings('.carousel-list').find('ul').stop().animate({'left': _left}, 500,function(){
							flag = true;
						});
					}
				});
			}
		});
	};
	carouselFn();

	//收藏店铺
	$('.same-store').on('click', '.star', function() {
		$(this).toggleClass('active');
	});

	/***************** 
		批量删除
	******************/
	var delParentDom;
	$(document).on('click', '.batch-delete', function() {
		//父级
		delParentDom = $(this).closest('.toggle-ctn');
		var activeLen = 0;
		delParentDom.find('.product-one').each(function() {
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
			delParentDom.find('.product-one').each(function() {
			if($(this).find('.checkbox').hasClass('active')){
				//删除节点
				$(this).remove();
				//取消全选
				delParentDom.find('.check-all').removeClass('active');
				delParentDom.find('.check-all input').prop('checked', false);
				//重新渲染个数
				carouselFn();
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
	