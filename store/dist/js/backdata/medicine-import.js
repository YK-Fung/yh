define(['jquery', 'datetime' ,'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	})
	// 新增信息
	$(document).on('click', '.add-form', function () {
		$('.pop-backdata-add .modal-title').text('新增');
		$('.pop-backdata-add .btn-submit').show();
		$('.pop-backdata-add .btn-pass').hide();

		//清空内容
		$('.pop-backdata-add input').val('');
		$('.pop-backdata-add select').each(function(index, el) {
			$(this).find('option:eq(0)').prop("selected", 'selected');
		});
		$('.pop-backdata-add .product-img li:gt(0)').remove();
		$('.pop-backdata-add').modal('show');
	});

	// 加工
	$(document).on('click', '.edit-product', function () {
		$('.pop-backdata-add .modal-title').text('加工');
		$('.pop-backdata-add .btn-submit').show();
		$('.pop-backdata-add .btn-pass').hide();
		$('.pop-backdata-add').modal('show');
	});

	// 审核
	$(document).on('click', '.check-product', function () {
		$('.pop-backdata-add .modal-title').text('审核');
		$('.pop-backdata-add .btn-submit').hide();
		$('.pop-backdata-add .btn-pass').show();
		$('.pop-backdata-add').modal('show');
	});

	//停用
	$(document).on('click', '.stop-use', function() {
		$('.pop-stop-use').modal('show');
	});

	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	//模糊搜索列表
	$('.pop-backdata-add .search-pull-down input').on('input propertychange', function() {
		if($(this).val()){
			$(this).siblings('.search-list').show();
		}else {
			$(this).siblings('.search-list').hide();
		}
	});

    //经营范围输入框失去焦点
    $('.manage-range input').on('blur', function () {
        if($('.manage-range .search-list li').length < 1 || $(this).val() == ''){
            $(this).val('');
        }else{
            var _this = this;
            var flag = false;
            for (var i = 0; i < $('.manage-range .search-list li').length; i++) {
              var $el =  $($('.manage-range .search-list li')[i]);
                if($(_this).val() == $el.html()){
                    flag = true;
                    break
                }
            }
            if(!flag){
                $(this).val($('.manage-range .search-list li:eq(0)').html());
            }
        }
    });

    //经营范围输入框按回车
    $(document).keypress(function (e) {
        if (e.keyCode == 13) {
            $('.manage-range input').trigger('blur')
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

	// 关闭大图预览
	$('.view-img').on('click', function () {
		$(this).fadeOut('fast');
	});

	// 删除图片
	var productImg;
	$(document).on('click', '.product-img-del', function () {
		productImg = $(this).closest('li');
		$('.pop-delete-photo').modal('show');
	});
	$('.pop-delete-photo .btn-yes').on('click', function () {
		productImg.remove();
		// 关闭弹窗
		$(this).closest('.pop-shade').modal('hide');
	});

	//提交审核
	$('.pop-backdata-add .btn-submit,.pop-backdata-add .btn-pass').click(function() {
		//验证必填项
		var mustLength = 0;
		$('.pop-backdata-add .must').each(function() {
			if(!$(this).val()){
				mustLength ++;
			}
		});
		if(mustLength <= 0){
			//成功
			$('.pop-backdata-add').modal('hide');
		}else {
			alert('检查是否有带*的未填!');
		}
	});
});