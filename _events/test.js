
var aaa = document.getElementById('testevent');

aaa.onmouseover = function(){
	// console.log('onmouseenter');
}

var bbb = document.getElementsByClassName('testevent');

for (var i = 0; i < bbb.length; i++) {

    bbb[i].onmousedown = sss;
    
};

function sss(){
    // console.log('onmousedown');
}

$(function(){

	$('#testevent').mouseenter(function(){
	    'test #';
	});


    $('.testevent').click(function(){
        'test .';
    });

});