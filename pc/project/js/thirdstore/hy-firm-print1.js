define(['jquery','bar-slider', 'bar-header','ie-tip'], function($){
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
			this.itemAmount = itemAmount;
			this.pageAmount = pageAmount;
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
			// 设置总条数
			parent.find('.pagination .item-amount').text(itemAmount);
			// 设置总页数
			parent.find('.pagination .page-amount').text(pageAmount);
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
			var pageNum = paginationArg.pageAmount - (paginationArg.pageAmount%5) + idx + 1;
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
	paginationArg.init($('.wrap'), 100, 11);
});
