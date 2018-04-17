define(['jquery','move'],function($){

	//限制文件格式
	$('input[type=file]').change(function() {
		var _val = $(this).val()
		var index1 = _val.lastIndexOf(".")
		var index2 = _val.length;
		var postf =_val.substring(index1,index2);//后缀名

		if(postf != '.doc' && postf != '.docx' && postf != ".exl" && postf != ".xls" && postf != ".xlsx" && postf != ".jpg" && postf != ".png" && postf != ".bmp" && postf != ".gif"){
			$('input[type=file]').val('')
		}
		if(!_val){
			$(this).siblings('.template').find('input').prop({'checked': false})
		}
	});
	

    //点击导航添加选中状态
	var chooseDom = null;//选中的对象
	$(document).on('click', '.box input', function(event) {
		var e = event || window.event;
		if(!$(this).hasClass('active')){
			$('.box input').removeClass('active');
			$(this).addClass('active');
			//选中的对象
			chooseDom = $(this).parent('.box');
			if($(this).attr('readonly')){
				//发送请求成功
				$('.toggle-ctn').show();
				$('#menu-title').text($(this).val());
			}
		}else {
			if(!$(this).is(":focus")){
				//编辑
				$(this).removeAttr('readonly');
				$(this).select();
			}
		}
		e.stopPropagation();
	});

	//删除弹窗
	var ajaxUrl = null;//请求的URL
	$(document).on('click', '.glyphicon-minus-sign', function(event) {
		var e = event || window.event;
		if(!chooseDom){
			//未选中
			$('.delete-node .modal-body').html('请选择需要删除的目录!');
			$('.delete-node .btn-yes').hide();
			$('.delete-node .btn-yes').attr('id', '');
		}else {
			//已选中
			$('.delete-node .modal-body').html('你确定要删除该目录吗？');
			$('.delete-node .btn-yes').show();
			$('.delete-node .btn-yes').attr('id', 'comfirm-del');
			//拿到url
			ajaxUrl = $('.box input.active').attr('data');
		}
		$('.delete-node').modal('show');
		e.stopPropagation();
	});

	//确认删除
	$(document).on('click', '#comfirm-del',function() {
		//发送请求 ajaxUrl 为请求url

		//成功  用了上面把下面删了
		chooseDom = null;
		$('.box input').each(function() {
			if($(this).hasClass('active')){
				$(this).parent().remove();//删除
			}
		});

		$('.delete-node').modal('hide');//隐藏弹窗

	});

	//添加
	$(document).on('click', '.glyphicon-plus-sign', function() {
		//如果没有选中添加的对象
		var boxDOm = $('.box input').hasClass('active');
		if(boxDOm){
			$('.box input.active').parent('.box').after('<div class="box"><input type="text" class="name" value="" placeholder="菜单名"></div>');
			$('.box input.active').parent('.box').next().children('input').focus();
		}else {
			$('.list').append('<div class="box"><input type="text" class="name" value="" placeholder="菜单名"></div>');
			$('.list div.box:last input').focus();
		}
	});

	//输入框失焦 确认添加节点
	$(document).on('blur', '.box input', function() {
		if(!$(this).attr('readonly')){
			$(this).attr('readonly','true');
			//发送请求
			var _val = $(this).val();
			if(_val != ''){
				//发送请求

			}else {
				$(this).closest('.box').remove();
			}
		}
	});

	//enter键失焦 确认添加节点
	$(document).on('keypress','.box input',function(e){
        var keyCode = e.keyCode;
        if(keyCode == 13){  //回车事件
            $(this).blur();//调用失焦事件
            $(this).attr('readonly','true');
        }
    });

	var _Edit = new edit('.box input',document,'.move',1);//（鼠标点击的目标，移动的范围，移动的提示语对象，允许最高多少级）
	//拖动完成ajax
	_Edit.ajaxFn = function(){
	}

	//切换选项
	$('.btn-chooses .radio').on('click', function() {
		if($(this).hasClass('radio-choose3')){
			$('.tab-all').hide();
		}else {
			$('.tab-all .list-tag').html('');
			$('.tab-all').show();
		}
	});

	//添加标签
	$('.input-group .add-tag').on('click',  function() {
		var _val = $(this).siblings('input').val();
		if(_val){
			$('.list-tag').append('<li><span>'+_val+'</span><input type="text" value="'+_val+'" readonly><i class="glyphicon glyphicon-remove close"></i></li>');
			$(this).siblings('input').val('');
		}
	});

	//删除标签
	$('.list-tag').on('click', '.close', function() {
		$(this).parent('li').remove();
	});
});
