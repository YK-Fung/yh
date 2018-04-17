define(['jquery', 'bar-slider', 'bar-header','ie-tip','jquery-migrate-1.1.0.min', 'jquery.jqprint'], function($){
	//打印
	$('.print-btn').on('click', function() {
		var printHtml = $('.print-ctn').clone();
		$('.print-clone').html(printHtml);
		$('.print-clone').jqprint();
		$('.print-clone').html('');
	});
	
});