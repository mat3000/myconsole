<?php

    // include_once('data/mylog.php');

    $file = "mylog.dev-6.0.0-beta.js";

?><!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8" />

    <title>mydev</title>

    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <meta name="author" content="mathieu bruno - mathieu-bruno.com" />

    <!-- <link rel="stylesheet" href="mylog.css" /> -->
    <!--[if lt IE 9]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->

    <script src="<?= $file ?>"></script>
    <script type="text/javascript">(function(){var methods=['assert','cd','clear','count','countReset','debug','dir','dirxml','error','exception','group','groupCollapsed','groupEnd','info','log','markTimeline','profile','profileEnd','select','table','time','timeEnd','timeStamp','timeline','timelineEnd','trace','warn','php','show','hide','loop','red','Red','orange','yellow','green','Green','blue','violet','white','grey','black','time','size','key','button','range'];var length=methods.length;var console=(window.console=window.console||{});while(length--){if(!console[methods[length]])console[methods[length]]=function(){};}})();</script>
    

    <style type="text/css">

    body, html{
        /*height: 100%;*/
        width: 100%;
        padding: 0;
        margin: 0;
        background: url(../fond.gif) repeat top left;
    }


/* DEV */
    #testajax{
        margin: 50px;
        padding: 20px;
        background-color: blue;
    }
    #result{
        background-color: rgba(255,0,0,0.5);
    }


    </style>
</head>
<body>

<div id="testajax" class="aa dd bb" data-test="test" for="test" data-truc >

    <!-- test -->

    <div class="test">
        blabla
    </div>

    <input type="button"/>

    <script>var truc = 'machin';</script>

</div>

    <p>Display : <button name="display" value="block">show</button> <button name="display" value="none">hide</button> <button name="display" value="toggle">toggle</button></p>
    <p>Reverse : <button name="reverse" value="true">true</button> <button name="reverse" value="false">false</button> <button name="reverse" value="toggle">toggle</button></p>
    <p>clear : <button name="clear" value="">action</button> </p>
    <p>moveOrSelect : <button name="moveOrSelect" value="move">move</button> <button name="moveOrSelect" value="select">select</button> <button name="moveOrSelect" value="toggle">toggle</button></p>


<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript">

var test1 = undefined;
var test2 = null;
var test3 = 'string';
var test4 = 123.456;
var test5 = true;
var test6 = false
var test7 = document.getElementById('testajax');
var test8 = $('#testajax');
var test9 = [test1,test2,test3,test4,test5,test6,test7,test8];
var test10 = {'test1':test1,'test2':test2,'test3':test3,'test4':test4,'test5':test5,'test6':test6,'test7':test7,'test8':test8};
var test11 = [test9,test10];
var test12 = {'test9':test9,'test10':test10};
// console.log('ok')
// console.info('info')
// _mypanel.tools.add_cookie('var3', 'bidule pozeopz')

// console.log( _mypanel.tools.get_cookie('var4') )


// _mypanel.display('none');

$('button').click(function(){
	var name = $(this).attr('name');
	var value = $(this).attr('value');
	// console.log(value)
	_mypanel[name](value);
});

var i = 0
console.loop(0, 'loop')

setInterval(function(){
	
	console.loop(++i, 'loop')
	console.green('loop', 'loop'+i)

}, 4000);

console.red('red')
console.orange('orange')
console.yellow('yellow')
console.green('green')
console.blue('blue')
console.violet('violet')
console.info(test1,'name','color','value');
console.info(test2,'name','color','value');
console.info(test3,'name','color','value');
console.info(test4,'name','color','value');
console.info(test5,'name','color','value');
console.info(test6,'name','color','value');
console.info(test7,'name','color','value');
console.info(test8,'name','color','value');
console.info(test9,'name','color','value');
console.info(test10,'name','color','value');
console.info(test11,'name','color','value');
console.info(test12,'name','color','value');






</script>

</body>
</html>





