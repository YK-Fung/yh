define(['jquery'], function($){

    //立即领取
    $(".btn").on('click',function(){
        if($(this).text() == '立即使用'){
            return;
        }
        $('#pop-use').fadeIn('fast');
        $('.stamp').css({display:'block'});
        $(this).text('立即使用')
    })

    // 立即领取弹窗
    // var useHref = '';
    $('.btn-get').on('click', function () {
        // useHref = $(this).attr('data');
        $('#pop-use').fadeIn('fast');
    });
    // 弹窗中立即使用按钮
    $('#pop-use').on('click', function () {
        // window.location.href = useHref;
        $(this).closest('.pop-shade').fadeOut('fast');
    });

    // 关闭弹窗
    $('.pop-shade .header-close, .pop-shade .btn-no').on('click', function () {
        $(this).closest('.pop-shade').fadeOut('fast');
    });


    //根据优惠券类型改变字体颜色
    var type = $(".discounts-bg").attr('src').split('link-')[1].substr(0,5);
    if(type == 'goods'){
        $(".desc1").css({color:'#fe635b'})
    }else if(type == 'store'){
        $(".desc1").css({color:'#fe985b'})
    }else{
         $(".desc1").css({color:'#53cbf7'})
    }
    //根据优惠券金额长度调整字体大小
      if($('.price').text().length == 3){
          $('.price').css({fontSize:'90px',lineHeight:'90px'})
      }


});