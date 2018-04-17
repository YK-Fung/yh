define(['jquery','datetime', 'pagination'], function($){
	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	// 新增
	$(document).on('click', '.btn-add', function () {
		$('.link-add').modal('show');
	});
	// 确定新增
	$(document).on('click', '.link-add .btn-yes', function () {
		console.log('新增成功！');
	});

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
		$('.link-detail').modal('show');
		//复制td的值
		var object = $(this).closest('tr').find('td');
		var _length = object.length-2;
		//i = 3的内容是图片
		for (var i = 0; i <= _length; i++) {
			if(i != 3){
				var txts = object.eq(i).text();
				//传值给编辑弹窗
				$('.link-detail tr').eq(i).find('input').val(txts);
			}else {
				var _src = object.eq(i).children('img').attr('src');
				//传值给编辑弹窗
				$('.link-detail tr').eq(i).find('img').attr('src',_src);
			}
		}
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

	// 初始化页码
	paginationArg.init($('.wrap'), $('.pagination .active').text(), $('.page-amount').text());
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});