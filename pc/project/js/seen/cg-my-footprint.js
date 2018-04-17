define(['jquery', 'datetime','bar-slider', 'bar-header','pagination2','ie-tip','ie-tip'], function($){
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

	//选中单个产品
	$.fn.toggleCheckbox = function () {
	 this.attr("checked", !this.attr("checked"));
	};

	$('.detail-lis').on('click', '.checkbox', function() {
		//切换attr属性
		$(this).find(':checkbox').toggleCheckbox();
		//切换样式
		$(this).toggleClass('active');
		if(!$(this).find(':checkbox').attr("checked")){
			//选中状态
			$(this).closest('.choose').css('display', '');
		}else {
			//选中状态
			$(this).closest('.choose').css('display', 'block');
		}
	});

	//批量删除 弹窗
	//提示弹框的元素定义
	var popBody = $('.pop-shade .pop-body');//弹框主体内容
	var btnYes = $('.pop-shade .btn-yes');//确定按钮
	$('.delete-all').on('click', function() {
		//if 当前列表是否有选中产品
		if($('.detail-lis').find('.checkbox').hasClass('active')){
			//弹窗
			$('.pop-shade').show();
			popBody.html('你确定删除改产品吗？');
			btnYes.show();
			//给‘确定’按钮赋id的值
			btnYes.attr('id', 'delete');
		}else {
			$('.pop-shade').show();
			popBody.html('未选择要删除的产品!');
		}
	});

	//批量删除
	$('body').on('click', '#delete', function() {
		$('.pop-shade').hide();
		popBody.html('');
		btnYes.hide();
		btnYes.attr('id', '');

		var choose='';
		var _length =$('.circulation input:checked').length-1;
		$('.circulation input:checked').each(function(index) {
			if(index == _length){
				choose += $(this).val();
			}else {
				choose += $(this).val()+',';
			}
		});

		//删除选中记录
		$('.circulation input:checked').closest('li').remove();

		//当天记录删除当天所有元素
		$('.circulation').each(function() {
			var a = $(this).find('li').length;
			if( a == 0){
				$(this).remove();
			}
		});
	});

	//关闭弹窗
	$('.btn-no,.header-close').on('click', function() {
		$(this).closest('.pop-shade').hide();
		popBody.html('');
		btnYes.hide();
		btnYes.attr('id', '');
	});

	// 初始化页码
	paginationArg.init($('.wrap'), $('.page-amount').text());
	paginationArg.ajaxFn = function () {
		console.log(paginationArg.viewNum);
	};
});
