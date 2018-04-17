define(['jquery', 'bar-slider', 'bar-header', 'verify','ie-tip'], function($){

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
    $('.select-drop').on('click',function(event) {
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

	// 收货人输入框
	$('.consignee').on('blur', function (){
		if ($(this).val() != '' && $(this).val().length > 25) {
			$(this).next('.error-tip').show();
		}
		else{
			$(this).next('.error-tip').hide();
		}
	});
	// 固话输入框
	$('.input-num').on('blur', function (){
		var inputNum;
		var selfPhone = $(this).closest('.form-phone');
		if ($.trim(selfPhone.find('.fj').val()) !== '') {
			inputNum = selfPhone.find('.qh').val() + '-' + selfPhone.find('.phone-num').val() + '-' + selfPhone.find('.fj').val();
		}
		else {
			inputNum = selfPhone.find('.qh').val() + '-' + selfPhone.find('.phone-num').val();
		}
		if (inputNum !== '' && inputNum !== '-' && !(/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/.test(inputNum))) {
			selfPhone.find('.error-tip').show();
		}
		else{
			selfPhone.find('.error-tip').hide();
		}
	});
	//手机号码
	$('.input-mobile').on('blur', function() {
		//获取输入框的值
		var _value = $(this).val();
		if(_value != '' && !(/^1[0-9]{10}$/.test(_value))){
			$(this).closest('.form-ctn').find('.error-tip').show();
		}else {
			$(this).closest('.form-ctn').find('.error-tip').hide();
		}
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
	// 是否设置为默认地址
	$('.btn-default').on('click', function() {
		$(this).toggleClass('active');
	});

	// 保存
	$('.adress .btn-save').on('click', function (event) {
		var e = event || window.event;
		// 验证项
		var verify = false;
		var verifyNum = 0;
		$(this).closest('.adress').find('.error-tip').each(function (){
			if( $(this).is(':hidden') ){
				verifyNum ++;
			}
		});
		if (verifyNum == $(this).closest('.adress').find('.error-tip').length) {
			verify = true;
		}
		// 必填项
		var must = false;
		var mustArr = [];
		$(this).closest('.adress').find('.must').each(function () {
			var mustVal = $.trim($(this).val());
			mustArr.push(mustVal);
		});
		if (mustArr.indexOf('') < 0) {
			must = true;
		}
		// 判断数据是否符合要求
		if (verify && must) {
			$('#pop-success').fadeIn('fast');
		}
		else {
			$('#pop-fail').fadeIn('fast');
		}
		e.preventDefault();
	});
	// 默认地址选择
	$('.btn-checkbox').on('click', function () {
		var hasActive = $(this).hasClass('active');
		if (hasActive) {
			$(this).removeClass('active');
		}
		else {
			$('.adress-default .btn-checkbox').removeClass('active');
			$(this).addClass('active');
		}
	});
	// 修改收货地址
	$('.opt-edit').on('click', function () {
		$('.adress .adress-title').text('修改收货地址');
	});
	// 删除收货地址
	$('.opt-del').on('click', function () {
		// 缺一个删除地址的弹窗，后期补上
		$(this).closest('tr').remove();
	});
	// 取消or关闭按钮
	$('.pop-shade .btn-no, .pop-shade .header-close').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});
});