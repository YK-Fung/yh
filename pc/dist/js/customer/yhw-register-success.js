define(['jquery','ie-tip'], function($){

    //15秒自动跳转到会员中心
    var count = 15;
    setInterval(function () {
        count--;
        if(count <= 0){
            window.location.href='../customer/hy-index.html'
        }
        $('.sec').html(count)
    },1000)

});
