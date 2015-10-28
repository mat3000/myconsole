$(function(){

	$('#js').hover( function(){
		log.green('ceci est un event jquery');
	});

});


var truc = document.getElementById('js');

truc.onmouseup = function(){
	log.green('ceci est un event javascript');
};