define(['jquery', 'pagination','datetime', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	// 删除
	var _self = null;
	$(document).on('click', '.icon-del', function () {
		_self = $(this).closest('tr');
		$('.delete-product').modal('show');
	});
	$('.delete-product .btn-yes').on('click', function () {
		_self.remove();
	});

	//全选
	$(document).on('click', '.checkbox-all', function() {
		var checkBox = $('tbody input[type="checkbox"]');//单选框
		checkBox.prop('checked',this.checked);
	});

	//单选
	$(document).on('click', 'tbody input[type=checkbox]',function() {
		$('.checkbox-all').prop('checked',$('tbody input[type="checkbox"]').length == $('tbody input[type=checkbox]:checked').length ? true : false);
	});

	//表格下方 推荐按钮
	$('.table-push').on('click', function() {
		$('.table-page tbody tr').each(function() {
			if($(this).find('input[type="checkbox"]').prop('checked')){
				$(this).find("select option:eq(1)").prop("selected", 'selected');
			}
		});
	});

	//表格下方 不推荐按钮
	$('.table-not-push').on('click', function() {
		$('.table-page tbody tr').each(function() {
			if($(this).find('input[type="checkbox"]').prop('checked')){
				$(this).find("select option:eq(0)").prop("selected", 'selected');
			}
		});
	});

	//推荐供应商 弹窗
	$('.add-company').on('click', function() {
		$('.company-recommend').modal('show');
		// 初始化页码
		paginationArg.init($('.company-recommend'), 10, 2);
		// 分页Ajax
		paginationArg.ajaxFn = function(){
			console.log(paginationArg.viewNum);
		};
	});

	//推荐产品 弹窗
	$(document).on('click','.table-page .choose-btn', function() {
		// 供应商名称
		var txt = $(this).closest('tr').find('td').eq(1).text();
		$('.module-product .company-name').text(txt);
		$('.module-product').modal('show');
		// 初始化页码
		paginationArg.init($('.module-product'), 10, 2);
		// 分页Ajax
		paginationArg.ajaxFn = function(){
			console.log(paginationArg.viewNum);
		};
	});

	//推荐产品 查询
	$('.product-search').bind('input porpertychange',function(){
		var thisThis = $(this).val();
		
	});

	//推荐供应商 查询
	$('.company-search').bind('input porpertychange',function(){
		var thisThis = $(this).val();
	});

	//选中产品
	$(document).on('click', '.check-recommend',function() {
		if($(this).closest('tr').hasClass('info')){
			$(this).closest('tr').removeClass('info');
			$(this).closest('tr').find('input[type="checkbox"]').prop('checked', false);
			$(this).text('选择');
		}else {
			$(this).closest('tr').addClass('info');
			$(this).closest('tr').find('input[type="checkbox"]').prop('checked', true);
			$(this).text('撤销');
		}
	});

	//保存
	$('.module-product .btn-yes').on('click', function() {
		//发送成功 关闭弹窗
		$('.module-product').modal('hide');
	});
	//保存
	$('.company-recommend .btn-yes').on('click', function() {
		//发送成功 关闭弹窗
		$('.company-recommend').modal('hide');
	});

	
});