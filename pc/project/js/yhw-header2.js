define(['jquery'], function($){

	//定时器开打广告
	setTimeout(function(){
		$('.top-bar .top-ad').animate({'height': '80px'}, 300);
	}, 500);

	//关闭顶部广告
	$('.top-bar .top-ad .close').on('click', function() {
		$(this).closest('.top-ad').animate({'height': '0'}, 300);
	});

	// 悬浮搜索框的切换
	;(function searchFn () {
		//滚动到屏幕的一半出现悬浮搜索框
		function search(){
			var timer;
			var pageTop = $(this).scrollTop();
			var pageHeight = $(window).height()/2;
			if(pageTop > pageHeight){
				$('.fixed-header').css('top', '0');
			}else {
				$('.fixed-header').css('top', '-70px');
			}
			// 停止搜索
			$('.top-search .pull-down').hide();
			$('.top-search .searchText').blur();
		}
		search();
		$(document).scroll(function(){
			search();
		})

		// 商品和店铺的切换
		$('.page-header .radio-btn li').click(function(e) {
			var e = e || window.event;
			var curData = $(this).attr('data');
			var _this = $(this);
			pageHeader(_this,curData);
			$('.top-search .pull-down ul').html('');
			//同步切换
			$('.fixed-header .choose-btn li').each(function() {
				if($(this).attr('data') == curData){
					//获取文本
					var _this = $(this);
					var topData = _this.attr('data');
					fixedHeader(_this,topData);
				}
			});
			e.stopPropagation();
		});

		//搜索文本同步监控
		$('.page-header .top-ctn input').bind('input propertychange', function() {
		    var _val = $(this).val();
		    $('.fixed-header .top-ctn input').val(_val);
		});

		$('.fixed-header .top-ctn input').bind('input propertychange', function() {
		    var _val = $(this).val();
		    $('.page-header .top-ctn input').val(_val);
		});

		//悬浮搜索框商品和店铺的切换
		$('.fixed-header .choose-btn .top').click(function(e) {
			var e = e || window.event;
			$(this).siblings('.btm').css('visibility', 'visible');
			//停止冒泡
			e.stopPropagation();
		});

		//选择商品 或  店铺
		$('.fixed-header .choose-btn .btm').click(function(e) {
			var e = e || window.event;
			//获取文本
			var _this = $(this);
			//获取data
			var topData = _this.attr('data');
			fixedHeader(_this,topData);
			$('.top-search .pull-down ul').html('');

			//同步切换
			var curData = $('.page-header .radio-btn li').eq(topData).attr('data');
			pageHeader($('.page-header .radio-btn li').eq(topData),curData);
			$('.fixed-header .choose-btn .btm').css('visibility', 'hidden');
			e.stopPropagation();
		});

		// 鼠标点击离开来目标，隐藏
		$(document).on('click', function() {
			$('.fixed-header .choose-btn .btm').css('visibility', 'hidden');
		});

		function pageHeader(_this,curData){
			if(curData == 0){
				_this.parent('ul').siblings('input').attr('placeholder', '您可通过通用名、准字号、厂家、品牌进行搜索');
			}else if (curData == 1) {
				_this.parent('ul').siblings('input').attr('placeholder', '通过供应商名称进行搜索');
				//点击供应商筛选不显示下拉列表
				$('.page-header .pull-down').hide();
			}
			_this.addClass('active').siblings().removeClass('active');
		}

		function fixedHeader(_this,topData){
			var topValue = _this.children('span').text();
			var btmValue = _this.siblings('li').children('span').text();
			var btmData = _this.siblings('li').attr('data');
			//切换提示语
			if(topData == 0){
				_this.parent('ul').siblings('input').attr('placeholder', '您可通过通用名、准字号、厂家、品牌进行搜索');
			}else if(topData == 1){
				_this.parent('ul').siblings('input').attr('placeholder', '通过供应商名称进行搜索');
				//点击供应商筛选不显示下拉列表
				$('.fixed-header .pull-down').hide();
			}

			//赋值
			_this.children('span').text(btmValue);
			_this.siblings('li').children('span').text(topValue);
			_this.attr('data',btmData);
			_this.siblings('li').attr('data',topData);
		}
	}());

	// 搜索店铺
	;(function searchStoreFn () {
		//店铺头部
		//搜本店
		$('.shop-header .search-shop').on('click', function() {
			//输入的值
			var _val = $(this).siblings('.search-txt').val();
			window.location.href="file:///D:/药荟项目文件/药荟前台/yhweb/dist/html/index/search-product.html";
		});
		//搜全站
		$('.shop-header .search-all').on('click', function() {
			//输入的值
			var _val = $(this).siblings('.top-search').find('.search-txt').val();
			window.location.href="file:///D:/药荟项目文件/药荟前台/yhweb/dist/html/index/search-product.html";
		});
	}());

	// 搜索商品
    ;(function searchGoodFn () {
    	//助记码列表请求
        function getSearchList(_this,_val){
            //插入列表
            $('.top-search').each(function(){
            	var ulhtml = '';
            	for(var i = 0;i < 5;i++){
            	    ulhtml +="<li><span class='goods-name'>一一一</span><span class='goods-num'>共<span class='red'>5</span>个商品</span></li>";
            	}
            	$(this).find('.pull-down ul').html('');
            	$(this).find('.pull-down ul').append(ulhtml);
            	//恢复当前选项索引
    			currentLine = -1;
            });
            _this.siblings('.pull-down').show();
            // 点亮关键词
            _this.siblings('.pull-down').find('li').each(function() {
            	// 搜索结果
				var sText = $(this).find('.goods-name').html();
				if($.trim(_val) !== ''){
					// 清除样式
					sText = sText.replace(/<[^>]+>/ig,"")
					var sKey = "<span class='red'>"+_val+"</span>";
					var rStr = new RegExp(_val, "g");
					sText = sText.replace(rStr,sKey); //替换key
			   		$(this).find('.goods-name').html(sText);
			   		//如果与两个以上连起来的词一致，不点亮单个的词，如果没有。点亮单个的词
			   		if($(this).find('.goods-name .red').length <= 0){
			   			for (var i = 0; i <_val.length; i++) {
			   				if(_val[i] != ' '){
					   			var sKey = "<span class='red'>"+_val[i]+"</span>";
								var rStr = new RegExp(_val[i], "g");
								sText = sText.replace(rStr,sKey); //替换key
							}
			   			}
			   			$(this).find('.goods-name').html(sText);
			   		}
				}else {
					// 清除样式
					sText = sText.replace(/<[^>]+>/ig,"");
					$(this).find('.goods-name').html(sText);
				}
			});
        }

		//当前选项索引
		var currentLine = -1; 
		//监听输入搜索
		var flag = true;
		$('.top-search .searchText').on('compositionstart',function(){
			flag = false;
	    })
		$('.top-search .searchText').on('compositionend',function(){
			flag = true;
		})
		$('.top-search .searchText').on('input propertychange', function() {
		 	var _this = $(this);
		 	var _val = $(this).val();
		 	setTimeout(function(){
		 		if(!flag){
	                return false;
	            }
				if(_this.siblings('button').hasClass('search-shop')){
		            //店铺页头部搜索
		            if(_val){
		                //请求
		               getSearchList(_this,_val)
		            }else {
		                _this.siblings('.pull-down').hide();
		            }
		        }else {
		            //非店铺页头部搜索
		            var curData = $('.top-search .toggle li.active').attr('data');
		            if($.trim(_val) !== '' && curData == 0){
		            	 //请求
		                getSearchList(_this,_val)
		            }else {
		                _this.siblings('.pull-down').hide();
		            }
		        }
	        },0)
	    });

		//聚焦搜索
		$('.top-search .searchText').on('click', function(e) {
			var e = e || window.event;
			var curData = $('.top-search .toggle li.active').attr('data');
			var _this = $(this);
		 	var _val = $(this).val();
			if(_val && curData == 0){
				//发送请求查询列表
				getSearchList(_this,_val)
			}
			e.stopPropagation();
		});

		//选择搜索结果
		$(document).on('keydown', function(e) {
			var e = e || window.event;
			switch (e.keyCode) {
				case 38:
					// 上箭头
					if($('.top-search:eq(0) .pull-down li').length > 0){
						currentLine --;
						var _this = null;
						$('.top-search').each(function() {
							if($(this).find('.searchText').is(":focus")){
								_this = $(this);
							}
						});
						changeItem(_this);
					}
					e.preventDefault();
					break;
				case 40:
					// 下箭头
					if($('.top-search:eq(0) .pull-down li').length > 0){
						currentLine ++;
						var _this = null;
						$('.top-search').each(function() {
							if($(this).find('.searchText').is(":focus")){
								_this = $(this);
							}
						});
						changeItem(_this);
					}
					break;
				case 37:
					// 左箭头
					if($('.top-search .pull-down li').length > 0 && $('.top-search .pull-down').find('li').hasClass('active')){
						//查询当前值
					}
					break;
				case 39:
					// 右箭头
					if($('.top-search .pull-down li').length > 0 && $('.top-search .pull-down').find('li').hasClass('active')){
						//查询当前值
					}
					break;
				case 13:
					// enter选中
					if($('.top-search .searchText').is(":focus")){
						if($('.top-search .searchText').siblings('button').hasClass('search-shop')){
							$('.top-search .search-shop').click();
						}else {
							$('.top-search .search-index').click();
						}
					}
					break;
			}
		    e.stopPropagation();
		});
		//切换选项
		function changeItem(_this){
			var lineLength = $('.top-search:eq(0) .pull-down').find('li').length;
			if(currentLine < 0){
				currentLine = lineLength - 1;
			}
			if(currentLine == lineLength){
				currentLine = 0;
			}
			//切换选中样式
			$('.top-search').each(function() {
				$(this).find('.pull-down li').eq(currentLine).addClass('active').siblings().removeClass('active');
				// 赋值
				var copyText = $(this).find('.pull-down li').eq(currentLine).find('.goods-name').text();
				$(this).find('.searchText').val(copyText);
			});
			
		}
    }());

    //确认搜索对象
    ;(function confirmSearchFn () {
    	 //判断是否IE浏览器
		function IEVersion() {
		    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
		    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
		    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
		    if(isIE || isEdge || isIE11) {
		        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		        reIE.test(userAgent);
		        return 'ie';
		    } else{
		        return -1;//不是ie浏览器
		    }
		}
		//点击选中
		$('.top-search .pull-down').on('click', 'li', function(e) {
			var e = e || window.event;
			var _txt = $(this).find('.goods-name').text();
			$('.top-search .searchText').val(_txt);
			$(this).closest('.pull-down').hide();
			//跳转页面
			if(IEVersion() == 'ie'){
				_txt = encodeURI(_txt)
				console.log(_txt)
			}
			window.location.href="file:///D:/药荟项目文件/药荟前台/static-web/dist/html/index/search-product.html";
			e.stopPropagation();
		});

		//确认搜索
		$('.top-search .search-index').click(function() {
			var curData = $(this).siblings('.radio-btn').find('li.active').attr('data');
			//搜索文字
			var searchText = $('.top-search .searchText').val().trim();
			//选中商品
			if(curData == 0 && searchText){
				//发请求
				window.location.href="file:///D:/药荟项目文件/药荟前台/static-web/dist/html/index/search-product.html";
			}else if(curData == 1 && searchText){
				//选中店铺
				//发请求
				window.location.href="file:///D:/药荟项目文件/药荟前台/static-web/dist/html/index/search-product.html";

			}
		});

		//悬浮搜索框确认搜索
		$('.fixed-header .btn').click(function() {
			$('.top-search:first .btn').click();
		});
    }());

	// 鼠标点击离开来目标，隐藏
	$(document).on('click', function() {
		$('.top-search .pull-down').hide();
		$('.top-search .pull-down ul').html('');
	});
});