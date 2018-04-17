define(['jquery', 'migrate', 'print'], function($){
	//打印
	$('.print-btn').on('click', function() {
		var printHtml = $('.print-ctn').clone();
		$('.print-clone').html(printHtml);
		$('.print-clone').jqprint();
		$('.print-clone').html('');
	});
	
});