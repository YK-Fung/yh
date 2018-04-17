define(['jquery','table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){
	// 删除
	var _self = null;
	$(document).on('click', '.icon-del',function () {
		_self = $(this).closest('tr');
		$('.delete-type').modal('show');
	});
	$('.delete-type .btn-yes').on('click', function () {
		_self.remove();
	});

	//编辑
	$(document).on('click', '.icon-edit', function() {
		//清空文本
		$('.type-detail .ctn').val('');
		var object = $(this).closest('tr').find('td');
		//复制td的值
		var _length = object.length-2;
		for (var i = 1; i <= _length; i++) {
			var txts = object.eq(i).text();
			//传值给编辑弹窗
			$('.type-detail').find('.ctn').eq(i-1).val(txts);
		}
		$('.type-detail').find('.modal-title').text('编辑信息');
		$('.type-detail').modal('show');
	});

	//新增
	$(document).on('click', '.add-btn', function() {
		//清空文本
		$('.type-detail .ctn').val('');
		$('.type-detail').find('.modal-title').text('新增信息');
		$('.type-detail').modal('show');
	});

	//保存
	$(document).on('click', '#save-btn', function() {
		//刷新
		window.location.reload(); 
	});
});