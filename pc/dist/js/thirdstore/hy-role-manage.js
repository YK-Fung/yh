define(['jquery', 'bar-slider', 'bar-header', 'pagination2', 'ie-tip'], function($){
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

	// 权限区域经过
	$('.line').on('mouseenter', '.lenth', function () {
		// 如果text值不会空
		if ($(this).text() != '') {
			// 读取text的值，作为详情浮动框的内容
			var districtArr = $(this).text();
			$(this).closest('.line').append('<div class="jurisdiction"><div class="detail-head"><span class="head-l">所有权限</span></div><ul class="detail-body"><p>' + districtArr + '</p></ul><div class="detail-foot"></div></div>');
			// 设置浮动框并且显示
			$('.jurisdiction').show();
		}
	});
	//权限区域离开
	$('.line').on('mouseleave', '.lenth', function () {
		// 移除详情浮动框
		$(this).closest('.line').find('.jurisdiction').remove();
	});

	// 删除角色
	$(document).on('click', '.delete-role', function() {
		//取得id
		var _id = $(this).parent('li').siblings('.tb-id').text();

			//发生请求
			//成功
			$(this).closest('.line').remove();
	});

	//修改
	$(document).on('click', '.modification', function() {
		//取得id
		var _id = $(this).parent('li').siblings('.tb-id').text();
	
	});

	// 初始化页码
	paginationArg.init($('.wrap'), $('.page-amount').text());
	paginationArg.ajaxFn = function () {
		console.log(paginationArg.viewNum);
	};
});
