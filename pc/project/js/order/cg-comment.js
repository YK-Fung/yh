define(['jquery', 'datetime', 'bar-slider', 'bar-header', 'ie-tip', 'pagination2'], function($){

	// 显示“来自卖家的评价”内容
	$('.search:eq(0), .comment-ctn:eq(0)').show();
	// 控制显示不同内容
	$('.comment-role li').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.comment-ctn').eq($(this).index()).show().siblings('.comment-ctn').hide();
		$('.search').eq($(this).index()).show().siblings('.search').hide();
	});

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

	// 回复弹窗
	var answerDom;
	$('.btn-answer').on('click', function () {
		answerDom = $(this).closest('.detail-body');
		$('#pop-answer').fadeIn('fast');
	});
	// 提交回复内容
	$('#pop-answer .btn-yes').on('click', function () {
		// 内容
		var answerText = $.trim($('.pop-shade').find('textarea').val());
		if (answerText == '') {
			alert('内容不能为空！');
			return false;
		}
		// 公司名
		var firmName = '我的回复' + '[广州制药]' + ': ';
		// 日期
		var myDate = new Date();
		var answerMonth = myDate.getMonth();
		if (answerMonth < 10) {
			answerMonth = '0' + answerMonth;
		}
		var answerDate = myDate.getDate();
		if (answerDate < 10) {
			answerDate = '0' + answerDate;
		}
		var answerHours = myDate.getHours();
		if (answerHours < 10) {
			answerHours = '0' + answerHours;
		}
		var answerMinutes = myDate.getMinutes();
		if (answerMinutes < 10) {
			answerMinutes = '0' + answerMinutes;
		}
		var answerTime = myDate.getFullYear() + '-' + answerMonth + '-' + answerDate + ' ' + answerHours + ':' + answerMinutes;
		answerDom.append('<div class="answer-ctn"><p>' + firmName + ' ' + answerText + '<span>' + answerTime + '</span></p></div>');
		answerDom.find('.btn-answer').hide();
		$(this).closest('.pop-shade').fadeOut('fast');
		$('.pop-shade').find('textarea').val('');
		// 回复成功弹窗
		$('#pop-success').fadeIn('fast');
	});
	// 取消or关闭按钮
	$('.pop-shade .btn-no, .pop-shade .header-close').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
		$('.pop-shade').find('textarea').val('');
	});

	// 初始化页码
	paginationArg.init($('.wrap'), 10, 2);
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});