define(['jquery'], function($){

	//展开收起内容
	$('.arrow').click(function() {
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).closest('.type-name').next('.toggle-ctn').removeClass('active');
		}else {
			$(this).addClass('active');
			$(this).closest('.type-name').next('.toggle-ctn').addClass('active');
		}
	});

	//查看物流
	$(document).on('click', '.logistics-check', function() {
		$('#pop-logistics-detail').modal('show');
	});

	//查看第三方物流
	$(document).on('click', '.logistics-third', function() {
		$('#pop-logistics-third').modal('show');
	});

	//查看图片
	$(document).on('click', '.certificate .proof-list li', function() {
		var srcPhoto = $(this).find('img').attr('src');	
		if(srcPhoto){
			$('.check-photo img').attr('src', srcPhoto);
			$('.check-photo').show();
		}
	});

	//关闭查看图片
	$('.check-photo .shadow').click(function() {
		$(this).parent().hide();
	});
});