define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 新增信息
	$('.btn-add').on('click', function () {
		$('.backdata-add').modal('show');
	});
	$('.backdata-add .btn-yes').on('click', function () {
		$('.table-view tbody').append('<tr><td><a class="detail">999感冒灵</a></td><td>2013d5646541365468</td><td>广东省回函嘻嘻公司</td><td>12</td><td>哈哈哈</td><td><i class="icon icon-edit"></i><i class="icon icon-del"></i></td></tr>');
	});

	// 查看详情
	$(document).on('click', '.detail', function () {
		$('.backdata-detail .modal-title').text('详细信息');
		// 隐藏 确定、关闭。
		$('.backdata-detail .btn-group2').hide();
		// 显示返回
		$('.backdata-detail .btn-group1').show();
		// 禁用input
		$('.backdata-detail input').attr('disabled', true);
		$('.backdata-detail').modal('show');
	});
	// 编辑信息
	$(document).on('click', '.icon-edit', function () {
		$('.backdata-detail .modal-title').text('编辑信息');
		// 显示 确定、关闭。
		$('.backdata-detail .btn-group2').show();
		// 隐藏 返回
		$('.backdata-detail .btn-group1').hide();
		// 取消禁用input
		$('.backdata-detail input').attr('disabled', false);
		$('.backdata-detail').modal('show');
	});
	// 新增信息
	// $('.backdata-detail .add').on('click', function () {
	// 	console.log('新增信息！');
	// });

	// 删除
	var _self = null;
	$(document).on('click', '.icon-del', function () {
		_self = $(this).closest('tr');
		$('.backdata-del').modal('show');
	});
	$('.backdata-del .btn-yes').on('click', function () {
		_self.remove();
	});

	// // 初始化页码
	// paginationArg.init($('.wrap'), $('.item-amount').text(), $('.page-amount').text());
	// // 分页Ajax
	// paginationArg.ajaxFn = function(){
	// 	console.log(paginationArg.viewNum);
	// };

});