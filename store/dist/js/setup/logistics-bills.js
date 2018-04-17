define(['jquery','table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){
	// 删除
	var _self = null;
	$(document).on('click', '.icon-del',function () {
		_self = $(this).closest('tr');
		$('.delete-link').modal('show');
	});
	$('.delete-link .btn-yes').on('click', function () {
		_self.remove();
	});

	//编辑
	$(document).on('click', '.icon-edit', function() {
		$('.bills-detail').modal('show');
		//复制td的值
		var object = $(this).closest('tr').find('td');
		var _length = object.length-2;
		for (var i = 0; i <= _length; i++) {
			var txts = object.eq(i).text();
			//传值给编辑弹窗
			$('.bills-detail tr').eq(i).find('input').val(txts);
			if(i == 6){
				var _src = object.eq(i).children('img').attr('src');
				//传值给编辑弹窗
				$('.bills-detail tr').eq(i).find('img').attr('src',_src);
			}
		}
	});

	// 商品图片
	var logoImg = null;
	$('.bills-detail .img-up').on('click', function () {
		logoImg = $(this);
		$(this).siblings('.file-up').click();
	});
	$('.bills-detail .file-up').on('click', function (event) {
		var e = event || window.event;
		e.stopPropagation();
	});
	// 上传图片and预览
	$('.bills-detail .file-up').on('change', function(){
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
});