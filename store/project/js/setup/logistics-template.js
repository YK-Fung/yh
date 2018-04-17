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
		var _length = object.length-3;
		for (var i = 0; i <= _length; i++) {
			var txts = object.eq(i).text();
			//传值给编辑弹窗
			$('.bills-detail').find('input').eq(i).val(txts);
		}
	});
});