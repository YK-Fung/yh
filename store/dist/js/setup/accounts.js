define(['jquery','pagination'], function($){
	//	添加帐号
	$('.add-accounts-btn').on('click', function() {
		$('.add-accounts .modal-title').text('添加帐号');
		$('.add-accounts .btn-yes').attr('id', 'add-accounts');
		$('.add-accounts').modal('show');
	});

	var form01 = false;//登录名称
	var form02 = false;//负责人姓名
	var form03 = false;//登录密码
	var form04 = false;//重复密码
	var form05 = false;//所属部门
	var form06 = false;//角色
	//登录名称
	$('.text01').on('blur', function() {
		//获取输入框的值
		var _value = $(this).val();
		if(_value == ''){
			$(this).siblings('.tip').text('请输入登录名称!');
		}else {
			//发送请求

			//成功
			$(this).siblings('.tip').text('');
			form01 = true;

			//失败
			//$(this).siblings('.tip').text('登录名已存在!');
		}
	});
	//负责人姓名
	$('.text02').on('blur', function() {
		//获取输入框的值
		var _value = $(this).val();
		if(_value == ''){
			$(this).siblings('.tip').text('请输入负责人姓名!');
		}else {
			//发送请求

			//成功
			$(this).siblings('.tip').text('');
			form02 = true;

			//失败
			//$(this).siblings('.tip').text('登录名已存在!');
		}
	});
	//登录密码
	$('.text03').on('blur', function() {
		//获取输入框的值
		var _value = $(this).val();
		var _value04 = $('.text04').val();
		if(_value == ''){
			$(this).siblings('.tip').text('请输入登录密码!');
		}else {
			if(_value04 == ''||_value == _value04){
				//成功
				$(this).siblings('.tip').text('');
				form03 = true;
				passwordText = $(this).val();
			}
			else {
				$(this).siblings('.tip').text('密码不一致!');
			}
		}
	});
	//重复密码
	$('.text04').on('blur', function() {
		//获取输入框的值
		var _value = $(this).val();
		var passwordText = $('.text03').val();
		if(_value == ''){
			$(this).siblings('.tip').text('请输入登录密码!');
		}else if(_value !== passwordText){
			$(this).siblings('.tip').text('密码不一致!');
		}else {
			//成功
			$(this).siblings('.tip').text('');
			form04 = true;
		}
	});

	//确定添加帐号
	$(document).on('click', '#add-accounts', function() {
		var e = event || window.event;
		var role = $('.text05').find("option:selected").text();
		if(role == '请选择'){
			$('.text05').closest('select').siblings('.tip').text('请选择角色！');
		}else {
			$('.text05').closest('select').siblings('.tip').text('');
			form05 = true;
		}
		if(form01&&form02&&form03&&form04&&form05){
			//提交表单

			//成功
			$('.add-accounts').modal('hide');
			//刷新页面
			window.location.reload();
		}
		e.preventDefault();
	});

	//修改帐号
	$(document).on('click', '.modification', function() {
		$('.add-accounts').modal('show');
		$('.add-accounts .modal-title').text('修改帐号');
		$('.add-accounts .btn-yes').attr('id', 'edit-accounts');
	});

	//确定修改帐号
	$(document).on('click', '#edit-accounts', function() {
		//成功
		//刷新页面
		window.location.reload();
	});
	
	//删除帐号
	$(document).on('click', '.delete-accounts', function() {
		//要删除帐号的id;
		var _id = $(this).parent('td').siblings('.hide-id').text();

			//请求成功 移除数据
			$(this).closest('tr').remove();
	});

	//冻结
	$(document).on('click', '.freezeing', function() {
		//要冻结帐号的id;
		var _id = $(this).parent('td').siblings('.hide-id').text();

			//请求成功 移除数据
			$(this).text('解除冻结');
			$(this).removeClass('freezeing').addClass('relieve');
			$(this).parent('td').siblings('.principal').append('<span class="freeze">（已冻结）</span>');
	});

	//解除冻结
	$(document).on('click', '.relieve', function() {
		//要冻结帐号的id;
		var _id = $(this).parent('td').siblings('.hide-id').text();

			//请求成功 移除数据
			$(this).text('冻结');
			$(this).removeClass('relieve').addClass('freezeing');
			$(this).parent('td').siblings('.principal').children('.freeze').remove();
	});
	
	// 初始化页码
	paginationArg.init($('.wrap'), $('.pagination .active').text(), $('.page-amount').text());
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};

});