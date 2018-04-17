define(['jquery', 'pagination2','bar-slider', 'bar-header','popwin','ie-tip'], function($){

	;(function selectBoxFn () {
		//下拉列表切换
		$(document).on('click', '.select-box .select-choice', function(event) {
			var e = event || window.event;
			//其它下拉隐藏
			$('.select-box').removeClass('down');
			//下拉效果切换
			$(this).parents('.select-box').toggleClass('down');
			//停止冒泡
			e.stopPropagation();
		});

		// 鼠标点击离开来目标，菜单栏隐藏
		$(document).on('click', function() {
			$('.select-box').removeClass('down');
		});

		//选中下拉选项
		$(document).on('click', '.select-box .select-drop li', function(event) {
			var e = event || window.event;
			var _txt = $(this).text();
			var _data = $(this).attr('data');
			//添加选中select值
			$(this).closest('.select-box').find('.select-text').text(_txt);
			$(this).closest('.select-box').find('.select-input').val(_data);
			//隐藏下拉列表
			$(this).closest('.select-box').removeClass('down');
			e.stopPropagation();
		});	
	}());

	//限制文件格式
	$('.import-file input[type=file]').change(function() {
		var _val = $(this).val()
		var index1 = _val.lastIndexOf(".")
		var index2 = _val.length;
		var postf =_val.substring(index1,index2);//后缀名

		if(postf != ".xls" && postf != ".xlsx"){
			$(this).val('');
		}
	});

	//导入产品数据
	$('.import-file .submit').click(function() {
		if(!$('.import-file input[type=file]').val()){
			$('#tip-txt .ctn-txt').text('请上传模板！');
			$('#tip-txt').show();
		}else {
			$('#tip-txt .ctn-txt').text('若产品已存在，将覆盖原有信息，确认导入产品数据？');
			$('#tip-txt .btn-yes').attr('data', 'tip-import');
			$('#tip-txt').show();
		}
		
	});

	//单选
	$('.table').on('click', '.checkbox', function() {
		//切换attr属性
		$(this).find(':checkbox').prop("checked", !$(this).find(':checkbox').prop("checked"));
		$(this).toggleClass('active');
		$(this).closest('tr').toggleClass('active');
		
		if($('.table input[type="checkbox"]').length == $('.table input[type=checkbox]:checked').length){
			//全选
			$('.select-all-checkbox').addClass('active');
			$('.select-all-checkbox').find(':checkbox').prop("checked", true);
		}else {
			//取消全选
			$('.select-all-checkbox').removeClass('active');
			$('.select-all-checkbox').find(':checkbox').prop("checked", false);
		}
	});

	//全选
	$('.select-all-checkbox').on('click', function() {
		//切换attr属性
		if(!$(this).find(':checkbox').prop("checked")){
			//全选
			$(this).addClass('active');
			$('.table').find('.checkbox').addClass('active');
			$('.table').find(':checkbox').prop("checked", true);
			$('tbody tr').addClass('active');
		}else {
			//取消全选
			$(this).removeClass('active');
			$('.table').find('.checkbox').removeClass('active');
			$('.table').find(':checkbox').prop("checked", false);
			$('tbody tr').removeClass('active');
		}
		$(this).find(':checkbox').prop("checked", !$(this).find(':checkbox').prop("checked"));
	});

	//关闭弹窗
	$(document).on('click', '.pop-shade .btn-no,.pop-shade .header-close', function() {
		$(this).closest('.pop-shade').hide();
	});

	//删除单个
	var _self = null;
	$(document).on('click', '.delete-this', function() {
		_self = $(this).closest('tr');
		$('#tip-txt .ctn-txt').text('确认删除该产品？');
		$('#tip-txt .btn-yes').attr('data', 'this-del');
		$('#tip-txt').show();
	});

	//批量删除
	$('.batch-delete-btn').click(function() {
		if($('.table input[type=checkbox]:checked').length > 0){
			$('#tip-txt .ctn-txt').text('确认批量删除产品？');
			$('#tip-txt .btn-yes').attr('data', 'all-del');
			$('#tip-txt').show();
		}else{
			$('#tip-txt .ctn-txt').text('未选中要删除的产品？');
			$('#tip-txt').show();
		}
	});

	//提示 确定按钮
	$('#tip-txt .btn-yes').click(function() {
		if($(this).attr('data') == 'all-del'){
			//批量删除

			//请求成功
			$('.table tbody tr').each(function() {
				if($(this).find('input[type=checkbox]').prop("checked")){
					$(this).remove();
				}
			});
		}else if ($(this).attr('data') == 'this-del') {
			//删除单个

			//请求成功
			_self.remove();
		}else if ($(this).attr('data') == 'tip-import') {
			//导入产品数据
			$('.table-loading').show();
		}
		$('.select-all-checkbox').removeClass('active');
		$('.select-all-checkbox input').prop("checked",false);
		$('#tip-txt').hide();
	});

	//查看详情
	$(document).on('click', 'table .pop-detail', function() {
		$('#price-detail').show();
	});

	// 初始化页码
	paginationArg.init($('.wrap'), 10, 2);
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};

});
