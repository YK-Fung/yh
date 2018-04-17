define(['jquery', 'yhw-sidebar2', 'yhw-topbar2',  'ie-tip'], function($){

	// 初始化状态
	$('.import-textarea').closest('.import-type').find('.warm-tip').removeClass('warn success');
	// 产品批量导入内容为空不可导入
	if ($('.import-textarea').val() !== '') {
		$('.import-textarea').addClass('active');
		$('.btn-import2').addClass('active');
	} else {
		$('.import-textarea').removeClass('active');
		$('.btn-import2').removeClass('active');
	}

	// 下单悬浮框
	var buyFixedFn = function (height) {
		// 滚动的实时距离
		var posT = height + $(document).scrollTop();
		// 底部部分的的位置
		var footT = $('.yhw-footer-top').offset().top - 40;
		// 当滚动的距离达到底部的位置
		if (posT >= footT) {
			$('.buy').css('bottom', (posT-footT));
			$('.buy').removeClass('fixed');
		}
		else {
			$('.buy').css('bottom', 0);
			$('.buy').addClass('fixed');
		}
		// 如果下单选付款是隐藏的，则显示出来
		if ($('.buy').is(':hidden')) {
			$('.buy').show();
		}
	};
	var winH = $(window).height(); 
	buyFixedFn(winH);
	$(document).on('scroll', function () {
		winH = $(window).height();
		buyFixedFn(winH);
	});

	// 隐藏搜索下拉框
	$(document).on('click', function () {
		$('.search .search-ctn').hide();
	});

	// 选择供应商
	var gySelectFn = function (text, data) {
		var gySelect = $('.gy-ctn .select-box');
		// 清空搜索框
		$('.search-gy .search-input').val('');
		$('.search-gy .search-ctn').hide();
		// 供应商数量
		var gyAmount = gySelect.find('.select-drop ul li').length;
		// 如果还没有供应商，先设置对应的值，如果已经有供应商了，就只添加
		if (gyAmount <= 0) {
			// 第二步
			gySelect.find('.select-text').text(text);
			gySelect.find('.select-input').val(data);
			// 第三步
			$('.infor-detail').eq(gyAmount).find('.firm-detail').html('<div class="firm-name"><input type="" value="' + data + '">' + text + '<span class="btn-del">删除供应商</span></div>');
		} else {
			// 第三步
			$('.import-detail').append('<div class="infor-detail"><div class="firm-detail"><div class="firm-name"><input type="" value="' + data + '">' + text + '<span class="btn-del">删除供应商</span></div> </div><div class="search search-cp"><input name="" class="search-input" placeholder="请输入批准文号、货品名称进行查询，添加货品"><span class="error-tip">批准文号不存在，请核对重新输入</span><ul class="search-ctn"><li><div class="search-img"><img src="../../img/hot-product.png"></div><div class="search-infor"><p>胃复春片</p><p>规格：0.36g*60s 薄膜衣</p><p>批准文号：国药准字Z20040003</p></div></li></ul></div><div class="table-product"><ul class="product-header"><li class=""><span class="checkbox checkbox-all"><input type="checkbox" value=""></span>全选</li><li>批准文号</li><li>货品名称</li><li>规格</li><li>数量</li><li>库存</li><li>单价</li><li>总额</li><li>操作</li></ul><div class="product-detail"></div></div><span class="btn-all-del">全部删除</span></div>');
		}
		// 添加供应商下拉列表的选项
		gySelect.find('.select-drop ul').append('<li data="' + data + '">' + text + '</li>');
		// 隐藏 尚未选择供应商
		gySelect.show().siblings().hide();
		// 初始化默认提示
		$('.import-type:eq(0) .warm-tip').text('（文件格式须为excel文件格式）');
		$('.import-type:eq(1) .warm-tip').removeClass('warn');
	};
	// 如果已经选择了了供应商，即供应商搜索框不为空的时候。也触发  选择供应商 函数
	if ($('.search-gy .search-input').val() !== '') {
		var gyName = $('.search-gy .search-ctn li:eq(0)');
		var text = gyName.text();
		var data = gyName.attr('data');
		gySelectFn(text, data);
	}
	// 供应商搜索
	$('.search-gy .search-input').on('input propertychange', function () {
		$(this).closest('.search').find('.search-ctn').show();
	});
	// 搜索结果点击、交易过的供应商点击
	$(document).on('click', '.search-gy .search-ctn li, .history-gy', function (event) {
		var e = event || window.event;
		var text = $(this).text();
		var data = $(this).attr('data');
		gySelectFn(text, data);
		e.stopPropagation();
	});

	//下拉列表切换
	$(document).on('click', '.select-box .select-choice', function(event) {
		var e = event || window.event;
		//其它下拉隐藏
		$('.select-box').removeClass('down');
		//下拉效果切换
		$(this).parents('.select-box').toggleClass('down');
		// 如果是规格的下拉框，就判断是否是当前表格最后一个产品，如果是就滚动到底
		if ($(this).closest('.standard-select').length > 0) {
			// 当前表格
			var tableProduct = $(this).closest('.table-product');
			// 当前产品idx
			var thisIdx = $(this).closest('.product-body').index();
			// 当前列表最后一个产品的idx
			var lastIdx = tableProduct.find('.product-body:last').index();
			// 当前表格的高度
			var tableProductH = tableProduct.height();
			// 表格内容的高度
			var tableProductHeaderH = tableProduct.find('.product-header').outerHeight(true);
			var tableProductDetailH = tableProduct.find('.product-detail').outerHeight(true) + 30;
			// 滚到底需要滚动的距离
			var scrollY = tableProductHeaderH + tableProductDetailH - tableProductH;
			// 滚动到底
			if (thisIdx == lastIdx) {
				tableProduct.scrollTop(scrollY);
			}
		}
		//停止冒泡
		e.stopPropagation();
	});
	// 鼠标点击离开来目标，菜单栏隐藏
	$(document).on('click', function() {
		$('.select-box').removeClass('down');
	});

	// 供应商索引
	var gyIdx = 0;
	// 供应商选中下拉选项
	$(document).on('click', '.gy-select .select-drop li', function(event) {
		var e = event || window.event;
		var _txt = $(this).text();
		var _data = $(this).attr('data');
		gyIdx = $(this).index();
		//添加选中select值
		$(this).closest('.select-box').find('.select-text').text(_txt);
		$(this).closest('.select-box').find('.select-input').val(_data);
		//隐藏下拉列表
		$(this).closest('.select-box').removeClass('down');
		e.stopPropagation();
	});

	//规格选中下拉选项
	$(document).on('click', '.standard-select .select-drop li', function(event) {
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


	// 商品总额
	var totalFn = function () {
		var total = 0;
		// 选中商品的状态数组
		var productStatusArr = []
		$('.product-body.active .checkbox').each(function () {
			productStatusArr.push($(this).attr('data'));
		});
		// 选择的商品是否都可以提交
		var productYes = productStatusArr.every(function (val) {
			return val === '0';
		});
		// 判断有没有选中的商品并且选中的商品数量足够,如果没有,不给提交
		if ($('.product-body.active').length > 0 && $('.product-body.active .inventory:visible').length <= 0 && productYes) {
			$('.btn-submit').addClass('active');
		} else {
			$('.btn-submit').removeClass('active');
		}
		$('.product-body.active').each(function () {
			// 有小计的才累加，如果没有就不累加了，比如：无结果
			if ($(this).find('.subtotal-num').length > 0) {;
				total += parseFloat($(this).find('.subtotal-num').text());
			}
		});
		$('.total-num').text(total.toFixed(2));
	};
	// 小计
	var subtotalFn = function (productBody, val) {
		var priceNum = parseFloat(productBody.find('.price-num').text());
		var subtotalNum = (priceNum * val).toFixed(2);
		productBody.find('.subtotal-num').text(subtotalNum);
		// 如果超出了库存，显示警告
		if (val > parseInt(productBody.find('.inventory-num').text(), 10)) {
			productBody.find('.inventory-num').addClass('warm');
			productBody.find('.inventory-tip').show();
		} else {
			productBody.find('.inventory-num').removeClass('warm');
			productBody.find('.inventory-tip').hide();
		}
		// 如果是已经选中了的商品,价格记入商品总额
		if (productBody.hasClass('active')) {
			totalFn();
		}
	};
	// 多选框
	var checkboxFn = function () {
		// 采购内容
		$('.table-product').each(function () {
			// 商品数量
			var productBodyLen = $(this).find('.product-body').length;
			// 选择的商品数量
			var productBodyActiveLen = $(this).find('.product-body.active').length;
			// 如果已经选择了该供应商的全部商品,供应商的多选框勾选
			if (productBodyActiveLen != 0 && productBodyActiveLen >= productBodyLen) {
				$(this).find('.product-header').addClass('active');
				$(this).find('.product-header .checkbox input').prop('checked', true);
			} else {
				$(this).find('.product-header').removeClass('active');
				$(this).find('.product-header .checkbox input').prop('checked', false);
			}
		});
		// 商品种类
		$('.procuct-kind').text($('.product-body.active').length);
		// 有商品的供应商数量
		var planGysLen = $('.product-body').closest('.table-product').find('.product-header').length;
		// 有商品的被选择的供应商数量
		var planGysActive = $('.product-body').closest('.table-product').find('.product-header.active').length;
		// 如果有商品,而且已经选择了全部商品,全选框勾选
		if (planGysLen > 0 && planGysActive >= planGysLen) {
			// 下单全选框
			$('.buy-all').addClass('active');
			$('.buy-all .checkbox input').prop('checked', true);
		} else {
			// 下单全选框
			$('.buy-all').removeClass('active');
			$('.buy-all .checkbox input').prop('checked', false);
		}
		totalFn();
	};


	// 导入-方法一
	$('.import-tip').on('click', function () {
		// 是否已经选择供应商
		if ($('.gy-ctn .select-box .select-input').val() == '') {
			 $(this).closest('.import-type').find('.warm-tip').text('（请先选择供应商）');
		} else {
			$('.btn-import1').click();
		}
	});
	$('.btn-import1').on('change', function(){
        //获取文件
        var file = this.files[0];
        var fileType = /^.*\.(?:xls|xlsx|xl|xla|xlt|xlm|xlc|xlw)$/;
        // 文件行数
        var fileCtnLen = 10;
        //是否是excel,文件行数是否超过50
        if (!fileType.test(file.name)) {
        	// 清空input的值
            $(this).val('');
            $(this).closest('.import-type').find('.warm-tip').text('（上传失败，请上传正确的excel文件）');
        } else if (fileCtnLen > 50) {
			$(this).val('');
            $(this).closest('.import-type').find('.warm-tip').text('（文件行数超过最大值）');
        } else {
        	$(this).closest('.import-type').find('.warm-tip').text('（文件格式须为excel文件格式）');
        	// 对应供应商添加内容
        	var inforDetail = '<ul class="product-body"><li><div class="li-ctn"><span class="checkbox" data="0"><input type="checkbox" value=""></span></div></li><li><div class="li-ctn">HJK321654651</div></li><li><div class="li-ctn">三九感冒灵三九感冒灵三九感冒灵</div></li><li><div class="li-ctn"><p>0.8g*8片*4板袋</p></div></li><li><div class="li-ctn"><div class="select-box standard-select"><a href="javascript:void(0)" class="select-choice"><div class="select-text">1</div><input type="text" class="select-input" value="1" name=""><span class="select-arrow"><i class="fa fa-angle-down"></i></span></a><div class="select-drop"><ul><li data="1">1</li><li data="2">2</li></ul></div></div></div></li><li><div class="li-ctn"><div class="amount-type">整件：</div><div class="amount-reduce">-</div><input name="" class="amount-input" type="text" value="1"><div class="amount-add">+</div><p class="whole">件装量：100盒/件</p></div></li><li><div class="li-ctn"><p><span class="inventory-num">8</span>盒</p><p class="inventory-tip">库存不足</p></div></li><li><div class="li-ctn">¥<span class="price-num">10.00</span></div></li><li><div class="li-ctn red">¥<span class="subtotal-num">10.00</span></div></li><li><div class="li-ctn"><p><span class="btn-del"></span></p><p><span class="btn-add"></span></p></div></li></ul><ul class="product-body"><li><div class="li-ctn"><span class="checkbox" data="1"><input type="checkbox" value=""></span></div></li><li><div class="li-ctn">HJK321654651</div></li><li><div class="li-ctn product-no">匹配不到结果</div></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>';
        	$('.import-detail .infor-detail').eq(gyIdx).find('.product-detail').append(inforDetail);
        	checkboxFn();
        }
        // 如果有文件，添加活动样式，否则移除
        if ($(this).val() != '') {
        	$(this).closest('.import-file').addClass('active');	
        } else {
        	$(this).closest('.import-file').removeClass('active');
        }
	});

	// 导入-方法二
	$('.import-textarea').on('input propertychange', function () {
		// 初始化状态
		$(this).closest('.import-type').find('.warm-tip').removeClass('warn success');
		// 内容为空不可导入
		if ($(this).val() !== '') {
			$(this).addClass('active');
			$('.btn-import2').addClass('active');
		} else {
			$(this).removeClass('active');
			$('.btn-import2').removeClass('active');
		}
	});

	$('.btn-import2').on('click', function(){
		if (!$(this).hasClass('active')) {
			return false;
		}
		// 文字行数
		var importTextCtnArr = $('.import-textarea').val().split('\n');
		var newimportTextCtnArr = importTextCtnArr.filter(function(val) {
			return val;
		});
		var importTextCtnLen = newimportTextCtnArr.length;
		// 是否已经选择供应商，文字行数是否超过50
		if ($('.gy-ctn .select-box .select-input').val() == '') {
			 $(this).closest('.import-type').find('.warm-tip').text('请先选择供应商');
			 $(this).closest('.import-type').find('.warm-tip').addClass('warn');
		} else if (importTextCtnLen > 5) {
			$(this).closest('.import-type').find('.warm-tip').text('目前只支持一次导入50个货品');
			$(this).closest('.import-type').find('.warm-tip').addClass('warn');
		} else {
			$(this).closest('.import-type').find('.warm-tip').text('导入成功');
			$(this).closest('.import-type').find('.warm-tip').addClass('success');
			// 对应供应商添加内容
        	var inforDetail = '<ul class="product-body"><li><div class="li-ctn"><span class="checkbox" data="0"><input type="checkbox" value=""></span></div></li><li><div class="li-ctn">HJK321654651</div></li><li><div class="li-ctn">三九感冒灵三九感冒灵三九感冒灵</div></li><li><div class="li-ctn"><p>0.8g*8片*4板袋</p></div></li><li><div class="li-ctn"><div class="select-box standard-select"><a href="javascript:void(0)" class="select-choice"><div class="select-text">1</div><input type="text" class="select-input" value="1" name=""><span class="select-arrow"><i class="fa fa-angle-down"></i></span></a><div class="select-drop"><ul><li data="1">1</li><li data="2">2</li></ul></div></div></div></li><li><div class="li-ctn"><div class="amount-type">整件：</div><div class="amount-reduce">-</div><input name="" class="amount-input" type="text" value="1"><div class="amount-add">+</div><p class="whole">件装量：100盒/件</p></div></li><li><div class="li-ctn"><p><span class="inventory-num">8</span>盒</p><p class="inventory-tip">库存不足</p></div></li><li><div class="li-ctn">¥<span class="price-num">10.00</span></div></li><li><div class="li-ctn red">¥<span class="subtotal-num">10.00</span></div></li><li><div class="li-ctn"><p><span class="btn-del"></span></p><p><span class="btn-add"></span></p></div></li></ul><ul class="product-body"><li><div class="li-ctn"><span class="checkbox" data="1"><input type="checkbox" value=""></span></div></li><li><div class="li-ctn">HJK321654651</div></li><li><div class="li-ctn product-no">匹配不到结果</div></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>';
        	$('.import-detail .infor-detail').eq(gyIdx).find('.product-detail').append(inforDetail);
        	checkboxFn();
		}
	});

	// 产品搜索
	$(document).on('input propertychange', '.search-cp .search-input', function () {
		var searchDom = $(this).closest('.search');
		searchDom.find('.search-ctn').show();
		searchDom.find('.error-tip').hide();
	});
	// 搜索结果点击
	$(document).on('click', '.search-cp .search-ctn li', function (event) {
		var e = event || window.event;
		var searchDom = $(this).closest('.search');
		// 清空搜索框
		// var text = $(this).text();
		searchDom.find('.search-input').val('');
		searchDom.find('.search-ctn').hide();
		// 错误类型
		var errorType = '1';
		switch (errorType) {
			case '0':
				searchDom.find('.error-tip').text('批准文号不存在，请核对重新输入');
				searchDom.find('.error-tip').css('display', 'inline-block');
				break;
			case '1':
				searchDom.find('.error-tip').text('不存在该商品，请核对重新输入');
				searchDom.find('.error-tip').css('display', 'inline-block');
				break;
			default:
				searchDom.find('.error-tip').css('display', 'none');
				break;
		}
		e.stopPropagation();
	});

	// 删除供应商
	$(document).on('click', '.firm-detail .btn-del', function () {
		// 导入的信息详情
		var inforDetail = $(this).closest('.infor-detail');
		// 供应商索引
		var idx = inforDetail.index() - 1;
		// 供应商val值
		var firmVal = $(this).closest('.firm-name').find('input').val();
		// 删除对应供应商下拉选项
		$('.gy-ctn .select-drop ul li').eq(idx).remove();
		// 供应商下拉选择框
		var gySelect = $('.gy-ctn .select-box');
		// 目前选择的供应商的val值
		var gySelectInputVal = gySelect.find('.select-input').val();
		// 供应商下拉框选项
		var gySelectLi = gySelect.find('.select-drop ul li');
		// 如果删除的供应商是当前选择的供应商,修改当前选择的供应商为第一顺位的那个
		if (firmVal == gySelectInputVal) {
			gyIdx = 0;
			gySelect.find('.select-text').text(gySelectLi.eq(0).text());
			gySelect.find('.select-input').val(gySelectLi.eq(0).attr('data'));
		}
		// 删除对应供应商,如果超过1个供应商，就直接删除，否则变为默认状态
		if ($('.import-detail .infor-detail').length > 1) {
			inforDetail.remove();
		} else {
			// 第三步变为默认状态
			inforDetail.find('.firm-detail').html('<div class="firm-no">尚未选择供应商</div>');
			inforDetail.find('.product-body').remove();
			// 第二步显示"尚未选择供应商"，隐藏供应商下拉框
			$('.gy-ctn .select-box').hide().siblings().show();
			$('.gy-ctn .select-box .select-text').text('');
			$('.gy-ctn .select-box .select-input').val('');
		}
		checkboxFn();
	});
	
	// 选择商品
	$(document).on('click', '.product-body .checkbox', function () {
		var productBody = $(this).closest('.product-body');
		if (productBody.hasClass('active')) {
			productBody.removeClass('active');
			$(this).find('input').prop('checked', false);
		} else {
			productBody.addClass('active');
			$(this).find('input').prop('checked', true);
		}
		checkboxFn();
	});
	// 选择供应商
	$(document).on('click', '.product-header .checkbox', function () {
		var table = $(this).closest('.table-product');
		if ($(this).closest('.product-header').hasClass('active')) {
			table.find('.product-body').removeClass('active');
			table.find('.product-body .checkbox input').prop('checked', false);
		} else {
			table.find('.product-body').addClass('active');
			table.find('.product-body .checkbox input').prop('checked', true);
		}
		checkboxFn();
	});
	// 全选
	$(document).on('click', '.buy-all .checkbox', function () {
		if ($(this).closest('.buy-all').hasClass('active')) {
			$('.product-body').removeClass('active');
			$('.product-body .checkbox input').prop('checked', false);
		} else {
			$('.product-body').addClass('active');
			$('.product-body .checkbox input').prop('checked', true);
		}
		checkboxFn();
	});
	// 数量调整-增加
	$(document).on('click', '.product-body .amount-add', function () {
		var productBody = $(this).closest('.product-body');
		// 库存
		var inventoryNum = parseInt(productBody.find('.inventory-num').text(), 10);
		var input = $(this).closest('.product-body').find('.amount-input');
		// 数量,最大6位
		var newVal = parseInt(input.val(), 10) + 1;
		if (newVal >= 999999) {
			newVal = 999999;
		}
		input.val(newVal);
		subtotalFn(productBody, newVal);
	});
	// 数量调整-减少
	$(document).on('click', '.product-body .amount-reduce', function () {
		var productBody = $(this).closest('.product-body');
		var input = $(this).closest('.product-body').find('.amount-input');
		// 数量,最小1
		var newVal = parseInt(input.val(), 10) - 1;
		if (newVal <= 1) {
			newVal = 1;
		}
		input.val(newVal);
		subtotalFn(productBody, newVal);
	});
	// 数量调整-输入
	$(document).on('input propertychange', '.product-body .amount-input', function () {
		var productBody = $(this).closest('.product-body');
		// 新的val值，如果有非数字都替换成空
		var newVal = $(this).val().replace(/[^\d.]/g, '');
		if (parseInt(newVal, 10) <= 1) {
			newVal = 1;
		}
		if (newVal.length > 6) {
			newVal = newVal.substr(0, 6);
		}
		$(this).val(newVal);
		subtotalFn(productBody, newVal);
	});
	// 如果失焦的时候,空值,则设置为1
	$(document).on('blur', '.product-body .amount-input', function () {
		var productBody = $(this).closest('.product-body');
		if ($(this).val() == '') {
			$(this).val(1);
			subtotalFn(productBody, 1);
		}
	});
	// 删除商品
	$(document).on('click', '.table-product .btn-del',  function () {
		$(this).closest('.product-body').remove();
		winH = $(window).height();
		buyFixedFn(winH);
		checkboxFn();
	});
	// 添加商品
	$(document).on('click', '.table-product .btn-add', function () {
		alert('添加产品！');
		buyFixedFn(winH);
		checkboxFn();
	});
	// 删除供应商全部商品
	$(document).on('click', '.btn-all-del', function () {
		$(this).closest('.infor-detail').find('.product-body').remove();
		winH = $(window).height();
		buyFixedFn(winH);
		checkboxFn();
	});
	// 删除选择商品
	$(document).on('click', '.buy .buy-del', function () {
		$('.product-body.active').remove();
		winH = $(window).height();
		buyFixedFn(winH);
		checkboxFn();
	});


});