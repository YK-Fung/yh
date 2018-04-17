define(['jquery','move'],function($){

   //点击导航添加选中状态
	var chooseDom = null;//选中的对象
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
			console.log(ajaxUrl)
		}
		$('.delete-node').modal('show');
		e.stopPropagation();
	});

	//确认删除
	$(document).on('click', '#comfirm-del',function() {
		//发送请求 ajaxUrl 为请求url
		// if(ajaxUrl != null && ajaxUrl){
		// 	//发生请求 ajaxUrl 为请求url
		// 	$.get(ajaxUrl,function (result) {
  //               if(result.code == -1){
  //                   alert(result.msg);
		// 		}else{
  //               	//成功
		// 			$('.box input').each(function() {
		// 				if($(this).hasClass('active')){
		// 					$(this).parent().remove();//删除
		// 				}
		// 			});
		// 		}
		// 	});
		// }
		chooseDom = null;
		//成功  用了上面把下面删了
		$('.box input').each(function() {
			if($(this).hasClass('active')){
				//如果没有子级删除切换按钮
				if($(this).parent().parent().children('.box').length == 1){
					$(this).parent().parent().children('.toggle-ctn').remove();
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
				var url = "/sys/help_cate/create";
				// $.post(url,_val,function (result) {
				// 	if(result.code == -1){
				// 		alert(result.msg);
				// 	}else{
		  //               //window.location.reload();
				// 	}
		  //       })
			}

		}
	});

	//enter键失焦 确认添加节点
	$(document).on('keypress','.box input',function(e){
        var keyCode = e.keyCode;
        if(keyCode == 13){  //回车事件
            $(this).blur();
            $(this).attr('readonly','true');
        }
    });

	var _Edit = new edit('.box input',document,'.move',2);
	//拖动完成ajax
	_Edit.ajaxFn = function(){
		
	}
});
