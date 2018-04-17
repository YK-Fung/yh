define(['jquery', 'bar-slider', 'bar-header','ie-tip'], function($){

	//展开收起内容
	$('.arrow').click(function() {
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).closest('.type-name').next('.toggle-ctn').removeClass('active');
		}else {
			$(this).addClass('active');
			$(this).closest('.type-name').next('.toggle-ctn').addClass('active');
		}
	});

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-yes,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});

	//单选框切换
	$('.radio').click(function() {
		$(this).addClass('active').parent().siblings().find('.radio').removeClass('active');
		$(this).children('input').prop('checked', true);
		$(this).parent().siblings().find('input').prop('checked', false);
	});

	//取消订单弹窗
	$(document).on('click', '.cancel-order', function() {
		$('#pop-cancel-order .btn-yes').attr('data', 'cancel-order-confirm');
		$('#pop-cancel-order').show();
	});

	//确认收款
	$(document).on('click', '.confirm-gathering', function() {
		// 检查是否收到全款，否，提示【请先上传转账凭据！】，是，提示【确认收到所有货款？】
		
		// $('#pop-tip-txt .ctn-txt').text('请先上传转账凭据！');
		// $('#pop-tip-txt .btn-yes').attr('data', '');

		$('#pop-tip-txt .ctn-txt').text('确认收到所有货款？');
		$('#pop-tip-txt .btn-yes').attr('data', 'confirm-gathering');
		$('#pop-tip-txt').show();
	});

	//确认收款立即发货
	$(document).on('click', '.immediately-deliver', function() {
		$('#pop-immediately-deliver .btn-yes').attr('data', 'immediately-deliver-confirm');
		$('#pop-immediately-deliver').show();
	});


	//补全凭证 弹窗
	$(document).on('click', '.onload-proof', function() {
		$('#pop-onload-proof .btn-yes').attr('data', 'onload-proof-confirm');
		$('#pop-onload-proof input').val('');
		$('#pop-onload-proof img').attr('src', '');
		$('#pop-onload-proof .file-img').addClass('img-add');
		$('#pop-onload-proof').show();
	});

	//文本失焦
	$('#pop-onload-proof .txt').on('blur', function() {
		 addActive();
	});

	//点击上传图片
	$(document).on('click', '.file-img', function() {
		$(this).find('.img-onload').click();
	});

	$(document).on('click', '.file-img .img-onload',function (event) {
		var e = event || window.event;
		e.stopPropagation();
	});

	// 上传图片and预览
	var imgSrc;
	$(document).on('change', '.file-img .img-onload', function(){
		var self = $(this).closest('.file-img');
		//判断是否支持FileReader
		if (window.FileReader) {
		    var reader = new FileReader();
		} else {
			alert('您的设备不支持图片预览功能，如需该功能请升级您的设备！');
		    return false;
		}
		//获取文件
		var file = this.files[0];
		var imageType = /^image\//;
		//是否是图片
		if (!imageType.test(file.type)) {
			alert('请选择图片文件！')
		    return false;
		}
		//读取完成
		reader.onload = function(e) {
			// 图片路径设置为读取的图片
			imgSrc = e.target.result;
			self.find('img').attr('src', imgSrc);
			// 移除img-add
			self.removeClass('img-add');
			addActive();
		};
		reader.readAsDataURL(file);
	});

	function addActive(){
		var sum = $('#pop-onload-proof .txt').val();
		if(sum && imgSrc){
			$('#pop-onload-proof .btn-yes').addClass('active');
		}else {
			$('#pop-onload-proof .btn-yes').removeClass('active');
		}
	}

	//删除图片
	var _this;
	$(document).on('click', '.delete-icon', function(event) {
		var e = event || window.event;
		_this = $(this);
		$('#pop-tip-txt .ctn-txt').text('确定要删除图片吗？');
		$('#pop-tip-txt .btn-yes').attr('data', 'delete-confirm');
		$('#pop-tip-txt').show();
		e.stopPropagation();
	});

	//查看图片
	$(document).on('click', '.certificate .proof-list li', function() {
		var srcPhoto = $(this).find('img').attr('src');	
		if(srcPhoto){
			$('.check-photo img').attr('src', srcPhoto);
			$('.check-photo').show();
		}
	});

	//关闭查看图片
	$('.check-photo .close').click(function() {
		$(this).parent().hide();
	});

	//确定提示框按钮
	$('.pop-shade .btn-yes').on('click', function() {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'cancel-order-confirm':
				//取消订单
				console.log('取消订单');
				break;
			case 'immediately-deliver-confirm':
				//立即发货
				console.log('立即发货');
				break;
			case 'confirm-gathering':
				//确认收款
				console.log('确认收款');
				break;
			case 'delete-confirm':
				//删除图片
				_this.closest('li').remove();
				break;
			case 'onload-proof-confirm':
				//补全凭证
				if($(this).hasClass('active')){
					var sum = $(this).closest('#pop-onload-proof').find('.txt').val();
					$('.proof-list').append('<li><div class="img"><img src="'+imgSrc+'"><div class="magnifying-icon"></div><span class="delete-icon"></span></div><p class="sum">本次转账￥<span>'+sum+'</span></p></li>')
				}
				break;
		}
	});
});