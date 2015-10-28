<?php

    include_once('data/mylog.php');

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

    <script src="mylog.dev-5.0.14.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

    <style type="text/css">

    body, html{
        /*height: 100%;*/
        width: 100%;
        padding: 0;
        margin: 0;
        background: url(../fond.gif) repeat top left;
    }


/* DEV */

    .testevent, .testevent2{
        width: 50px;
        height: 50px;
        background-color: blue;
    }

    .node1{
        position: relative;
        width: 200px;
        height: 200px;
        background-color: red;
    }

    .node2{
        position: relative;
        width: 100px;
        height: 100px;
        background-color: orange;
    }

    .node3{
        position: relative;
        width: 50px;
        height: 50px;
        background-color: yellow;
    }


    </style>
</head>
<body>




<div class="testevent">//1</div>

<div class="testevent" id="testevent">2<div></div></div>



<div class="testevent" id="testevent1">
    ddd
</div>

<div class="testevent" id="testevent2">eee</div>



<div id="testevent4">

    <div class="testevent" id="testevent3">

        zzzz
        <div>zzz</div>
        aaa
        <img src="aaaa" />
        <div>
            <img src="aaaa" />
        </div>
        aaa
        <div>
            <!-- aaa
            <div>aaaa</div>
            aa -->
        </div>
        aaa
    </div>
    <script type="text/javascript" src="events/test.js"></script>
    <script class="truc">

        var test = 0;

        if( test > 0){

        }else if (test < 0){

        }

    </script>

</div>



<div class="testevent2" >3</div>




<div class="node1">
    
    <div class="node2">
        
        <div class="node3"></div>

    </div>

</div>






<a id="bookmarklet" href="javascript:(function(){var url='http://matdev.fr/mylog/mylog-5.0/mylog.dev-5.0.13-beta.js';var n=document.createElement('script');n.setAttribute('language','JavaScript');n.setAttribute('src',url);document.body.appendChild(n);setTimeout(function(){log.show()},1000);})();">mylog</a>

            
<textarea id="js">(function() {
    var url = 'http://matdev.fr/mylog/mylog-5.0/mylog.dev-5.0.13-beta.js';
    
    var n=document.createElement('script');
    n.setAttribute('language','JavaScript');
    n.setAttribute('src',url);
    document.body.appendChild(n);

    setTimeout(function(){log.show()},0);

})();</textarea>





<script type="text/javascript">


// log.green(testevent1)
// log.green(testevent2)
// log.green(testevent3)
log.green(testevent4)
// log.green(document.body)


var infos = {};
var scripts = [];


$('.node1').on('click', function(){
    // log.green('okok')
});
$(document).on('click', '.node1', function(){
    // log.green('okok')
});

        
var all = document.querySelectorAll('body > *'),
    types = [ 'click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseenter', 'mouseleave', 'mouseup', 'change', 'focus', 'blur', 'scroll', 'select', 'submit', 'keydown', 'keypress', 'keyup', 'load', 'unload' ];

for (var i = 0; i < all.length; i++) {

    // all[i].addEventListener('mouseover', getEvents, false); 

};

function getEvents(){

    var events = null;

    infos = { 'node': this, 'events': [] };

    for (var ii = 0; ii < types.length; ii++) {

        if ( typeof this['on'+types[ii]] == 'function' ) {

            infos.events.push( { 'type':types[ii], 'func':this['on'+types[ii]].toString(), file:null, line:null, src:'DOM 0'  } ); 

        }
    };

    if ( typeof jQuery !== 'undefined' ){
        events = $._data(this, 'events');

        for( var k in events){
            var truc = events[k];
            for (var i = 0; i < events[k].length; i++) {
                var handler = events[k][i]['handler'].toString();
                if( handler.indexOf('prout') === -1 )
                    infos.events.push( { 'type':events[k][i]['origType'], 'func':handler, file:null, line:null, src:'jQuery'  } ); 
            };
        }

    }

    for (var i = 0; i < infos.events.length; i++) {

        var test = infos.events[i].func.replace(/(.*){/i, '');

        for (var ii = 0; ii < scripts.length; ii++) {

            if(scripts[ii].script.indexOf(test) !== -1 ){

                var machin = scripts[ii].script.split(test);
                var machin = machin[0].split("\n");
                
                infos.events[i].line = machin.length;
                infos.events[i].file = scripts[ii].name;
            }

        };
    };

    log.loop( infos );

}







    function _ajax(obj){
    
        var xhr = null;

        if (window.XMLHttpRequest || window.ActiveXObject) {
            if (window.ActiveXObject) {
                try {
                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
                } catch(e) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
            } else {
                xhr = new XMLHttpRequest(); 
            }
        } else {
            // alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
            return null;
        }

        xhr.onreadystatechange = function() {

            if (xhr.readyState == 4 && xhr.status == 200 && obj.success /*&& xhr.responseText!=''*/ ) {

                if(obj.type=='json'){
                    obj.success( JSON.parse(xhr.responseText) );
                }else{
                    obj.success( xhr.responseText );
                }

            }

        };

        variables = '';
        if( obj.data ){
            ii = 0; l = Object.keys(obj.data).length;
            for (var i in obj.data) {
                variables += i + '=' + encodeURIComponent(obj.data[i]);
                if(++ii!=l) variables += '&'; 
            };
        };

        xhr.open('POST', obj.url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(variables);

    };



    function getScript(){

        var $script = document.getElementsByTagName('script');
        
        for (var i = $script.length - 1; i >= 0; i--) {

            if( $script[i].src && $script[i].src != '' ){
                var name =  $script[i].src.split('/');
                name = name[name.length-1]
                if( name.indexOf('jquery') === -1 && name.indexOf('mylog') === -1 ){
                    getFile( $script[i].src, name )
                    // scripts.push({ 'name':name, 'script': getFile($script[i].src) });
                }
            }else{
                scripts.push({ 'name':'inline', 'script': $script[i].innerText ? $script[i].innerText : 'error' });
            }

        };

    }

    function getFile(url, name){

        _ajax({
            url: url,
            type: "text",
            success: function (text) {

                scripts.push({ 'name':name, 'script': text });
                // log.loop(scripts);

            }
        });

    }

    // getScript();



</script>

</body>
</html>





