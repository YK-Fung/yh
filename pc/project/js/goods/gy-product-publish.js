define(['jquery', 'bar-slider', 'bar-header','ie-tip','pagination2'], function($){

	//下拉列表
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

	//下拉菜单联动
	$('.linkage-left').on('click', 'li', function() {
		$(this).closest('.select-box').siblings('.select-box').find('.select-text').text('请选择');
	});

	//快速检索
	$('.find-form .search-btn').on('click', function() {
		if($('.must-text').text() != '请选择'){
			$('.result').show();
		}else {
			$('#pop-tips').show();
			$('.result').hide();
		}
	});

	//弹窗打开 新增规格 
	$('.result').on('click','.add-size-btn', function() {
		$('#add-size .header-text').text('新增规格');
		$('#add-size .btn-yes').attr('id', 'confirm-size');
		$('#add-size').show();
	});

	//弹窗打开 新增产品
	$('.product-add').on('click', function() {
		$('#add-size .header-text').text('新增产品');
		$('#add-size .btn-yes').attr('id', 'confirm-product');
		$('#add-size').show();
	});

	//包装规格 大写英文变小写/中文标点变英文/去掉所有空格
	$('.packing-size').on('input propertychange', function() {
		//大写英文变小写|去掉所有空格
		var str = $(this).val().toLowerCase().replace(/\s+/g, "");
		//中文标点变英文
		function transition(str){  
		    var tmp = "";  
		    for(var i=0;i<str.length;i++){
		        if(str.charCodeAt(i) >= 65281 && str.charCodeAt(i) <= 65374){
		            tmp += String.fromCharCode(str.charCodeAt(i)-65248)  
		        }else{
		            tmp += str[i];  
		        }  
		    }  
		    return tmp.replace(/\。/g, ".").replace(/\【/g, "[").replace(/\】/g, "]").replace(/\、/g, "/").replace(/\“/g, "'").replace(/\”/g, "'").replace(/\‘/g, "'").replace(/\’/g, "'");  
		}
		$(this).val(transition(str));
	});

	//确定按钮（新增规格/新增产品）
	$('#add-size').on('click','.btn-yes', function() {
		var mustNum1 = 0;//下拉框填必填
		$('#add-size .select-text').each(function() {
			if($(this).text() != '请选择'){
				mustNum1++;
			}
		});  
		var selectBoxNum = 0;//下拉框个数
        $('#add-size .select-box').each(function() {
            if($(this).is(":visible")){
                selectBoxNum++;
            }
        });
		var mustNum2 = 0;//输入框填必填
		$('#add-size .add-input').each(function() {
			if($(this).val()){
				mustNum2++;
			}
		});

		if(mustNum1 == $('#add-size .select-box').length && mustNum2 == $('#add-size .add-input').length){
			$(this).siblings('.error-tip').css('display', 'none');
			//成功执行
			if($(this).attr('id') == 'confirm-size'){
				//确定新增规格
				$('#add-size').hide();

			}else if ($(this).attr('id') == 'confirm-product') {
				//确定新增产品
				$('#add-size').hide();
			}
		}else {
			$(this).siblings('.error-tip').css('display', 'inline-block');
		}
	});

	//关闭弹窗
	$('.pop-shade .header-close,.pop-shade .btn-no').on('click', function() {
		$(this).closest('.pop-shade').hide();
	});

	// 初始化页码
	paginationArg.init($('.wrap'), 10, 2);
	// 分页Ajax
	paginationArg.ajaxFn = function(){
		console.log(paginationArg.viewNum);
	};
});
