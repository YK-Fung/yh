define(['jquery', 'bar-slider', 'bar-header', 'popwin', 'verify','ie-tip'], function($){
		

		// 绑定银行卡
		$('.card-add').on('click', function () {
			// 重置弹窗---每次打开都是默认显示个人账户
			$('.account-type li:eq(0)').addClass('active').siblings().removeClass('active');
			$('.account-ctn:eq(0)').show().siblings('.account-ctn').hide();
			// 显示弹窗
			$('.pop-add').popShow();
		});
		// 提交
		$('.pop-add .btn-yes').on('click', function (event) {
			var e = event || window.event;
			// 验证项
			var verify = false;
			var verifyNum = 0;
			$('.pop-body .error-tip').each(function (){
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
			if (mustArr.indexOf('') < 0) {
				must = true;
			}
			// 如果是个人账户,判断数据是否符合要求，如果是对公账户，直接跳转页面
			if ($('.account-type li:eq(0)').hasClass('active')) {
				if (verify && must) {
					alert('可以提交！');
					// 如果已经有四个li了，移除“添加银行卡”
					if ($('.card li').length >= 4) {
						$('.card-add').closest('li').remove();
					}
				}
				else {
					alert('请检查是否选项未填写以及填写的内容格式是否有误！')
				}
			} else if($('.account-certify').is(':visible')){
                //对公账户已资质认证
				window.location.href = 'bank-bundle1.html';
			}else{
				//对公账号未资质认证
                window.location.href = 'hy-firm1.html';
			}
			e.preventDefault();
		});

		// 解绑银行卡
		var cardDelSelf;
		$('.card-del').on('click', function () {
			cardDelSelf = $(this).closest('li');
			$('.pop-del').popShow();
		});
		$('.pop-del .btn-yes').on('click', function () {
			// 判断删除的是否是默认账户
			var delDefault = cardDelSelf.find('.card-default').length;
			cardDelSelf.remove();
			if (delDefault > 0) {
				$('.card li:eq(1)').find('.card-ctn').addClass('card-default');
				$('.card li:eq(1)').find('.btn-radio').addClass('active');
			}
			if ($('.card .card-add').length <= 0 ) {
				$('.card').prepend('<li><div class="li-ctn"><a class="card-ctn card-add">添加银行卡</a></div></li>');
			}
			$(this).closest('.pop-shade').popHide();
		});

		// 默认账号选择
		$('.btn-radio').on('click', function () {
			if (!$(this).hasClass('active')) {
				$('.btn-radio').removeClass('active');
				$(this).addClass('active');
				$('.card-default').removeClass('card-default');
				$(this).prev('.card-ctn').addClass('card-default');
			}
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

            //根据账户类型和是否资质认证改变按钮的文字
           if(idx == 1 && $('.account-certify').is(':visible')){
           		//对公账户已认证
				$('.btn-yes').html('马上去绑定')
		   }else if(idx == 1 && $('.account-uncertify').is(':visible')){
           		//对公账户未认证
               $('.btn-yes').html('去认证')
		   }else{
           		//个人账户
               $('.btn-yes').html('提交')
		   }

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
		// 		$(this).next('.error-tip').show();
		// 	}
		// 	else{
		// 		$(this).next('.error-tip').hide();
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
		// 设置默认地址
		$('.set-default').on('click', function () {
			$(this).toggleClass('active');
			$(this).find('input').click();
		});
		$('.set-default input').on('click', function (event) {
			var e = event || window.event;
			e.stopPropagation();
		});

});