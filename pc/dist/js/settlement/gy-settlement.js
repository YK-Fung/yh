define(['jquery', 'datetime','bar-slider', 'bar-header','pagination2','table', 'base64','ie-tip'], function($){
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

	// 初始化页码
	paginationArg.init($('.wrap'), $('.page-amount').text());
	paginationArg.ajaxFn = function () {
		console.log(paginationArg.viewNum);
	};
});