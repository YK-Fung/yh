define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){
	// 删除
	var _self = null;
	$(document).on('click', '.icon-del',function () {
		_self = $(this).closest('tr');
		$('.delete-brand').modal('show');
	});
	$('.delete-brand .btn-yes').on('click', function () {
		_self.remove();
	});

	//新增品牌
	$('.add-brand-btn').on('click', function () {
		//清空val值
		$('.pop-add-brand input').val('');
		$('.pop-add-brand textarea').val('');
		$('.pop-add-brand .pic-show').attr('src', '');
		$('.pop-add-brand .btn-yes').attr('data','add-brand');
		$('.pop-add-brand').modal('show');
	});

	//编辑品牌
	$(document).on('click','.icon-edit', function () {
		_self = $(this).closest('tr');
		//情况文件上传
		$('.pop-add-brand input[type="file"]').val('');
		//品牌名称
		var brandName = $(this).closest('tr').find('td:eq(1)').text();
		//品牌说明
		var brandDes = $(this).closest('tr').find('td:eq(2)').text();
		//品牌logo
		var brandLogo = $(this).closest('tr').find('.logo').attr('src');
		//赋val值
		$('.pop-add-brand .brand-name').val(brandName);
		$('.pop-add-brand textarea').val(brandDes);
		$('.pop-add-brand .pic-show').attr('src', brandLogo);
		$('.pop-add-brand .btn-yes').attr('data','edit-brand');
		$('.pop-add-brand').modal('show');
	});

	//查看图片
	$(document).on('click', 'table .logo,.pop-add-brand .pic-show', function() {
		var _src = $(this).attr('src');
		$('.check-img').find('img').attr('src', _src);
		$('.check-img').show();
	});

	//关闭查看图片的弹窗
	$('.check-img .closed').on('click', function() {
		$(this).closest('.check-img').hide();
	});

	// 图片
	var Img = $('.pic-show');
	$('.add-img').on('click', function (event) {
		var e = event || window.event;
		e.stopPropagation();
	});
	// 上传图片and预览
	$('.add-img').on('change', function(){
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
            $('.add-img').val('');
            $('.pop-add-brand .pic-show').attr('src', '');
            return false;
        }
        //读取完成
        reader.onload = function(e) {
            // 图片路径设置为读取的图片
            var imgSrc = e.target.result;
            Img.attr('src', imgSrc);
        };
        reader.readAsDataURL(file);
	});

	//弹窗确定按钮
	$('.pop-add-brand').on('click', '.btn-yes', function() {
		//品牌名称
		var brandName = $('.pop-add-brand .brand-name').val();
		//品牌说明
		var brandDes = $('.pop-add-brand textarea').val();
		//品牌logo
		var brandLogo = $('.pop-add-brand .pic-show').attr('src');
		//确定新增
		console.log(brandName)
		if($(this).attr('data') == 'add-brand'){
			$('table tbody').prepend('<tr><td><img src="'+brandLogo+'" height="40" class="logo"></td><td>'+brandName+'</td><td>'+brandDes+'</td><td><i class="icon icon-edit"></i><i class="icon icon-del"></i></td></tr>');
		}else if ($(this).attr('data') == 'edit-brand') {
			//确定编辑
			_self.html('<td><img src="'+brandLogo+'" height="40" class="logo"></td><td>'+brandName+'</td><td>'+brandDes+'</td><td><i class="icon icon-edit"></i><i class="icon icon-del"></i></td>')
		}

	});
});