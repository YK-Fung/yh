define(['jquery', 'bar-slider', 'bar-header','ie-tip'], function($){

		// 企业LOGO上传and预览
		$('.logo-up').on('change', function(){
			var _self = $(this);
	        //判断是否支持FileReader
	        if (window.FileReader) {
	            var reader = new FileReader();
	        } else {
	            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
	            return false;
	        }
	        //获取文件
	        var file = this.files[0];
	        console.log(file);
	        var imageType = /^image\//;
	        //是否是图片
	        if (!imageType.test(file.type)) {
	            alert("请选择图片！");
	            return false;
	        }
	        //读取完成
	        reader.onload = function(e) {
	            // 图片路径设置为读取的图片
	            _self.closest('.form-ctn').find('img').attr('src', e.target.result);
	            _self.closest('.form-ctn').find('img').show();
	        };
	        reader.readAsDataURL(file);
		});

		// 店铺图上传and预览
		$(document).on('change', '.shop-img-up input', function(){
			var selfParent = $(this).closest('.shop-img-up');
			//判断是否支持FileReader
			if (window.FileReader) {
				// 2M
				var sizeMax = 1024 * 1024 *2;
				reader = new FileReader();
				//获取文件
				file = this.files[0];
				//是否是图片
				if (!/^image\//.test(file.type)) {
					alert('请选择图片文件！');
					return false;
				}
				// 是否超过2M
				if (file.size > sizeMax) {
					alert('单张图片大小不得超过2M！')
				}
				//读取完成
				reader.onload = function(e) {
					// 将裁剪后的图片设置为预览图
		            selfParent.append('<span class="shop-img-del"></span><img class="img-view" src="' + e.target.result + '">');
				};
				reader.readAsDataURL(file);
			} else {
				alret('您的设备不支持图片预览功能，如需该功能请升级您的设备！');
				return false;
			}
		});

		// 删除店铺图
		var shopImg;
		$(document).on('click', '.shop-img-del', function () {
			shopImg = $(this).closest('.shop-img-up');
			$('#pop-del').fadeIn('fast');
		});
		$('#pop-del .btn-yes').on('click', function () {
			shopImg.html('<input name"" class="" type="file" val="">');
			// 关闭弹窗
			$(this).closest('.pop-shade').fadeOut('fast');
		});

		// 大图预览
		$(document).on('click', '.img-view', function () {
			$('.view-img img').attr('src', $(this).attr('src'));
			$('.view-img').fadeIn('fast');
		});
		// 关闭大图预览
		$('.view-img').on('click', function () {
			$(this).fadeOut('fast');
		});

		// 关闭弹窗
		$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
			$(this).closest('.pop-shade').fadeOut('fast');
		});

		// banner背景色
		$('.color-set').on("blur", function () {
			var val = $(this).val();
			if ($.trim($(this).val()) != '' && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(val)) {
				$('.color-view').css('background-color', val);
			} else {
				$(this).val('#f8f8f8');
				$('.color-view').css('background-color', '#f8f8f8');
			}
		});

		// 店铺名称
		$('.len20').on('blur', function () {
			if ($(this).val().length > 20) {
				$(this).addClass('warn');
			} else {
				$(this).removeClass('warn');
			}
		});
		// 店铺标题
		$('.len30').on('blur', function () {
			if ($(this).val().length > 30) {
				$(this).addClass('warn');
			} else {
				$(this).removeClass('warn');
			}
		});
		// 二级域名
		$('.domain').on('blur', function () {
			if ($.trim($(this).val()) == '' || /^(?=.*\d+)(?=.*[A-Za-z]+)[A-Za-z0-9]{3,16}$/.test($(this).val())) {
				$(this).removeClass('warn');
			} else {
				$(this).addClass('warn');
			}
		});
		// 店铺关键字
		$('.keyword').on('blur', function () {
			if ($.trim($(this).val()) == '' || /^[\u4e00-\u9fa5/,]{1,40}$/.test($(this).val())) {
				$(this).removeClass('warn');
			} else {
				$(this).addClass('warn');
			}
		});
		// 店铺描述
		$('.len80').on('blur', function () {
			if ($(this).val().length > 80) {
				$(this).addClass('warn');
			} else {
				$(this).removeClass('warn');
			}
		});
		// 企业简介
		$('.len300').on('blur', function () {
			console.log($(this).val().length);
			if ($(this).val().length > 300) {
				$(this).addClass('warn');
			} else {
				$(this).removeClass('warn');
			}
		});


		// 保存
		$('.btn-save').on('click', function (event) {
			var e = event || window.event;
			// 必填项
			var must = false;
			var mustArr = [];
			$('.must').each(function () {
				var mustVal = $.trim($(this).val());
				if (mustVal == '') {
					$(this).addClass('warn');
				}
				mustArr.push(mustVal);
			});
			if (mustArr.indexOf('') < 0) {
				must = true;
			}
			// 判断数据是否符合要求
			if ($('.warn').length <= 0 && must) {
				alert('可以提交！');
			}
			else {
				$('#pop-warn').fadeIn('fast');
			}
			e.preventDefault();
		});
		// 关闭弹窗
		$('#pop-warn .btn-yes').on('click', function () {
			$(this).closest('.pop-shade').fadeOut('fast');
		});

});