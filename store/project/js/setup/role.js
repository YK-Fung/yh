define(['jquery','pagination'], function($){
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
	paginationArg.init($('.wrap'), $('.pagination .active').text(), $('.page-amount').text());
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});