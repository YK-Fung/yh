define(['jquery', 'datetime', 'bar-slider', 'bar-header','ie-tip'], function($){
	 // 地址下拉框
    $('.address-select .select-choice').on('click', function(event) {
        var e = event || window.event;
        //其它下拉隐藏
        $('.address-select').removeClass('down');
        //下拉效果切换
        $(this).parent().addClass('down');
        //停止冒泡
        e.stopPropagation();
    });
    // 鼠标点击离开来目标，菜单栏隐藏
    $(document).on('click', function() {
        $('.address-select').removeClass('down');
    });
    //下拉菜单停止冒泡
    $('.address-select .select-drop').on('click',function(event) {
        var e = event || window.event;
        e.stopPropagation();
    });
    // 地区类型选择
    $('.address-select .select-type li').on('click', function () {
        // 获取索引值
        var idx = $(this).index();
        // 前面的区域已选的情况下，才可以选择再小一些的区域
        if (idx == 0 || $('.address-arr input').eq(idx - 1).val() != '') {
            // 设置活动状态，以及显示对应的内容
            $(this).addClass('active').siblings().removeClass('active');
            $('.select-type-ctn .type-main').eq(idx).show().siblings('.type-main').hide();
        }
    });
    // 地区选择
    $('.address-select .zm-ctn li').on('click', function () {
        // 获取索引值
        var idx = $(this).closest('.type-main').index();
        // 如果是之前选择的，则不向下执行
        if ($(this).hasClass('active')) {
            return false;
        }
        // 清除其他的活动状态，给当前添加活动状态
        $(this).closest('.type-main').find('.active').removeClass('active');
        $(this).addClass('active');
        // 设置并获取相应的text
        $('.address-arr input').eq(idx).attr('value', $(this).text() + '/');
        $('.address-arr input').eq(idx).nextAll('input').attr('value', '');
        var addressText = '';
        $('.address-arr input').each(function () {
            addressText += $(this).attr('value');
        });
        // 设置省市的值
        $(this).closest('.address-select').find('.select-chosen').val(addressText.substr(0, addressText.length-1));
        // 显示下一级地区,如果已经是最后一级了则隐藏下拉列表
        if (idx == $('.select-type li').length - 1) {
            $('.address-select').removeClass('down');
            return false;
        }
        // 地区类型切换
        $(this).closest('.select-drop').find('.select-type li').removeClass('active');
        $(this).closest('.select-drop').find('.select-type li').eq(idx + 1).addClass('active');
        // 内容切换
        $(this).closest('.select-drop').find('.type-main').hide();
        $(this).closest('.select-drop').find('.type-main').eq(idx + 1).show();
    });

	// 企业角色选择
	$('.firm-role li').on('click', function () {
		var idx = $(this).index();
		// 交互效果
		$(this).addClass('active').siblings('li').removeClass('active');
		//切换企业类型数据
		

	});
	// 企业类型选项
	$('.firm-type li').on('click', function () {
		if($('.firm-role li').hasClass('active')){
			var idx = $(this).index();
			// 交互效果
			$(this).addClass('active').siblings('li').removeClass('active');
			//切换企业类型数据
		}
	});

	// 机构类型
	$('.organ-type li').on('click', function () {
		if($('.firm-type li').hasClass('active')){
			var idx = $(this).index();
			// 交互效果
			$(this).addClass('active').siblings('li').removeClass('active');
			//切换企业类型数据
		}
		
		
	});

	//企业法人
	$('.faren').on('input propertychange',function() {
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		if($(this).val() === ''){
			//为空
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');
		}else if( !(/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/.test($(this).val()))){
			//格式错误
			showTip.find('p').hide();
			showTip.find('.error').show();
			$(this).addClass('error').removeClass('true');
		}else {
			//正确
			showTip.find('p').hide();
			showTip.find('.true').show();
			$(this).addClass('true').removeClass('error');
		}
	});

	//企业联系人
	$('.contacts').on('input propertychange',function() {
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		if($(this).val() === ''){
			//为空
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');
		}else if( !(/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/.test($(this).val()))){
			//格式错误
			showTip.find('p').hide();
			showTip.find('.error').show();
			$(this).addClass('error').removeClass('true');
		}else {
			//正确
			showTip.find('p').hide();
			showTip.find('.true').show();
			$(this).addClass('true').removeClass('error');
		}
	});

	// 手机输入框
	$('.input-mobile').on('input propertychange', function (){
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		if($(this).val() === ''){
			//为空
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');
		}else if( !( /^1[0-9]{10}$/.test($(this).val()))){
			//格式错误
			showTip.find('p').hide();
			showTip.find('.error').show();
			$(this).addClass('error').removeClass('true');
		}else {
			//正确
			showTip.find('p').hide();
			showTip.find('.true').show();
			$(this).addClass('true').removeClass('error');
		}
	});

	// 固话输入框
	$('.input-num').on('input propertychange', function (){
		var inputNum;
		//获取提示框的对象
		var selfPhone = $(this).closest('.form-phone');
		var showTip = $(this).parent('.form-phone').siblings('.tip-words');
		if ($.trim(selfPhone.find('.fj').val()) !== '') {
			inputNum = selfPhone.find('.qh').val() + '-' + selfPhone.find('.phone-num').val() + '-' + selfPhone.find('.fj').val();
		}
		else {
			inputNum = selfPhone.find('.qh').val() + '-' + selfPhone.find('.phone-num').val();
		}
		if(inputNum === '' || inputNum === '-'){
			//为空
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$('.input-num').addClass('error').removeClass('true');
		}
		else if (!(/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/.test(inputNum))) {
			//格式错误
			showTip.find('p').hide();
			showTip.find('.error').show();
			$('.input-num').addClass('error').removeClass('true');
		}
		else{
			//正确
			showTip.find('p').hide();
			showTip.find('.true').show();
			$('.input-num').addClass('true').removeClass('error');
		}
	});

	// 邮箱输入框
	$('.input-email').on('input propertychange', function (){
		//获取提示框的对象
		var showTip = $(this).siblings('.tip-words');
		if($(this).val() === ''){
			//为空
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');
		}else if( !(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test($(this).val()))){
			//格式错误
			showTip.find('p').hide();
			showTip.find('.error').show();
			$(this).addClass('error').removeClass('true');
		}else {
			//正确
			showTip.find('p').hide();
			showTip.find('.true').show();
			$(this).addClass('true').removeClass('error');
		}
	});

	// 地址输入框
    $('.input-address').on('input propertychange', function (){
        //获取父级
        var showTip = $(this).siblings('.tip-words');
        if($(this).val() === ''){
            //为空
			showTip.find('p').hide();
			showTip.find('.empty').show();
			$(this).addClass('error').removeClass('true');
        }else if(!(/^[A-Za-z0-9_\u4e00-\u9fa5]*$/.test($(this).val()))){
            //格式错误
			showTip.find('p').hide();
			showTip.find('.error').show();
			$(this).addClass('error').removeClass('true');
        }else {
            //正确
			showTip.find('p').hide();
			showTip.find('.true').show();
			$(this).addClass('true').removeClass('error');
        }
    });

	// 切换资质文件显示隐藏
    $('.toggle-show').on('click', function() {
        $(this).toggleClass('active');
        $(this).next('.file-ctn').toggleClass('active');
    });

    // 弹窗-编辑资质
	$(document).on('click', '.file-edit', function () {
        $(this).closest('li').find('.img-up').click();
	});

	// 查看大图
	$(document).on('click', '.file-img img', function () {
		$('.view-img img').attr('src', $(this).attr('src'));
		$('.view-img').show();
	});
	$('.view-img').on('click', function () {
		$(this).hide();
	});

	// 上传图片and预览
	$(document).on('change', '.file-ctn .img-up', function() {
		var self = $(this).closest('li');
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
            // 图片路径设置为读取的图片
            var imgSrc = e.target.result;
            self.find('img').attr('src', imgSrc);
            // 移除img-add
            self.find('.file-img').removeClass('img-add');
        };
        reader.readAsDataURL(file);
	});

	//保存草稿
	$('.btn-save').on('click', function (event) {
		var e = event || window.event;
		// 验证项
		var verifyNum = 0;
		$('.form-group .must').each(function (){
			if( $(this).hasClass('error')){
				verifyNum ++;
			}
		});
		// 判断数据是否符合要求
		if (verifyNum <= 0) {
			$('#tip-txt .ctn-txt').html('保存成功！');
			$('#tip-txt').show();
		}
		else {
			$('#tip-txt .ctn-txt').html('请检查填写的内容格式是否有误');
			$('#tip-txt').show();
		}
		e.preventDefault();
	});

	//提交审核
	$('.btn-submit').on('click', function (event) {
		var e = event || window.event;
		// 验证项
		var verifyNum = 0;
		$('.form-group .must').each(function (){
			if( $(this).hasClass('error')){
				verifyNum ++;
			}
		});
		// 必填项表单
		var mustArr = 0;
		$('.must').each(function () {
			if($(this).hasClass('true')){
				mustArr++;
			}else if ($(this).hasClass('select-chosen') && $(this).val()) {
				mustArr++;
			}
		});

		// 必上传文件
		var mustfile = 0;
		$('.must-file-ctn li').each(function() {
			if($(this).find('img').attr('src')){
				mustfile++;
			}
		});
		if(verifyNum <= 0 && mustArr == $('.must').length && mustfile == $('.must-file-ctn li').length){
			console.log('可以提交！');
		}else {
			$('#tip-txt .ctn-txt').html('请检查必填项是否有未填写以及填写的内容格式是否有误');
			$('#tip-txt').show();
		}
		e.preventDefault();
	});

	//关闭弹窗
	$(document).on('click', '.pop-shade .btn-no,.pop-shade .header-close', function() {
		$(this).closest('.pop-shade').hide();
	});
});