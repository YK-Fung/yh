define(['jquery', 'datetime','bar-slider', 'bar-header', 'ie-tip', 'pagination2'], function($){

	// //屏幕小于1670导航栏收起
	// function toggleClient(){
	// 	var _width = document.body.clientWidth;
	// 	if(_width <= 1300){
	// 		$('.bar-slider').addClass('close');
	// 		$('.ctn-right').addClass('close');
	// 	}
	// };
	// toggleClient();
	// $(window).bind('resize', function() {
	// 	toggleClient();
	// });

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

	//年月日时分
	$('.month-date-time').datetimepicker({
		step:10
	});

	//自定义复选框
	$.fn.toggleCheckbox = function () {
	 this.attr("checked", !this.attr("checked"));
	};

	$('.tabel-all').on('click', '.checkbox', function() {
		//切换attr属性
		$(this).find(':checkbox').toggleCheckbox();
		//切换样式
		$(this).toggleClass('active');
		
		if(!$(this).find(':checkbox').attr("checked")){
			//取消全选
			$('.select-all-checkbox').removeClass('active');
			$('.select-all-checkbox').find(':checkbox').attr("checked", false);
			//取消选中
			$(this).closest('tr').removeClass('active');
		}else {
			//添加选中状态
			$(this).closest('tr').addClass('active');
		}
	});

	//全选
	$('.select-all-checkbox').on('click', function() {
		if(!$(this).find(':checkbox').attr("checked")){
			//全选
			$(this).addClass('active');
			$(this).find(':checkbox').attr("checked", true);
			$('.tabel-all').find('.checkbox').addClass('active');
			$('.tabel-all').find(':checkbox').attr("checked", true);
			$('tbody tr').addClass('active');
		}else {
			//取消全选
			$(this).removeClass('active');
			$(this).find(':checkbox').attr("checked", false);
			$('.tabel-all').find('.checkbox').removeClass('active');
			$('.tabel-all').find(':checkbox').attr("checked", false);
			$('tbody tr').removeClass('active');
		}
	});

	// 删除
	$('.btn-del').on('click', function () {
		$('#pop-del').fadeIn('fast');
	});
	// 确定删除
	$('#pop-del .btn-yes').on('click', function () {
		$('.tabel-all tr.active').remove();
		$(this).closest('.pop-shade').fadeOut('fast');
	});
	// 关闭弹窗
	$('.pop-shade .btn-no, .pop-shade .fa-close').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	// 标为已读
	$('.btn-read').on('click', function () {
		$('.tabel-all tr.active .read-status').text('已读');
		$('.tabel-all tr.active').addClass('read-yes');
	});

	// 查看详情
	var detailSelf;
	$('.detail').on('click', function () {
		detailSelf = $(this).closest('tr');
		// $('#pop-detail .header-text').text($(this).attr('title'));
		$('#pop-detail').fadeIn('fast');
	});
	$('#pop-detail .btn-yes').on('click', function () {
		detailSelf.find('.read-status').text('已读');
		detailSelf.addClass('read-yes');
		$('#pop-detail').fadeOut('fast');
	});

	// 取消or关闭按钮
	$('.pop-shade .btn-no, .pop-shade .header-close').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});


	// 初始化页码
	paginationArg.init($('.wrap'), 10, 2);
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};

});
