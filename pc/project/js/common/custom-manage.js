define(['jquery'], function($){
	var customManage = function(targetEl, moveRange, moveEl){
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
		// 删除按钮-删除模块内容
		$(document).on('mousedown', '.module .btn-del', function(event){
			var e = event || window.event;
			// 将内容设置为初始状态，即只有模块提示的状态
			$(this).closest('.module').html(obj.tipHtml);
			e.stopPropagation(); 
		});
		// 删除按钮-删除模块
		$(document).on('mousedown', '.manage-del', function(event){
			var e = event || window.event;
			// 将一整个模块删除
			$(this).closest('.modules').remove();
			e.stopPropagation(); 
		});
		// 添加按钮-添加模块
		$(document).on('mousedown', '.manage-add', function(event){
			var e = event || window.event;
			// 添加一整个模块
			$(this).before('<div class="modules modules-1"><div class="module"><span class="tip">在此处添加模块</span></div><ul class="module-manage"><li class="manage-move">移动</li><li class="manage-del">删除</li></ul></div>');
			e.stopPropagation(); 
		});
		// 移动模块
		// 鼠标按下
		$(document).on('mousedown', obj.targetEl, function(event){
			var e = event || window.event;
			// 记录当前dom
			obj.source = $(this);
			// 鼠标按下，改为true
			obj.isDown = true;
			// 当前dom的module-type
			obj.moduleType = $(this).attr('module-type');
			// 判断模块类型，并设置相应的文字
			switch (obj.moduleType) {
				// 标题
				case 'module-title':
					obj.text = '标题';
				break;
				// 图片
				case 'module-pic':
					obj.text = '图片';
				break;
			}
			// 获取内容
			obj.moduleHtml = $(this).clone();
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
		// 鼠标移动
		$(obj.moveRange).on('mousemove', function(event){
			// 如果鼠标已经按下
			if (obj.isDown) {
				var e = event || window.event;
				// 获取需要移动后的坐标并设置。
				obj.moveX = e.pageX - 25;
				obj.moveY = e.pageY - 25;
				$(obj.moveEl).css({
					'display': 'block',
					'top': obj.moveY,
					'left': obj.moveX
				});
				// 碰撞检测,在目标添加活动状态
				$('.module').each(function(){
					obj.T = $(this).offset().top - obj.moveElH;
					obj.B = obj.T + $(this).height();
					obj.L = $(this).offset().left - obj.moveElW;
					obj.R = obj.L + $(this).width();
					if (obj.moveY > obj.T && obj.moveY < obj.B && obj.moveX > obj.L && obj.moveX < obj.R) {
						$(this).addClass('active');
					} else {
						$(this).removeClass('active');
					}
				});
			}
		});
		// 鼠标松开
		$('.rectangle').on('mouseup', function(event){
			var e = event || window.event;
			// 鼠标松开，改为false
			obj.isDown = false;
			// 碰撞检测,在目标dom插入对应内容
			$('.module').each(function(){
				obj.T = $(this).offset().top - obj.moveElH;
				obj.B = obj.T + $(this).height();
				obj.L = $(this).offset().left - obj.moveElW;
				obj.R = obj.L + $(this).width();
				if (obj.moveY > obj.T && obj.moveY < obj.B && obj.moveX > obj.L && obj.moveX < obj.R) {
					// 内容互换
					obj.source.parent().html($(this).html());
					$(this).html(obj.moduleHtml);
				}
			});
			// 重置模块类型和模块内容，隐藏小方块
			obj.moduleType = '';
			obj.moduleHtml = '';
			$('.module').removeClass('active');
			$('.rectangle').hide();
		});
		return obj;
	};
	var _customManage = new customManage('.module-ctn', window, '.rectangle');
});