define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 删除
	var _self = null;
	$(document).on('click', '.icon-del', function () {
		_self = $(this).closest('tr');
		$('.delete-product').modal('show');
	});
	$('.delete-product .btn-yes').on('click', function () {
		_self.remove();
	});

	//添加模块 弹窗
	$('.add-btn button').click(function() {
		$('.edit-module .modal-title').text('添加模块');
		$('.edit-module').modal('show');
		$('.edit-module').find('input').val('');
		$('.edit-module').find('select').get(0).selectedIndex = 0;
		$('.edit-module').find('.btn-yes').attr('id', 'add-module');
	});

	//确定添加模块
	$(document).on('click', '#add-module', function() {
		var inputVal = $('.edit-module').find('input').val();
		var selectVal = $('.edit-module').find('select').val();
		// 下拉选择值的索引
		var selectIndex = $('.edit-module').find('select').get(0).selectedIndex;
		// 序号
		var num = parseInt($('tbody tr:last').find('td').eq(0).text())+1;
		if(inputVal != '' && selectIndex != 0){
			$('.table tbody').append('<tr><td>'+num+'</td><td>'+inputVal+'</td><td>'+selectVal+'</td><td><i class="icon icon-edit"></i><i class="icon icon-del"></i></td></tr>');
			$('.edit-module').modal('hide');
		} 
	});

	//编辑模块 弹窗
	var object;
	$(document).on('click', '.icon-edit', function() {
		$('.edit-module .modal-title').text('编辑模块');
		$('.edit-module').modal('show');
		$('.edit-module').find('.btn-yes').attr('id', 'edit-module');
		//复制td的值
		object = $(this).closest('tr').find('td');
		var inputVal = $('.edit-module').find('input').val(object.eq(1).text());
		var selectVal = $('.edit-module').find('select').val(object.eq(2).text());
	});

	//确定添加模块
	$(document).on('click', '#edit-module', function() {
		var inputVal = $('.edit-module').find('input').val();
		var selectVal = $('.edit-module').find('select').val();
		var selectIndex = $('.edit-module').get(0).selectedIndex;
		if(inputVal != '' && selectIndex != 0){
			object.eq(1).text(inputVal);
			object.eq(2).text(selectVal);
			$('.edit-module').modal('hide');
		}
	});
});