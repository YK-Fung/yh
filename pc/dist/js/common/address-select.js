define(['jquery'], function ($) {

    // 地址下拉框
    $('.address-select .select-choice').on('click', function(event) {
        var e = event || window.event;
        //其它下拉隐藏
        $('.address-select').removeClass('down');
        //下拉效果切换
        $(this).parent().addClass('down');
        //停止冒泡
        e.stopPropagation();
    });
    // 鼠标点击离开来目标，菜单栏隐藏
    $(document).on('click', function() {
        $('.address-select').removeClass('down');
    });
    //下拉菜单停止冒泡
    $('.address-select .select-drop').on('click',function(event) {
        var e = event || window.event;
        e.stopPropagation();
    });
    // 地区类型选择
    $('.address-select .select-type li').on('click', function () {
        // 获取索引值
        var idx = $(this).index();
        // 前面的区域已选的情况下，才可以选择再小一些的区域
        if (idx == 0 || $('.address-arr input').eq(idx - 1).val() != '') {
            // 设置活动状态，以及显示对应的内容
            $(this).addClass('active').siblings().removeClass('active');
            $('.select-type-ctn .type-main').eq(idx).show().siblings('.type-main').hide();
        }
    });
    // 地区选择
    $('.address-select .zm-ctn li').on('click', function () {
        // 获取索引值
        var idx = $(this).closest('.type-main').index();
        // 如果是之前选择的，则不向下执行
        if ($(this).hasClass('active')) {
            return false;
        }
        // 清除其他的活动状态，给当前添加活动状态
        $(this).closest('.type-main').find('.active').removeClass('active');
        $(this).addClass('active');
        // 设置并获取相应的text
        $('.address-arr input').eq(idx).attr('value', $(this).text() + '/');
        $('.address-arr input').eq(idx).nextAll('input').attr('value', '');
        var addressText = '';
        $('.address-arr input').each(function () {
            addressText += $(this).attr('value');
        });
        // 设置省市的值
        $(this).closest('.address-select').find('.select-chosen').val(addressText.substr(0, addressText.length-1));
        // 显示下一级地区,如果已经是最后一级了则隐藏下拉列表
        if (idx == $('.select-type li').length - 1) {
            $('.address-select').removeClass('down');
            return false;
        }
        // 地区类型切换
        $(this).closest('.select-drop').find('.select-type li').removeClass('active');
        $(this).closest('.select-drop').find('.select-type li').eq(idx + 1).addClass('active');
        // 内容切换
        $(this).closest('.select-drop').find('.type-main').hide();
        $(this).closest('.select-drop').find('.type-main').eq(idx + 1).show();
    });

});