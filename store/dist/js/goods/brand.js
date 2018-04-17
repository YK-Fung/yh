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

	//设置推荐品牌
	$('.icon-edit').on('click', function () {
		$('.recommend').modal('show');
	});

	//查看图片
	$('td').on('click', '.logo', function() {
		var _src = $(this).attr('src');
		$('.check-img').find('img').attr('src', _src);
		$('.check-img').show();
	});

	//关闭查看图片的弹窗
	$('.check-img .closed').on('click', function() {
		$(this).closest('.check-img').hide();
	});

	//设置推荐品牌
	$('.add-btn').on('click', function () {
		//清空val值
		$('.recommend input').val('');
		$('.recommend textarea').val('');
		$('.recommend .pic-show').attr('src', '');
		$('.recommend .check-box').attr('checked', false);
		$('.recommend').modal('show');
	});

	//

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

});