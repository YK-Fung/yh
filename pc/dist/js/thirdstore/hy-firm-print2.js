define(['jquery','jquery-migrate','jquery.jqprint','bar-slider', 'bar-header','popwin','ie-tip'], function($){
	// 查看放大图片
	$('.firm-aptitude').on('click', '.img', function() {
		// 获取当前的图片路径
		var _src = $(this).find('img').attr('src');
		//资质放大弹窗
		$('.pop-shade').popShow();	
		//重置弹窗src
		$('.pop-shade').find('img').attr('src', _src);
	});
	//关闭弹窗
	$('.header-close').on('click', function() {
		$(this).closest('.pop-shade').popHide();
		$(this).closest('.pop-shade').find('img').removeAttr('style');
	});

	//选中单个产品
	$.fn.toggleCheckbox = function () {
	 this.prop("checked", !this.prop("checked"));
	};

	$('.choose').on('click', '.checkbox', function() {
		//切换attr属性
		$(this).find(':checkbox').toggleCheckbox();
		//切换样式
		$(this).toggleClass('active');
		if($('.choose input[type="checkbox"]:checked').length == $('.choose input[type="checkbox"]').length){
			//全选
			$('.all-checkbox .checkbox').addClass('active');
			$('.all-checkbox input[type="checkbox"]').prop("checked", true);
		}else {
			//取消全选
			$('.all-checkbox .checkbox').removeClass('active');
			$('.all-checkbox input[type="checkbox"]').prop("checked", false);
		}
	});

	// 全选
	$('.all-checkbox').on('click', '.checkbox', function() {
		if(!$(this).find(':checkbox').prop("checked")){
			//全选
			$(this).addClass('active');
			$('.choose .checkbox').addClass('active');
			$('.choose input[type="checkbox"]').prop("checked", true);
		}else {
			//取消全选
			$(this).removeClass('active');
			$('.choose .checkbox').removeClass('active');
			$('.choose input[type="checkbox"]').prop("checked", false);
		}
		$(this).find(':checkbox').toggleCheckbox();
	});

	// 图片设置宽高百分比
	$('.img-box').each(function() {
 		//对比宽高
 		var _width = $(this).children('img').width();
 		var _height =$(this).children('img').height();
 		if(_width > _height){
 			$(this).children('img').width('100%');
 		}else if(_height > _width){
 			$(this).children('img').height('100%');
 		}else if(_width == _height){
 			$(this).children('img').width('100%');
 		}
 	});
	// 打印图片
	$("button.btn-print").click(
		function(){
			//获取选中的图片
			var checkImg = $('.massage input:checked').closest('li').find('.img-box');
			if(checkImg.length>0){
				//打印
			 	checkImg.jqprint();
			}
		 }
	);

	//鼠标滚动图片放大缩小
	$('.pop-shade').on('mousewheel', function() {
		// 判断是否有zoom值
		if(!$(this).find('img').attr('style')){
			var zoom = 100;
		}else {
			var zoom = parseInt($(this).find('img').css('zoom')*100);
		}
		//event.wheelDelta取值情况取决于滚动鼠标的方向；
		zoom += parseInt(event.wheelDelta/12);
		if(zoom > 0){
			$(this).find('img').css('zoom', zoom+'%');
		}
		return false;
	});
});
