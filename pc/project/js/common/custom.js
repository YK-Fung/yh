// 页面编辑、布局管理、预览页面的转换，需要优化
// 插入dom的方式需要优化
// 很多类似的js需要合并
define(['jquery'], function($){
	// targetEl：目标模块；moveRange：移动范围；moveEl: 移动的dom
	var custom = function(targetEl, moveRange, moveEl){
		var obj = {
			// 鼠标点击的目标
			'targetEl': targetEl,
			// 移动的范围
			'moveRange': moveRange,
			// 移动的小方块、宽、高
			'moveEl': moveEl,
			'moveElW': $(moveEl).outerWidth(true) / 2,
			'moveElH': $(moveEl).outerHeight(true) / 2,
			// 插入的模块类型，true为页面编辑，false为布局管理
			'domType': true,
			// 鼠标是否已经按下
			'isDown': false,
			// 模块类型
			'moduleType': '',
			// 窗口宽度
			'winW': parseInt($(window).width(), 10),
			'winH': parseInt($(window).height(), 10),
			// 左侧部分宽度
			'wrapLW': parseInt($('.wrap-l').outerWidth(true), 10),
			// 导航条高度
			'navH': parseInt($('.nav').outerHeight(true), 10),
			// 预览按钮高度
			'btnH': parseInt($('.btn-group').outerHeight(true), 10),
			// 在iframe中移动
			iframeMoveFn: function(){
				// 鼠标移动-iframe中
				obj.iframeDoc = $('#page-view').contents();
				$(obj.iframeDoc).on('mousemove', function(event){
					// 如果鼠标已经按下
					if (obj.isDown) {
						var e = event || window.event;
						// 获取需要移动后的坐标并设置。
						obj.moveX = e.pageX - 25 + obj.wrapLW;
						obj.moveY = e.pageY - 25 + obj.navH + obj.btnH;
						$(obj.moveEl).css({
							'top': obj.moveY,
							'left': obj.moveX
						});
					}
				});
			}
		};
		// 页面区宽
		$('.page').width(obj.winW - obj.wrapLW);
		// iframe高度
		$('.iframe').height(obj.winH - obj.btnH);
		// 操作内容
		$('.operate-type>li').on('click', function(){
			var idx = $(this).index();
			$(this).addClass('active').siblings('li').removeClass('active');
			$('.operate-ctn>li').eq(idx).show().siblings('li').hide();
		});
		// 鼠标按下
		$(obj.targetEl).on('mousedown', function(event){
			var e = event || window.event;
			// 鼠标按下，改为true
			obj.isDown = true;
			// 当前dom的文字
			obj.text = $(this).text();
			// 当前dom的module-type
			obj.moduleType = $(this).attr('module-type');
			// 获取按下时的坐标，减去宽高一半，让鼠标在中心位置
			obj.startX = e.pageX - 25;
			obj.startY = e.pageY - 25;
			// 给移动的小方块设置文字、样式、位置
			$(obj.moveEl).text(obj.text);
			$(obj.moveEl).css({
				'display': 'block',
				'top': obj.startY,
				'left': obj.startX
			});
			// 取消默认行为
			e.preventDefault(); 
		});
		// 鼠标移动-父窗口中
		$(obj.moveRange).on('mousemove', function(event){
			// 如果鼠标已经按下
			if (obj.isDown) {
				var e = event || window.event;
				// 获取移动时的坐标，减去宽高一半，让鼠标在中心位置
				obj.moveX = e.pageX - 25;
				obj.moveY = e.pageY - 25;
				$(obj.moveEl).css({
					'display': 'block',
					'top': obj.moveY,
					'left': obj.moveX
				});
				// 获得iframe中的.module
				obj.iframeModule = $('#page-view').contents().find('.module');
				// 相对于iframe中的位置
				obj.iframeX = obj.moveX- obj.wrapLW;
				obj.iframeY = obj.moveY - obj.navH - obj.btnH;
				// 碰撞检测,在目标添加活动状态
				$(obj.iframeModule).each(function(){
					obj.T = $(this).offset().top - obj.moveElH;
					obj.B = obj.T + $(this).height();
					obj.L = $(this).offset().left - obj.moveElW;
					obj.R = obj.L + $(this).width();
					if (obj.iframeY > obj.T && obj.iframeY < obj.B && obj.iframeX > obj.L && obj.iframeX < obj.R) {
						$(this).addClass('active');
					} else {
						$(this).removeClass('active');
					}
				});
			}
		});
		obj.iframeMoveFn();
		// 鼠标松开
		$('.rectangle').on('mouseup', function(){
			// 鼠标松开，改为false
			obj.isDown = false;
			// 判断插入的dom类型
			if (obj.domType) {
				// 判断模块类型，并设置相应模块内容
				switch (obj.moduleType) {
					// 标题
					case 'module-title':
						obj.moduleHtml = '<div class="module-ctn module-title" module-type="module-title"><div class="module-edit"><div class="btn-del">删除</div><div class="btn-edit">编辑</div><div class="btn-b">↑</div><div class="btn-t">↓</div></div><h1>这是标题</h1></div>';
					break;
					// 图片
					case 'module-pic':
						obj.moduleHtml = '<div class="module-ctn module-pic" module-type="module-pic"><div class="module-edit"><div class="btn-del">删除</div><div class="btn-edit">编辑</div><div class="btn-b">↑</div><div class="btn-t">↓</div></div><img src="../img/slideshow1.jpg"></div>';
					break;
				}			
			} else {
				// 判断模块类型，并设置相应的内容
				switch (obj.moduleType) {
					// 标题
					case 'module-title':
						obj.moduleHtml = '<div class="module-ctn module-title" module-type="module-title"><div class="btn-del">删除</div><span>标题</span></div>';
					break;
					// 图片
					case 'module-pic':
						obj.moduleHtml = '<div class="module-ctn module-pic" module-type="module-pic"><div class="btn-del">删除</div><span>图片</span></div>';
					break;
				}
			}
			// 碰撞检测,在目标dom插入对应内容
			$(obj.iframeModule).each(function(){
				obj.T = $(this).offset().top - obj.moveElH;
				obj.B = obj.T + $(this).height();
				obj.L = $(this).offset().left - obj.moveElW;
				obj.R = obj.L + $(this).width();
				if (obj.iframeY > obj.T && obj.iframeY < obj.B && obj.iframeX > obj.L && obj.iframeX < obj.R) {
					$(this).html(obj.moduleHtml);
				}
			});
			// 重置模块类型和模块内容，隐藏小方块
			obj.moduleType = '';
			obj.moduleHtml = '';
			obj.iframeModule.removeClass('active');
			$('.rectangle').hide();
		});
		// 页面编辑按钮
		$('.btn-edit').on('click', function(){
			// 如果已经是当前页面，不重复执行
			if ($(this).hasClass('active')) {
				return false;
			}
			$(this).addClass('active').siblings().removeClass('active');
			obj.domType = true;
			// 获得iframe中的module-ctn
			obj.iframeModuleCtn = $('#page-view').contents().find('.module-ctn');
			$(obj.iframeModuleCtn).each(function(){
				// 获得iframe中的module-ctn的module-type
				obj.iframeModuleType = $(this).attr('module-type');
				// 判断模块类型，并设置相应的内容
				switch (obj.iframeModuleType) {
					// 标题
					case 'module-title':
						obj.iframeModuleCtnHtml = '<div class="module-edit"><div class="btn-del">删除</div><div class="btn-edit">编辑</div><div class="btn-b">↑</div><div class="btn-t">↓</div></div><h1>这是标题</h1>';
					break;
					// 图片
					case 'module-pic':
						obj.iframeModuleCtnHtml = '<div class="module-edit"><div class="btn-del">删除</div><div class="btn-edit">编辑</div><div class="btn-b">↑</div><div class="btn-t">↓</div></div><img src="../img/slideshow1.jpg">';
					break;
				}
				$(this).html(obj.iframeModuleCtnHtml);
			});
			// 获得iframe的body的innerHTML
			obj.iframeHtml = $('#page-view').contents().find('body').html();
			// 打开新页面
			$('#page-view').attr('src', 'custom-edit.html');
			// 当新页面加载完，将新页面的innerHTML设置为之前iframe的innerHTML
			$('#page-view')[0].onload = function(){
				$('#page-view').contents().find('body').html(obj.iframeHtml);
				// 移除“页面管理”相关按钮
				$('#page-view').contents().find('.module-manage').remove();
				// 移除“添加模块”
				$('#page-view').contents().find('.manage-add').remove();
				obj.iframeMoveFn();
			};
		});
		// 布局管理按钮
		$('.btn-manage').on('click', function(event){
			// 如果已经是当前页面，不重复执行
			if ($(this).hasClass('active')) {
				return false;
			}
			$(this).addClass('active').siblings().removeClass('active');
			obj.domType = false;
			// 获得iframe中的module-ctn
			obj.iframeModuleCtn = $('#page-view').contents().find('.module-ctn');
			$(obj.iframeModuleCtn).each(function(){
				// 获得iframe中的module-ctn的module-type
				obj.iframeModuleType = $(this).attr('module-type');
				// 判断模块类型，并设置相应的内容
				switch (obj.iframeModuleType) {
					// 标题
					case 'module-title':
						obj.iframeModuleCtnHtml = '<div class="btn-del">删除</div><span>标题</span>';
					break;
					// 图片
					case 'module-pic':
						obj.iframeModuleCtnHtml = '<div class="btn-del">删除</div><span>图片</span>';
					break;
				}
				$(this).html(obj.iframeModuleCtnHtml);
			});
			// 获得iframe的body的innerHTML
			obj.iframeHtml = $('#page-view').contents().find('body').html();
			// 打开新页面
			$('#page-view').attr('src', 'custom-manage.html');
			// 当新页面加载完，将新页面的innerHTML设置为之前iframe的innerHTML
			$('#page-view')[0].onload = function(){
				$('#page-view').contents().find('body').html(obj.iframeHtml);
				// 获得iframe中的.module
				obj.iframeModuleS = $('#page-view').contents().find('.modules');
				// 插入“页面管理”相关按钮
				$(obj.iframeModuleS).each(function(){
					$(this).append('<ul class="module-manage"><li class="manage-move">移动</li><li class="manage-edit">编辑</li><li class="manage-del">删除</li></ul>');
					if ($(this).find('.module').length <=1 ) {
						$(this).find('.manage-edit').hide();
					}
				});
				// 插入“添加模块”
				$('#page-view').contents().find('.wrapper').append('<div class="manage-add">添加模块</div>');
				obj.iframeMoveFn();
			};
		});
		// 预览按钮
		$('.btn-view').on('click', function(event){
			var e = event || window.event;
			// 获得iframe的body的innerHTML,记录备份
			obj.iframeBackup = $('#page-view').contents().find('body').html();
			// 获得iframe中的module-ctn
			obj.iframeModuleCtn = $('#page-view').contents().find('.module-ctn');
			$(obj.iframeModuleCtn).each(function(){
				// 获得iframe中的module-ctn的module-type
				obj.iframeModuleType = $(this).attr('module-type');
				// 判断模块类型，并设置相应的内容
				switch (obj.iframeModuleType) {
					// 标题
					case 'module-title':
						obj.iframeModuleCtnHtml = '</div><h1>这是标题</h1>';
					break;
					// 图片
					case 'module-pic':
						obj.iframeModuleCtnHtml = '<img src="../img/slideshow1.jpg">';
					break;
				}
				$(this).html(obj.iframeModuleCtnHtml);
			});
			// 移除“提示”
			$('#page-view').contents().find('.module .tip').remove();
			// 移除“页面管理”相关按钮
			$('#page-view').contents().find('.module-manage').remove();
			// 移除“添加模块”
			$('#page-view').contents().find('.manage-add').remove();
			// 获得iframe的body的innerHTML
			obj.iframeHtml = $('#page-view').contents().find('body').html();
			// 打开新页面
			obj.previewWin = window.open("custom-preview.html");
			// 当新页面加载完，将新页面的innerHTML设置为iframe的innerHTML
			obj.previewWin.onload = function(){
				obj.previewWin.document.body.innerHTML = obj.iframeHtml;
				// 还原页面
				$('#page-view').contents().find('body').html(obj.iframeBackup);
			};
		});
		return obj;
	};
	var _custom = new custom('.module .list>li', document, '.rectangle');
});