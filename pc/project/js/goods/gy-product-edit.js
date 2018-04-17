define(['jquery', 'ZeroClipboard', 'datetime', 'bar-slider', 'bar-header', 'ie-tip'], function ($, ZeroClipboard) {
    window['ZeroClipboard'] = ZeroClipboard;

    UE.delEditor("ue");
    var ue = UE.getEditor('editor',{
        initialFrameWidth : 100+'%',//设置编辑器宽度
        initialFrameHeight: 365,//设置编辑器高度
        scaleEnabled: false,//设置手动拉伸
        autoFloatEnabled: false,//设置工具栏浮动
        autoHeightEnabled: false//设置高度是否自动撑高
    });
    //弹出基础库图片弹窗
    $('.basic-btn').on('click', function () {
        $('#pop-basic').fadeIn('fast');
        $('.basic-item').removeClass('check')
        $('.check-num').html(6 - $('.product-img>li').length)
    });

    //基础库图片点击
    $('#pop-basic .pop-body').on('click','.basic-item',function(){
        if ($('.basic-item.check').length + $('.product-img>li').length >= 6) {
            if ($(this).hasClass('check')) {
                $(this).toggleClass('check');
                $('.check-num').html(6 - $('.basic-item.check').length - $('.product-img>li').length)
            }
        } else {
            $(this).toggleClass('check');
            $('.check-num').html(6 - $('.basic-item.check').length - $('.product-img>li').length)
        }
    })

    //基础库弹窗点击确定
    $('#pop-basic .btn-yes').on('click', function () {
        $('#pop-basic').fadeOut('fast');
        $('.basic-item.check>img').each(function (index, el) {
            var li = $('<li class="basic-temp"><span class="product-img-del"></span></li>');
            li.find('span').after($(el).clone()[0]);
            li.appendTo('.detail-group>.product-img')
            $(el).parent().remove()
        })
        //图片有5张的时候隐藏上传按钮
        if($('.product-img').children('li').length>=6){
            $('.product-img').children('li').eq(0).hide()
        }
    })


    // 设置产品标题输入框光标位置
    // function cursorPos(el, pos){
    // 	var obj = $(el)[0];
    // 	if (pos < 0) {
    // 		pos = obj.value.length;
    // 	}
    // 	// 兼容火狐,谷歌
    // 	if (obj.setSelectionRange) {
    // 		obj.setSelectionRange(pos, pos);
    // 		obj.focus();
    // 	// 兼容IE
    // 	} else if (obj.createTextRange){
    // 		var rng = obj.createTextRange();
    // 		rng.move('character', pos);
    // 		rng.select();
    // 	} else {
    // 		console.log('浏览器版本过低，建议您更换高版本的浏览器！');
    // 	}
    // }
    // 产品标题
    // cursorPos('.product-title input', 0);//设置到开头
    // cursorPos('.product-title input', -1);//设置到末尾
    // $('.product-title input').focus();
    $('.product-title input').on('input propertychange', function () {
        var val = $(this).val();
        if (val.length > 30) {
            $(this).val(val.substr(0, 30));
        }
    });
    // 判断必选选项是否已填并且内容符合规则
    var mustFn = function (el) {
        var el = el || '.must';
        $(el).each(function () {
            var val = $(this).val();
            // 如果是可见的必填选项
            if ($(this).is(':visible')) {
                // 如果为空
                if (val === '') {
                    $(this).closest('.verify-parent').removeClass('verify-error');
                    $(this).closest('.verify-parent').addClass('verify-empty');
                }
                // 如果为0
                if (/^[0](?:\.[0]*)?$/.test(val)) {
                    $(this).closest('.verify-parent').removeClass('verify-empty');
                    $(this).closest('.verify-parent').addClass('verify-error');
                }
            }
            $('.product-piece input').trigger('blur')
        });
    };

    // 件装量
    $('.product-piece input').on('input propertychange', function () {
        // 新的val值，如果有非数字都替换成空，如果大于6个字符则截断
        var newVal = $(this).val().replace(/\D/g, '');
        if (newVal.length > 6) {
            newVal = newVal.substr(0, 6);
        }
        $(this).val(newVal);
        $(this).closest('.verify-parent').removeClass('verify-empty');
        $(this).closest('.verify-parent').removeClass('verify-error');
        $(this).closest('.prod-piece-item').removeClass('verify-empty');
        $(this).closest('.prod-piece-item').removeClass('verify-error');
    });
    $('.product-piece input').on('blur', function () {
        // 如果为空
        if ($(this).val() === '') {
            $(this).closest('.prod-piece-item').removeClass('verify-error');
            $(this).closest('.prod-piece-item').addClass('verify-empty');
        }
        // 如果为0
        if (parseInt($(this).val(), 10) == '0') {
            $(this).closest('.prod-piece-item').removeClass('verify-empty');
            $(this).closest('.prod-piece-item').addClass('verify-error');
        }
    });

    // 采购方式
    var marketShowFn = function () {
        // 如果勾选了拆零，控销表格显示对应的td，否则隐藏
        if ($('.purchase-one').hasClass('active')) {
            $('.market-table').removeClass('show-whole show-all');
            $('.market-table').addClass('show-one')
            marketArg.marketShow = 'show-one';
        } else {
            $('.market-table').removeClass('show-one')
        }
        // 如果勾选了整件，控销表格显示对应的td，否则隐藏
        if ($('.purchase-whole').hasClass('active')) {
            $('.market-table').removeClass('show-one show-all');
            $('.market-table').addClass('show-whole')
            marketArg.marketShow = 'show-whole';
        } else {
            $('.market-table').removeClass('show-whole')
        }
        // 如果勾选了整件和拆零，则控销表格中的td全部显示
        if ($('.purchase-whole').hasClass('active') && $('.purchase-one').hasClass('active')) {
            $('.market-table').removeClass('show-whole show-one');
            $('.market-table').addClass('show-all')
            marketArg.marketShow = 'show-all';
        } else {
            $('.market-table').removeClass('show-all')
        }
    };

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
    marketShowFn();

    // 采购方式选择
    $('.purchase-type li').on('click', function () {
        var idx = $(this).index();
        if ($(this).hasClass('active')) {
            // 如果只有一个有选择，则不给取消
            if ($('.purchase-type .active').length <= 1) {
                return false;
            }
            $(this).removeClass('active');
            $(this).find('input').prop('checked', false);
            // 隐藏的时候顺便移除异常状态提示verify-empty
            $('.purchase-opt li').eq(idx).removeClass('active');
            $('.purchase-opt li').eq(idx).removeClass('verify-empty');
        } else {
            $(this).addClass('active');
            $(this).find('input').prop('checked', true);
            $('.purchase-opt li').eq(idx).addClass('active');
            $('.purchase-opt li').eq(idx).find('.opt-ctn:eq(0) input').focus();
        }
        marketShowFn();
    });

    //接口同步设置
    $('.interface-type li,.checkbox-group .label-radio').on('click',function(){
            $(this).toggleClass('active')
    })

    //标签单选
    $('.radio-group .label-radio').on('click',function(){
          if($(this).hasClass('active')){
              return
          }
        if($(this).hasClass('label-radio-yes')){
            $('.label-sort').css({'visibility':'visible'});
            $(this).parents('.radio-group').removeClass('verify-empty');
            $('.radio-group input')[0].focus()
        }else if($(this).hasClass('label-radio-no')){
            $('.label-sort').css({'visibility':'hidden'});
            $(this).parents('.radio-group').removeClass('verify-empty')
        }
        $(this).addClass('active').siblings('.label-radio').removeClass('active')
    })

    //排序输入框失焦
    $(document).on('blur','.radio-group input',function(){
        var newVal = $(this).val().replace(/\D/g, '');
        if(newVal.length > 0){
            $(this).parents('.radio-group').removeClass('verify-empty')
        }else{
            $(this).parents('.radio-group').addClass('verify-empty')
        }
    })
    //排序输入框内容
    $(document).on('input propertychange','.radio-group input',function(){
        // 新的val值，如果有非数字都替换成空，如果大于6个字符则截断
        var newVal = $(this).val().replace(/\D/g, '');
        if (newVal.length > 6) {
            newVal = newVal.substr(0, 6);
        }
        $(this).val(newVal);
    })

    // 起订量or起订金额 输入
    $('.opt-ctn input').on('input propertychange blur', function () {
        // 新的val值，如果有非数字都替换成空，如果大于6个字符则截断
        var newVal = 0;
        // 0是起订数量，1是起订金额
        if ($(this).closest('.opt-ctn').index() === 0) {
            newVal = $(this).val().replace(/[^\d]/g, '');
            if (!/^[1-9]\d{0,5}$/.test(newVal)) {
                newVal = newVal.substring(0, newVal.length - 1);
            }
        } else {
            newVal = $(this).val().replace(/[^\d.]/g, '');
            if (!/^(([1-9]\d{0,5})|[0])(?:\.\d{0,2})?$/.test(newVal)) {
                newVal = newVal.substring(0, newVal.length - 1);
            }
        }
        $(this).val(newVal);
        // 其他input
        var otherInput = $(this).closest('.opt-ctn').siblings('.opt-ctn').find('input');
        // 如果当前输入框有值了，另一个框则不给输入
        if (newVal.length > 0) {
            otherInput.attr('disabled', true);
        } else {
            otherInput.attr('disabled', false);
        }
        // input值的数组
        var optInputArr = [];
        // 如果input值为空,则加入数组
        $(this).closest('li').find('input').each(function () {
            if ($(this).val() == '') {
                optInputArr.push($(this).val());
            }
        });
        // 如果数组长度为2,则两个input都为空,提示不能为空.
        if (optInputArr.length >= 2) {
            $(this).closest('li').addClass('verify-empty');
        } else {
            $(this).closest('li').removeClass('verify-empty');
        }
    });
    $('.opt-ctn input').on('blur', function () {
        if (parseFloat($(this).val()) < 0.01) {
            $(this).val('0.01');
        }
    });

    // 重定控销相关input的name
    var marketInputName = function () {
        $('.batch-input').each(function (batchIdx) {
            var batchName = marketArg.batch + '[' + batchIdx + '].';
            // 批次
            $(this).attr('name', batchName + marketArg.batchArg);
            // 批次内容
            var batchCtn = $('.batch-ctn').eq(batchIdx);
            // 生产日期
            batchCtn.find('.date-start').attr('name', batchName + marketArg.dateStart);
            // 有效期
            batchCtn.find('.date-end').attr('name', batchName + marketArg.dateEnd);
            // 库存
            batchCtn.find('.inventory').attr('name', batchName + marketArg.inventory);
            // 控销表格
            batchCtn.find('.market-price .table-body').each(function (lvIdx) {
                var lvName = batchName + marketArg.lv + '[' + lvIdx + '].';
                // 地区
                $(this).find('.district-input').attr('name', lvName + marketArg.district);
                // 渠道
                $(this).find('.channel-input').attr('name', lvName + marketArg.channel);
                // 整件单价
                $(this).find('.price-whole').attr('name', lvName + marketArg.priceWhole);
                // 拆零单价
                $(this).find('.price-one').attr('name', lvName + marketArg.priceOne);
                // 禁销or销往
                $(this).find('.market-input').attr('name', lvName + marketArg.isMarket);
                // 楼层
                $(this).find('.lv-input').attr('name', lvName + marketArg.lvArg);
                $(this).find('.lv-input').val(lvIdx);
            });
        });
    };
    // 所有渠道
    marketArg.channelAll = '';
    $('#pop-channel .channel-select li').each(function () {
        marketArg.channelAll += $(this).text() + ',';
    });
    marketArg.channelAll = marketArg.channelAll.substr(0, marketArg.channelAll.length - 1);
    // 批次内容
    marketArg.batchCtn = function () {
        return '<div class="batch-ctn"><div class="market-detail"><span class="market-type">生产日期：</span><input name="" class="market-date date-start date1" value="' + marketArg.marketDate() + '"><span class="must-star">*</span></div><div class="market-detail"><span class="market-type">有效期至：</span><input name="" class="market-date date-end date2" value="' + marketArg.marketDate('end') + '"><span class="must-star">*</span></div><div class="market-detail verify-parent inventory-set"><span class="market-type">库存：</span><input name="" class="inventory must" value=""><span class="must-star">*</span><div class="empty-tip">请填写库存</div><div class="error-tip">库存不能为0</div></div><div class="market-price"><div class="price-title">销售定价</div><div class="market-table ' + marketArg.marketShow + '"><ul class="table-header"><li>区域</li><li>渠道</li><li class="market-whole">整件单价</li><li class="market-one">拆零单价</li><li>操作</li></ul><ul class="table-body"><li><div class="district" data="中国">中国</div><input name="" class="district-input hidden" value="中国"></li><li><div class="channel" data="' + marketArg.channelAll + '">所有渠道</div><input name="" class="channel-input hidden" value="' + marketArg.channelAll + '"></li><li class="verify-parent market-whole"><input name="" class="price-input price-whole must" value=""><br><div class="empty-tip">请填写拆零单价</div></li><li class="verify-parent market-one"><input name="" class="price-input price-one must" value=""><br><div class="empty-tip">请填写拆零单价</div></li><li><span class="district-add">新增销往区域</span><span class="district-reduce">添加禁销区域</span><input name="" class="market-input hidden" value="0"><input name="" class="lv-input hidden" value="0"></li></ul></div></div></div>';
    };
    // 批次选择
    $(document).on('click', '.batch .batch-li', function () {
        mustFn('.market-ctn .must');
        var marketCtn = $(this).closest('.market-ctn');
        // 如果有异常提示，则不能切换
        if (marketCtn.find('.verify-empty').length !== 0 || marketCtn.find('.verify-error').length !== 0) {
            return false;
        }
        var idx = $(this).index();
        $(this).addClass('active').siblings('.batch-li').removeClass('active');
        $('.batch-ctn').eq(idx).show().siblings('.batch-ctn').hide();
    });
    // 批次修改
    $(document).on('dblclick', '.batch .batch-li', function () {
        mustFn('.market-ctn .must');
        var marketCtn = $(this).closest('.market-ctn');
        // 如果有异常提示，则不能继续修改
        if (marketCtn.find('.verify-empty').length !== 0 || marketCtn.find('.verify-error').length !== 0) {
            return false;
        }
        // 隐藏文字展示框
        $(this).find('.batch-detail').removeClass('show');
        // 显示输入框,并获得焦点
        $(this).find('.batch-input').addClass('show').focus();
    });
    // 批次输入
    $(document).on('input propertychange', '.batch .batch-input', function () {
        var val = $(this).val();
        // var newVal = val.replace(/[^0-9a-zA-Z]/g, '');
        if (val.length > 20) {
            val = val.substr(0, 20);
        }
        $(this).val(val);
        $(this).closest('.batch-li').find('.batch-detail').text(val);
    });
    // 批次输入失焦
    $(document).on('blur', '.batch .batch-input', function () {
        if ($.trim($(this).val()) === '') {
            $(this).closest('.market-detail').addClass('verify-empty');
        } else {
            // 显示文字展示框
            $(this).closest('.batch-li').find('.batch-detail').addClass('show');
            // 隐藏输入框
            $(this).closest('.batch-li').find('.batch-input').removeClass('show');
            // 移除异常状态
            $(this).closest('.market-detail').removeClass('verify-empty');
        }
    });
    // 增加and减少按钮的显示 隐藏
    var batchBtnToggle = function () {
        // 如果批次有10个了则不能继续添加
        if ($('.batch-li').length >= 10) {
            $('.batch-add').hide();
        } else {
            $('.batch-add').show();
        }
        // 如果批次已经没了则不能继续减少
        if ($('.batch-li').length <= 0) {
            $('.batch-reduce').hide();
            // 没有批次了则默认按钮出现
            $('.batch .batch-opt').before('<li class="batch-default"><div class="batch-detail show">默认</div><input name="" class="batch-input" value="0"></li>');
            // 增加默认的批次内容
            $('.market-ctn').append(marketArg.batchCtn());
        } else {
            $('.batch-reduce').show();
            // 如果有批次了就移除默认按钮
            if ($('.batch .batch-default').length > 0) {
                $('.batch .batch-default').remove();
                $('.batch-ctn:eq(0)').remove();
                // 移除默认的日期插件
                $('.xdsoft_datetimepicker').remove();
            }
        }
    };
    // 增加批次
    $('.batch-add').on('click', function () {
        mustFn('.market-ctn .must');
        var marketCtn = $(this).closest('.market-ctn');
        // 如果有异常提示且不是默认批次，则不能继续增加
        if ($('.batch .batch-default').length <= 0 && (marketCtn.find('.verify-empty').length !== 0 || marketCtn.find('.verify-error').length !== 0)) {
            return false;
        }
        var batchDom = $(this).closest('.batch');
        // 移除其他批次的选中状态，并添加一个新的批次
        batchDom.find('.batch-li').removeClass('active');
        $(this).parent().before('<li class="batch-li active"><div class="batch-detail"></div><input name="" class="batch-input show" value=""></li>');
        batchDom.find('.batch-li:last').find('.batch-input').focus();
        // 增加对应的批次内容
        $('.market-ctn').append(marketArg.batchCtn());
        $('.batch-ctn:last').show().siblings('.batch-ctn').hide();
        batchBtnToggle();
        marketInputName();
        // 日期
        $('.batch-ctn:last').find('.market-date').datetimepicker({
            minView: "month",
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
    });
    // 删除批次
    var batchReduce;
    $('.batch-reduce').on('click', function () {
        batchReduce = $(this);
        batchReduceDom = batchReduce.closest('.batch').find('.active');
        // 如果有异常提示，则不能删除
        if (batchReduce.closest('.market-detail').hasClass('verify-empty')) {
            return false;
        }
        // 如果没有选中，则也不能删除
        if (batchReduceDom.length <= 0) {
            return false;
        }
        $('#pop-reduce').fadeIn('fast');
    });
    $('#pop-reduce .btn-yes').on('click', function () {
        // 删除对应的批次内容
        $('.batch-ctn').eq(batchReduceDom.index()).remove();
        batchReduceDom.remove();
        batchBtnToggle();
        marketInputName();
        $(this).closest('.pop-shade').fadeOut('fast');
    });

    // 库存
    $(document).on('input propertychange', '.inventory', function () {
        $(this).closest('.inventory-set').removeClass('verify-empty');
        $(this).closest('.inventory-set').removeClass('verify-error');
        // 新的val值，如果有非数字都替换成空，如果大于6个字符则截断
        var newVal = $(this).val().replace(/\D/g, '');
        if (newVal.length > 6) {
            newVal = newVal.substr(0, 6);
        }
        $(this).val(newVal);
    });
    $(document).on('blur', '.inventory', function () {
        // 如果为空
        if ($(this).val() === '') {
            $(this).closest('.inventory-set').removeClass('verify-error');
            $(this).closest('.inventory-set').addClass('verify-empty');
        }
        // 如果为0
        if (parseInt($(this).val(), 10) == '0') {
            $(this).closest('.inventory-set').removeClass('verify-empty');
            $(this).closest('.inventory-set').addClass('verify-error');
        }
    });

    // 日期
    $('.market-date').datetimepicker({
        minView: "month",
        timepicker: false,
        format: 'Y-m-d',
        formatDate: 'Y-m-d'
    });

    //发布开始日期
    var date1 = {};
    //发布结束日期
    var date2 = {};
    $(document).on('change','.date1',function(){
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

    $(document).on('change','.date2',function(){
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

    // 生产日期如果为空，设置为当前日期
    $(document).on('blur', '.date-start', function () {
        if ($.trim($(this).val()) == '') {
            $(this).val(marketArg.marketDate());
        }
    });
    // 有效期期如果为空，设置为当前日期+1年
    $(document).on('blur', '.date-end', function () {
        if ($.trim($(this).val()) == '') {
            $(this).val(marketArg.marketDate('end'));
        }
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
        marketArg.record = districtSelf.closest('.market-table').html();
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
    // 整件单价and拆零单价
    $(document).on('input propertychange', '.price-input', function () {
        $(this).closest('li').removeClass('verify-empty');
        var newVal = $(this).val().replace(/[^\d.]/g, '');
        if (!/^(([1-9]\d{0,5})|[0])(?:\.\d{0,2})?$/.test(newVal)) {
            newVal = newVal.substring(0, newVal.length - 1);
        }
        $(this).val(newVal);
    });
    // 不能为空，为空设置为0.01
    $(document).on('blur', '.price-input', function () {
        if ($(this).val() === '') {
            $(this).closest('li').addClass('verify-empty');
        }
        if (parseFloat($(this).val()) < 0.01) {
            $(this).val('0.01');
        }
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

    // 上传图片and预览
    $('.product-img-up').on('change', function () {
        var selfParent = $(this).closest('.product-img');
        // 可传图片上限
        var filesLenMax = (6 - $('.product-img li').length) >= 0 ? (6 - $('.product-img li').length) : 0;
        // 如果图片上限为0，则不能继续上传

        if (!filesLenMax) {
            $(this).val('')
            return false;
        }
        //判断是否支持FileReader
        if (window.FileReader) {
            var fileArr = [];
            var readerArr = [];
            // 上传图片数量
            var filesLen = this.files.length;
            // 2M
            var sizeMax = 1024 * 1024 * 2;
            // 图片如果达到上限，就只传到最大值
            if (filesLen > filesLenMax) {
                filesLen = filesLenMax;
            }
            for (var i = 0; i < filesLen; i++) {
                readerArr[i] = new FileReader();
                //获取文件
                fileArr[i] = this.files[i];
                //是否是图片
                if (!/^image\//.test(fileArr[i].type)) {
                    alert('请选择图片文件！');
                    return false;
                }
                // 是否超过2M
                if (fileArr[i].size > sizeMax) {
                    alert('单张图片大小不得超过2M！')
                    continue;
                }
                // (function (idx) {
                // 	//读取完成
                // 	readerArr[idx].onload = function(e) {
                // 		// 图片路径设置为读取的图片
                //        	var imgObj = new Image();
                //        	imgObj.setAttribute('crossorigin', 'anonymous');
                //            imgObj.src = e.target.result;
                //            imgObj.onload = function () {
                //         	// 获取canvas
                //         	var canvas = $('#canvas')[0]
                // 			var ctx = canvas.getContext("2d");
                // 			// 判断图片的宽高，取最小值作为新的宽高
                //             if (imgObj.width > imgObj.height) {
                //             	canvas.width = imgObj.height;
                //             	canvas.height = imgObj.height;
                //             } else {
                //             	canvas.width = imgObj.width;
                //             	canvas.height = imgObj.width;
                //             }
                //             // 裁剪图片的位置
                //         	var posW = (canvas.width - imgObj.width) / 2
                //         	var posH = (canvas.height - imgObj.height) / 2
                // 			ctx.drawImage(imgObj, posW, posH);
                // 			// 将裁剪后的图片设置为预览图
                //             selfParent.append('<li><span class="product-img-del"></span><img src="' + canvas.toDataURL('image/png') + '"></li>');
                //            }
                // 	};
                // 	readerArr[idx].readAsDataURL(fileArr[idx]);
                // }(i));
                (function (idx) {
                    //读取完成
                    readerArr[idx].onload = function (e) {
                        // 将裁剪后的图片设置为预览图
                        selfParent.append('<li><span class="product-img-del"></span><img src="' + e.target.result + '"></li>');
                    };
                    readerArr[idx].readAsDataURL(fileArr[idx]);
                }(i));
            }
            //如果够5张图片则隐藏上传按钮
            if($('.product-img').children('li').length>=5){
                $(this).parent().hide()
            }
        } else {
            alert('您的设备不支持图片预览功能，如需该功能请升级您的设备！');
            return false;
        }
        $(this).val('')
    });

    // 大图预览
    $(document).on('click', '.product-img img', function () {
        $('.view-img img').attr('src', $(this).attr('src'));
        $('.view-img').fadeIn('fast');
    });
    // 关闭大图预览
    $('.view-img').on('click', function () {
        $(this).fadeOut('fast');
    });

    // 删除图片
    var productImg;
    $(document).on('click', '.product-img-del', function () {
        productImg = $(this).closest('li');
        $('#pop-del1').fadeIn('fast');
    });
    $('#pop-del1 .btn-yes').on('click', function () {
        if(productImg.hasClass('basic-temp')){
            var div = $('<div class="basic-item"><span class="check-icon"></span></div>');
            div.find('span').before(productImg.find('img')[0]);
            $('#pop-basic .pop-body').append(div)
        }
        productImg.remove();
        //删除图片的时候必定将上传按钮显示
        $('.product-img').children('li').eq(0).show()
        // 关闭弹窗
        $(this).closest('.pop-shade').fadeOut('fast');
    });

    // 资质收起or展开
    $('.aptitude-head').on('click', function () {
        var aptitudeCtn = $(this).next('.aptitude-ctn');
        if (aptitudeCtn.is(':hidden')) {
            $(this).find('.fa').addClass('fa-angle-up').removeClass('fa-angle-down');
            aptitudeCtn.show();
        } else {
            $(this).find('.fa').addClass('fa-angle-down').removeClass('fa-angle-up');
            aptitudeCtn.hide();
        }
    });
    // 资质图片上传and预览
    $('.aptitude-up .aptitude-file').on('change', function () {
        var selfParent = $(this).closest('.aptitude-ctn');
        var selfInput = $(this).closest('.aptitude').find('.aptitude-input');
        var selfInputVal = '';
        //判断是否支持FileReader
        if (window.FileReader) {
            var fileArr = [];
            var readerArr = [];
            // 上传图片数量
            var filesLen = this.files.length;
            // 2M
            var sizeMax = 1024 * 1024 * 2;
            if (filesLen > 20) {
                alert('批量上传一次不得超过20张图片！');
                return false;
            }
            for (var i = 0; i < filesLen; i++) {
                readerArr[i] = new FileReader();
                //获取文件
                fileArr[i] = this.files[i];
                //是否是图片
                if (!/^image\//.test(fileArr[i].type)) {
                    alert('请选择图片文件！');
                    return false;
                }
                // 是否超过2M
                if (fileArr[i].size > sizeMax) {
                    alert('单张图片大小不得超过2M！')
                    continue;
                }
                (function (idx) {
                    //读取完成
                    readerArr[idx].onload = function (e) {
                        // 图片路径设置为读取的图片
                        var imgSrc = e.target.result;
                        selfParent.append('<li class="aptitude-view"><div class="aptitude-del"></div><img src="' + imgSrc + '"></li>');
                    };
                    readerArr[idx].readAsDataURL(fileArr[idx]);
                }(i));
            }
            //************************//
            // 后端代码
            selfInputVal += '七牛云路径' + ',';
            selfInput.attr('value', selfInputVal.substr(0, selfInputVal.length - 1));
        } else {
            alret('您的设备不支持图片预览功能，如需该功能请升级您的设备！');
            return false;
        }
    });
    // 资质图片预览
    $(document).on('click', '.aptitude-view img', function () {
        $('.view-img img').attr('src', $(this).attr('src'));
        $('.view-img').fadeIn('fast');
    });
    // 资质图片删除
    var aptitudeDelDom;
    $(document).on('click', '.aptitude-del', function () {
        aptitudeDelDom = $(this).parent();
        $('#pop-del2').fadeIn('fast');
    });
    $('#pop-del2 .btn-yes').on('click', function () {
        aptitudeDelDom.remove();
        // 关闭弹窗
        $(this).closest('.pop-shade').fadeOut('fast');
    });

    // 存草稿
    $('.btn-group .btn-save').on('click', function () {
        console.log('保存成功');
    });
    // 提交
    $('.btn-group .btn-submit').on('click', function () {
        mustFn('.must');
        // 采购方式，先聚焦，触发其输入框的相关事件
        $('.purchase-opt .active input').focus();
        $('.purchase-opt .active input').blur();
        if ($('.verify-empty').length <= 0 && $('.verify-error').length <= 0) {
            alert('提交成功！');
        }

    });
    // 返回
    $('.btn-group .btn-back').on('click', function () {
        window.history.back();
    });
});