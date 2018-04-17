define(['jquery', 'datetime', 'bar-slider', 'bar-header','popwin','ie-tip','pagination2'], function($){

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
            // 初始化页码
            paginationArg.init($('.wrap'), 300/(_txt*1), 2);
			e.stopPropagation();
		});	
	}());

	// 日期控件
	//年月日
	$('.date-time').datetimepicker({
        minView: "month",
        timepicker:false,
        format:'Y/m/d',
        formatDate:'Y/m/d'
    });


	//发布开始日期
	var date1 = {};
	//发布结束日期
	var date2 = {};
    $('.date1').on('change',function(){
        date1.val = $(this).val();
        date1.year = date1.val.substr(0,4);
        date1.month = date1.val.substr(5,2);
        date1.day = date1.val.substr(8,2);
        if(date2.val){
            if(date1.year * 1 > date2.year * 1){
                date1.val = date2.val;
                $(this).val(date1.val)
            }else if(date1.month * 1 > date2.month * 1){
                date1.val = date2.val;
                $(this).val(date1.val)
            }else if(date1.day * 1 > date2.day * 1){
                date1.val = date2.val;
                $(this).val(date1.val)
            }
        }
    });

    $('.date2').on('change',function(){
		 date2.val = $(this).val();
		date2.year = date2.val.substr(0,4);
		date2.month = date2.val.substr(5,2);
		date2.day = date2.val.substr(8,2);
        if(date1.val){
        	if(date2.year * 1 < date1.year * 1){
                date2.val = date1.val;
                $(this).val(date2.val)
            }else if(date2.month * 1 < date1.month * 1){
                date2.val = date1.val;
                $(this).val(date2.val)
            }else if(date2.day * 1 < date1.day * 1){
                date2.val = date1.val;
                $(this).val(date2.val)
            }
		}
    });

	//导航切换
	$(document).on('click', '.navs li', function() {
		$(this).addClass('active').siblings().removeClass('active');
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

	//批次管理
	$(document).on('click', '.batch-btn' ,function() {
		$('#batch').show();
	});

	//批量删除
	$('.batch-delete-btn').click(function() {
		if($('.table input[type=checkbox]:checked').length > 0){
			$('#tip-txt .ctn-txt').text('确认批量删除产品？');
			$('#tip-txt .btn-yes').attr('data', 'true');
			$('#tip-txt').show();
		}else{
			$('#tip-txt .ctn-txt').text('未选中要删除的产品？');
			$('#tip-txt').show();
		}
	});

	//批量删除 确定按钮
	$('#tip-txt .btn-yes').click(function() {
		if($(this).attr('data')){

			//请求成功
			$('.table tbody tr').each(function() {
				if($(this).find('input[type=checkbox]').prop("checked")){
					$(this).remove();
				}
			});
			$('#tip-txt').hide();
		}else {
			$('#tip-txt').hide();
		}
	});

	// 初始化页码
	paginationArg.init($('.wrap'), 30, 2);
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};

});
