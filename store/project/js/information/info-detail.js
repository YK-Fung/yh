define(['jquery','ZeroClipboard'],function($,ZeroClipboard){

	//ZeroClipboard is not defined 的解决方法
	window['ZeroClipboard'] = ZeroClipboard;
	
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
	