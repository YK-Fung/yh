define(['jquery'], function($){

	// 设置默认是ajax
	// $._pageFn.pageAjaxSet = function () {
	// 	console.log('这里设置默认的ajax！');
	// }

	// 初始化页码，el选择append进去的dom，pageSet设置查看的页面，不设置默认显示第一页，pageAmount设置总页数。
	// $._pageFn({
	// 	'el': '.main',
	// 	'pageAmount': 12
	// });

	// 初始化页面，并且设置特定的ajax。
	// $._pageFn({
	// 	'el': '.main',
	// 	'pageSet': 5,
	// 	'pageAmount': 20
	// }).pageAjax(function () {
	// 	console.log(this.pageView)
	// });

	/*************************************/

	$._pageFn = function (arg) {

		var _defaults = {
			'el': null, //选择append进去的dom
			'pageSet': null, //设置查看的页面
			'pageView': 1, //预览页面,确定类型用
			'pageAmount': 1, //设置总页面数
			// ajax
			pageAjaxFn: function () {
				console.log('这是Ajax！');
			}
		};

		var _opt = $.extend({}, _defaults, arg);

		// 如果没有设置目标dom，不往下执行
		if (!_opt.el) {
			alert('请选择目标DOM！');
			return;
		}

		// 如果传入了新的ajax，使用新的覆盖原本默认是ajax
		_opt.pageAjaxFn = $._pageFn.pageAjaxSet || _opt.pageAjaxFn;
		_opt.pageAjax = function (ajaxArg) {
			if (ajaxArg) {
				_opt.pageAjaxFn = ajaxArg;
			}
		}
		// 页码
		var pageNumDom = '<ul><li class="page-first">首页</li><li class="page-prev">上一页</li><li class="page-num">1</li><li class="page-num">2</li><li class="page-num">3</li><li class="page-num">4</li><li class="page-num">5</li><li class="page-next">下一页</li><li class="page-last">尾页</li></ul>';
		// 页面统计
		var totalNumDom = '<div class="all-num">共<span class="page-view">' + _opt.pageView + '</span><span>/</span><span class="page-amount">' + _opt.pageAmount + '</span>页</div>'
		// 跳转
		var pageNumGo = '<div class="page-go"><input name="" type="text" value=""><button>跳转</button></div>'
		// 生成dom
		var paginationHtml = $('<div class="pagination"></div>').append(pageNumDom + totalNumDom + pageNumGo);

		// 初始化
		var init = function () {
			var pageNum;
			// 是否有设置页面.
			if (_opt.pageSet) {
				paginationHtml.find('.page-num').each(function (idx) {
					pageNum = parseInt((_opt.pageSet - 1) / 5, 10) * 5 + idx + 1;
					// pageNum = _opt.pageSet + idx;
					$(this).text(pageNum);
					// 显示的数字按钮如果大于总页数，隐藏
					if (pageNum > _opt.pageAmount) {
						$(this).hide();
					}
					else {
						$(this).show();
					}
					// 如果数字等于最大页码，添加活动状态
					if (pageNum === _opt.pageSet) {
						$(this).addClass('active').siblings('.page-num').removeClass('active');
					}
				});
			} else {
				paginationHtml.find('.page-num').each(function (idx) {
					pageNum = idx + 1;
					$(this).text(pageNum);
					// 数字按钮总数是否大于总页数,则隐藏
					if (pageNum > _opt.pageAmount) {
						$(this).hide();
					}
					else {
						$(this).show();
					}
					// 如果数字等于1，添加活动状态
					if (pageNum === 1) {
						$(this).addClass('active').siblings('.page-num').removeClass('active');
					}
				});
			}
			// 当前页
			_opt.pageView = paginationHtml.find('.page-num.active').text();
			paginationHtml.find('.page-view').text(_opt.pageView);
			$(_opt.el).append(paginationHtml);
		}
		init();

		// 首页
		paginationHtml.find('.page-first').on('click', function () {
			paginationHtml.find('.page-num').each(function (idx) {
				var pageNum = idx + 1;
				$(this).text(pageNum);
				// 数字按钮总数是否大于总页数,则隐藏
				if (pageNum > _opt.pageAmount) {
					$(this).hide();
				}
				else {
					$(this).show();
				}
				// 如果数字等于1，添加活动状态
				if (pageNum === 1) {
					$(this).addClass('active').siblings('.page-num').removeClass('active');
				}
			});
			// 当前页
			_opt.pageView = paginationHtml.find('.page-num.active').text();
			paginationHtml.find('.page-view').text(_opt.pageView);
			// ajax
			_opt.pageAjaxFn();
		});
		// 尾页
		paginationHtml.find('.page-last').on('click', function () {
			paginationHtml.find('.page-num').each(function (idx) {
				var pageNum = parseInt((_opt.pageAmount-1)/5, 10) * 5 + idx + 1;
				$(this).text(pageNum);
				// 数字按钮总数是否大于总页数,则隐藏
				if (pageNum > _opt.pageAmount) {
					$(this).hide();
				}
				else {
					$(this).show();
				}
				// 如果数字是最大页码,添加活动状态
				if (pageNum === _opt.pageAmount) {
					$(this).addClass('active').siblings('.page-num').removeClass('active');
				}
			});
			// 当前页
			_opt.pageView = paginationHtml.find('.page-num.active').text();
			paginationHtml.find('.page-view').text(_opt.pageView);
			// ajax
			_opt.pageAjaxFn();
		});

		// 上一页
		paginationHtml.find('.page-prev').on('click', function () {
			// 如果是最小页数
			if (paginationHtml.find('.page-num.active').text() <= 1) {
				return;
			}
			// 如果第一个是活动状态
			if (paginationHtml.find('.page-num:first').hasClass('active')) {
				paginationHtml.find('.page-num').each(function (idx) {
					// 数字变化，大小-5
					var newNum = parseInt($(this).text(), 10) - 5;
					$(this).text(newNum);
					// 隐藏的数字按钮如果小于总页数，显示出来
					if ($(this).text() < _opt.pageAmount) {
						$(this).show();
					}
					// 给最后一个添加活动状态
					paginationHtml.find('.page-num:last').addClass('active').siblings('.page-num').removeClass('active');
				});
			}
			else {
				// 如果第一个不是活动状态
				paginationHtml.find('.active').prev('.page-num').addClass('active').siblings('.page-num').removeClass('active');
			}
			// 当前页
			_opt.pageView = paginationHtml.find('.page-num.active').text();
			paginationHtml.find('.page-view').text(_opt.pageView);
			// ajax
			_opt.pageAjaxFn();
		});
		// 下一页按钮点击
		paginationHtml.find('.page-next').on('click', function () {
			// 如果是最大页数
			if (paginationHtml.find('.page-num.active').text() >= _opt.pageAmount) {
				return;
			}
			// 如果最后一个是活动状态
			if (paginationHtml.find('.page-num:last').hasClass('active')) {
				paginationHtml.find('.page-num').each(function (idx) {
					// 数字变化，大小+5
					var newNum = parseInt($(this).text(), 10) + 5;
					$(this).text(newNum);
					// 显示的数字按钮如果大于总页数，隐藏出来
					if ($(this).text() > _opt.pageAmount) {
						$(this).hide();
					}
					// 给第一个添加活动状态
					paginationHtml.find('.page-num:first').addClass('active').siblings('.page-num').removeClass('active');
				});
			}
			else {
				// 如果第一个不是活动状态
				paginationHtml.find('.active').next('.page-num').addClass('active').siblings('.page-num').removeClass('active');
			}
			// 当前页
			_opt.pageView = paginationHtml.find('.page-num.active').text();
			paginationHtml.find('.page-view').text(_opt.pageView);
			// ajax
			_opt.pageAjaxFn();
		});

		// 数字按钮点击
		paginationHtml.find('.page-num').on('click', function () {
			// 点击添加活动状态
			$(this).addClass('active').siblings('.page-num').removeClass('active');
			// 当前页
			_opt.pageView = paginationHtml.find('.page-num.active').text();
			paginationHtml.find('.page-view').text(_opt.pageView);
			// ajax
			_opt.pageAjaxFn();
		});

		// 跳转输入
		paginationHtml.find('.page-go input').on('input propertychange', function () {
			if ($(this).val() == '') {
				return;
			}
			// 如果输入数字小于最小页数，默认为最小页数
			if ($(this).val() <= 1) {
				$(this).val(1);
			}
			// 如果输入数字大于最大页数，默认为最大页数
			if ($(this).val() > _opt.pageAmount) {
				$(this).val(_opt.pageAmount);
			}
		});
		// 跳转按钮点击
		paginationHtml.find('.page-go button').on('click', function () {
			// 当前相关dom
			var pageGoNum = paginationHtml.find('.page-go input').val();
			if (pageGoNum === '') {
				return;
			}
			// 修改页码
			paginationHtml.find('.page-num').each(function (idx) {
				var pageNum = parseInt((pageGoNum - 1) / 5, 10) * 5 + idx + 1;
				$(this).text(pageNum);
				// 如果数字等于最大页码，添加活动状态
				if ($(this).text() == pageGoNum) {
					$(this).addClass('active').siblings('.page-num').removeClass('active');
				}
				// 显示的数字按钮如果大于总页数，隐藏
				if ($(this).text() > _opt.pageAmount) {
					$(this).hide();
				}
				else {
					$(this).show();
				}
			});
			// 当前页
			_opt.pageView = paginationHtml.find('.page-num.active').text();
			paginationHtml.find('.page-view').text(_opt.pageView);
			// ajax
			_opt.pageAjaxFn();
		});

		return _opt;
	};

	// 初始化页码，el选择append进去的dom，pageSet设置查看的页面，不设置默认显示第一页，pageAmount设置总页数。
	$._pageFn({
		'el': '.wrap',
		'pageAmount': 12
	});

	// 初始化页面，并且设置特定的ajax。
	$._pageFn({
		'el': '.wrap',
		'pageSet': 5,
		'pageAmount': 20
	}).pageAjax(function () {
		console.log(this.pageView)
	});


});