define(['jquery', 'datetime','bar-slider', 'bar-header','popwin', 'table', 'base64','ie-tip'], function($){
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


    // 导出在销产品
	$('.btn-export').on('click', function () {
		$('.table-export').html($('.settlement-table').html());
		$('.table-export').show();
		$('.table-export').tableExport({type:'excel',escape:'false'});
		$('.table-export').hide();
	});
	
	/***********************************/
	// 发送给后端的当前页码:viewNum
	// 后端传总条数过来:itemAmount
	// 后端传总页数过来:pageAmount
	/***********************************/
	var paginationArg = {
		// 总条数
		'itemAmount': 0,
		// 总页数
		'pageAmount': 0,
		// 当前页数
		'viewNum': 1,
		// 初始化,parent为当前对象、itemAmount为当前总条数、pageAmount为当前总页数
		init: function (parent, itemAmount, pageAmount) {
			this.itemAmount = parseInt(itemAmount);
			this.pageAmount = parseInt(pageAmount);
			console.log(parent.attr('data'));
			if (!parent.attr('data') || parent.attr('data') == '') {
				// 初始化页码数字按钮
				parent.find('.pagination .page-num').each(function (idx) {
					var pageNum = idx + 1;
					$(this).text(pageNum);
					// 数字按钮总数是否大于总页数,则隐藏
					if (pageNum > paginationArg.pageAmount) {
						$(this).hide();
					}
					else {
						$(this).show();
					}
				});
				// 初始化活动状态，默认在第一个
				parent.find('.pagination .page-num:first').addClass('active').siblings('.page-num').removeClass('active');
			}
			else {
				// 读取页码
				var readNum = parseInt(parent.attr('data'), 10);
				// 修改页码
				parent.find('.pagination .page-num').each(function (idx) {
					var pageNum = parseInt((readNum-1)/5, 10) * 5 + idx + 1;
					$(this).text(pageNum);
					// 如果数字等于最大页码，添加活动状态
					if ($(this).text() == readNum) {
						$(this).addClass('active').siblings('.page-num').removeClass('active');
					}
					// 显示的数字按钮如果大于总页数，隐藏
					if ($(this).text() > paginationArg.pageAmount) {
						$(this).hide();
					}
					else {
						$(this).show();
					}
				});
				// 当前页码
				paginationArg.viewNum = parseInt(readNum, 10);
				
			}
			// 设置总条数
			// parent.find('.pagination .item-amount').text(itemAmount);
			// 设置总页数
			// parent.find('.pagination .page-amount').text(pageAmount);
			// 显示分页条
			parent.show();
		}
	}
	// 首页按钮点击
	$('.pagination .page-first').on('click', function () {
		// 当前相关dom
		var paginationDom = $(this).closest('.pagination');
		// 修改页码
		paginationDom.find('.page-num').each(function (idx) {
			var pageNum = idx + 1;
			$(this).text(pageNum);
			// 数字按钮总数是否大于总页数,则隐藏
			if (pageNum > paginationArg.pageAmount) {
				$(this).hide();
			}
			else {
				$(this).show();
			}
		});
		// 第一个添加活动状态
		paginationDom.find('.page-num:first').addClass('active').siblings('.page-num').removeClass('active');
		// 当前页码
		paginationArg.viewNum = 1;
		
	});
	// 尾页按钮点击
	$('.pagination .page-last').on('click', function () {
		// 当前相关dom
		var paginationDom = $(this).closest('.pagination');
		// 修改页码
		paginationDom.find('.page-num').each(function (idx) {
			var pageNum = parseInt((paginationArg.pageAmount-1)/5, 10) * 5 + idx + 1;
			$(this).text(pageNum);
			// 如果数字是最大页码,添加活动状态
			if (pageNum == paginationArg.pageAmount) {
				$(this).addClass('active').siblings('.page-num').removeClass('active');
			}
			// 数字按钮总数是否大于总页数,则隐藏
			if (pageNum > paginationArg.pageAmount) {
				$(this).hide();
			}
			else {
				$(this).show();
			}
		});
		// 当前页码
		paginationArg.viewNum = paginationArg.pageAmount;
	});
	// 上一页按钮点击
	$('.pagination .page-prev').on('click', function () {
		// 当前相关dom
		var paginationDom = $(this).closest('.pagination');
		// 如果是最小页数
		if (paginationDom.find('.page-num.active').text() <= 1) {
			return false;
		}
		// 如果第一个是活动状态
		if (paginationDom.find('.page-num:first').hasClass('active')) {
			paginationDom.find('.page-num').each(function (idx) {
				// 数字变化，大小-5
				var newNum = parseInt($(this).text(), 10) - 5;
				$(this).text(newNum);
				// 隐藏的数字按钮如果小于总页数，显示出来
				if ($(this).text() < paginationArg.pageAmount) {
					$(this).show();
				}
				// 给最后一个添加活动状态
				paginationDom.find('.page-num:last').addClass('active').siblings('.page-num').removeClass('active');
			});
			return false;
		}
		// 如果第一个不是活动状态
		paginationDom.find('.active').prev('.page-num').addClass('active').siblings('.page-num').removeClass('active');
		// 当前页码
		paginationArg.viewNum = parseInt(paginationDom.find('.page-num.active').text(), 10);
	});
	// 下一页按钮点击
	$('.pagination .page-next').on('click', function () {
		// 当前相关dom
		var paginationDom = $(this).closest('.pagination');
		// 如果是最大页数
		if (paginationDom.find('.active').text() >= paginationArg.pageAmount) {
			return false;
		}
		// 如果最后一个是活动状态
		if (paginationDom.find('.page-num:last').hasClass('active')) {
			paginationDom.find('.page-num').each(function (idx) {
				// 数字变化，大小+5
				var newNum = parseInt($(this).text(), 10) + 5;
				$(this).text(newNum);
				// 显示的数字按钮如果大于总页数，隐藏出来
				if ($(this).text() > paginationArg.pageAmount) {
					$(this).hide();
				}
				// 给最后一个添加活动状态
				paginationDom.find('.page-num:first').addClass('active').siblings('.page-num').removeClass('active');
			});
			return false;
		}
		// 如果最后一个不是活动状态
		paginationDom.find('.active').next('.page-num').addClass('active').siblings('.page-num').removeClass('active');
		// 当前页码
		paginationArg.viewNum = parseInt(paginationDom.find('.page-num.active').text(), 10);
	});
	// 数字按钮点击
	$('.pagination .page-num').on('click', function () {
		// 点击添加活动状态
		$(this).addClass('active').siblings('.page-num').removeClass('active');
		// 当前页码
		paginationArg.viewNum = parseInt($(this).text(), 10);
	});
	// 跳转输入
	$('.pagination .page-go input').on('input propertychange', function () {
		if ($(this).val() == '') {
			return false;
		}
		// 如果输入数字小于最小页数，默认为最小页数
		if ($(this).val() <= 1) {
			$(this).val(1);
		}
		// 如果输入数字大于最大页数，默认为最大页数
		if ($(this).val() > paginationArg.pageAmount) {
			$(this).val(paginationArg.pageAmount);
		}
	});
	// 跳转按钮点击
	$('.pagination .page-go button').on('click', function () {
		// 当前相关dom
		var paginationDom = $(this).closest('.pagination');
		var pageGoNum = paginationDom.find('.page-go input').val();
		if (pageGoNum == '') {
			return false;
		}
		// 修改页码
		paginationDom.find('.page-num').each(function (idx) {
			var pageNum = parseInt((pageGoNum-1)/5, 10) * 5 + idx + 1;
			$(this).text(pageNum);
			// 如果数字等于最大页码，添加活动状态
			if ($(this).text() == pageGoNum) {
				$(this).addClass('active').siblings('.page-num').removeClass('active');
			}
			// 显示的数字按钮如果大于总页数，隐藏
			if ($(this).text() > paginationArg.pageAmount) {
				$(this).hide();
			}
			else {
				$(this).show();
			}
		});
		// 当前页码
		paginationArg.viewNum = parseInt(pageGoNum, 10);		
	});
	// 初始化页码
	paginationArg.init($('.wrap'), parseInt($('.item-amount').text()), parseInt($('.page-amount').text()));
});