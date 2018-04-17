define(['jquery','table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){
	// 删除
	var _self = null;
	$(document).on('click', '.icon-del',function () {
		_self = $(this).closest('tr');
		$('.delete-page').modal('show');
	});
	$('.delete-page .btn-yes').on('click', function () {
		_self.remove();
	});

	//编辑
	$(document).on('click', '.icon-edit', function() {
		$('.page-detail').modal('show');
	});

	//新增信息
	$(document).on('click', '.add-btn', function() {
		var line = '<tr><td class="w186"><input name="" type="text" value="" class="text-right tit"></td><td><input name="" type="text" value="" class="ctn"></td></tr>';
		$('.page-detail .modal-body tbody').append(line);
	});
});