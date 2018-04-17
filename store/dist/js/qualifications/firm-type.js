define(['jquery','move'],function($){

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
				$('#menu-title').text($(this).val());
				//发送请求成功
				if($(this).parent().parent().hasClass('list')){
					//为一级菜单
					$('.tab-tit ul>li').eq(1).hide();
					$('.tab-tit ul>li').eq(0).show();
					$('.tab-tit ul>li').eq(2).show();
					//添加样式
					$('.tab-tit ul>li').eq(0).addClass('active').siblings('li').removeClass('active');
					$('.tab-ctn>li').eq(0).show().siblings('li').hide();
					//同步到子类显示
					$('.sync').show();
				}else {
					//为二级菜单
					$('.tab-tit ul>li').eq(0).hide();
					$('.tab-tit ul>li:gt(0)').show();
					$('.tab-tit ul>li').eq(1).addClass('active').siblings('li').removeClass('active');
					$('.tab-ctn>li').eq(1).show().siblings('li').hide();
					//同步到子类隐藏
					$('.sync').hide();
				}
			}
		}
		else {
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

		//成功  用了上面把下面删了
		chooseDom = null;
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
			$('.box input.active').parent('.box').after('<div class="box"><input type="text" class="name" value="" placeholder="菜单名" data="id"></div>');
			$('.box input.active').parent('.box').next().children('input').focus();
		}else {
			$('.list').append('<div class="box"><input type="text" class="name" value="" placeholder="菜单名" data="id"></div>');
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
            $(this).blur();
           // $(this).attr('readonly','true');
        }
    });

	var _Edit = new edit('.box input',document,'.move',2);//（鼠标点击的目标，移动的范围，移动的提示语对象，允许最高多少级）
	//拖动完成ajax
	edit.ajaxFn = function(){

	}

	/////////切换tab烂//////////

	$('.tab-tit').on('click', 'li', function() {
		$(this).addClass('active').siblings('li').removeClass('active');
		var _data = $(this).data('tit');
		$('.tab-ctn>li').each(function() {
			if($(this).data('tit') == _data){
				$(this).show().siblings('li').hide();
			}
		});
	});


	/////////范围设定//////////


	//添加标签
	$('.add .input-group-addon').on('click', function() {
		var _val = $(this).siblings('input').val();
		if(_val){
			$(this).parent('.add').siblings('.list').append('<li><span>	'+_val+'</span><i class="glyphicon glyphicon-remove close-btn"></i></li>');
			$(this).siblings('input').val('');
		}
	});

	//删除标签
	$(document).on('click', '.list .close-btn', function() {
		$(this).parent('li').remove();
	});

	//范围设定 同步到子类
	$(document).on('click', '.range-sync', function() {
		$('.sync-alert').modal('show');
		$('.sync-alert .btn-yes').attr('id', 'confirm-range-sync');
	});

	$(document).on('click', '#confirm-range-sync', function() {
		console.log('范围设定同步');
	});

	/////////企业资质//////////


	//全选按钮
	$('.page-top .checkbox-all').on('change', function() {
		if($(this).prop("checked")){
			//全选
			$('.firm-aptitude .name-list').find('.choose-this').prop("checked", true);
		}else {
			//取消全选
			$('.firm-aptitude .name-list').find('.choose-this').prop("checked", false);
		}
	});

	//取消选中
	$('.firm-aptitude .choose-this').on('change',  function() {
		if(!$(this).prop("checked")){
			$('.page-top .checkbox-all').prop("checked", false);
		}
	});

	//删除选项
	$(document).on('click', '.delete-this', function() {
		$(this).closest('li').remove();
		//追加到弹窗
		var _txt = $(this).closest('li').find('.aptitude-name').text();
		$('.aptitude-toggle .name-list').append('<li><div class="checkbox"><label><input type="checkbox" class="choose-this"><span class="aptitude-name">'+_txt+'</span></label></div></li>');
	});

	//批量删除
	$(document).on('click', '.remove-group', function() {
		$('.firm-aptitude .choose-this').each(function() {
			if($(this).prop("checked")){
				$(this).closest('li').remove();
				//追加到弹窗
				var _txt = $(this).closest('li').find('.aptitude-name').text();//获取文本
				var _id = $(this).closest('li').attr('data');//获取id的值
				$('.aptitude-toggle .name-list').append('<li data="'+_id+'"><div class="checkbox"><label><input type="checkbox" class="choose-this"><span class="aptitude-name">'+_txt+'</span></label></div></li>');
			}
		});
	});

	//上移按钮
	$(document).on('click', '.into-top',function() {
   		var ele = $(this).closest('li');
        var _new =  ele.clone();
        ele.prev().before(ele);
    });	

    //点击必填
    $(document).on('change', '.function .must', function() {
    	if($(this).prop("checked")){
    		$(this).closest('li').find('.aptitude-name').before('<i class="must-show">*</i>');
    	}else {
    		$(this).closest('li').find('.must-show').remove();
    	}
    });


	//添加资质
	$('.alert-btn .add-group').on('click', function() {
		$('.aptitude-toggle').modal('show');
	});

	//弹窗全选按钮
	$('.aptitude-toggle .checkbox-all').on('change', function() {
		if($(this).prop("checked")){
			//全选
			$('.aptitude-toggle .name-list').find(':checkbox').prop("checked", true);
		}else {
			//取消全选
			$('.aptitude-toggle .name-list').find(':checkbox').prop("checked", false);
		}
	});

	//弹窗取消选中
	$('.aptitude-toggle .choose-this').on('change',  function() {
		if(!$(this).prop("checked")){
			$('.aptitude-toggle .checkbox-all').prop("checked", false);
		}
	});

	//确定添加按钮
	$('.aptitude-toggle .btn-yes').on('click', function() {
		$(this).closest('.aptitude-toggle').find('.choose-this').each(function() {
			if($(this).prop("checked")){
				//删除选中标签
				$(this).closest('li').remove();
				var _tet = $(this).siblings('.aptitude-name').text();//获取文本
				var _id = $(this).closest('li').attr('data');//获取id的值
				//追加已选中标签
				$('.firm-aptitude .name-list').append('<li data="'+_id+'"><div class="checkbox pull-left"><label><input type="checkbox" class="choose-this"><span  class="aptitude-name">'+_tet+'</span></label></div><div class="function pull-left"><div class="checkbox pull-left"><label><input type="checkbox" class="must">* 必填</label></div><i class="glyphicon glyphicon-arrow-up into-top"></i><i class="glyphicon glyphicon-trash delete-this"></i></div></li>')
			}
		});

		//返回成功  关闭弹窗
		$('.aptitude-toggle').modal('hide');
	});


	//企业资质列表 同步到子类
	$(document).on('click', '.aptitude-sync', function() {
		$('.sync-alert').modal('show');
		$('.sync-alert .btn-yes').attr('id', 'confirm-aptitude-sync');
	});

	$(document).on('click', '#confirm-aptitude-sync', function() {
		console.log('企业资质列表同步');
	});



	//复制
	$(document).on('click', '.aptitude-copy', function() {
		var selected = new Array();//已选
		$('.firm-aptitude .name-list li').each(function(i) {
			selected[i] = $(this).attr('data');
		});
		console.log(selected);
	});

});
