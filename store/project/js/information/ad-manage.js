define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 删除
	var _self = null;
	$(document).on('click', '.icon-del',function () {
		_self = $(this).closest('tr');
		$('.ad-del').modal('show');
	});
	$('.ad-del .btn-yes').on('click', function () {
		_self.remove();
	});

	// 新增
	$('.btn-add').on('click', function () {
		$('.ad-add .modal-title').text('添加广告类型');
		$('.ad-add .btn-yes').attr('id', 'confirm-add');
		$('.ad-add').find('input').val('');
		$('.ad-add').find('textarea').val('');
		$('.ad-add select').find("option:eq(0)").prop("selected", 'selected');
		$('.ad-add').modal('show');
	});

	//确定新增
	$(document).on('click', '#confirm-add', function () {
		console.log('新增');
	});


	//编辑
	$(document).on('click', '.icon-edit', function() {
		$('.ad-add .modal-title').text('编辑广告类型');
		$('.ad-add .btn-yes').attr('id', 'confirm-edit');
		$('.ad-add').modal('show');
	});

	//确定编辑
	$(document).on('click', '#confirm-edit', function () {
		console.log('编辑');
	});

	// 商品图片
	var logoImg = null;
	$('.modal .img-up').on('click', function () {
		logoImg = $(this);
		$(this).siblings('.file-up').click();
	});
	$('.modal .file-up').on('click', function (event) {
		var e = event || window.event;
		e.stopPropagation();
	});

	// 上传图片and预览
	$('.modal .file-up').on('change', function(){
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
            logoImg.attr('src', imgSrc);
        };
        reader.readAsDataURL(file);
	});

    // banner背景色
    $('.color-set').on("blur", function () {
        var val = $(this).val();
        if ($.trim($(this).val()) != '' && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(val)) {
            $('.color-view').css('background-color', val);
        } else {
            $(this).val('#fff');
            $('.color-view').css('background-color', '#fff');
        }
    });

});