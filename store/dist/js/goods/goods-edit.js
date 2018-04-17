define(['jquery', 'datetime'], function($){
	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	// 批次选择
	$(document).on('click', '.batch .batch-li', function () {
		var idx = $(this).index();
		$(this).addClass('active').siblings('.batch-li').removeClass('active');
		$('.batch-ctn').eq(idx).show().siblings('.batch-ctn').hide();
	});

	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	// 上传图片and预览
	$('.product-img-up').on('change', function(){
		var selfParent = $(this).closest('.product-img');
		// 可传图片上限
		var filesLenMax = (6 - $('.product-img li').length) >= 0 ? (6 - $('.product-img li').length) : 0;
		// 如果图片上限为0，则不能继续上传
		if (!filesLenMax) {
			return false;
		}
		//判断是否支持FileReader
		if (window.FileReader) {
			var fileArr = [];
			var readerArr = [];
			// 上传图片数量
			var filesLen = this.files.length;
			// 2M
			var sizeMax = 1024 * 1024 *2;
			// 图片如果达到上限，就只传到最大值
			if (filesLen > filesLenMax) {
				filesLen = filesLenMax;
			}
			for (var i = 0; i < filesLen; i++) {
				readerArr[i] = new FileReader();
				//获取文件
				fileArr[i] = this.files[i];
				//是否是图片
				if (!/^image\//.test(fileArr[i].type)) {
					alert('请选择图片文件！');
					return false;
				}
				// 是否超过2M
				if (fileArr[i].size > sizeMax) {
					alert('单张图片大小不得超过2M！')
					continue;
				}
                (function (idx) {
                    //读取完成
                    readerArr[idx].onload = function(e) {
                        // 将裁剪后的图片设置为预览图
                        selfParent.append('<li><span class="product-img-del"></span><img src="' + e.target.result + '"></li>');
                    };
                    readerArr[idx].readAsDataURL(fileArr[idx]);
                }(i));
			}
		} else {
			alret('您的设备不支持图片预览功能，如需该功能请升级您的设备！');
			return false;
		}
	});

	// 大图预览
	$(document).on('click', '.product-img img', function () {
		$('.view-img img').attr('src', $(this).attr('src'));
		$('.view-img').fadeIn('fast');
	});
	// 删除图片
	var productImg;
	$(document).on('click', '.product-img-del', function () {
		productImg = $(this).closest('li');
		$('#pop-del1').fadeIn('fast');
	});
	$('#pop-del1 .btn-yes').on('click', function () {
		productImg.remove();
		// 关闭弹窗
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	// 资质收起or展开
	$('.aptitude-head i').on('click', function () {
		var aptitudeCtn = $(this).parent().next('.aptitude-ctn');
		if (aptitudeCtn.is(':hidden')) {
			$(this).addClass('fa-angle-up').removeClass('fa-angle-down');
			aptitudeCtn.show();
		} else {
			$(this).addClass('fa-angle-down').removeClass('fa-angle-up');
			aptitudeCtn.hide();
		}
	});
	// 资质图片上传and预览
	$('.aptitude-up .aptitude-file').on('change', function(){
		var selfParent = $(this).closest('.aptitude-ctn');
		var selfInput = $(this).closest('.aptitude').find('.aptitude-input');
		var selfInputVal = '';
		//判断是否支持FileReader
		if (window.FileReader) {
			var fileArr = [];
			var readerArr = [];
			// 上传图片数量
			var filesLen = this.files.length;
			// 2M
			var sizeMax = 1024 * 1024 *2;
			if (filesLen > 20) {
				alert('批量上传一次不得超过20张图片！');
				return false;
			}
			for (var i = 0; i < filesLen; i++) {
				readerArr[i] = new FileReader();
				//获取文件
				fileArr[i] = this.files[i];
				//是否是图片
				if (!/^image\//.test(fileArr[i].type)) {
					alert('请选择图片文件！');
					return false;
				}
				// 是否超过2M
				if (fileArr[i].size > sizeMax) {
					alert('单张图片大小不得超过2M！')
					continue;
				}
				(function (idx) {
					//读取完成
					readerArr[idx].onload = function(e) {
						// 图片路径设置为读取的图片
						var imgSrc = e.target.result;
						selfParent.append('<li class="aptitude-view"><div class="aptitude-del"></div><img src="' + imgSrc + '"></li>');
					};
					readerArr[idx].readAsDataURL(fileArr[idx]);
				}(i));
			}
			//************************//
			// 后端代码
			selfInputVal += '七牛云路径' + ',';
			selfInput.attr('value', selfInputVal.substr(0, selfInputVal.length-1));
		} else {
			alret('您的设备不支持图片预览功能，如需该功能请升级您的设备！');
			return false;
		}
	});
	// 资质图片预览
	$(document).on('click', '.aptitude-view img', function () {
		$('.view-img img').attr('src', $(this).attr('src'));
		$('.view-img').fadeIn('fast');
	});
	// 资质图片删除
	var aptitudeDelDom;
	$(document).on('click', '.aptitude-del', function () {
		aptitudeDelDom = $(this).parent();
		$('#pop-del2').fadeIn('fast');
	});
	$('#pop-del2 .btn-yes').on('click', function () {
		aptitudeDelDom.remove();
		// 关闭弹窗
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	// 关闭大图预览
	$('.view-img').on('click', function () {
		$(this).fadeOut('fast');
	});

	// 存草稿
	$('.btn-group .btn-save').on('click', function () {
		console.log('保存成功');
	});
	// 提交
	$('.btn-group .btn-submit').on('click', function () {
		// 采购方式，先聚焦，触发其输入框的相关事件
		$('.purchase-opt .active input').focus();
		$('.purchase-opt .active input').blur();
		if ($('.verify-empty').length <= 0) {
			alert('提交成功！');
		}
	});
	// 返回
	$('.btn-group .btn-back').on('click', function () {
		window.history.back();
	});

});