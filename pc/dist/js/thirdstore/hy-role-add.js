define(['jquery', 'bar-slider', 'bar-header','ie-tip'], function($){
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
	
	//自定义目录高度
	function catalogH(){
		$('.catalog').each(function() {
			var rt = $(this).children('.rt');
			var lf = $(this).children('.lf');
			if(rt.find('li').length == 0){
				lf.css({
					'height': '34px',
					'line-height': '34px'
				});
			}else {
				var _height = rt.height()+'px';
				lf.css({
					'height': _height,
					'line-height': _height
				});
			}
		});

		$('.choose .function-list').each(function() {
			var boxHeight = $(this).parent('.choose').siblings('.function').find('.function-list').height();
			$(this).height(boxHeight);
		});
	}
	catalogH();
	
	//添加功能总列表
	$(document).on('click', '.add-all', function() {
		//右侧添加栏目
		var selected = $(this).closest('.function').siblings('.choose');
		//获取选择功能的id
		var idNameLt = $(this).closest('.catalog').attr('id');
		//判断是否已经选择该范围,若已经选择移除之前选中的所有，重新覆盖
		selected.find('.catalog').each(function() {
			var idNameRt = $(this).attr('id');
			if(idNameLt == idNameRt){
				$(this).remove();
			}
		});
		//所选功能名称
		var actionName = $(this).closest('.catalog').find('.name').text();
		//对应的功能列表
		var actions = $(this).closest('.catalog').find('li').children('span');
		//右侧对应的功能列表
		var rtDom = '';
		actions.each(function() {
			var txt = $(this).text();
			var _id = $(this).parent('li').attr('id');
			var liDom = '<li id="'+_id+'"><span>'+txt+'</span><i class="fa fa-minus-square cut-single"></i></li>';
			rtDom += liDom;
		});
		//右侧对应的列表
		var allDom = '<div class="catalog" id="'+idNameLt+'"><div class="lf"><span class="name">'+actionName+'</span><i class="fa fa-minus-square cut-all"></i></div><ul class="rt">'+rtDom+'</ul>';
		//移动功能
		selected.find('.function-list').append(allDom);
		catalogH();
	});

	//移除右侧功能总列表
	$(document).on('click', '.cut-all', function() {
		$(this).closest('.catalog').remove();
	});

	//添加单个功能
	$(document).on('click', '.add-single', function() {
		//获取选择功能的id
		var idNameLt = $(this).closest('.catalog').attr('id');
		var idNameThis = $(this).closest('li').attr('id');
		//选中的功能详情
		var detailTxt = $(this).closest('li').find('span').text();
		//选中的功能名称
		var actionName = $(this).closest('.catalog').find('.name').text();
		//右侧添加栏目
		var selected = $(this).closest('.function').siblings('.choose');
		
		var rtDom = '<div><li id="'+idNameThis+'"><span>'+detailTxt+'</span><i class="fa fa-minus-square cut-single"></i></li></div>';
		//判断是否已经选择该范围
		var move = 0;
		selected.find('.catalog').each(function() {
			var idNameRt = $(this).attr('id');
			if(idNameLt == idNameRt){
				move ++;
			}
		});
		if(move > 0){
			var moveInto = 0;
			var nameId = '#'+idNameLt;
			var liId = '#'+idNameThis;
			//判断是否已经选择该功能
			selected.find('li').each(function() {
				var idNameHas = $(this).attr('id');
				if(idNameThis == idNameHas){
					moveInto ++;
				}
			});
			if(moveInto > 0){
				selected.find(liId).remove();
			}
			//列表插入单个
			selected.find(nameId).children('.rt').append(rtDom);
		
		}else {
			//列表插入全部
			var allDom = '<div class="catalog" id="'+idNameLt+'"><div class="lf"><span class="name">'+actionName+'</span><i class="fa fa-minus-square cut-all"></i></div><ul class="rt">'+rtDom+'</ul>';
			selected.find('.function-list').append(allDom);
		}
		catalogH();
	});

	//移除右侧功能单个列表
	$(document).on('click', '.cut-single', function() {
		var _length = $(this).closest('.rt').children('li').length;
		if(_length == 1){
			//当所选功能个数小于1时，整个移除；
			$(this).closest('.catalog').remove();
		}else {
			$(this).closest('li').parent().remove();
			catalogH();
		}
	});

	//提交表单
	var inputDom = '';
	var inputDomAll = '';
	$('.submit').on('click', function() {
		$('.choose').find('li').each(function() {
			var chooseId = $(this).attr('id');
			var list = '<input type="text" name="" value="'+chooseId+'"/>';
			inputDom += list;
		});
		$('.choose').find('.catalog').each(function() {
			var chooseIdAll = $(this).attr('id');
			var list = '<input type="text" name="" value="'+chooseIdAll+'"/>';
			inputDomAll += list;
		});
		
		$('#input-list').append(inputDom+inputDomAll);
		console.log($('#departmentName').val())
		if($('#roleName').val() == '' || $('#departmentName').val() == '0'){
			$('.submit-tips').show();
		}else {
			$('.submit-tips').hide();
			//发送请求
			$('#input-list').html('')
		}
	});
});