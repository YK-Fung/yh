define(['jquery', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

	///////////////////添加类别 弹窗////////////////////
	$('.add-class').on('click', function() {
		$('.category-add .list').html('');
		$('.category-add').modal('show');
	});

	//添加
	$('.category-add .icon-add').on('click', function() {
		var curList = $('.category-add li').hasClass('active');
		if(curList){
			$('.category-add li.active').after('<li><input type="checkbox" class="check-num"><input type="text" maxlength="10" class="txt"></li>');
			$('.category-add li.active').next().find('.txt').focus();
		}else {
			$('.category-add .list').append('<li><input type="checkbox" class="check-num"><input type="text" maxlength="10" class="txt"></li>');
			$('.category-add li:last .txt').focus();	
		}
	});
	//输入框失焦
	$(document).on('blur', '.category-add .txt', function() {
		if($(this).val() == ''){
			$(this).closest('li').remove();
		}
	});
	$(document).on('keypress','.category-add .txt',function(e){
        var keyCode = e.keyCode;
        if(keyCode == 13){  //回车事件
            $(this).blur();//调用失焦事件
        }
    });

	//选中
	$('.category-add').on('click', 'li', function() {
		$(this).addClass('active').siblings().removeClass('active');
	});

	//上移
	$('.icon-up').on('click', function() {
		var ele = null;
    	$('.category-add li').each(function() {
    		if($(this).hasClass('active')){
    			ele = $(this);
    		}
    	});
    	if(ele){
    		ele.prev().before(ele);
    	}
	});
	//下移
	$('.icon-down').on('click', function() {
		var ele = null;
    	$('.category-add li').each(function() {
    		if($(this).hasClass('active')){
    			ele = $(this);
    		}
    	});
    	if(ele){
    		ele.next().after(ele);
    	}
	});

	//删除
	$('.icon-close').on('click', function() {
    	$('.category-add li').each(function() {
    		if($(this).find('.check-num').prop('checked')){
    			//删除
    			$(this).remove();
    		}
    	});
	});

	//添加多个
	$('.many-alert').on('click',function() {
		$('.category-more').modal('show');
		$('.category-more textarea').val('');
	});

	//确定按钮 添加多个 
	$('.category-more .btn-yes').on('click', function() {
		var text = $('.category-more').find('textarea').val();
		var addArry = text.split("\n");
		var errorTxt = 0;
		if(text == ''){
			$('.category-more').modal('hide');
		}
		for (var i = 0; i < addArry.length; i++) {
			if(addArry[i].length > 10){
				errorTxt ++;
			}
		}
		if(errorTxt > 0){
			$('.category-more .tips').show();
		}else {
			$('.category-more .tips').hide();
			for (var i = 0; i < addArry.length; i++) {
				if(addArry[i] != ''){
					$('.category-add .list').append('<li><input type="checkbox" class="check-num"><input type="text" maxlength="10" class="txt" value="'+addArry[i]+'"></li>');
				}
			}
			$('.category-more').modal('hide');
		}
	});

	//确定按钮 添加类别
	$('.category-add .btn-yes').on('click', function() {
		//请求成功 执行
		$('.category-add li').each(function() {
			var val = $(this).find('.txt').val();
			$('.category-select').append('<option>'+val+'</option>');
		});
		$('.category-add').modal('hide');
	});


	///////////////////经营范围表格///////////////////

	//添加经营范围
	$(document).on('click','.add-range',function() {
		$('.business-edit .modal-title').text('添加');
		$('.business-edit .range-txt').val('');
		$('.business-edit select option:first').prop("selected", 'selected');
		$('.business-edit .btn-yes').attr('id', 'confirm-add');
		$('.business-edit').modal('show');
	});

	//确定添加经营范围
	$(document).on('click', '#confirm-add', function() {
		var val = $('.business-edit .range-txt').val();
		if(val != ''){
			//发送请求
			$('.business-edit').modal('hide');
		}
	});

	//编辑经营范围
	$(document).on('click','.icon-edit',function() {
		$('.business-edit .modal-title').text('编辑');
		// for (var i = 1; i <= 2; i++) {
		// 	var txts =$(this).closest('tr').find('td').eq(i).text();
		// 	//传值给编辑弹窗
		// 	$('.business-edit').find('.form-val').eq(i-1).val(txts);
		// }
		$('.business-edit .btn-yes').attr('id', 'confirm-edit');
		$('.business-edit').modal('show');
	});

	//确定编辑经营范围
	$(document).on('click', '#confirm-edit', function() {
		var val = $('.business-edit .range-txt').val();
		if(val != ''){
			//发送请求
			$('.business-edit').modal('hide');
		}
	});

	// 删除
	var _self = null;
	$(document).on('click', '.icon-del', function () {
		_self = $(this).closest('tr');
		$('.business-delete').modal('show');
	});
	$('.business-delete .btn-yes').on('click', function () {
		_self.remove();
	});


	//全选
	$(document).on('click', '.all-check', function() {
		if($(this).prop("checked")){
			//全选
			$('tbody .check-num').prop("checked", true);
		}else {
			//取消全选
			$('tbody .check-num').prop("checked", false);
		}
	});

	//取消全选
	$('tbody .check-num').on('change',  function() {
		if(!$(this).prop("checked")){
			$('.all-check').prop("checked", false);
		}
	});

	//批量删除
	$(document).on('click', '.delete-range', function() {
		$('tbody tr').each(function() {
			if($(this).find('.check-num').prop("checked")){
				$(this).remove();
			}
		});
	});
});