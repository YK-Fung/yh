define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){
	//删除弹窗
	var _self = null;
	$(document).on('click', '.delete-account', function() {
		_self = $(this).closest('tr');
		$('#pop-delete').modal('show');
	});

	//确认删除
	$('#pop-delete .btn-yes').on('click', function() {
		//发送请求
		//成功
		_self.remove();
		$('#pop-delete').modal('hide');
	});

	//添加/编辑账户
	$(document).on('click', '.edit-account', function() {
		// 清空表单
		$('#pop-edit-account input[type="text"]').val('');
		$('#pop-edit-account input[type="text"]').removeClass('error');
		$('#pop-edit-account').modal('show');
	});

	// 切换账户类型
	$('#pop-edit-account input[type="radio"]').on('change',function() {
		if($('#pop-edit-account input[type="radio"]:checked').hasClass('public-radio')){
			// 对公账户
			$('.icbc').show();
		}else {
			// 个人账户
			$('.icbc').hide();
		}
	});

	//确认添加
	$('#pop-edit-account .btn-yes').on('click', function() {
		var mustLength = 0;
		if($('#pop-edit-account input[type="radio"]:checked').hasClass('public-radio')){
			// 对公账户
			var mustoriginL = $('#pop-edit-account .must').length;
		}else {
			// 个人账户
			var mustoriginL = $('#pop-edit-account .must').length-1;
		}
		
		$('#pop-edit-account .must').each(function() {
			if(!$(this).hasClass('error') && $.trim($(this).val())){
				mustLength++;
			}
		});
		if(mustLength == mustoriginL){
			// 请求

			$('#pop-edit-account').modal('hide');
		}else {
			alert('请检查是否有填写错误或未填写！')
		}
	});

	// 银行账户
	$('.card-number').on('input propertychange',function() {
		if ($(this).val() != '' && !(/^([1-9]{1})(\d{14}|\d{18})$/.test($(this).val()))) {
			$(this).addClass('error');
		}else{
			$(this).removeClass('error');
		}
	});	

	//手机号码
	$('.mobile').on('input propertychange', function() {
		var _val = $(this).val().trim();
		if(!(/^1[0-9]{10}$/.test(_val))){
			$(this).addClass('error');
		}else {
			$(this).removeClass('error');
		}
	});

	//审核
	$(document).on('click', '.public-check', function() {
		// 清空表单
		$('#pop-public-check textarea').val('');
		$('#pop-public-check').modal('show');
	});

	//审核保存
	$('#pop-public-check .btn-yes').on('click', function() {
		// 未通过一定要填写原因
		if($('#pop-public-check input:checked').hasClass('nopass')){
			if(!$.trim($('#pop-public-check textarea').val())){
				alert('未通过一定要填写原因!');
				return false;
			}
		}
		// 请求

		$('#pop-public-check').modal('hide');
	});

	//模糊搜索列表
	$('#pop-edit-account .search-company input').on('input propertychange', function() {
		if($(this).val()){
			// 请求
			
			$(this).siblings('.search-list').show();
		}else {
			$(this).siblings('.search-list').hide();
		}
	});

	//输入框失去焦点
    $('#pop-edit-account .search-company input').on('blur', function () {
        if($('#pop-edit-account .search-list li').length < 1 || $(this).val() == ''){
            $(this).val('');
        }else{
            var _this = this;
            var flag = false;
            for (var i = 0; i < $('#pop-edit-account .search-list li').length; i++) {
                var $el =  $($('#pop-edit-account .search-list li')[i]);
                if($(_this).val() == $el.html()){
                    flag = true;
                    break
                }
            }
            if(!flag){
                $(this).val($('#pop-edit-account .search-list li:eq(0)').html());
            }
        }
    });

    //经营范围输入框按回车
    $(document).keypress(function (e) {
        if (e.keyCode == 13) {
            $('#pop-edit-account .search-company input').trigger('blur')
        }
    });

	//选中下拉框
	$('.search-list').on('click', 'li', function(event) {
		var e = event || window.event;
		var _txt = $(this).text();
		$(this).parent('.search-list').siblings('input').val(_txt);
		$(this).parent().hide();
		e.stopPropagation();
	});

	// 鼠标点击离开来目标，隐藏
	$(document).on('click', function() {
		$('.search-list').hide();
	});
});