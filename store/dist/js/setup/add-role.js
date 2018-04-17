define(['jquery',], function($){
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
		
		var rtDom = '<li id="'+idNameThis+'"><span>'+detailTxt+'</span><i class="fa fa-minus-square cut-single"></i></li>';
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
			$(this).closest('li').remove();
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
		if($('#roleName').val() == '' ){
			$('.submit-tips').show();
		}else {
			$('.submit-tips').hide();
			//发送请求
			$('#input-list').html('')
		}
	});
});