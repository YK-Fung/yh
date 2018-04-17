define(['jquery', 'bar-slider', 'bar-header', 'popwin', 'ie-tip'], function($){

		//银行卡户名显示的内容
		$('.input-name').val($('.form-group:eq(0) p').html())
    	// 手机输入框
		$('.input-mobile').on('blur', function (){
			if ($(this).val() != '' && !( /^1[0-9]{10}$/.test($(this).val()))) {
				$(this).closest('.form-group').find('.error-tip').show();
			}
			else{
				$(this).closest('.form-group').find('.error-tip').hide();
			}
		});
		// 银行账号
		$('.input-bank').on('blur', function (){
			if ($(this).val() != '' && !(/^([1-9]{1})(\d{14}|\d{18})$/.test($(this).val()))) {
				$(this).closest('.form-group').find('.error-tip').show();
			}
			else{
				$(this).closest('.form-group').find('.error-tip').hide();
			}
		});
		// 银行卡户名
		// $('.input-name').on('blur', function (){
		// 	if ($(this).val() != '' && !(/^([\u4e00-\u9fa5]{2,5}|[A-z]{1,26})$/.test($(this).val()))) {
		// 		$(this).closest('.form-group').find('.error-tip').show();
		// 	}
		// 	else{
		// 		$(this).closest('.form-group').find('.error-tip').hide();
		// 	}
		// });
		// 开户网点
		$('.input-wd').on('blur', function (){
			if ($(this).val() != '' && !(/^[\u4e00-\u9fa5]{2,}$/.test($(this).val()))) {
				$(this).closest('.form-group').find('.error-tip').show();
			}
			else{
				$(this).closest('.form-group').find('.error-tip').hide();
			}
		});
		// 工商注册号
		// $('.input-gs').on('blur', function (){
		// 	if ($(this).val() != '' && !(/^[a-zA-Z0-9\u4e00-\u9fa5]{1,}$/.test($(this).val()))) {
		// 		$(this).closest('.form-group').find('.error-tip').show();
		// 	}
		// 	else{
		// 		$(this).closest('.form-group').find('.error-tip').hide();
		// 	}
		// });

		// 绑定银行卡
		$('.card-add').on('click', function () {
			$('.account-ctn:eq(0)').show();
			$('.pop-add').popShow();
		});

		// 弹窗控制
		$('.header-close, .pop-footer .btn-no').on('click', function () {
			$(this).closest('.pop-shade').popHide();
		});

		// 绑定账户类型
		$('.account-type li').on('click', function () {
			var idx = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$('.account-ctn').eq(idx).show().siblings('.account-ctn').hide();
		});

		//下拉列表切换
		$('.select-box .select-choice').on('click', function(event) {
			var e = event || window.event;
			//其它下拉隐藏
			$('.select-box').removeClass('down');
			//下拉效果切换
			$(this).parent().addClass('down');
			//停止冒泡
			e.stopPropagation();
		});
		// 鼠标点击离开来目标，菜单栏隐藏
		$(document).on('click', function() {
			$('.select-box').removeClass('down');
		});
		//下拉菜单停止冒泡
		$('.select-drop').on('click',function(event) {
			var e = event || window.event;
			e.stopPropagation();
		});
		//地址选中下拉选项
		$('.select-box .select-drop').on('click', 'li', function() {
			var _txt = $(this).text();
			//添加选中select值
			$(this).closest('.select-box').find('.select-chosen').val($(this).text());
			//隐藏下拉列表
			$(this).closest('.select-box').removeClass('down');
		});
		// 收货人输入框
		// $('.consignee').on('blur', function (){
		// 	if ($(this).val() != '' && $(this).val().length > 25) {
		// 		$(this).closest('.form-group').find('.error-tip').show();
		// 	}
		// 	else{
		// 		$(this).closest('.form-group').find('.error-tip').hide();
		// 	}
		// });
		// 固话输入框
		// $('.input-num').on('blur', function (){
		// 	var inputNum = $('.form-ctn .qh').val() + '-' + $('.form-ctn .phone-num').val() + '-' + $('.form-ctn .fj').val();
		// 	if ($(this).val() != '' && !(/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/.test(inputNum))) {
		// 		$(this).closest('.form-ctn').find('.error-tip').show();
		// 	}
		// 	else{
		// 		$(this).closest('.form-ctn').find('.error-tip').hide();
		// 	}
		// });
		// 发送验证码
	    var codeTime;
	    $(document).on('click', '.btn-code', function () {
	        if ($(this).hasClass('active')) {
	            // 移除活动样式
	            $(this).removeClass('active');
	            var _self = $(this);
	            var num = 10;
	            _self.text(num + 's');
	            codeTime = setInterval(function () {
	                num--;
	                _self.text(num + 's');
	                if (num <= 0) {
	                    clearInterval(codeTime);
	                    _self.text('发送验证码');
	                    _self.addClass('active');
	                }
	            }, 1000);
	        }
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
					selfParent.find('input').val('');
					alert('请选择图片文件！');
					return false;
				}
				// 是否超过2M
				if (file.size > sizeMax) {
					selfParent.find('input').val('');
					alert('单张图片大小不得超过2M！');
				}
				//读取完成
				reader.onload = function(e) {
					// 将裁剪后的图片设置为预览图
		            selfParent.append('<span class="shop-img-del"></span><img class="img-view" src="' + e.target.result + '">');
				};
				reader.readAsDataURL(file);
			} else {
				selfParent.find('input').val('');
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
			shopImg.html('<input name="" class="must" type="file" val="">');
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

		// 设置默认地址
		$('.set-default').on('click', function () {
			$(this).toggleClass('active');
			$(this).find('input').click();
		});
		$('.set-default input').on('click', function (event) {
			var e = event || window.event;
			e.stopPropagation();
		});

		// 提交
		$('.step1-ctn .btn-submit').on('click', function (event) {
			var e = event || window.event;
			// 验证项
			var verify = false;
			var verifyNum = 0;
			$('.step1-ctn .error-tip').each(function (){
				if( $(this).is(':hidden') ){
					verifyNum ++;
				}
			});
			if (verifyNum == $('.error-tip').length) {
				verify = true;
			}
			// 必填项
			var must = false;
			var mustArr = [];
			$('.must').each(function () {
				var mustVal = $.trim($(this).val());
				mustArr.push(mustVal);
			});
			console.log(mustArr);
			if (mustArr.indexOf('') < 0) {
				must = true;
			}
			// 判断数据是否符合要求
			if (verify && must) {
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