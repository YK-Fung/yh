define(['jquery', 'yhw-nav2', 'yhw-header2', 'yhw-topbar2', 'yhw-sidebar2','ie-tip'], function($){
	var objArg = {
		// 是否显示大图
		isView: false,
		// 画布
		canvas: $('.goods-show .big-pic')[0],
		canvasW: $('.goods-show .big-pic')[0].width,
		canvasH: $('.goods-show .big-pic')[0].height
	}
	
	// 鼠标进去移动区域，开始放大镜效果，并显示小方块
	$('.goods-show .pic').on('mouseenter', function (event) {
		objArg.isView = true;
		$('.goods-show .move').show();
	});

	$('.goods-show .pic').on('mousemove', function (event) {
		var moveArg = {
			// 移动小方块的宽度的一半
			moveW: parseInt($('.goods-show .move').width(), 10) / 2,
			moveH: parseInt($('.goods-show .move').height(), 10) / 2,
			// 移动范围的位置
			offsetX: $('.goods-show .pic').offset().left+1,
			offsetY: $('.goods-show .pic').offset().top+1,
			//图片的位置
			imgOffsetX : $('.goods-show img').offset().left,
			imgOffsetY : $('.goods-show img').offset().top,
			// 移动边界
			minX: 0,
			maxX: $('.goods-show .pic').width() - parseInt($('.goods-show .move').width(), 10),
			minY: 0,
			maxY: $('.goods-show .pic').height() - parseInt($('.goods-show .move').height(), 10),
			// 获取坐标
			getMousePos: function (event) {
				var e = event || window.event;
				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				var posX = (e.pageX || e.clientX + scrollX) - moveArg.offsetX - moveArg.moveW;
				var posY = (e.pageY || e.clientY + scrollY) - moveArg.offsetY - moveArg.moveH;
				// 如果移动到了边界，值不再变化
				posX < moveArg.minX ? posX = moveArg.minX : posX = posX;
				posX > moveArg.maxX ? posX = moveArg.maxX : posX = posX;
				posY < moveArg.minY ? posY = moveArg.minY : posY = posY;
				posY > moveArg.maxY ? posY = moveArg.maxY : posY = posY;
				// console.log(`${posX}-${posY}`);
				return { 'moveX': posX, 'moveY': posY };
			}
		};
		if (objArg.isView) {
			if (objArg.canvas.getContext) {
				var e = event || window.event;
				// 小方块移动
				$('.move').css({
					top: moveArg.getMousePos(e).moveY,
					left: moveArg.getMousePos(e).moveX
				});
				// 获取图片原大小
				var imgSrc = $(this).find('img').attr('src');
				var imgObj = new Image();
				imgObj.src = imgSrc;
				// 获取缩放比例
				var scale = imgObj.width / $(this).find('img').outerWidth(true);
				// 画笔
				var ctx = objArg.canvas.getContext('2d');

				//新建原图画布
				var newCanvas = document.createElement('canvas');
				newCanvas.width = $(this).width() * scale;
				newCanvas.height = $(this).height() * scale;
				//新建原图画笔
				var newCtx = newCanvas.getContext('2d');
				//清空像素
				newCtx.clearRect(0,0,newCanvas.width,newCanvas.height);
				//绘制新的原图
				newCtx.drawImage($('.goods-show img')[0] , 0 , 0 , imgObj.width , imgObj.height , (moveArg.imgOffsetX - moveArg.offsetX) * scale , (moveArg.imgOffsetY - moveArg.offsetY) * scale , imgObj.width , imgObj.height);

				//清空像素
				ctx.clearRect(0,0,objArg.canvasW,objArg.canvasH);
				//绘制出放大后的图片
				ctx.drawImage(newCanvas , moveArg.getMousePos(e).moveX * scale, moveArg.getMousePos(e).moveY * scale, 100 * scale, 100 * scale, 0, 0, 338, 338);
			} else {
				alert('您的设备不支持该功能!');
			}
			// 如果画布还没有显示，则显示出来
			if ($('.goods-show .big-pic').is(':hidden')) {
				$('.goods-show .big-pic').show();
			}
		}
	});

	// 鼠标离开移动区域，关闭放大镜效果，并隐藏小方块
	$('.goods-show .pic').on('mouseleave', function (event) {
		objArg.isView = false;
		$('.goods-show .move').hide();
		$('.goods-show .big-pic').hide();
	});

	//收藏
	$('.collect .star').click(function() {
		var num = $(this).siblings('.num').children('i');//收藏数量
		if($(this).hasClass('active')){
			//取消收藏
			$(this).removeClass('active');
			num.text(parseInt(num.text())-1);
		}else {
			//收藏
			$(this).addClass('active');
			num.text(parseInt(num.text())+1);
		}
	});

	//商品信息纠错
	$('.message-pop').click(function() {
		$('#massage-error').show();
	});

	//弹窗-商品信息纠错
	$('#massage-error .radio').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		$(this).find('input').prop('checked', true);
		$(this).siblings().find('input').prop('checked', false);
		console.log($("#massage-error input[type='radio']:checked").val());
	});

	//提交商品信息纠错
	$('#massage-error .btn-yes').click(function() {
		//成功執行
		$('#massage-error').hide();
		$('#succeed-tip').show();
	});

	//关闭弹窗
	$('.pop-shade .header-close').click(function() {
		$(this).closest('.pop-shade').hide();
	});

	//批次
	$('.batch li').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		$(this).find('input').prop('checked', true);
		$(this).siblings().find('input').prop('checked', false);
		console.log($(".batch input[type='radio']:checked").val());
	});

	//采购方式
	$('.cg-way li').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		$(this).find('input').prop('checked', true);
		$(this).siblings().find('input').prop('checked', false);
		console.log($(".cg-way input[type='radio']:checked").val());
	});

	// 数量调整-增加
	$('.buy-num .amount-add').on('click', function () {
		var input = $(this).siblings('.amount-num');
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= 999999) {
			newVal = 999999;
		}
		input.val(newVal);
	});

	// 数量调整-减少
	$('.buy-num .amount-reduce').on('click', function () {
		var input = $(this).siblings('.amount-num');
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) - 1;
		if (newVal <= 1) {
			newVal = 1;
		}
		input.val(newVal);
	});

	// 数量调整-输入
	$('.buy-num .amount-num').on('input propertychange', function () {
		// 新的val值，如果有非数字都替换成空
		var newVal = $(this).val().replace(/[^\d.]/g, '');
		if (parseInt(newVal, 10) <= 1) {
			newVal = 1;
		}
		if (newVal.length > 6) {
			newVal = newVal.substr(0, 6);
		}
		$(this).val(newVal);
	});

	//配送说明
	$('.logistics .tit').hover(function() {
		$(this).find('.txt').show();
	}, function() {
		$(this).find('.txt').hide();
	});

	//说明书切换
	$('.toogle-ctn .title').on('click', 'li', function() {
		var Index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.toogle-ctn .for-ctn .toogle-li').eq(Index).addClass('active').siblings().removeClass('active');
	});


	//展示图片的切换
	$('.pic-toggle li').mouseenter(function() {
		$(this).addClass('active').siblings().removeClass('active');
		var imgSrc = $(this).find('img').attr('src');
		$('.goods-show .pic img').attr('src',imgSrc);
	});
});

