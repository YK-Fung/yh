define(['jquery'], function($){

	// 鼠标点击离开来目标，菜单栏隐藏
	$(document).on('click', function() {
		$('.user-info-left li').removeClass('open');
		$('.user-data').removeClass('show');
	});

	// 鼠标点击栏下拉菜单的切换；
	$('.user-info-left .dropdown').on('click',function(event) {
		var e = event || window.event;
		//全部下拉菜单影藏
		$(this).parent('li').siblings('li').removeClass('open');
		// 点击icon切换
		$(this).parent('li').toggleClass('open');
		//停止冒泡
		e.stopPropagation();
	});
	
	//下拉菜单停止冒泡
	$('.dropdown-menu').on('click',function(event) {
		var e = event || window.event;
		e.stopPropagation();
	});

	//右侧个人资料的切换
	$('.user-data').on('click','.user',function(event) {
		var e = event || window.event;
		$(this).parent().toggleClass('show');
		//停止冒泡
		e.stopPropagation();
	});

	//下拉菜单停止冒泡
	$('.user-data ul').on('click',function(event) {
		var e = event || window.event;
		e.stopPropagation();
	});

	//点击团队动态列表展开
	$('.team-state .btn').on('click',function(){
		$(this).parent().addClass('open');
		$('.footer').addClass('extend');
	});

	//点击合上团队动态列表
	$('.team-state-list .close-team').on('click',function(){
		$('.team-state').removeClass('open');
		$('.footer').removeClass('extend');
		$('.person-message').hide();
	});

	//查看个人操作动态
	var obj;
	$('.bu-men .name').on('click', function(event) {
		var topHeight = $(window).scrollTop();
		var _top = $(this).offset().top - topHeight - 22;
		$('.team-state-list li').removeClass('is-open');
		$(this).parent('li').addClass('is-open')
		obj = $(this)
		$('.person-message').css({
			'display': 'block',
			'top': _top + 'px'
		});
	});

	//页面滚动时个人动态框跟随
	$('.team-state-list').scroll(function(e) {
		var topHeight = $(window).scrollTop();
		var _top2 = obj.offset().top - topHeight - 22;
		$('.person-message').css({
			'top': _top2 + 'px'
		});
    });

	//关闭个人动态
	$('.person-message .close').on('click', function() {
		$('.person-message').hide();
		$('.team-state-list li').removeClass('is-open');
	});

	// 切换人员列表
	$('.bu-men h3').on('click', function() {
		var objParent = $(this).parent('.bu-men')
		// 切换部门人员列表
		objParent.toggleClass('is-open');
		
		// icon切换
		if(objParent.hasClass('is-open')){
			$(this).children('i').removeClass('fa-angle-down').addClass('fa-angle-up');
		}else {
			$(this).children('i').removeClass('fa-angle-up').addClass('fa-angle-down');
			$('.person-message').hide();
		}
	});

	// 产品展示分类导航
	var navCur = $('#navInnerCur').data('nav');
	var navClass = '.' + navCur;
	//导航标题选中
	if($('#navInner li').hasClass(navCur)){
		$(navClass).addClass('active');
	}
});