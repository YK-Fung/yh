var paginationArg = {};
define(['jquery'], function($){
	/***********************************/
	// 发送给后端的当前页码:viewNum
	// 后端传总条数过来:itemAmount
	// 后端传总页数过来:pageAmount
	/***********************************/
	paginationArg = {
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
				parent.find('.pagination .page-number>a').each(function (idx) {
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
				parent.find('.pagination .page-number:first').addClass('active').siblings('.page-number').removeClass('active');
			}
			else {
				// 读取页码
				var readNum = parseInt(parent.attr('data'), 10);
				// 修改页码
				parent.find('.pagination .page-number>a').each(function (idx) {
					var pageNum = parseInt((readNum-1)/5, 10) * 5 + idx + 1;
					$(this).text(pageNum);
					// 如果数字等于最大页码，添加活动状态
					if ($(this).text() == readNum) {
						$(this).parent().addClass('active').siblings('.page-number').removeClass('active');
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
		},
		ajaxFn: function () {
			console.log('在这里添加Ajax！');
		}
	}
	// 上一页按钮点击
	$('.pagination .page-pre').on('click', function () {
		// 当前相关dom
		var paginationDom = $(this).closest('.pagination');
		// 如果是最小页数
		if (paginationDom.find('.page-number.active').text() <= 1) {
			return false;
		}
		// 如果第一个是活动状态
		if (paginationDom.find('.page-number:first').hasClass('active')) {
			paginationDom.find('.page-number>a').each(function (idx) {
				// 数字变化，大小-5
				var newNum = parseInt($(this).text(), 10) - 5;
				$(this).text(newNum);
				// 隐藏的数字按钮如果小于总页数，显示出来
				if ($(this).text() < paginationArg.pageAmount) {
					$(this).show();
				}
				// 给最后一个添加活动状态
				paginationDom.find('.page-number:last').addClass('active').siblings('.page-number').removeClass('active');
			});
		} else {
			// 如果第一个不是活动状态
			paginationDom.find('.active').prev('.page-number').addClass('active').siblings('.page-number').removeClass('active');
		}
		// 当前页码
		paginationArg.viewNum = parseInt(paginationDom.find('.page-number.active').text(), 10);
		paginationArg.ajaxFn();
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
		if (paginationDom.find('.page-number:last').hasClass('active')) {
			paginationDom.find('.page-number>a').each(function (idx) {
				// 数字变化，大小+5
				var newNum = parseInt($(this).text(), 10) + 5;
				$(this).text(newNum);
				// 显示的数字按钮如果大于总页数，隐藏出来
				if ($(this).text() > paginationArg.pageAmount) {
					$(this).hide();
				}
				// 给最后一个添加活动状态
				paginationDom.find('.page-number:first').addClass('active').siblings('.page-number').removeClass('active');
			});
		} else {
			// 如果最后一个不是活动状态
			paginationDom.find('.active').next('.page-number').addClass('active').siblings('.page-number').removeClass('active');
		}
		// 当前页码
		paginationArg.viewNum = parseInt(paginationDom.find('.page-number.active').text(), 10);
		paginationArg.ajaxFn();
	});
	// 数字按钮点击
	$('.pagination .page-number>a').on('click', function () {
		// 点击添加活动状态
		$(this).parent().addClass('active').siblings('.page-number').removeClass('active');
		// 当前页码
		paginationArg.viewNum = parseInt($(this).text(), 10);
		paginationArg.ajaxFn();
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
		paginationDom.find('.page-number>a').each(function (idx) {
			var pageNum = parseInt((pageGoNum-1)/5, 10) * 5 + idx + 1;
			$(this).text(pageNum);
			// 如果数字等于最大页码，添加活动状态
			if ($(this).text() == pageGoNum) {
				$(this).parent().addClass('active').siblings('.page-number').removeClass('active');
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
		paginationArg.ajaxFn();	
	});
	// 初始化页码
	// paginationArg.init($('.wrap'), $('.item-amount').text(), $('.page-amount').text());
	return paginationArg;
});