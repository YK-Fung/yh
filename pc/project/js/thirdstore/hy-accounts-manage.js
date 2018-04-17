define(['jquery', 'bar-slider', 'bar-header','pagination2','ie-tip'], function($){
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

	//弹窗关闭按钮
	function closePop(_this){
		_this.closest('.pop-shade').hide();
		_this.closest('.pop-shade').find('.btn-yes').attr('id', '');
		_this.closest('.pop-shade').find('.txt').val('');
		_this.closest('.pop-shade').find('.tip').text('');
	}
	$('.btn-no,.header-close').on('click', function() {
		var _this = $(this);
		closePop(_this);
	});

	//添加一级部门的弹窗
	$('.add-department-a').on('click', function() {
		$('#pop-department-a').show();
		$('#pop-department-a .header-text').text('添加部门');
		$('#pop-department-a .btn-yes').attr('id', 'add-department-a');
	});

	//添加一级部门
	$('body').on('click', '#add-department-a',function() {
		var _this = $(this);
		//获取输入的值
		var _val = _this.closest('.pop-shade').find('.txt').val();
		if(_val == ''){
			//提示
			_this.closest('.pop-shade').find('.tip').text('请输入部门名称');
		}else {
			//请求成功执行以下

			_this.closest('.pop-shade').find('.tip').text('');
			//弹窗关闭
			closePop(_this);
			//插入内容
			var addDom = '<li><div class="first-class"><span class="first-name">'+_val+'</span><i class="fa fa-plus-circle add-department-b"></i><i class="fa fa-minus-circle delete-a"></i><i class="fa fa-edit edit-a"></i></div><ul class="second-class"></ul></li>';
			$('.add-lf .class').append(addDom);


		}
	});

	//修改一级部门的弹窗
	var deparName;
	$('body').on('click', '.edit-a', function() {
		$('#pop-department-a').show();
		$('#pop-department-a .header-text').text('修改部门');
		$('#pop-department-a .btn-yes').attr('id', 'edit-department-a');
		//获取当前部门名称
		deparName =  $(this).siblings('.first-name');
		var _val = deparName.text();
		//添加默认值
		$('#pop-department-a .txt').val(_val);
	});

	//修改一级部门
	$('body').on('click', '#edit-department-a',function() {
		var _this = $(this);
		//获取输入的值
		var _val = _this.closest('.pop-shade').find('.txt').val();
		if(_val == ''){
			//提示
			_this.closest('.pop-shade').find('.tip').text('请输入部门名称');
		}else {
			//请求成功执行以下


			_this.closest('.pop-shade').find('.tip').text('');
			//弹窗关闭
			closePop(_this);
			_this.closest('.pop-shade').find('.txt').val('');
			//修改内容
			deparName.text(_val);


		}
	});

	//删除一级部门
	var delOneDepar;
	$('body').on('click', '.delete-a', function() {
		$('#pop-tip').find('.pop-body').text('您确定要删除该部门吗？');
		$('#pop-tip .btn-yes').attr('id', 'delete-a');
		$('#pop-tip').show();
		delOneDepar = $(this).closest('li');
	});

	//确定删除一级部门
	$('body').on('click', '#delete-a', function() {
		//请求成功执行以下
		delOneDepar.remove();
		$('#pop-tip').hide();
	});
	
	//添加二级部门的弹窗
	var secondClass;
	$('body').on('click', '.add-department-b', function() {
		//获取当前部门名称
		var oneDeparName =  $(this).siblings('.first-name').text();
		$('#pop-department-b').find('.department-name').val(oneDeparName);
		$('#pop-department-b').show();
		$('#pop-department-b .header-text').text('添加部门');
		$('#pop-department-b .btn-yes').attr('id', 'add-department-b');
		//获取当前所属上级部门
		secondClass =  $(this).closest('.first-class').siblings('.second-class');
		
	});

	//添加二级部门
	$('body').on('click', '#add-department-b', function() {
		//弹窗父级
		var parent = $(this).closest('.pop-shade');
		//部门名称
		var nameVal = parent.find('.txt').val();
		if( nameVal == ''){
			parent.find('.name').children('.tip').text('请输入部门名称');
		}else {
		//请求成功执行以下

			$('#pop-department-b').hide();
			parent.find('.name').children('.tip').text('');
			//添加二级部门
			var addDom = '<li><span>'+nameVal+'</span><i class="fa fa-minus-circle delete-b"></i><i class="fa fa-edit edit-b"></i></i>';
			secondClass.append(addDom);


		}
	});

	//删除二级部门
	var delTwoDepar;
	$('body').on('click', '.delete-b', function() {
		$('#pop-tip').find('.pop-body').text('您确定要删除该部门吗？');
		$('#pop-tip .btn-yes').attr('id', 'delete-b');
		$('#pop-tip').show();
		delTwoDepar = $(this).closest('li');
	});

	//确定删除二级部门
	$('body').on('click', '#delete-b', function() {
		//请求成功执行以下
		delTwoDepar.remove();
		$('#pop-tip').hide();
	});

	//修改二级部门
	var twoDeparDom;
	$('body').on('click', '.edit-b', function() {
		//获取当前部门名称
		twoDeparDom =  $(this).siblings('span');
		var twoDeparName = twoDeparDom.text();
		//获取一级部门名称
		var oneDeparName =  $(this).closest('.depart-all').find('.first-name').text();
		$('#pop-department-b').find('.department-name').val(oneDeparName);
		$('#pop-department-b').find('.txt').val(twoDeparName);
		$('#pop-department-b').show();
		$('#pop-department-b .header-text').text('修改部门');
		$('#pop-department-b .btn-yes').attr('id', 'edit-b');
	});

	//确定修改二级部门
	$('body').on('click', '#edit-b', function() {
		//弹窗父级
		var parent = $(this).closest('.pop-shade');
		//部门名称
		var nameVal = parent.find('.txt').val();

		if( nameVal == ''){
			parent.find('.name').children('.tip').text('请输入部门名称');
		}else {
		//请求成功执行以下

			$('#pop-department-b').hide();
			parent.find('.name').children('.tip').text('');
			twoDeparDom.text(nameVal);

		}
	});

	//	添加帐号
	$('.add-accounts-btn').on('click', function() {
		$('#pop-add-accounts').show();
		$('#pop-add-accounts .header-text').text('添加帐号');
		$('#pop-add-accounts .btn-yes').attr('id', 'add-accounts');
	});

	var form01 = false;//登录名称
	var form02 = false;//负责人姓名
	var form03 = false;//登录密码
	var form04 = false;//重复密码
	var form05 = false;//所属部门
	var form06 = false;//角色
	//登录名称
	$('.text01').on('input propertychange blur', function() {
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
	$('.text02').on('input propertychange blur', function() {
		//获取输入框的值
		var _value = $(this).val();
		if(_value == ''){
			$(this).siblings('.tip').text('请输入负责人姓名!');
		}else  if(!(/^(^[\u4e00-\u9fa5]{2,20}$)|(^[A-Za-z]{2,20}$)$/.test(_value))){
			//格式不正确
			$(this).siblings('.tip').text('负责人姓名格式不正确!');
		}else{
			//发送请求

			//成功
			$(this).siblings('.tip').text('');
			form02 = true;

			//失败
			//$(this).siblings('.tip').text('登录名已存在!');
		}
	});

	//账号密码 
	$('.text03').on('input propertychange blur', function() {
		var selfVal = $.trim($(this).val());
		// 验证为空和字符串
		if(selfVal === ''){
			//为空
			$(this).siblings('.tip').text('请输入登录密码!');
		}else if(!(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(selfVal))){
			//格式不正确
			$(this).siblings('.tip').text('密码格式不正确!');
		}else {
			//成功
			$(this).siblings('.tip').text('');
			form03 = true;
			passwordText = $(this).val();
			//对比再‘确认密码’框
			validate();
		}
	});

	//确认密码 
	$('.text04').on('input propertychange blur', function() {
		//获取输入框的值
		var selfVal = $.trim($(this).val());
		if(selfVal === ''){
			//为空
			$(this).siblings('.tip').text('请输入登录密码!');
		}else if(!(/^[\da-zA-Z`~_!@#$%^&*\(\)-_+={}|\[\];':\",\.\\\/\?]{6,20}$/.test(selfVal))){
			//格式不正确
			$(this).siblings('.tip').text('密码格式不正确!');
		}else {
			//对比再‘确认密码’框
			$(this).siblings('.tip').text('');
			validate();
		}
	});

	//对比两次输入的密码
	function validate(){
		var pwd1 = $('.text03').val();
		var pwd2 = $('.text04').val();
		if(pwd1 === pwd2 && pwd1 !== '' && pwd2 !== ''){
			//两次输入密码一致
			 $('.text04').siblings('.tip').text('');
		}else if(pwd1 !== pwd2 && pwd1 !== '' && pwd2 !== ''){
			//两次输入密码不一致
			 $('.text04').siblings('.tip').text('密码不一致！');
		}
	}

	//确定添加帐号
	$(document).on('click', '#add-accounts', function() {
		var e = event || window.event;
		var department = $('.text05').text();
		var role = $('.text06').text();
		if(department == '请选择'){
			$('.text05').closest('.select-box').siblings('.tip').text('请选择部门！');
		}else {
			$('.text05').closest('.select-box').siblings('.tip').text('');
			form05 = true;
		}

		if(role == '请选择'){
			$('.text06').closest('.select-box').siblings('.tip').text('请选择角色！');
		}else {
			$('.text06').closest('.select-box').siblings('.tip').text('');
			form06 = true;
		}
		if(form01&&form02&&form03&&form04&&form05&&form06){
			//提交表单

			//成功
			$('#pop-add-accounts').hide();
			//刷新页面
			window.location.reload();

		}
		e.preventDefault();
	});

	//修改帐号
	$(document).on('click', '.modification', function() {
		$('#pop-add-accounts').show();
		$('#pop-add-accounts .header-text').text('修改帐号');
		$('#pop-add-accounts .btn-yes').attr('id', 'edit-accounts');
		
	});
	//确定修改帐号
	$(document).on('click', '#edit-accounts', function() {
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

});
