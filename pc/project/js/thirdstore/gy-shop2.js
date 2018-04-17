define(['jquery', 'bar-slider', 'bar-header', 'ie-tip'], function($){
	var arg = {};

	// 金额输入框
	$(document).on('input propertychange', '.min-money, .free-money, .collect-money', function () {
		var newVal = $(this).val().replace(/\D/g, '');
		if (newVal.length > 6) {
			newVal = newVal.substr(0, 6);
		}
		$(this).val(newVal);
	});
	// 商品配送说明
	$(document).on('input propertychange', '.explain', function () {
		var newVal = $(this).val();
		if (newVal.length > 30) {
			newVal = newVal.substr(0, 30);
		}
		$(this).val(newVal);
	});

	// 选择过的地区
	arg.districtHistoryFn = function () {
		var districtHistory = '';
		$('.district .address').each(function () {
			districtHistory += $(this).val() + '，';
		});
		var districtHistoryArr = districtHistory.substr(0, districtHistory.length - 1).split('，');
		// 给所有选择过的地区添加禁选
		$('.district-select li').removeClass('default');
		$('.district-select li').each(function () {
			for (var i = 0, len = districtHistoryArr.length; i < len; i ++){
				if (!$(this).hasClass('active') && $(this).text() == districtHistoryArr[i]) {
					$(this).addClass('default');				
				}
			}
		});	
	};
	// 地区类型，edit修改、add新增
	arg.districtType = 'edit';
	// 地区点击
	$('.favorable').on('click', '.district', function () {
		arg.district = $(this);
		arg.districtType = 'edit';
		// 重置弹窗的样式
		$('.district-big .active').removeClass('active');
		// 当前选择过的地区
		var districtDetail = arg.district.find('.address').val().split('，');
		// 遍历，给当前选择过的地区添加活动样式
		$('.district-select li').each(function () {
			for (var i = 0, len = districtDetail.length; i < len; i ++){
				if ($(this).text() == districtDetail[i]) {
					$(this).addClass('active');				
				}
			}
		});
		// 给所有被选择过的企图加上禁选
		arg.districtHistoryFn()
		$('#pop-area').fadeIn();
	});
	// 新增规则
	$('.favorable').on('click', '.add-district', function () {
		arg.district = $(this);
		arg.districtType = 'add';
		// 初始化弹窗状态
		$('.district-big .active').removeClass('active');
		// 给所有被选择过的企图加上禁选
		arg.districtHistoryFn()
		$('#pop-area').fadeIn('fast');
	});

	// 选择地区
	$('#pop-area .district-name').on('click', function () {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).next('.district-select').find('li').removeClass('active');
		}
		else {
			$(this).addClass('active');
			$(this).next('.district-select').find('li').each(function () {
				if (!$(this).hasClass('default')) {
					$(this).addClass('active');
				}
			});
		}
	});
	$('#pop-area .district-select li').on('click', function () {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			if ($(this).hasClass('default')) {
				return false;
			}
			$(this).addClass('active');
		}
	});
	// 确定地区
	$('#pop-area .btn-yes').on('click', function () {
		arg.districtDetail = '';
		var favorableBodyLen = $('.favorable ul').length;
		// 文字拼接
		$('.district-select .active').each(function (i) {
			arg.districtDetail += $(this).text() + '，';
		});
		if (arg.districtDetail == '') {
			return false;
		}
		arg.districtView = arg.districtDetail.substr(0, arg.districtDetail.length - 1);
		// edit修改、add新增
		switch(arg.districtType){
			case 'edit':
				// 如果全部都选择了，显示为 全国
				if ($('.district-select .active').length == $('.district-select li').length) {
					arg.district.find('.district-detail').html('全国');
				} else {
					arg.district.find('.district-detail').html(arg.districtView);
				}
				arg.district.find('.district-detail').removeClass('active');
				arg.district.find('input').attr('value', arg.districtView);
				break;
			case 'add':
				var addDistrictHtml = '<ul><li class="wid30">订单金额满：<input name="thirdStorePreferentialList[' + favorableBodyLen + '].freeMoney" class="money free-money" type="text">元免运费</li><li class="wid30">不满收取运费：<input name="thirdStorePreferentialList[' + favorableBodyLen + '].collectMoney" class="money collect-money" type="text">元</li><li class="wid30 district"><input name="thirdStorePreferentialList[' + favorableBodyLen + '].preferentialAddress" class="hidden address" type="text" value="' + arg.districtView + '"><span class="address-text">地区：</span><span class="district-detail">' + arg.districtView + '</span></li><li class="wid10 del-district">删除规则</li></ul>';
				arg.district.closest('.favorable').append(addDistrictHtml);
			default: 
				break;
		}
		$(this).closest('.pop-shade').fadeOut('fast');
		arg.district = null;
	});

	 // 控销相关参数
    var marketArg = {
        // 批次
        'batch': 'batch',
        // 表格楼层
        'lv': 'lv',
        // 批次参数
        'batchArg': 'batchArg',
        // 生产日期参数
        'dateStart': 'dateStart',
        // 有效期参数
        'dateEnd': 'dateEnd',
        // 库存参数
        'inventory': 'inventory',
        // 地区参数
        'district': 'district',
        // 渠道参数
        'channel': 'channel',
        // 整件单价参数
        'priceWhole': 'priceWhole',
        // 拆零单价参数
        'priceOne': 'priceOne',
        // 禁销or销往（0销往，1禁销）
        'isMarket': 'isMarket',
        // 楼层参数
        'lvArg': 'lvArg',
        // 显示拆零、整件或者全部显示的类名,默认拆零
        'marketShow': 'show-one',
        // 记录原本的样子
        'record': '',
        // 获取当前日期 有效期end
        marketDate: function (dateType) {
            var date = new Date();
            var year = date.getFullYear();
            if (dateType && dateType == 'end') {
                year = year + 1;
            }
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var dateView = year + '-' + month + '-' + day;
            return dateView;
        }
    };

     // 重定控销相关input的name
    var marketInputName = function () {
        $('.batch-input').each(function (batchIdx) {
            var batchName = marketArg.batch + '[' + batchIdx + '].';
            // 控销表格
            batchCtn.find('.market-price .table-body').each(function (lvIdx) {
                var lvName = batchName + marketArg.lv + '[' + lvIdx + '].';
                // 地区
                $(this).find('.district-input').attr('name', lvName + marketArg.district);
                // 渠道
                $(this).find('.channel-input').attr('name', lvName + marketArg.channel);
                // 禁销or销往
                $(this).find('.market-input').attr('name', lvName + marketArg.isMarket);
                // 楼层
                $(this).find('.lv-input').attr('name', lvName + marketArg.lvArg);
                $(this).find('.lv-input').val(lvIdx);
            });
        });
    };

	// 删除规则
	var delSelf;
	$('.favorable').on('click', '.del-district', function () {
		delSelf = $(this);
		$('#pop-del').fadeIn();
	});
	$('#pop-del .btn-yes').on('click', function () {
		delSelf.parent().remove();
		$('.favorable ul').each(function (i) {
			var freeMoney = 'thirdStorePreferentialList[' + i + '].freeMoney';
			var collectMoney = 'thirdStorePreferentialList[' + i + '].collectMoney';
			var address = 'thirdStorePreferentialList[' + i + '].preferentialAddress';
			$(this).find('.free-money').attr('name', freeMoney);
			$(this).find('.collect-money').attr('name', collectMoney);
			$(this).find('.address').attr('name', address);
		});
		$(this).closest('.pop-shade').fadeOut('fast');
	});

	// 区域和渠道不能完全相同
    var marketWarn = function (self) {
        var dcArr = [];
        var tableBody = self.closest('.market-table').find('.table-body');
        tableBody.each(function () {
            var dc = $(this).find('.district').attr('data') + $(this).find('.channel').attr('data');
            // 如果有重复的，则还原修改。
            if (dcArr.indexOf(dc) >= 0) {
                $(this).closest('.market-table').html(marketArg.record);
                $('#pop-warn').fadeIn('fast');
            } else {
                dcArr.push(dc);
            }
        });
    };
    // 选择区域
    var districtSelf;
    // 区域操作类型 编辑edit 新增add 禁销reduce
    var districtType = 'edit';
    $(document).on('click', '.district', function () {
        districtSelf = $(this);
        districtType = 'edit';
        // 区域选项
        var districtLi = $('#pop-district .district-ul li');
        // 清空所有选中状态
        districtLi.removeClass('active');
        // 获取目前选择的的区域
        var dataArr = $(this).attr('data').split(',');
        // 遍历，给选择的区域添加活动状态
        districtLi.each(function () {
            for (var i = 0, len = dataArr.length; i < len; i++) {
                if ($(this).text() == dataArr[i]) {
                    $(this).addClass('active');
                }
            }
        });
        $('#pop-district').fadeIn('fast');
    });
    // 新增销往
    $(document).on('click', '.district-add', function () {
        districtSelf = $(this);
        districtType = 'add';
        // 区域选项
        var districtLi = $('#pop-district .district-ul li');
        // 清空所有选中状态
        districtLi.removeClass('active');
        $('#pop-district').fadeIn('fast');
    });
    // 新增禁销
    $(document).on('click', '.district-reduce', function () {
        districtSelf = $(this);
        districtType = 'reduce';
        // 区域选项
        var districtLi = $('#pop-district .district-ul li');
        // 清空所有选中状态
        districtLi.removeClass('active');
        $('#pop-district').fadeIn('fast');
    });

    // 选择区域-中国
    $('.district-all li').on('click', function () {
        // 清空其他区域的选中状态，只留中国
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $('.district-ul li').removeClass('active');
            $(this).addClass('active');
        }
    });
    // 选择区域-其他
    $('.district-select li').on('click', function () {
        // 如果已经选了中国，则不可选其他区域
        if ($('.district-all li').hasClass('active')) {
            return false;
        }
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
    });
    // 选择区域-确定
    $('#pop-district .btn-yes').on('click', function () {
        // 如果没有选择区域，不能确定
        if ($('#pop-district .pop-body .active').length <= 0) {
            return false;
        }
        // 记录原本的样子
        marketArg.record = districtSelf.closest('.market-table').html();
        // 区域文字
        var districtText = '';
        $('#pop-district .pop-body .active').each(function () {
            districtText += $(this).text() + ',';
        });
        // 区域文字详情
        var newDistrictText = districtText.substr(0, districtText.length - 1);
        // 表格中只显示20字
        var districtTableText = newDistrictText.substr(0, 20);
        switch (districtType) {
            case 'edit':
                districtSelf.attr('data', newDistrictText);
                districtSelf.next('input').val(newDistrictText);
                districtSelf.text(districtTableText);
                break;
            case 'add':
                var districtAddHtml = '<ul class="table-body"><li><div class="district" data="' + newDistrictText + '">' + districtTableText + '</div><input name="" class="district-input hidden" value="' + newDistrictText + '"></li><li><div class="channel" data="' + marketArg.channelAll + '">所有渠道</div><input name="" class="channel-input hidden" value="' + marketArg.channelAll + '"></li><li class="verify-parent market-whole"><input name="" class="price-input price-whole must" value=""><br><div class="empty-tip">请填写拆零单价</div></li><li class="verify-parent market-one"><input name="" class="price-input price-one must" value=""><br><div class="empty-tip">请填写拆零单价</div></li><li><span class="district-del">删除</span><input name="" class="market-input hidden" value="0"><input name="" class="lv-input hidden" value=""></li></ul>';
                districtSelf.closest('.market-table').append(districtAddHtml);
                break;
            case 'reduce':
                var districtReduceHtml = '<ul class="table-body"><li><div class="district" data="' + newDistrictText + '">' + districtTableText + '<p class="forbid">禁销</p>' + '</div><input name="" class="district-input hidden" value="' + newDistrictText + '"></li><li><div class="channel" data="' + marketArg.channelAll + '">所有渠道</div><input name="" class="channel-input hidden" value="' + marketArg.channelAll + '"></li><li class="verify-parent market-whole"><input name="" class="price-input price-whole must" value=""><br><div class="empty-tip">请填写拆零单价</div></li><li class="verify-parent market-one"><input name="" class="price-input price-one must" value=""><br><div class="empty-tip">请填写拆零单价</div></li><li><span class="district-del">删除</span><input name="" class="market-input hidden" value="1"><input name="" class="lv-input hidden" value=""></li></ul>';
                districtSelf.closest('.market-table').append(districtReduceHtml);
                break;
            default:
                console.log('药荟网');
                break;
        }
        marketWarn(districtSelf);
        marketInputName();
        // 关闭弹窗
        $(this).closest('.pop-shade').fadeOut('fast');
    });

    // 选择渠道
    var channelSelf;
    $(document).on('click', '.channel', function () {
        channelSelf = $(this);
        // 区域选项
        var channelLi = $('#pop-channel .channel-select li');
        // 清空所有选中状态
        channelLi.removeClass('active');
        // 获取目前选择的的区域
        var dataArr = $(this).attr('data').split(',');
        // 遍历，给选择的区域添加活动状态
        channelLi.each(function () {
            for (var i = 0, len = dataArr.length; i < len; i++) {
                if ($(this).text() == dataArr[i]) {
                    $(this).addClass('active');
                }
            }
        });
        // 是否已经全部选择，如果是，全选按钮添加活动状态
        if ($('.channel-select .active').length == $('.channel-select li').length) {
            $('.channel-all').addClass('active');
        } else {
            $('.channel-all').removeClass('active');
        }
        $('#pop-channel').fadeIn('fast');
    });
    // 选择渠道-全选
    $('.channel-all').on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.channel-select li').removeClass('active');
        } else {
            $(this).addClass('active');
            $('.channel-select li').addClass('active');
        }
    });
    // 选择渠道-其他
    $('.channel-select li').on('click', function () {
        $(this).toggleClass('active');
        // 是否已经全部选择，如果是，全选按钮添加活动状态
        if ($('.channel-select .active').length == $('.channel-select li').length) {
            $('.channel-all').addClass('active');
        } else {
            $('.channel-all').removeClass('active');
        }
    });
    // 选择渠道-确定
    $('#pop-channel .btn-yes').on('click', function () {
        // 如果没有选择渠道，不能确定
        if ($('#pop-channel .pop-body .active').length <= 0) {
            return false;
        }
        // 记录原本的样子
        marketArg.record = channelSelf.closest('.market-table').html();
        // 渠道文字
        var channelText = '';
        $('#pop-channel .channel-select .active').each(function () {
            channelText += $(this).text() + ',';
        });
        // 渠道文字详情
        var newChannelText = channelText.substr(0, channelText.length - 1);
        channelSelf.attr('data', newChannelText);
        channelSelf.next('input').val(newChannelText);
        // 表格中，如果全选了，则显示  所有渠道
        if ($('.channel-all').hasClass('active')) {
            channelSelf.text('所有渠道');
        } else {
            channelSelf.text(newChannelText);
            // 在表格中超过20则截断
            if (newChannelText.length > 20) {
                newChannelText = newChannelText.substr(0, 20);
            }
        }
        marketWarn(channelSelf);
        // 关闭弹窗
        $(this).closest('.pop-shade').fadeOut('fast');
    });

    // 删除控销
    var districtDel;
    $(document).on('click', '.district-del', function () {
        districtDel = $(this);
        $('#pop-market').fadeIn('fast');
    });
    $('#pop-market .btn-yes').on('click', function () {
        districtDel.closest('.table-body').remove();
        marketInputName();
        // 关闭弹窗
        $(this).closest('.pop-shade').fadeOut('fast');
    });

	// 关闭弹窗
	$('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
		$(this).closest('.pop-shade').fadeOut('fast');
	});


	// 保存
	$('.btn-save').on('click', function (event) {
		var e = event || window.event;
		// 金额没填
		var money = false;
		var moneyArr = [];
		$('.money').each(function () {
			var val = $.trim($(this).val());
			if (val == '') {
				$(this).addClass('warn');
			}
			moneyArr.push(val);
		});
		if (moneyArr.indexOf('') < 0) {
			money = true;
		}
		// 地址没填
		var address = false;
		var addressArr = [];
		$('.address').each(function () {
			var val = $.trim($(this).val());
			if (val == '') {
				$(this).closest('.district').find('.address-text').addClass('warn');
			}
			addressArr.push(val);
		});
		if (addressArr.indexOf('') < 0) {
			address = true;
		}
		// 判断数据是否符合要求
		if (money && address) {
			$('.warn').removeClass('warn');
			$('.warn-tip').hide();
			alert('保存成功！');
		} else {
			console.log(!money && !address)
			if (!money) {
				$('.warn-tip').text('请输入金额!');
			}
			if (!address) {
				$('.warn-tip').text('请先选择地区!');
			}
			if (!money && !address) {
				$('.warn-tip').text('请输入金额并选择地区!');
			}
			$('.warn-tip').show();
		}
		e.preventDefault();
	});
});