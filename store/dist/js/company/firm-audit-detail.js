define(['jquery', 'datetime'], function ($) {

    // 日期控件
    $('.date-time').datetimepicker({
        minView: "month",
        timepicker: false,
        format: 'Y/m/d',
        formatDate: 'Y/m/d'
    });

    // 企业类型
    $('.firm-type').on('click', function () {
        var val = $(this).val();
        switch (val) {
            case '1':
                $('.firm-type-ctn').html('1');
                break;
            default:
                $('.firm-type-ctn').html('2');
                break;
        }
    });

    // 经营类型
    $('.manage-type').on('change', function () {
        var val = $(this).val();
        switch (val) {
            case '1':
                $('.manage-type-ctn').html('1');
                break;
            default:
                $('.manage-type-ctn').html('2');
                break;
        }
    });

    // 服务费率
    $('.service-tariffing').on('click', function () {
        $('.modal-service').modal('show');
    });
    // 收费模式
    $('.service-radio').on('click', function () {
        var idx = $(this).parent().index();
        if (idx) {
            $('.service-set').hide()
        }
        else {
            $('.service-set').show()
        }
    });

    // 更换资质
    $(document).on('click', '.btn-change', function () {
        $(this).closest('.detail-ctn').find('.qualifications-up').click();
    });
    // 上传图片and预览
    $(document).on('change', '.qualifications-up', function () {
        var self = $(this);
        //判断是否支持FileReader
        if (window.FileReader) {
            var reader = new FileReader();
        } else {
            alert('您的设备不支持图片预览功能，如需该功能请升级您的设备！');
            return false;
        }
        //获取文件
        var file = this.files[0];
        var imageType = /^image\//;
        //是否是图片
        if (!imageType.test(file.type)) {
            alert('请选择图片文件！')
            return false;
        }
        //读取完成
        reader.onload = function (e) {
            // 图片路径设置为读取的图片
            var imgSrc = e.target.result;
            self.parent('.detail-img').find('img').attr('src', imgSrc);
            self.parent('.detail-img').removeClass('qualifications-add');
        };
        reader.readAsDataURL(file);
    });
    // 更新存档
    $(document).on('click', '.btn-renewal', function () {
        var imgDom = $(this).closest('.detail-ctn').find('img');
        var detailUpDom = $(this).closest('li').find('.detail-up');
        // 如果有图片且图片不为空，则把用户上传的图片跟新过去，并清空系统存档的file
        if (imgDom.length > 0 && imgDom.attr('src') !== '') {
            detailUpDom.find('img').attr('src', imgDom.attr('src'));
            detailUpDom.find('.qualifications-up').val('');
        }
    });

    $(document).on('click','.modal .modal-ctn img',function(){
        $('.view-img').modal('hide');
    });


    // 点击查看图片
    $(document).on('click', '.detail-img img', function () {
        $('.view-img img').attr('src', $(this).attr('src'));
        $('.view-img').modal('show');
    });

    // 删除图片
    $(document).on('click', '.qualifications-del', function () {
        $(this).parent('.detail-img').find('img').attr('src', '');
        $(this).parent('.detail-img').find('qualifications-up').val('');
        $(this).parent('.detail-img').addClass('qualifications-add');
    });

    // 长期
    $(document).on('click', '.long-time', function () {
        var checkboxDom = $(this).find('.checkbox');
        checkboxDom.prop('checked', checkboxDom.prop('checked'));
    });
    $(document).on('click', '.long-time .checkbox', function (e) {
        var dateTimeDom = $(this).parent().prev('.date-time');
        if ($(this).prop('checked')) {
            dateTimeDom.val('');
            dateTimeDom.attr('disabled', true);
        }
        else {
            dateTimeDom.attr('disabled', false);
        }
        e.stopPropagation();
    });

    // 保存按钮点击
    $('.btn-submit').on('click', function () {
        alert('提交成功！');
    });
    // 返回按钮点击
    $('.btn-back').on('click', function () {
        history.back();
    });

    // $('.modal-ctn').hover(function () {
    //     $('.action-btn').stop().fadeToggle()
    // })


    //放大预览图片
    var angel = 0, plus = 1;
    $('.icon-plus').on('click', function () {
        plus+=0.5;
        if($('.modal-ctn>img').width()*plus >= $('body').width()){
            plus = $('body').width()/$('.modal-ctn>img').width();
        }
        $('.modal-ctn>img').css({transform: 'scale('+plus+') rotateZ('+angel+'deg)'});
    })

    //缩小预览图片
    $('.icon-minus').on('click', function () {

        plus-=0.5;
        if(plus <= 1){
            plus = 1;
        }
        $('.modal-ctn>img').css({transform: 'scale('+plus+') rotateZ('+angel+'deg)'});
    })

    //旋转图片
    $('.icon-rotate').on('click', function () {
        angel += 90;
        $('.modal-ctn>img').css({'transform': 'scale('+plus+') rotateZ(' + angel + 'deg)'})
    })

    //下载图片
    $('.icon-download').on('click', function () {
        console.log('可以下载');
    })

    //恢复图片原貌
    $('.view-img').on('click', function (e) {
        if (e.target == this) {
            angel = 0;
            plus = 1;
            $('.modal-ctn>img').css({'transform': 'none'});
        }
    })

});