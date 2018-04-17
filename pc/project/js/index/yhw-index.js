define(['jquery','yhw-sidebar2','yhw-topbar2','yhw-header2','ie-tip'], function($){
	/*
	 *新年元素
	*/
	$(document).scroll(function(){
		var pageTop = $(this).scrollTop();
		if(pageTop > 700){
			$('.year-ad').addClass('fixed-top');
		}else {
			$('.year-ad').removeClass('fixed-top');
		}
	});

	//页面初始化
	;(function onloadId () {
		//获得页面定位
		var arrId = new Array(); 
		var scrollTop = $(window).scrollTop();
		var _len = $('.floor').length;
		for (var i = 0; i < _len; i++) {
			var doc = $('.floor').eq(i);
			var docTop = doc.offset().top;
			if(scrollTop < docTop + doc.height() && docTop < $(window).height()+scrollTop){
				arrId.push(doc.attr('data'));
			}
		}
		
		//分割品牌管理的字符串
		$('.lucency .center').each(function() {
			var strP = $(this).find('p').html();
			var words = strP.split("<br>");
			var replaceStr;//转换空格
			var subStr;//切割字符串

			if(words.length == 1){
				//只要一行时 可以换行
				replaceStr = words[0].replace(/&nbsp;/g, ' ');
				if(replaceStr.length > 46){
					// 控制长度不能超过2行
					subStr = replaceStr.substring(0,46);
					$(this).find('p').html(subStr.replace(/ /g, '&nbsp;'));
				}
			}else if (words.length >= 2) {
				// 只要两行时
				replaceStr = words[0].replace(/&nbsp;/g, ' ');
				if(replaceStr.length > 23){
					//当第一行换行 不显示第二行
					subStr = replaceStr.substring(0,46);
					$(this).find('p').html(subStr.replace(/ /g, '&nbsp;'));
				}else {
					//当第一行不换行 第二行控制长度
					replaceStr = words[1].replace(/&nbsp;/g, ' ');
					if(replaceStr.length > 23){
						subStr = replaceStr.substring(0,23);
						$(this).find('p').html(words[0]+'<br>'+subStr.replace(/ /g, '&nbsp;'));
					}
				}
			}
		});

	}());

	// 轮播图
	var slideshowFn = (function(){
		$('.slideshow-pic li').first().show();
		var idx = 0;
		var picLen = $('.slideshow-pic li').length; 
		var timer = null;
		// 轮播图动画
		var picAnimate = function(){
			$('.slideshow-dot li').eq(idx).addClass('active').siblings('li').removeClass('active');
			$('.slideshow-pic li').eq(idx).fadeIn().siblings('li').fadeOut();
			idx++;
			if (idx >= picLen) {
				idx = 0;
			}
			if (idx < 0) {
				idx = picLen - 1;
			}
			clearTimeout(timer);
			timer = setTimeout(picAnimate, 4000);
		};
		picAnimate();
		// 下方圆点点击
		$('.slideshow-dot li').click(function(){
			idx = $(this).index();
			picAnimate();
		});
		// 向左按钮点击
		$('.slideshow-left').click(function(){
			idx-=2;
			picAnimate();
		});
		// 向右按钮点击
		$('.slideshow-right').click(function(){
			picAnimate();
		});
	}());

	//商品分类鼠标移上效果
	$('.goods-classify').hover(function() {
		//商品分类详情展开
		$(this).find('.detail').show();
	}, function() {
		//商品分类详情收起
		$(this).find('.detail').hide();
		$('.goods-classify .top-nav li').removeClass('active');
	});

	//导航鼠标移上
	$('.goods-classify .top-nav').on('mouseenter', 'li', function() {
		$(this).addClass('active').siblings('li').removeClass('active');
		//获取数据
	});

	//banner公告栏切换
	$('.notice .toggle-title li').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		var Index = $(this).index();
		$(this).closest('.toggle-title').siblings('.toggle-ctn').find('ul').eq(Index).addClass('active').siblings().removeClass('active');
	});

	//供应商推荐切换
	$('.supplier-recommend .nav li').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
	});

	//广告图的切换
	var adPlay = (function(){
		$('.introduce-ad').each(function() {
			var _this = $(this);
			var timer = null;
			var numImg = 0;
			var adLength = $(this).find('.ad').length;

			//添加切换按钮
			if(adLength > 1){
				_this.find('.carousel').append(_this.find('.ad').eq(0).clone());//在列表后面追加一张图片
				var adWidth = _this.width();//一张图片的宽度
				$(this).find('.bar').show();
				for (var i = 0; i <= adLength-1; i++) {
					if(i == 0){
						$(this).find('.bar').append('<li class="active"></li>');
					}else {
						$(this).find('.bar').append('<li></li>');
					}
				}
				// 轮播图动画
				var adAnimate = function(){
					clearInterval(timer);
					timer = setInterval(function(){
						if(numImg < adLength-1){
							numImg ++;
							_this.find('.carousel').animate({'left':-numImg*adWidth}, 300);
						}else {
							_this.find('.carousel').animate({'left':-adLength*adWidth}, 300);
							numImg = 0;
							var timeOut = setTimeout(function(){
								_this.find('.carousel').css({'left': 0});
							}, 500);
						}
						_this.find('.bar li').eq(numImg).addClass('active').siblings().removeClass('active');
					}, 4000);
				}
				adAnimate();

				//广告鼠标移上清除定时器
				$(this).on('mouseenter', '.ad', function() {
					clearInterval(timer);
				});
				$(this).on('mouseleave', '.ad', function() {
					clearInterval(timer);
					adAnimate();
				});

				//鼠标移上切换按钮
				$(this).on('click', 'li', function() {
					// 按钮切换
					$(this).addClass('active').siblings().removeClass('active');
					//图片切换
					numImg = $(this).index();
					_this.find('.carousel').animate({'left':-numImg*adWidth}, 300);
					adAnimate();
				});
			}
		});
	}());

	//侧边导航定位
	function onloadNav(){
		var scrollTop = $(window).scrollTop();
		var navLenth = $('.nav-section').length-1;
		//隐藏导航
		if(scrollTop <= $('.nav-section').eq(0).offset().top || scrollTop >= $('.nav-section').eq(navLenth).offset().top){
			$('.sidebar-nav').hide();
		}else {
			$('.sidebar-nav').show();
		}
		for (var i = 0; i <= navLenth; i++) {
			var that = $('.nav-section').eq(i)
			if(scrollTop >= that.offset().top - 500){
				$('.sidebar-nav li').removeClass('active').eq(i).addClass('active');
			}
		}
	}
	onloadNav();

	//点击导航
	$('.sidebar-nav').on('click', 'li', function(event) {
		var e = event || window.event;
		$('html, body').animate({
		    'scrollTop': $($(this).attr('data')).offset().top - 300
		  }, 400);
		e.preventDefault();
	});

    /*
     * 图片懒加载 start
     */
    //判断当前img是否已经出现在了视野中
    function isShow(img){
    	var scrollTop = $(window).scrollTop();//滚动条相对于顶部的偏移。
    	var windowHeight = $(window).height();//浏览器的高度
    	var offsetTop = img.offset().top;//img对于document顶部的位置
    	if(offsetTop > scrollTop && offsetTop < (scrollTop + windowHeight)){
    		return true;
    	}
    	return false;
    }

    // 判断当前img是否已经被加载过了
    function isLoaded(img){
    	return img.attr('data-src') === img.attr('src');
    }

    //把自定义属性中存放的真实的src地址赋给src属性
    function lazyRender(){
     	$('.main img').each(function() {
     		if(isShow($(this)) && !isLoaded($(this))){
     			$(this).attr('src',$(this).attr('data-src'));
     		}
     	});
    }
    lazyRender();

    var clock;
    $(window).on('scroll',function() {
    	//切换选中导航
    	onloadNav();
    	//赋给src属性
    	if (clock) { 
    		clearTimeout(clock);
    	}
    	clock = setTimeout(function(){
    		lazyRender();
    	},150);
    });
    /*
     * 图片懒加载 end
     */

    //友情链接切换
    $('.friendly-link .toggle-title li').on('click', function() {
    	var _index = $(this).index();
    	$(this).addClass('active').siblings().removeClass('active');
    	$('.friendly-link .toggle-ctn ul').eq(_index).show().siblings('ul').hide();
    });
});