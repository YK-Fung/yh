var edit;
define(['jquery'],function($){
	edit = function(targetEl,moveRange,moveEl,zIndex){
		var obj = {
			// 鼠标点击的目标
			'targetEl':targetEl,
			// 移动的范围
			'moveRange': moveRange,
			// 移动的提示语、宽、高
			'moveEl':moveEl,
			'moveElW':'',
			'moveElH':'',
			ajaxFn: function () {

			}
		}

		// 切换左侧导航
		$(document).on('click', '.box .toggle-ctn',function() {
			if($(this).parent('.box').hasClass('cur')){
				$(this).parent('.box').removeClass('cur');
			}else {
				$(this).parent('.box').addClass('cur').siblings('.box').removeClass('cur');
			}
		});

		// 失焦取消菜单选中
        $(document).on('click', function() {
            $(obj.targetEl).removeClass('active');
        });

		// 移动模块
		//鼠标按下
		$(document).on('mousedown', obj.targetEl, function(event) {
			var e = event || window.event;
			obj.source = $(this)
			// 鼠标按下，改为true
			obj.isDown = true;
			//获取该html
			obj.moduleHtml = obj.source.parent().clone();
			//获取内容
			obj.moduleText = obj.source.val();
			// 赋值给提示语
			$(obj.moveEl).text(obj.moduleText);
			//事件元素相对于窗口的X,Y坐标
			obj.offsetX = $(this).offset().left - $(window).scrollLeft();
			obj.offsetY = $(this).offset().top - $(window).scrollTop();
			// 鼠标位于对象位置的x,y轴
			obj.viewX = e.pageX - obj.offsetX;
			obj.viewY = e.pageY - obj.offsetY;
			//设置宽度
			obj.moveElW = obj.source.width()-10;
			obj.moveElH = $(obj.moveEl).height();
			// 给移动的提示语设置文字、样式、位置
			$(obj.moveEl).css({
				'width':obj.moveElW
			});

			obj.child = $(this).parent().parent().children('.box').length;
			obj.toggle = $(this).parent().parent().children('.toggle-ctn');
			e.stopPropagation();
		});

		//鼠标移动
		$(obj.moveRange).on('mousemove', function(event) {
			var e = event || window.event;
			if(obj.isDown){
				// 获取需要移动后的坐标并设置。
				obj.moveX = e.pageX - obj.viewX;
				obj.moveY = e.pageY - obj.viewY;
				// 获取需要移动后的坐标并设置。
				obj.set = setTimeout(function(){
					$(obj.moveEl).css({
						'display':'block',
						'top':obj.moveY,
						'left':obj.moveX
					})
				},100)

				//判断移动的对象是一级菜单还是二级菜单
				if(obj.source.hasClass('one')){
					//一级菜单
					obj.isparent = true;
				}else if(obj.source.hasClass('two')){
					//二级菜单
					obj.isparent = false;
				}

				//碰撞检测,在目标添加活动状态
				$(obj.targetEl).each(function() {
					obj.moveT = $(obj.moveEl).offset().top - $(window).scrollTop();
					obj.tarT = $(this).offset().top - $(window).scrollTop();
					obj.moveB = obj.moveT + obj.moveElH;
					obj.tarB = obj.tarT + $(this).height();
					obj.moveL = $(obj.moveEl).offset().left - $(window).scrollLeft();
					obj.tarL = $(this).offset().left - $(window).scrollLeft();
					obj.moveR = obj.moveL+obj.moveElW;
					obj.tarR = obj.tarL + $(this).width();
					//拖动元素是二级菜单情况下
					if(!obj.isparent){
						//内移
						if (obj.moveT+5 >= obj.tarT && obj.moveB-5 <= obj.tarB && obj.moveL >= obj.tarL && obj.moveR <= obj.tarR) {
							//碰撞目标是一级菜单 可跨级拖动
							if($(this).hasClass('one')){
								$(this).addClass('intrue');
							}
						}
						//下移
						else if (obj.moveT-15 <= obj.tarT && obj.moveB-5 >= obj.tarB && obj.moveR-20 <= obj.tarR+20) {
							//如果拖动的元素是二级菜单
							if($(this).hasClass('two')){
								//碰撞目标也必须是二级菜单
								$(this).addClass('after-true');
							}
						}
						//上移
						else if (obj.moveT+5 <= obj.tarT && obj.moveB+15 >= obj.tarB && obj.moveR-20 <= obj.tarR+20) {
							//如果拖动的元素是二级菜单
							if($(this).hasClass('two')){
								//碰撞目标也必须是二级菜单
								$(this).addClass('before-true');
							}
						}
						//条件不成立
						else {
							$(this).removeClass('intrue after-true before-true');
						}
					}
					//拖动元素是一级菜单情况下
					else {
						//下移
						if (obj.moveT-15 <= obj.tarT && obj.moveB-5 >= obj.tarB && obj.moveR-20 <= obj.tarR+20) {
							if($(this).hasClass('one')){
								//碰撞目标也必须是一级菜单
								$(this).addClass('after-true');
							}
						}
						//上移
						else if (obj.moveT+5 <= obj.tarT && obj.moveB+15 >= obj.tarB && obj.moveR-20 <= obj.tarR+20) {
							if($(this).hasClass('one')){
								//碰撞目标也必须是一级菜单
								$(this).addClass('before-true');
							}
						}
							else {
							$(this).removeClass('intrue after-true before-true');
						}
					}
				});
			}
			e.stopPropagation();
		});

		//鼠标松开
		$(document).on('mouseup', function(event) {
			var e = event || window.event;
			clearTimeout(obj.set);
			// 鼠标松开，改为false
			obj.isDown = false;
			// 碰撞检测,在目标dom插入对应内容
			$(obj.targetEl).each(function() {
				obj.moveT = $(obj.moveEl).offset().top - $(window).scrollTop();
				obj.tarT = $(this).offset().top - $(window).scrollTop();
				obj.moveB = obj.moveT + obj.moveElH;
				obj.tarB = obj.tarT + $(this).height();
				obj.moveL = $(obj.moveEl).offset().left - $(window).scrollLeft();
				obj.tarL = $(this).offset().left - $(window).scrollLeft();
				obj.moveR = obj.moveL+obj.moveElW;
				obj.tarR = obj.tarL + $(this).width();

				//拖动元素是二级菜单情况下
				if(!obj.isparent && obj.moduleHtml){
					//内移
					if (obj.moveT+5 >= obj.tarT && obj.moveB-5 <= obj.tarB && obj.moveL >= obj.tarL && obj.moveR <= obj.tarR) {
						//碰撞目标是一级菜单 可跨级拖动
						if($(this).hasClass('one')){
							//是一级菜单
							$(this).after(obj.moduleHtml);
							obj.source.parent().remove();
							//如果没有子级删除切换按钮
							if(obj.child <= 1 && $(this).val() != obj.source.val()){
								obj.toggle.remove();
							}

							//增加和移除加减icon
							if($(this).parent().children('.box').length > 0 && $(this).siblings('.toggle-ctn').length == 0){
								//当子级数量为1 添加切换按钮并且展开
								$(this).before('<i class="toggle-ctn"></i>');
								$(this).parent().addClass('cur').siblings('.box').removeClass('cur');
							}else if($(this).parent().children('.box').length > 0 && $(this).siblings('.toggle-ctn').length == 1){
								//当子级数量为多 展开内容
								$(this).parent().addClass('cur').siblings('.box').removeClass('cur');
								
							}
							/////////////////////////////////ajax/////////////////////////////////

							//移动后父级id
							var parentId = $(this).attr('data');
							obj.ajaxFn(obj.source,$(this),parentId);
						}
					}
					//下移
					else if(obj.moveT-15 <= obj.tarT && obj.moveB-5 >= obj.tarB && obj.moveR-20 <= obj.tarR+20 && obj.moveT != 0) {
						//如果拖动的元素是二级菜单
						if($(this).hasClass('two')){
							//碰撞目标也必须是二级菜单
							$(this).parent().after(obj.moduleHtml);
							obj.source.parent().remove();
							//父级对象
							var parent = obj.source.parent().parent();
							if(obj.child <= 1 && $(this).val() != obj.source.val()){
								obj.toggle.remove();
							}
							var parentId = $(this).parent('.box').siblings('input').attr('data');
							obj.ajaxFn(obj.source,parent,parentId);
							//参数（this，父级对象，父级的id）
						}
					}
					//上移
					else if (obj.moveT+5 <= obj.tarT && obj.moveB+15 >= obj.tarB && obj.moveR-20 <= obj.tarR+20 && obj.moveT != 0) {
						//如果拖动的元素是二级菜单
						if($(this).hasClass('two')){
							$(this).parent().before(obj.moduleHtml);
							obj.source.parent().remove();
							if(obj.child <= 1 && $(this).val() != obj.source.val()){
								obj.toggle.remove();
							}
							var parentId = $(this).parent('.box').siblings('input').attr('data');
							obj.ajaxFn(obj.source,parent,parentId);
							//参数（this，父级对象，父级的id）
						}
					}
				}
				//拖动元素是一级菜单情况下
				else if(obj.isparent && obj.moduleHtml){
					//下移
					if(obj.moveT-15 <= obj.tarT && obj.moveB-5 >= obj.tarB && obj.moveR-20 <= obj.tarR+20 && obj.moveT != 0) {
						if($(this).hasClass('one')){
							//碰撞目标也必须是一级菜单
							$(this).parent().after(obj.moduleHtml);
							obj.source.parent().remove();
							//父级对象
							var parent = obj.source.parent().parent();
							if(obj.child <= 1 && $(this).val() != obj.source.val()){
								obj.toggle.remove();
							}
							obj.ajaxFn(obj.source,parent,0);
							//参数（移动后的级别0 1，移动后同级全部的id，父级的id）
						}
					}
					//上移
					else if (obj.moveT+5 <= obj.tarT && obj.moveB+15 >= obj.tarB && obj.moveR-20 <= obj.tarR+20 && obj.moveT != 0) {
						if($(this).hasClass('one')){
							$(this).parent().before(obj.moduleHtml);
							obj.source.parent().remove();
							if(obj.child <= 1 && $(this).val() != obj.source.val()){
								obj.toggle.remove();
							}
							var parentId = $(this).parent('.box').siblings('input').attr('data');
							obj.ajaxFn(obj.source,parent,parentId);
							//参数（this，父级对象，父级的id）
						}
					}
				}
			});
			//清空提示语html
			obj.moduleHtml = '';
			//清空提示语内容
			obj.moduleText = '';
			//隐藏提示语
			$(obj.moveEl).hide();
			//样式移除
			$(obj.targetEl).removeClass('intrue after-true before-true');
			e.stopPropagation();
		});
		return obj;
	}
});
