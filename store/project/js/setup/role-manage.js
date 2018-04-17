define(['jquery','move'],function($){
	/**
	 *	角色管理目录 start
	 **/
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
	_Edit.roleAjax = function(targetId,parentId,targetIndex){
		//参数（本身id,父级id,移动后下标）
		console.log(targetId+'+'+parentId+'+'+targetIndex)
	}

	//切换功能
	$('.toggle-title li').on('click', function() {
		var _index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.toggle-user-function>div').eq(_index).show().siblings().hide();
	});

	/**
	 *	角色管理目录 end
	 */

	/**
	 *	现有用户 start
	 */

	//全选
	$(document).on('click', '.checkbox-all', function() {
		var checkBox = $('tbody input[type="checkbox"]');//单选框
		checkBox.prop('checked',this.checked);
	});

	//单选
	$(document).on('click', 'tbody input[type=checkbox]',function() {
		$('.checkbox-all').prop('checked',$('tbody input[type="checkbox"]').length == $('tbody input[type="checkbox"]:checked').length ? true : false);
	});
	// 删除用户
	var _user = null;
	$(document).on('click', '.delete-user', function () {
		$('#pop-tips .tip-text').text('确定要删除该记录吗？');
		_user = $(this).closest('tr');
		$('#pop-tips').modal('show');
		$('#pop-tips .btn-yes').attr('data', 'delete-one');
	});

	//刪除多个用户
	$('.delete-user-more').on('click', function() {
		var checkNum = $('tbody input[type="checkbox"]:checked').length;
		if(checkNum > 0){
			$('#pop-tips .tip-text').text('确定要删除该选中记录吗？');
			$('#pop-tips').modal('show');
			$('#pop-tips .btn-yes').attr('data', 'delete-more');
		}else {
			$('#pop-tips .tip-text').text('未选中要删除的产品！');
			$('#pop-tips').modal('show');
		}
	});	

	//冻结用户 启动用户
	$(document).on('click', '.freeze-using', function() {
		_user = $(this);
		var _txt = $(this).text();
		if(_txt == '冻结'){
			$('#pop-tips .tip-text').text('确定要冻结该用户吗？');
			$('#pop-tips').modal('show');
			$('#pop-tips .btn-yes').attr('data', 'freeze-urer');
		}else if(_txt == '启用'){
			$('#pop-tips .tip-text').text('确定要启用该用户吗？');
			$('#pop-tips').modal('show');
			$('#pop-tips .btn-yes').attr('data', 'start-using');
		}
	});

	//添加账号
	$('.add-account-btn').click(function() {
		$('#pop-add-account input').val('');
		$('#pop-add-account').modal('show');
		$('#pop-add-account .btn-yes').attr('data', 'add-account');;
	});

	//修改账号
	$('.edit-account').click(function() {
		$('#pop-add-account').modal('show');
		$('#pop-add-account .btn-yes').attr('data', 'add-account');;
	});

	/**
	 *	添加账号/修改账号弹窗
	 */
	(function(){
		//添加账号-登录名
		$('.login-name').on('input propertychange', function() {
			var _val = $(this).val().trim();
			if(!(/^[A-Za-z0-9_]{6,20}$/.test(_val))){
				$(this).addClass('error');
			}else {
				$(this).removeClass('error');
			}
		});

		//添加账号-姓名
		$('.user-name').on('input propertychange', function() {
			var _val = $(this).val().trim();
			if(!(/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/.test(_val))){
				$(this).addClass('error');
			}else {
				$(this).removeClass('error');
			}
		});

		//添加账号-密码
		$('.user-password').on('input propertychange', function() {
			var _val = $(this).val().trim();
			if(!(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(_val))){
				$(this).addClass('error');
			}else {
				$(this).removeClass('error');
			}
		});

		//重置密码
		$(document).on('click', '.reset-pass-btn', function() {
			$('#pop-reset-password').modal('show');
			$('#pop-reset-password input').val('');
			$('#pop-reset-password .btn-yes').attr('data', 'reset-password');
		});

		//重置密码监听input
		$('.set-password-input').on('input propertychange', function() {
			var _val = $(this).val().trim();
			if(!(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(_val))){
				$(this).addClass('error');
			}else {
				$(this).removeClass('error');
			}
		});	

		//角色查询
		$('.role-list input').on('input propertychange', function() {
			if($(this).val()){
				$(this).siblings('.search-list').show();
			}else {
				$(this).siblings('.search-list').hide();
			}
		});

		//选中下拉框
		$('.search-list').on('click', 'li', function(event) {
			var e = event || window.event;
			var _txt = $(this).text();
			$(this).parent('.search-list').siblings('input').val(_txt);
			$(this).parent().hide();
			e.stopPropagation();
		});

		// 鼠标点击离开来目标，隐藏
		$(document).on('click', function() {
			$('.search-list').hide();
		});
	})();

	//弹窗确认按钮
	$('.modal .btn-yes').on('click', function () {
		var _data = $(this).attr('data');
		switch (_data) {
			case 'delete-one':
				//删除单个

				//执行成功
				_user.remove();
				$('.modal').modal('hide');
				break;
			case 'delete-more':
				//删除多个

				//执行成功
				$('tbody input[type="checkbox"]:checked').closest('tr').remove();
				$('.modal').modal('hide');
				break;
			case 'freeze-urer':
				//冻结用户
				
				//执行成功
				_user.text('启用');
				$('.modal').modal('hide');
				break;
			case 'start-using':
				//启动用户
				
				//执行成功
				_user.text('冻结');
				$('.modal').modal('hide');
				break;
			case 'reset-password':
				//重置密码
				if(!$('.set-password-input').hasClass('error') && $('.set-password-input').val()){
					//执行成功
					$('.modal').modal('hide');
				}
				break;
			case 'add-account':
				//添加账号/修改账号
				var trueNum = 0;
				$('#pop-add-account input').each(function() {
					if(!$(this).hasClass('error') && $(this).val()){
						trueNum++;
					}
				});
				if(trueNum == $('#pop-add-account input').length){
					//执行成功
					$('.modal').modal('hide');
				}else {
					alert('请检查是否有填写错误或未填写！')
				}
				break;
			default :
				$('.modal').modal('hide');
		}
	});

	/**
	 *	现有用户 end
	 **/

	/**
	 *	权限管理 start
	 **/
	// 添加切换按钮
	function toggleArrow(){
		$('.select-function .class-divide').each(function() {
			var children = $(this).find('.class-divide').length;
			if(children > 0 && !$(this).children('.arrow').length){
				$(this).prepend('<i class="arrow"></i>');
			}
		});
	}
	toggleArrow();

	// 收起和展开
	$('.select-function').on('click', '.arrow', function() {
		var parent = $(this).closest('.class-divide');
		parent.hasClass('active') ? parent.removeClass('active') : parent.addClass('active')
	});

	//切换加减按钮
	$('.select-function').on('mouseenter', '.class-txt', function(e) {
		var e = e || window.event;
		$(this).find('.glyphicon').show();
		//停止冒泡
		e.stopPropagation();
	});
	$('.select-function').on('mouseleave', '.class-txt', function(e) {
		var e = e || window.event;
		$(this).find('.glyphicon').hide();
		//停止冒泡
		e.stopPropagation();
	});

	//参数（当前对象,相对选择框,当前选择框的类名）
	function toggleClass(thisObj,currentObj,oppositeObj,_addClass){
		//当前层级
		var thisDom = thisObj.closest('.class-divide');
		//层级命名
		var className = thisDom.find('.class-name:eq(0)').text();
		//父级层级
		var parentDom = thisDom.parent('.class-divide');
		//当前的id
		var presentId = thisDom.attr('id');
		//当前的父级id
		var parentId = thisDom.attr('data');
		//查找父级元素的id
		var parentDomId = thisDom.parent('.class-divide').attr('id');
		//选中的节点
		if(currentObj == '.unselected'){
			var selectDom = thisDom.prop("outerHTML").replace(/add/g, 'reduce').replace(/plus/g, 'minus');
		}
		if(currentObj == '.selected'){
			var selectDom = thisDom.prop("outerHTML").replace(/reduce/g, 'add').replace(/minus/g, 'plus');
		}
		//是否已选择
		var exist = 0;
		var selectedThis;
		var sameParent = false;
		oppositeObj.find('.class-divide').each(function() {
			//右侧存在相同节点
			if(presentId == $(this).attr('id')){
				exist ++;
				var _this = $(this);
				thisDom.find('.class-divide').each(function() {

					var unselectId = $(this).attr('id');
					var unselectData = $(this).attr('data');
					var unselectText = $(this).find('.class-name:eq(0)').text();
					var same = 0;
					_this.find('.class-divide').each(function() {
						var hasSelectId = $(this).attr('id');
						if(unselectId == hasSelectId){
							same++;	
						}
					});
					if(same <= 0){
						oppositeObj.find('#'+unselectData).append('<div class="class-divide" id="'+unselectId+'" data="'+unselectData+'"><div class="class-txt"><span class="class-name">'+unselectText+'</span><i class="'+_addClass+'"></i></div></div>');
						toggleArrow();
					}
				});
			}
			//右侧存在相同的父节点
			else if(parentId == $(this).attr('id')){
				//未选择 但 已选择父级
				selectedThis = $(this);
			}
		});

		//右侧存在相同的父节点 执行代码
		if(exist == 0 && selectedThis){
			//未选择 但  已选择父级
			selectedThis.append(selectDom);
			oppositeObj.find('.reduce-group').hide();
			oppositeObj.find('.add-group').hide();
			// 添加切换按钮
			toggleArrow();
			selectedThis.addClass('active');
		}

		//移除子级为空的父级
		function removeEmpty(){
			thisDom = thisObj.closest('.class-divide');
			//父级层级
			parentDom = thisDom.parent('.class-divide');
			//当前的父级id
			parentId = thisDom.attr('data');
			//查找父级元素的id
			parentDomId = thisDom.parent('.class-divide').attr('id');
			thisDom.html('');
			while (parentId == parentDomId) {
				//移除子级为空的父级
				var deleteDom = thisDom;
				if(deleteDom.find('.class-divide').length <= 0){
					deleteDom.remove()
				}
				//当前层级
				thisDom = parentDom;
				parentDom = parentDom.parent('.class-divide');
				//当前层级id 和 名称
				parentId = thisDom.attr('data');
				parentDomId = parentDom.attr('id');
			}
			if(thisDom.find('.class-divide').length <= 0){
				thisDom.remove()
			}
		}

		if(exist > 0 || selectedThis){
			removeEmpty();
			return false;
		}

		//未选择
		var selectedTar = null;
		while (parentId == parentDomId && !selectedTar) {
			//当前层级
			thisDom = parentDom;
			parentDom = parentDom.parent('.class-divide');
			//当前层级id 和 名称
			parentId = thisDom.attr('data');
			parentDomId = parentDom.attr('id');
			presentId = thisDom.attr('id');
			className = thisDom.find('.class-name:eq(0)').text();
			//添加到已选择
			var addDom = '<div class="class-divide active" id="'+presentId+'" data="'+parentId+'"><i class="arrow"></i><div class="class-txt"><span class="class-name">'+className+'</span><i class="'+_addClass+'"></i></div></div>';
			var element = $(addDom).get(0);
			$(element).append(selectDom);
			selectDom = $(element).clone();
			//查询上级是否已选择
			oppositeObj.find('.class-divide').each(function() {
				var _id = $(this).attr('id');
				if(parentId == _id){
					selectedTar = $(this);
				}
			})
		}

		//已选择框插入内容
		if(selectedTar){
			//已存在父节点
			selectedTar.append(selectDom);
			// 添加切换按钮
			toggleArrow();
			selectedTar.addClass('active');
		}else {
			//未存在父节点
			oppositeObj.append(selectDom);
		}
		//隐藏加减号
		oppositeObj.find('.reduce-group').hide();
		oppositeObj.find('.add-group').hide();

		//移除子级为空的父级
		removeEmpty();
		if(thisObj.closest('.class-divide').parent().hasClass(currentObj)){
			thisObj.closest('.class-divide').remove();
		}
	}

	//选择功能
	$('.unselected').on('click', '.class-divide .add-group', function() {
		var thisObj = $(this);
		var _addClass = 'reduce-group glyphicon glyphicon-minus';
		toggleClass(thisObj,'.unselected',$('.selected'),_addClass);
		return false;
	});

	//取消功能
	$('.selected').on('click', '.class-divide .reduce-group', function() {
		var thisObj = $(this);
		var _addClass = 'add-group glyphicon glyphicon-plus';
		toggleClass(thisObj,'.selected',$('.unselected'),_addClass);
		return false;
	});

	/**
	 *	权限管理 end
	 **/
});
