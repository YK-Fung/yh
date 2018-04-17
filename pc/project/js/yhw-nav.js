define(['jquery'], function($){
	$('.classify-nav').on('mouseenter', 'li', function() {
		$(this).addClass('cur').siblings('li').removeClass('cur');
	});

	$('.yhw-nav .classify-btn').on('mouseenter',function() {
		
	});
});