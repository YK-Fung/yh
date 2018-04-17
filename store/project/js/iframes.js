;(function($){
	// 第一块内容块显示
	$('.ctn').eq(0).show();
	// 顶部导航点击相关事件
	var navFn = (function(){
		// 点击事件
		$(document).on('click', '.nav li', function(){
			var navLiW = $('.nav li').width();
			var idx = $(this).index();
			var slideMove = navLiW * idx;
			// 相关动画
			$(this).addClass('active').siblings().removeClass('active');
			$('.slide-border').animate({
				'left': slideMove
			}, 100);
			// 相关内容块
			$('.ctn').eq(idx).show().siblings('.ctn').hide();
			// ellipsis();
			// 代码提示框隐藏
			$('.code').hide();
		});
	}());
	// 列表操作相关事件
	var modalFn = (function(){
		// 操作
		$(document).on('click', '.ctn .fa-edit, .btn-add', function(){
			$('#edit-add').modal('show');
		});
		// 启用授权
		$(document).on('click', '.ctn tbody .btn', function(){
			if ($(this).hasClass('btn-success')) {
				$(this).removeClass('btn-success').addClass('btn-default');
				$(this).text('已停用');
			}
			else {
				$(this).removeClass('btn-default').addClass('btn-success');
				$(this).text('已启用');
			}
		});
		// 日期控件 http://www.bootcss.com/p/bootstrap-datetimepicker/
		$(document).on('click', '.date-start', function(){
			$('.date-start').datetimepicker('show');
		});
		$(document).on('click', '.date-end', function(){
			$('.date-end').datetimepicker('show');
		});
	}());
	// 分站管理相关事件
	var substationFn = (function(){
		// 分站管理按钮
		$(document).on('click', '.substation-btn .btn', function(){
			$(this).addClass('btn-primary').siblings().removeClass('btn-primary');
		});
		// 分站管理新增分站按钮
		$(document).on('click', '#substation .btn-add', function(){
			$('#edit-add').modal('show');
		});
	}());
	// 上传图片相关功能
	var uploadImgFn = (function(){
		var clipObj = {};
		var imgUpload;
		// 上传图片按钮
		$(document).on('click', '.btn-upload-start', function(){
			imgUpload = $(this).closest('.form-group').find('.img-upload');
			$('#upload').modal('show');
		});
		// 选择文件按钮
		$(document).on('click', '.btn-select', function(){
			$('.select-file').click();
		});
		// 上传图片and预览
		$(document).on('change', '.select-file', function(){
			$('.img-no').hide().siblings('.img-has').show();
			// 预览图片
	        //判断是否支持FileReader
	        if (window.FileReader) {
	            var reader = new FileReader();
	        } else {
	            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
	            return false;
	        }
	        //获取文件
	        var file = this.files[0];
	        var imageType = /^image\//;
	        //是否是图片
	        if (!imageType.test(file.type)) {
	            alert("请选择图片！");
	            return false;
	        }
	        //读取完成
	        reader.onload = function(e) {
	        	// 裁剪and移动and调整大小
	        	clipObj.clipFn = function(){
		        	// 获得图片原始大小
		        	clipObj.sourceImg = new Image();
		        	clipObj.sourceImg.src = clipObj.targetResult;
		        	clipObj.sourceImgW = clipObj.sourceImg.width;
		        	clipObj.sourceImgH = clipObj.sourceImg.height;
		            // 获取图片的位置和宽高
		            clipObj.webImgW = parseInt($('.img-has img').outerWidth(true), 10);
		            clipObj.webImgH = parseInt($('.img-has img').outerHeight(true), 10);
		            // 缩放比例
		            clipObj.scale = clipObj.sourceImgW / clipObj.webImgW;
		            // 设置遮罩层的位置和宽高
		            $('.img-has .shade').css({
		            	'width': clipObj.webImgW,
		            	'height': clipObj.webImgH
		            });
		            // 裁剪图片
		            // 操作框的宽高和位置
		            clipObj.opL = $('.img-has .operation').position().left;
		            clipObj.opT = $('.img-has .operation').position().top;
		            clipObj.opW = parseInt($('.img-has .operation').width(), 10);
		            clipObj.opH = parseInt($('.img-has .operation').height(), 10);
		            // 设置canvas
					clipObj.canvas = $('#canvas')[0];
					clipObj.canvas.width = clipObj.opW;
					clipObj.canvas.height = clipObj.opH;
					clipObj.ctx = canvas.getContext("2d");
					// 绘制图形并裁剪
					clipObj.ctx.drawImage(
						clipObj.sourceImg, 
						clipObj.opL * clipObj.scale, 
						clipObj.opT * clipObj.scale, 
						clipObj.opW * clipObj.scale, 
						clipObj.opH * clipObj.scale, 
						0, 
						0, 
						clipObj.opW, 
						clipObj.opH
					);
					// 给图片src设置为裁剪后的图
					$(document).on('click', '.img-has .btn-upload-end', function(){
						imgUpload.attr('src', canvas.toDataURL());
						$('.img-has').hide().siblings('.img-no').show();
						$('#upload').modal('hide');
						$('.modal').css('overflow-y', 'auto');
					})
					// 移动裁剪框
					// 鼠标按下
					$(document).on('mousedown', '.operation', function(e){
						clipObj.opMove = true;
						clipObj.opStartX = e.pageX;
						clipObj.opStartY = e.pageY;
						clipObj.opL = parseInt($(this).css('left'), 10);
						clipObj.opT = parseInt($(this).css('top'), 10);
					});
					// 鼠标移动
					$(document).on('mousemove', '.operation', function(e){
						if(clipObj.opMove){
							clipObj.opMoveX = clipObj.opL + (e.pageX - clipObj.opStartX);
							clipObj.opMoveY = clipObj.opT + (e.pageY - clipObj.opStartY);
							$(this).css({
								'left': clipObj.opMoveX,
								'top': clipObj.opMoveY
							});
							clipObj.ctx.drawImage(
								clipObj.sourceImg, 
								clipObj.opMoveX * clipObj.scale, 
								clipObj.opMoveY * clipObj.scale, 
								clipObj.opW * clipObj.scale, 
								clipObj.opH * clipObj.scale, 
								0, 
								0, 
								clipObj.opW, 
								clipObj.opH
							);
						}
					});
					// 鼠标松开
					$(document).on('mouseup', '.operation', function(){
						clipObj.opMove = false;
					});
					// 调整大小
					// 鼠标按下
					$(document).on('mousedown', '.resize', function(e){
						clipObj.resize = true;
						clipObj.resizeStartX = e.pageX;
						clipObj.resizeStartY = e.pageY;
						clipObj.opW = parseInt($('.img-has .operation').width(), 10);
			        	clipObj.opH = parseInt($('.img-has .operation').height(), 10);
			        	clipObj.opL = parseInt($('.img-has .operation').css('left'), 10);
						clipObj.opT = parseInt($('.img-has .operation').css('top'), 10);
						e.stopPropagation();
					});
					// 鼠标移动
					$(document).on('mousemove', '.shade', function(e){
						if(clipObj.resize){
							clipObj.resizeMoveX = e.pageX - clipObj.resizeStartX;
							clipObj.resizeMoveY = e.pageY - clipObj.resizeStartY;
							clipObj.opMoveX = clipObj.opL - clipObj.resizeMoveX / 2
							clipObj.opMoveY = clipObj.opT - clipObj.resizeMoveY / 2
							clipObj.resizeW = clipObj.opW * (1 + clipObj.resizeMoveX / clipObj.opW);
							clipObj.resizeH = clipObj.opH * (1 + clipObj.resizeMoveY / clipObj.opH);
							$('.operation').css({
								'left': clipObj.opMoveX,
								'top': clipObj.opMoveY,
								'width': clipObj.resizeW,
								'height': clipObj.resizeH
							});
							canvas.width = clipObj.resizeW,
							canvas.height = clipObj.resizeH,
							clipObj.ctx.drawImage(
								clipObj.sourceImg, 
								clipObj.opMoveX * clipObj.scale, 
								clipObj.opMoveY * clipObj.scale, 
								clipObj.resizeW * clipObj.scale, 
								clipObj.resizeH * clipObj.scale, 
								0, 
								0, 
								clipObj.resizeW, 
								clipObj.resizeH
							);
						}
					});
					// 鼠标松开
					$(document).on('mouseup', '.shade', function(e){
						clipObj.resize = false;
					});
            	};
	            // 图片路径设置为读取的图片
	            clipObj.targetResult = e.target.result;
	            $('.img-has img').attr('src', clipObj.targetResult);
	            // 检测图片是否加载成功
            	if ($('.img-has img').attr('src') !== '' && $('.img-has img')[0].complete) {
            		clipObj.clipFn();
            	} else {
		            $('.img-has img').attr('src', clipObj.targetResult);
		            clipObj.setTime = setInterval(function(){
		            	if($('.img-has img').attr('src') !== '' && $('.img-has img')[0].complete) {
		            		clipObj.clipFn();
		            		clearInterval(clipObj.setTime);
		            	}
		            }, 10);
            	}
	        };
	        reader.readAsDataURL(file);
		});
	}());
}(jQuery));