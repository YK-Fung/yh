define(['jquery', 'pagination','datetime', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	// 日期控件
	$('.date-time').datetimepicker({
		minView: "month", 
		timepicker:false,
		format:'Y/m/d',  
		formatDate:'Y/m/d'
	});

	$('select').on('change', function() {
	alert(42)
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
		$('.checkbox-all').prop('checked',$('tbody input[type="checkbox"]').length == $('tbody input[type="checkbox"]:checked').length ? true : false);
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

	//推荐产品 弹窗
	$('.add-product').on('click', function() {
		var name = $('.module-choose').val();
		var type = $('.type-choose').val();
		var nameIndex = $('.module-choose').get(0).selectedIndex;
		var typeIndex = $('.type-choose').get(0).selectedIndex;
		if(nameIndex != 0 && typeIndex != 0){
			$('.module-name').text(name);
			$('.type-name').text(type);
			$('.module-product').modal('show');
			$(this).siblings('.red').css('display', 'none');
		}else {
			$(this).siblings('.red').css('display', 'inline-block');
		}
		
	});

	//推荐产品 查询
	$('.product-search').bind('input porpertychange',function(){
		var thisThis = $(this).val();
		
	});

	//选中产品
	$(document).on('click', '.module-product .check-recommend',function() {
		if($(this).closest('tr').hasClass('info')){
			$(this).closest('tr').removeClass('info');
			$(this).closest('tr').find('.sort').hide();
			$(this).closest('tr').find('input[type="checkbox"]').prop('checked', false);
			$(this).text('选择');
		}else {
			$(this).closest('tr').addClass('info');
			$(this).closest('tr').find('.sort').show();
			$(this).closest('tr').find('input[type="checkbox"]').prop('checked', true);
			$(this).text('撤销');
		}
	});

	//保存
	$('.module-product .btn-yes').on('click', function() {
		//成功 关闭弹窗
		$('.module-product').modal('hide');
	});

	// 初始化页码
	paginationArg.init($('.wrap'), $('.pagination .active').text(), $('.page-amount').text());
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});