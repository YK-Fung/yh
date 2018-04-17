define(['jquery','move-el'],function($,ZeroClipboard){

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
				//发送请求成功 右侧获取内容
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
		}
		$('.delete-node').modal('show');
		e.stopPropagation();
	});

	//确认删除
	$(document).on('click', '#comfirm-del',function() {
		//发送请求 

		//成功  把下面删了
		chooseDom = null;
		$('.box input').each(function() {
			if($(this).hasClass('active')){
				if($(this).parent().parent().children('.box').length == 1){
					$(this).parent().siblings('.toggle-ctn').remove();//删除切换按钮
				}
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
			//选中一级：在其内部最下方添加二级
			if($('.box input.active').siblings('.toggle-ctn').length == 0){
				//当子级数量为1 添加切换按钮并且展开
				$('.box input.active').before('<i class="toggle-ctn"></i>');
			}
			$('.box input.active').parent('.box').addClass('cur').siblings('.box').removeClass('cur');
			$('.box input.active').parent('.box').append('<div class="box"><input type="text" class="name" value="" placeholder="新建文档"></div>');
			//聚焦
			$('.box input.active').parent('.box').find('div.box:last input').focus();
		}else {
			// 未选中 在最下方添加一级
			$('.list').append('<div class="box"><input type="text" class="name" value="" placeholder="新建文件夹"></div>');
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
        	if($(this).hasClass('active') && $(this).attr('readonly')){
        		$(this).click();
        	}else {
	            $(this).blur();
	            $(this).attr('readonly','true');
	            $('.box input').removeClass('active');
	            $(this).addClass('active');
        	}
        }
    });

	var _Edit = new edit('.box input',document,'.move',0);
	//拖动完成ajax
	_Edit.ajaxFn = function(){
		
	}
});