define(['jquery', 'datetime', 'pagination', 'bootstrap'], function($){



	//不通过审核
	$(document).on('click','.btn-nopass',function(){
	    var _this = $(this);
        $('.modal-nopass').modal('show');
        //不通过审核弹窗提交
        $('.modal-nopass .btn-sub').on('click',function(){

            if($('.modal-nopass textarea').val().length>30){
                //提交失败
                alert('不超过30个字');
                return;
            }
            //    提交成功
            _this.parent().siblings('.status').html('未通过');
            _this.remove();
            $('.modal-nopass').modal('hide');
        })
	});

    //通过审核
    $(document).on('click','.btn-pass',function(){
        var _this = $(this);
        $('.modal-pass').modal('show');
        //通过审核弹窗提交
        $('.modal-pass .btn-yes').on('click',function(){
            // 确定
            _this.parent().siblings('.status').html('已审核');
            _this.parent().empty();
        })
    })
});