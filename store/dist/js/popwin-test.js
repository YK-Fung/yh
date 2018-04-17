require(['jquery', 'popwin'], function($){
	$('.click').on('click', function(){
		$('.pop-shade').popShow();
	});
	$('.header-close, .btn-no').on('click', function(){
		$('.pop-shade').popHide();
	});
});