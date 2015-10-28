/*! 
* mylog v6.0.0-dev
* http://mathieu-bruno.com
* Copyright 2014, Mathieu BRUNO
*/

/*
        
    new :
        - event supported

    bug :
        - bug mylog.php
        - bug affichage fullscreen
        - log.show()

    todo:
        - new log element in highligth
        - one cookie for all param

*/

(function() {

    var _myversion = '6.0.0-dev';
    var _myid = 'mylog';
    var _myname = 'log';
    var _mycookies_days = 30;
    var _mylimite = { type:'ext' , size:20 };
    var _myminSize = { x:150, y:100 };
    var _mystart = { left:100, top:100, width:100, height:100}
    var _limite_arbo = 5;
    var _php_interval = 1000;
    var _mydisplay = 'none';

    var _status_display = undefined;

    // var _mypath = '';
    var _mypath = 'http://matdev.fr/mylog/mylog-5.0/';
    var _myurl_css   = 'data/mylog.css';
    var _myurl_action = 'data/action.php';

    var _debug_mylog = false;

    var $mylog, $mymajor, $myminor, $mynotes, $myevents,
        mymajor = [],
        mymajorReverse = [],
        myminor = [],
        myminorReverse = [],
        mynewtime = false,
        mytime1,
        mytime2;

    var arrayMajor = [];
    var i_major={};
    var i_minor=0;
    var myreverse = 'false';

// mylog
    window[ _myname ] = {

        php: function(status){
            _php(status);
        },

        show: function(){

            if(typeof $mylog === 'undefined') 
                _mydisplay = 'block';
            else
                _show();
            
        },

        hide: function(){
            _hide();
        },

        loop: function( obj, name, color ) {
            if (typeof color == 'undefined') color='red';
            if( name=='red' || name=='orange' || name=='yellow' || name=='green' || name=='blue' || name=='violet' ){
                color = name;
                name = 'none';
            };
            _object(obj, name, color, 'major');
        },

        info: function( obj, name, color ) {
            if( name=='red' || name=='orange' || name=='yellow' || name=='green' || name=='blue' || name=='violet' ){
                color = name;
                name = 'none';
            };
            _object(obj, name, color, 'minor');
        },

        red: function( obj, name ) {
            _object( obj, name, 'red', 'minor' );
        },

        orange: function( obj, name ) {
            _object( obj, name, 'orange', 'minor' );
        },

        yellow: function( obj, name ) {
            _object( obj, name, 'yellow', 'minor' );
        },

        green: function( obj, name ) {
            _object( obj, name, 'green', 'minor' );
        },

        Green: function( obj, name ) {
            _object( obj, name, 'green', 'minor' );
        },
 
        blue: function( obj, name ) {
            _object( obj, name, 'blue', 'minor' );
        },

        violet: function( obj, name ) {
            _object( obj, name, 'violet', 'minor' );
        },

        white: function( obj, name ) {
            _object( obj, name, 'white', 'minor' );
        },
 
        grey: function( obj, name ) {
            _object( obj, name, 'grey', 'minor' );
        },

        black: function( obj, name ) {
            _object( obj, name, 'black', 'minor' );
        },

        time: function( name, color ) {
            if (typeof color == 'undefined') color='red';
            if (typeof name == 'undefined') name='time';
            _time( name, color ); 
        },
 
        size: function( color ) {
            if (typeof color == 'undefined') color='red';
            _size( color );
        },

        key: function( color ) {
            if (typeof color == 'undefined') color='red';
            _key( color );
        },

        button: function( name, callback ) {

            if (typeof name == 'undefined') test='button';
            if (typeof callback == 'undefined') test='button';
            else test = name;

            _button( 'red', test, function(i){
                if(callback) callback(i);
                else if(name) name(i);
            });
        },

        range: function( name, min, max, step, callback ) {

            _range( name, 'red', min, max, step, function(i){
                if(callback) callback(i);
            });
        }

    };

// php
    var memorie = [];
    var si = null;
    function _php(status){

        clearInterval(si);

        if(status==='disable'){

            _disable_myphp(true);

        }else{

            function looop(){

                if(_status_display==='none')
                    return;

                _ajax({
                    url: _myurl_action,
                    data:{ action:'read_mylog' },
                    type:'data',
                    success:function(data){

                        _addClass($myphp_button, 'newloop');
                        setTimeout(function(){
                            _removeClass($myphp_button, 'newloop');
                        },400);

                        if(data==='') return;

                        try {
                            JSON.parse(data);
                        } catch (e) {
                            log.red( data, 'error mylog.js:_php()' );
                            return;
                        }

                        var json = JSON.parse(data);
                        for (var i = 0; i < json.length; i++) {

                            if( indexof( memorie, json[i].id ) === -1 ){

                                memorie.push(json[i].id);

                                if(json[i].color=='none') json[i].color = 'violet';

                                // log.loop( json[i].obj, json[i].name, json[i].color );
                                log.info( json[i].obj, json[i].name, json[i].color );

                            }
                        };

                    }
                });

            };

            if( _php_interval < 500 ) _php_interval = 500;
            looop();
            si = setInterval( looop, _php_interval );
            _enable_myphp(true);

        }
    };

// time
    function _time( name, color ){

        if (!Date.now) {
            Date.now = function() {
                return new Date().valueOf();
            }
        };

        if (!mynewtime) {

            mytime1 = Date.now();
            mynewtime=true;

        } else {

            mytime2 = Date.now();

            _generate_line( '<span class="mystring">'+((mytime2-mytime1)/1000)+'</span>', name, color, 'major');

            mynewtime=false;

        };

    };

// Window Size  
    function _size(color){

        function resize(){

            var sizeWindow={
                x : window.innerWidth,
                y : window.innerHeight
            };

            _generate_line( '<span class="mystring">w: '+sizeWindow.x+'px | h: '+sizeWindow.y+'px</span>', 'size', color, 'major');

        }

        resize();

        window.onresize = function(event) {

            resize();

        }
    };

// which Key 
    function _key(color){

        _generate_line( '<span class="mystring">press key</span>', 'key', color, 'major' );

        document.onkeydown = function(event){

            event = event || window.event; // Compatibilité IE

            var CharCodeW = event.which;
            var CharCodeK = event.keyCode; //verif
            var letter = String.fromCharCode(CharCodeW);

            _generate_line( '<span class="mystring">letter: '+letter+' | CharCode: '+CharCodeW+' - '+CharCodeK+'</span>', 'key', color, 'major' );

        }

    };

// button 
    function _button(color, name, callback){

        var id = Math.round(Math.random()*100000);

        _generate_line( '<button id="mybutton'+id+'" data-stop-propa="true" data-click="0">'+name+'</button>', 'button-'+id, color, 'major' );

        function mybutton(event){
            event = event || window.event; // Compatibilité IE
            var $target = event.target || event.srcElement;
            if( $target.getAttribute('id')=='mybutton'+id && callback ){
                var i = parseInt( $target.getAttribute('data-click') ) + 1;
                $target.setAttribute('data-click', i);
                callback(i);
            }

        }

        if(document.documentElement.addEventListener){
            document.documentElement.addEventListener("mouseup", mybutton);
        }else{
            document.documentElement.attachEvent("onmouseup", mybutton);
        }


    };

// range 
    function _range( name, color, min, max, step, callback){

        _generate_line( '<input type="range" id="myrange-'+name+'" data-stop-propa="true"  min="'+min+'" max="'+max+'" step="'+step+'" value="0" /><span id="myrangeval-'+name+'"></span>', name, color, 'major' );

        function myrange1(event){
            event = event || window.event; // Compatibilité IE
            var $target = event.target || event.srcElement;
            if( $target.getAttribute('id')=='myrange-'+name && callback ){
                var val = parseFloat($target.value);
                callback(val);
            }

        }

        function myrange2(event){
            event = event || window.event; // Compatibilité IE
            var $target = event.target || event.srcElement;
            if( $target.getAttribute('id')=='myrange-'+name && callback ){
                document.getElementById('myrangeval-'+name).innerText = $target.value;
            }

        }

        if(document.documentElement.addEventListener){
            document.documentElement.addEventListener("change", myrange1);
        }else{
            document.documentElement.attachEvent("onchange", myrange1);
        }

        if(document.documentElement.addEventListener){
            document.documentElement.addEventListener("input", myrange2);
        }else{
            document.documentElement.attachEvent("oninput", myrange2);
        }


    };

// object
    function _object( object, name, color, value ){

        if (typeof name == 'undefined') name='none';
        if (typeof color == 'undefined') color='none';

        var obj = _generate_markup(object);
        if(name=='none') name = obj['type'];
        iii=0;
        _generate_line( obj['html'], name, color, value );

    };

    var iii=0;
    function _generate_markup(object,count){

// undefined
        if( typeof object == 'undefined' ) {

            if(_debug_mylog) console.log('undefined');
            return { html:'<span class="mygrey">undefined</span>', type:'var' };
            
// null
        }else if( object == null ) {

            if(_debug_mylog) console.log('null');
            return { html:'<span class="mygrey">NULL</span>', type:'var' };

// string
        }else if ( typeof object == 'string' ) {
            
            if(_debug_mylog) console.log('string');
            return { html:'<span class="mystring">&quot;'+escapeHtml(object)+'&quot;</span>', type:'string' };

// boolean
        }else if (typeof object == 'boolean') {

            if(_debug_mylog) console.log('boolean');
            var tf = object ? 'mytrue' : 'myfalse';
            
            return { html:'<span class="'+tf+'">'+object+'</span>', type:'boolean' };

// number
        }else if (typeof object == 'number') {
            
            if(_debug_mylog) console.log('number');
            return { html:'<span class="mynumber">'+object+'</span>', type:'number' };

// array
        }else if( object instanceof Array ) {

            if(_debug_mylog) console.log('array');
            var html='';
            if( ++iii>_limite_arbo && count ) return { html:'<span class="mygrey">[array]</span>', type:'' };

            for (var i=0, a=object.length; i<a; i++) {

                html += '<div class="mytab">';
                html += '<span class="myblack">'+i+' : </span>';
                html += _generate_markup( object[i], true )['html'];
                html += '</div>';
                 
            };

            iii=0;

            return { html:'<span class="myblack">[</span>'+html+'<div class="myblack">]</div>', type:'array' };

// object literal
        }else if( object.constructor == Object ){

            if(_debug_mylog) console.log('object literal');
            var html='';
            if( ++iii>_limite_arbo && count ) return { html:'<span class="mygrey">{object}</span>', type:'' };

            for (var i in object) {

                html += '<div class="mytab">';
                html += '<span class="myblack">'+i+' : </span>';
                html += _generate_markup( object[i], true )['html'];
                html += '</div>';

            };

            iii=0;

            return { html:'<span class="myblack">{</span>'+html+'<div class="myblack">}</div>', type:'object literal' };

// object object
        }else if( typeof object == 'object'){

            var html='';

            
            if( object.length ){ // jquery

                for (var i = 0; i < object.length; i++) {

                    html += '<div class="mytab">';
                    html += '<span class="myblack">'+i+' : </span>';

                    var id = Math.round(Math.random()*100000000);
                    html += '<div id="min_'+id+'" onclick="javascript:this.style.display=\'none\';document.getElementById(\'dev_'+id+'\').style.display=\'block\';">' + htmlConverter(object[i], true) + '</div>';
                    html += '<div id="dev_'+id+'" onclick="javascript:this.style.display=\'none\';document.getElementById(\'min_'+id+'\').style.display=\'block\';" style="display:none;">' + htmlConverter(object[i]) + '</div>';
                    html += '</div>';

                    // log.green( html )

                    // if(i!=object.length-1)
                        // html += '<span class="myblack">,</span>';
                };

                html = '<span class="myblack">[</span>'+html+'<div class="myblack">]</div>';

            }else if(object.length == undefined){ // javascript

                /*try{

                    object.outerHTML;

                }catch(e){

                    return 'error';

                }*/

                if(!object.outerHTML) {

                    if( ++iii>_limite_arbo && count ) return { html:'<span class="mygrey">{Object}</span>', type:'' };

                    var __i=0;
                    for (var i in object) {

                        html += '<div class="mytab">';
                        html += '<span class="myblack">'+i+' : </span>';
                        // if(++__i==38){
                            html += _generate_markup( object[i], true )['html'];
                        // }else{
                            // html += "_generate_markup()";
                        // }
                        html += '</div>';

                    };

                    iii=0;

                    return { html:'<span class="myblack">{</span>'+html+'<div class="myblack">}</div>', type:'object' };

                }else{

                    var id = Math.round(Math.random()*100000000);
                    html += '<div id="min_'+id+'" onclick="javascript:this.style.display=\'none\';document.getElementById(\'dev_'+id+'\').style.display=\'block\';">' + htmlConverter(object, true) + '</div>';
                    html += '<div id="dev_'+id+'" onclick="javascript:this.style.display=\'none\';document.getElementById(\'min_'+id+'\').style.display=\'block\';" style="display:none;">' + htmlConverter(object) + '</div>';


                }

                
            }else{

                html = '<span class="mygrey">undefined</span>';

            }
           
            return { html:html, type:'object object' };

// unknow
        }else{

            if(_debug_mylog) console.log('unknow');
            return { html:'<span class="mygrey">'+escapeHtml(object)+'</span>', type:'unknow' };

        };
    };

    function _generate_line(markup, name, color, value){

        if(value=='major'){

            if( indexof( arrayMajor, name ) == -1 ) {

                arrayMajor.push(name);
                var i_array = indexof( arrayMajor, name );
                i_major[name] = 1;

                var html =  '<div id="mymajor_'+i_array+'" class="mysection '+color+'">'+
                                '<div class="myback_color"></div>'+
                                '<div class="myline"><span class="mynumberline">'+(i_array+1)+'</span><span class="myname">'+name+' : </span>'+markup+'</div>'+
                            '</div>';

                if(typeof $mylog == 'undefined'){

                    mymajor.push(html);

                }else{

                    if(myreverse==='true') $mymajor.innerHTML = html + $mymajor.innerHTML;
                    else $mymajor.innerHTML += html;

                }

            }else{

                var i_array = indexof( arrayMajor, name );
                i_major[name]++;

                var html =  '<div class="myback_color"></div>'+
                            '<div class="myline"><span class="mynumberline">'+(i_array+1)+'</span><span class="myname">'+name+' : </span>'+markup+'<span class="mycount">'+i_major[name]+'</span></div>';
                            
                if(typeof $mylog == 'undefined'){

                    mymajor[i_array] = '<div id="mymajor_'+i_array+'" class="mysection '+color+'">'+html+'</div>';;

                }else{

                    var $el = document.getElementById('mymajor_'+i_array);
                    $el.className = 'mysection '+color;
                    $el.innerHTML = html;

                }

            }

        }else if(value=='minor'){

            i_minor++;

            var html =  '<div class="myback_color"></div>'+
                        '<div class="myline"><span class="mynumberline">'+i_minor+'</span><span class="myname">'+name+' : </span>'+markup+'</div>';

            if(typeof $mylog == 'undefined'){

                myminor.push('<div id="myminor_'+i_minor+'" class="mysection '+color+'">'+html+'</div>');

            }else{

                var insert = document.createElement('div');
                insert.setAttribute('id','myminor_'+i_minor);
                insert.setAttribute('class','mysection '+color);

                insert.innerHTML = html;

                if(myreverse==='true') {
                    last = document.getElementById('myminor_'+(i_minor-1));
                    $myminor.insertBefore(insert,last);
                }else {
                    $myminor.appendChild(insert);
                }
            }

        }

    };

// drag
    function _draggable(start) {

        var drag = null;
        var drag_end = null;
        var $element = $mylog;
        var scrollStart = 0;
        var classTarget = null;

        function _start(data){

            data.left = _readCookie('posObjX') ? parseInt(_readCookie('posObjX')) : data.left;
            data.top = _readCookie('posObjY') ? parseInt(_readCookie('posObjY')) : data.top;
            data.width = _readCookie('sizeObjX') ? parseInt(_readCookie('sizeObjX')) : data.width;
            data.height = _readCookie('sizeObjY') ? parseInt(_readCookie('sizeObjY')) : data.height;

            drag = {
                posObjX: $element.offsetLeft,
                posObjY: $element.offsetTop,
                sizeObjX : $element.offsetWidth,
                sizeObjY : $element.offsetHeight,
                sizeParentX : window.innerWidth,
                sizeParentY : window.innerHeight
            };

            if(data.width) {
                if( data.width < _myminSize.x ) data.width = _myminSize.x;
                if( data.width > drag.sizeParentX ) data.width = drag.sizeParentX - _mylimite.size * 2;
                $element.style.width = data.width + 'px';
            }

            if(data.height) {
                if( data.height < _myminSize.y ) data.height = _myminSize.y;
                if( data.height > drag.sizeParentY ) data.height = drag.sizeParentY - _mylimite.size * 2;
                $element.style.height = data.height + 'px';
            }

            if(data.left) {
                if(data.left < _mylimite.size) data.left = _mylimite.size;
                if(data.left + drag.sizeObjX > drag.sizeParentX - _mylimite.size) data.left = drag.sizeParentX - drag.sizeObjX - _mylimite.size;
                if($element.offsetWidth + data.left > drag.sizeParentX - _mylimite.size) $element.style.width = (drag.sizeParentX - _mylimite.size) - data.left + 'px';
                $element.style.left = data.left + 'px';
            }

            if(data.top) {
                if(data.top < _mylimite.size) data.top = _mylimite.size;
                if(data.top + drag.sizeObjY > drag.sizeParentY - _mylimite.size) data.top = drag.sizeParentY - drag.sizeObjY - _mylimite.size;
                if($element.offsetHeight + data.top > drag.sizeParentY - _mylimite.size) $element.style.height = (drag.sizeParentY - _mylimite.size) - data.top + 'px';
                $element.style.top = data.top + 'px';
            }

            drag = {
                posObjX: data.left,
                posObjY: data.top,
                sizeObjX : data.width,
                sizeObjY : data.height
            };

        };

        function _mousedown (event) {

            event = event || window.event; // Compatibilité IE
            if(event.type == 'touchstart'){
                if(event.touches.length>1) return;
                event = event.touches[0];
            }
            if(event.button==2) {
                drag = null;
                return;
            }

            _addClass($mylog, 'mymove');

            var $target = event.target || event.srcElement;

            if( search_parents_attr($target,'data-stop-propa') === 'true' ) return;

            drag = {
                clientX: event.clientX,
                clientY: event.clientY,
                posObjX: $element.offsetLeft,
                posObjY: $element.offsetTop,
                sizeObjX : $element.offsetWidth,
                sizeObjY : $element.offsetHeight,
                sizeParentX : window.innerWidth,
                sizeParentY : window.innerHeight
            };

            drag_end = {
                left    : drag.posObjX,
                top     : drag.posObjY,
                width   : drag.sizeObjX,
                height  : drag.sizeObjY
            }

            scrollStart = $target.scrollTop;

            var target_class = $target.getAttribute('class');
            if(target_class) target_class = target_class.split(' ');
            if(target_class && target_class[0]=='rsz') classTarget = target_class[1];
            else classTarget = 'move';

            // log.loop(drag_end,'_mousedown()');

            return false;
        };

        function _drag(event) {

            if (!drag) return;
            event = event || window.event; // Compatibilité IE
            if(event.type == 'touchmove') event = event.touches[0]; // Compatibilité iOS

            var newPosition={
                    x : drag.posObjX + (event.clientX - drag.clientX),
                    y : drag.posObjY + (event.clientY - drag.clientY)
                };

            var $target = event.target || event.srcElement;
            if($target.scrollTop!=scrollStart) {
                _end();
                return false;
            }

            if(classTarget=='move')
                _move(newPosition);
            else
                _resize(newPosition);

            // log.loop(drag,'_drag()');

            return false;
        };

        function _move(newPosition) {

            drag_end = {
                left    : drag.posObjX,
                top     : drag.posObjY,
                width   : drag.sizeObjX,
                height  : drag.sizeObjY
            }

            if(_mylimite.type=='int') {

                if( newPosition.x < _mylimite.size ) 
                    newPosition.x = _mylimite.size;

                if( newPosition.y < _mylimite.size ) 
                    newPosition.y = _mylimite.size;

                if( newPosition.x > drag.sizeParentX - _mylimite.size - drag.sizeObjX ) 
                    newPosition.x = drag.sizeParentX - _mylimite.size - drag.sizeObjX;

                if( newPosition.y > drag.sizeParentY - _mylimite.size - drag.sizeObjY ) 
                    newPosition.y = drag.sizeParentY - _mylimite.size - drag.sizeObjY;

            } else if(_mylimite.type=='ext') {

                if( newPosition.x < _mylimite.size - drag.sizeObjX + 1 ) 
                    newPosition.x = _mylimite.size - drag.sizeObjX + 1;

                if( newPosition.y < _mylimite.size - drag.sizeObjY + 1 ) 
                    newPosition.y = _mylimite.size - drag.sizeObjY + 1;

                if( newPosition.x > drag.sizeParentX - _mylimite.size - 1 ) 
                    newPosition.x = drag.sizeParentX - _mylimite.size - 1;

                if( newPosition.y > drag.sizeParentY - _mylimite.size - 1 ) 
                    newPosition.y = drag.sizeParentY - _mylimite.size - 1;

            }

            drag_end.left = newPosition.x;
            drag_end.top = newPosition.y;

            $element.style.left = newPosition.x + 'px';
            $element.style.top = newPosition.y + 'px';

        }

        function _resize(newPosition){
            
            drag_end = {
                left    : drag.posObjX,
                top     : drag.posObjY,
                width   : drag.sizeObjX,
                height  : drag.sizeObjY
            }

            if( classTarget=='rsz_r' || classTarget=='rsz_tr' || classTarget=='rsz_rb' ){

                var width = drag.sizeObjX + newPosition.x - drag.posObjX;

                // limites
                if(_mylimite.type=='int'){

                    if( drag.posObjX + width > drag.sizeParentX - _mylimite.size ) 
                        width = drag.sizeParentX - drag.posObjX - _mylimite.size;

                }else if(_mylimite.type=='ext'){

                    if( drag.posObjX + width < _mylimite.size + 1 ) 
                        width = _mylimite.size - drag.posObjX + 1;

                }

                // min
                if( width < _myminSize.x ) 
                    width = _myminSize.x;

                drag_end.width = width;

                $element.style.width = width + 'px';

            };

            if( classTarget=='rsz_b' || classTarget=='rsz_rb' || classTarget=='rsz_bl' ){

                var height = drag.sizeObjY + newPosition.y - drag.posObjY;

                // _mylimites
                if(_mylimite.type=='int'){

                    if( drag.posObjY + height > drag.sizeParentY - _mylimite.size ) 
                        height = drag.sizeParentY - drag.posObjY - _mylimite.size;

                }else if(_mylimite.type=='ext'){

                    if( drag.posObjY + height < _mylimite.size + 1 ) 
                        height = _mylimite.size - drag.posObjY + 1;

                }

                // min
                if( height < _myminSize.y ) 
                    height = _myminSize.y;

                drag_end.height = height;

                $element.style.height = height + 'px';

            };

            if( classTarget=='rsz_l' || classTarget=='rsz_bl' || classTarget=='rsz_lt' ){

                var left = newPosition.x;
                var width = drag.sizeObjX - newPosition.x + drag.posObjX;

                if(_mylimite.type=='int'){

                    if( left < _mylimite.size ) {
                        left = _mylimite.size;
                        width = drag.posObjX + drag.sizeObjX - _mylimite.size;
                    }

                }else if(_mylimite.type=='ext'){

                    if( left > drag.sizeParentX - _mylimite.size - 1 ){
                        left = drag.sizeParentX - _mylimite.size - 1;
                        width = drag.posObjX + drag.sizeObjX - drag.sizeParentX + _mylimite.size;
                    }

                }

                if( width < _myminSize.x ){
                    width = _myminSize.x;
                    left = drag.posObjX + drag.sizeObjX - _myminSize.x;
                }

                drag_end.left = left;
                drag_end.width = width;

                $element.style.left = left + 'px';
                $element.style.width = width + 'px';

            };

            if( classTarget=='rsz_t' || classTarget=='rsz_tr' || classTarget=='rsz_lt' ){

                var top = newPosition.y ;
                var height = drag.sizeObjY - newPosition.y + drag.posObjY;

                if(_mylimite.type=='int'){

                    if( top < _mylimite.size ) {
                        top = _mylimite.size;
                        height = drag.posObjY + drag.sizeObjY - _mylimite.size;
                    }

                }else if(_mylimite.type=='ext'){

                    if( top > drag.sizeParentY - _mylimite.size - 1 ){
                        top = drag.sizeParentY - _mylimite.size -1;
                        height = drag.posObjY + drag.sizeObjY - drag.sizeParentY + _mylimite.size;
                    }

                }

                if( height < _myminSize.y ){
                    height = _myminSize.y;
                    top = drag.posObjY + drag.sizeObjY - _myminSize.y;
                }

                drag_end.top = top;
                drag_end.height = height;

                $element.style.top = top + 'px';
                $element.style.height = height + 'px';

            };

        }
        
        function _end() {
            _removeClass($mylog, 'mymove');
            _pos_cookie(drag_end);
            drag = null;
        };

        if(start) _start(start);

        $element.onmousedown  = _mousedown;
        $element.ontouchstart = _mousedown;

        if (!document.addEventListener) 
            document.attachEvent("onmousemove", _drag);
        else {
            document.addEventListener('touchmove', _drag, false);
            document.addEventListener('mousemove', _drag, false);
        }

        if (!document.addEventListener) 
            document.attachEvent("onmouseup", _end);
        else {
            document.addEventListener('touchend', _end, false);
            document.addEventListener('mouseup', _end, false);
        }
    };


// display
    function _display_start(){
        // $mylog.style.display = _readCookie('mydisplay')=='block' ? 'block' : 'none';
        if( _readCookie('mydisplay')=='block' ){
            $mylog.style.display = 'block';
            _status_display = 'block';
        }else{
            _status_display = 'none';
        }
    }

    function _show(){
        if(typeof $mylog !== 'undefined')
            $mylog.style.display = 'block';
        _status_display = 'block';
        _createCookie('mydisplay','block');
    };

    function _hide(){
        $mylog.style.display = 'none';
        _status_display = 'none';
        _createCookie('mydisplay','none');
    };

    function _toggle_display(event){

        event = event || window.event;

        var $target = event.target || event.srcElement;

        if ( event.altKey || $target.className === 'myclose' ){
            if( _getStyle($mylog,'display') == 'block' ) {
                _hide();
            } else {
                _show();
            };
        }

    };

// toggle php log
    function _mylogphp_start(){

        _readCookie('myphp')=='true' ? _enable_myphp() : _disable_myphp();

    };
    function _disable_myphp(inactive) {

        if(!inactive) log.php('disable');
        if(typeof $myphp_button != 'undefined')
            _removeClass($myphp_button,'active');
        _createCookie('myphp','false');

    };
    function _enable_myphp(inactive) {

        if(!inactive) log.php('enable');
        if(typeof $myphp_button != 'undefined')
            _addClass($myphp_button,'active');
        _createCookie('myphp','true');

    };
    function _toggle_myphp() {

        if(_hasClass(this,'active')){
            _disable_myphp();
        }else{
            _enable_myphp();
        }

    };

// toggle menu
    function _mymenu_start(){

        _readCookie('mymenu')=='true' ? _enable_mymenu() : _disable_mymenu();

    };
    function _disable_mymenu() {

        _removeClass($mylog,'mymenu');
        if(typeof $mylog != 'undefined')
            _removeClass($mymenu_button,'active');
        _createCookie('mymenu','false');

    };
    function _enable_mymenu() {

        _addClass($mylog,'mymenu');
        if(typeof $mylog != 'undefined')
            _addClass($mymenu_button,'active');
        _createCookie('mymenu','true');

    };
    function _toggle_mymenu() {

        if(_hasClass($mylog,'mymenu')){
            _disable_mymenu();
        }else{
            _enable_mymenu();
        }

    };

// toggle edit
    function _myedit_start(){

        _readCookie('myedit')=='true' ? _enable_myedit() : _disable_myedit();

    };
    function _disable_myedit() {

        _removeClass($mylog,'myedit');
        if(typeof $mylog != 'undefined'){
            $myconsole.setAttribute('data-stop-propa','false');
            _removeClass($myedit_button,'active');
        }
        _createCookie('myedit','false');

    };
    function _enable_myedit() {

        _addClass($mylog,'myedit');
        if(typeof $mylog != 'undefined'){
            $myconsole.setAttribute('data-stop-propa','true');
            _addClass($myedit_button,'active');
        }
        _createCookie('myedit','true');

    };
    function _toggle_myedit() {

        if(_hasClass($mylog,'myedit')){
            _disable_myedit();
        }else{
            _enable_myedit();
        }

    };

// toggle reverse
    function _myreverse_start(){

        // _readCookie('myreverse')=='true' ? _enable_myreverse() : _disable_myreverse();
        _readCookie('myreverse')=='false' ? _disable_myreverse() : _enable_myreverse();

    };
    function _disable_myreverse() {

        myreverse = 'false';
        if(typeof $mylog != 'undefined')
            _removeClass($myreverse_button,'active');
        _createCookie('myreverse','false');

    };
    function _enable_myreverse() {

        myreverse = 'true';
        if(typeof $mylog != 'undefined')
            _addClass($myreverse_button,'active');
        _createCookie('myreverse','true');

    };
    function _toggle_myreverse() {

        if(_hasClass(this,'active')){
            _disable_myreverse();
        }else{
            _enable_myreverse();
        }

    };

// toggle reset
    function _myreset() {

        $mymajor.innerHTML = '';
        $myminor.innerHTML = '';

    };

// tab
    function _mytab_start(){

        var mytab_cookie = _readCookie('mytab');
        if(mytab_cookie) _select_content(mytab_cookie);

    };

    function _change_tab(event){

        event = event || window.event;
        var $target = event.target || event.srcElement;
        var content_selected = $target.getAttribute('data-content-selected');

        _select_content(content_selected);

    };

    function _select_content(content_id){

        if(!content_id) return;

        var $this_tab = null;
        var $this_content = document.getElementById(content_id);

        var $alltab = document.getElementsByClassName('mytab');
        var $allcontent = document.getElementsByClassName('mycontent');

        for (var i = $alltab.length - 1; i >= 0; i--) {
            _removeClass($alltab[i],'current');
            if($alltab[i].getAttribute('data-content-selected')===content_id) $this_tab = $alltab[i];
        };

        for (var i = $allcontent.length - 1; i >= 0; i--) {
            _removeClass($allcontent[i],'current');
        };

        _addClass($this_tab,'current');
        _addClass($this_content,'current');

        _createCookie('mytab', content_id);

        if(content_id=='mynotes')
            _load_notes();

        if(content_id==='myeventnode'){
            _load_script();
            _add_hover_event();
        }else{
            _remove_hover_event();
        }

    };

// tab event
    function _hover_tab_enter(event){

        event = event || window.event;

        for (var i = 0; i < $mytab.length; i++) {
            _removeClass( $mytab[i], 'hover' );
        };
        
        var target = event.target;
        if( _hasClass(target, 'mytab') )
            _addClass( target, 'hover' );

    };

    function _hover_tab_leave(event){

        event = event || window.event;

        for (var i = 0; i < $mytab.length; i++) {
            _removeClass( $mytab[i], 'hover' );
        };
        
        var target = event.toElement;

        // console.log( _hasClass_parent( target, 'mytab' ) ,'test')

        if( _hasClass_parent( target, 'mytab' ) )
            _addClassToParent( target, 'mytab', 'hover' );

    };

// events
    var script_loaded = [];
    var node_infos = {};
    var $all_node = null;

    function _add_hover_event(){

        var $all_node = document.querySelectorAll('body *');

        for (var i = 0; i < $all_node.length; i++) {

            if( search_parents_id($all_node[i], 'mylog') ) continue; 

            $all_node[i].addEventListener('mouseover', _get_events, false); 

        };

    };

    function _remove_hover_event(){

        var $all_node = document.querySelectorAll('body *');

        for (var i = 0; i < $all_node.length; i++) {

            if( search_parents_id($all_node[i], 'mylog') ) continue; 

            $all_node[i].removeEventListener('mouseover', _get_events, false);

        };
        
    };

    function _get_events(event){

        // log.red( script_loaded )

        if(this != event.target) return;

        var $this = event.target;
        var events = null,
            types = [ 'click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseenter', 'mouseleave', 'mouseup', 'change', 'focus', 'blur', 'scroll', 'select', 'submit', 'keydown', 'keypress', 'keyup', 'load', 'unload' ];

        node_infos = { 'node': this, 'events': [] };

        for (var ii = 0; ii < types.length; ii++) {

            if ( typeof this['on'+types[ii]] == 'function' ) {

                node_infos.events.push( { 'type':types[ii], 'func':this['on'+types[ii]].toString(), file:null, line:null, src:'DOM 0'  } ); 

            }
        };

        if ( typeof jQuery !== 'undefined' ){
            events = $._data(this, 'events');

            for( var k in events){
                var truc = events[k];
                for (var i = 0; i < events[k].length; i++) {
                    var handler = events[k][i]['handler'].toString();
                    if( handler.indexOf('prout') === -1 )
                        node_infos.events.push( { 'type':events[k][i]['origType'], 'func':handler, file:null, line:null, src:'jQuery'  } ); 
                };
            }

        }

        for (var i = 0; i < node_infos.events.length; i++) {

            var func = node_infos.events[i].func.replace(/(.*){/i, '');

            for (var ii = 0; ii < script_loaded.length; ii++) {

                if(script_loaded[ii].script.indexOf(func) !== -1 ){

                    var script = script_loaded[ii].script.split(func);
                    var script = script[0].split("\n");
                    
                    node_infos.events[i].line = script.length;
                    node_infos.events[i].file = script_loaded[ii].name;
                }

            };

        };

        $mynode.innerHTML = htmlConverter(node_infos.node, true);
        $myevents.innerHTML = '';

        for (var i = 0; i < node_infos.events.length; i++) {
            
            $myevents.innerHTML += '<div class="myevent">';
                $myevents.innerHTML += '<div class="mytype">'+node_infos.events[i].type+'</div>';
                $myevents.innerHTML += '<div class="myfile">'+node_infos.events[i].file+':'+node_infos.events[i].line+'</div>';
                $myevents.innerHTML += '<pre class="myfunc">'+node_infos.events[i].func+'</pre>';
            $myevents.innerHTML += '</div>';
        };

    };

    function _load_script(){

        var $script = document.getElementsByTagName('script');
        
        for (var i = $script.length - 1; i >= 0; i--) {

            if( $script[i].src && $script[i].src != '' ){

                var name =  $script[i].src.split('/');
                name = name[name.length-1];

                if( name.indexOf('jquery') === -1 && name.indexOf('mylog') === -1 ){

                    getFile( $script[i].src, name )

                }

            }else{

                script_loaded.push({ 'name':'inline', 'script': $script[i].innerText ? $script[i].innerText : 'error' });

            }

        };

    };

    function getFile(url, name){

        _ajax({
            url: url,
            type: "text",
            success: function (text) {

                script_loaded.push({ 'name':name, 'script': text });

            }
        });

    }

// notes 
    function _load_notes(){

        var $mynotes = document.getElementById('mynotes');

        $mynotes.onchange = function(){
            _save_notes($mynotes.value);
        };

        _ajax({
            url:_mypath+_myurl_action,
            data:{ action:'load_note' },
            success:function(data){

                $mynotes.innerHTML = data;

            }
        });

    };

    function _save_notes(text){

        _ajax({
            url:_mypath+_myurl_action,
            data:{ action:'save_note', note:text },
            success:function(data){
                var $myconslog = document.getElementById('myconslog');
                if(data==1){
                    $myconslog.innerHTML = 'saved';
                    setTimeout(function(){
                        $myconslog.innerHTML = '';
                    },1000);
                }else{
                    log.red(data,'mylog.js: error in _save_notes()');
                    $myconslog.innerHTML = 'error : see console';
                }
            }
        });
        
    };


// utilitaires


// core
    function _generateMarkup() {

        if(_readCookie('myreverse') == 'true') {
            mymajor = mymajor.reverse();
            myminor = myminor.reverse();
        }


        var newNode = document.createElement('DIV');
        newNode.id = _myid;
        newNode.setAttribute('style', 'position:fixed;display:'+_mydisplay+';');
        newNode.innerHTML = 

            '<div class="myback"></div>'+

            '<div id="mynav_list">'+
                /*'<div class="mysubbutton" data-stop-propa="true">'+
                        '<ul>'+
                            '<li>aaa</li>'+
                            '<li>bbbbbb</li>'+
                            '<li>ccccc</li>'+
                        '</ul>'+
                '</div>'+*/

                '<div id="myphp_button" class="mybutton" data-stop-propa="true"></div>'+
                '<div id="myedit_button" class="mybutton" data-stop-propa="true"></div>'+
                '<div id="mymenu_button" class="mybutton" data-stop-propa="true"></div>'+
                '<div id="myreverse_button" class="mybutton" data-stop-propa="true"></div>'+
                '<div id="myreset_button" class="mybutton" data-stop-propa="true"></div>'+

                '<div id="myclose_button" class="myclose" data-stop-propa="true"></div>'+
            '</div>'+

            '<div id="mytab_list">'+
                '<div class="mytab current" data-content-selected="myconsole">console</div>'+
                '<div class="mytab" data-content-selected="myeventnode">events</div>'+
                '<div class="mytab" data-content-selected="mynotes">notes</div>'+
                '<div class="mytab" data-content-selected="myfile">'+
                    'file'+
                    /*'<div class="mysubmenu">'+
                       '<div class="sprite submenu"></div>'+
                        '<ul>'+
                            '<li>aaa</li>'+
                            '<li>bbbbbb</li>'+
                            '<li>ccccc</li>'+
                        '</ul>'+
                    '</div>'+*/
                '</div>'+
                // '<div class="mytab" data-content-selected="myhelp">help</div>'+
            '</div>'+

            '<div id="mycontent_list">'+
                '<div id="myconsole" class="mycontent current">'+
                    '<div id="mymajor" class="highlight_html">'+mymajor.join('')+'</div>'+
                    '<div id="myminor" class="highlight_html">'+myminor.join('')+'</div>'+
                '</div>'+
                '<div id="myeventnode" class="mycontent">'+

                    '<div id="mynodes">'+
                        '<div id="mynode" class="highlight_html"></div>'+
                        '<div id="myevents">'+
                            /*'<div class="myfile">test.js:16</div>'+
                            '<div class="mytype">mousedown</div>'+
                            '<div class="myfunc">function(){...}</div>'+*/
                        '</div>'+
                    '</div>'+

                '</div>'+
                '<textarea id="mynotes" class="mycontent" data-stop-propa="true" ></textarea>'+

                // '<div id="myhelp" class="mycontent">'+
                // '<div id="myfile" class="mycontent"></div>'+

            '</div>'+
            '<div id="myfooter"><div id="myconslog"></div><div class="myversion">v.'+_myversion+'</div></div>'+

            '<div class="rsz rsz_t"></div>'+
            '<div class="rsz rsz_r"></div>'+
            '<div class="rsz rsz_b"></div>'+
            '<div class="rsz rsz_l"></div>'+
            // '<div class="rsz rsz_tr"></div>'+
            '<div class="rsz rsz_rb"></div>'+
            '<div class="rsz rsz_bl"></div>'+
            // '<div class="rsz rsz_lt"></div>'+
            '';
            
        return newNode;
 
    };

    function _addEvent( obj, type, fn ) {
        var obj = ( obj.constructor === String ) ? document.getElementById( obj ) : obj;
        if ( obj.attachEvent ) {
            obj[ 'e' + type + fn ] = fn;
            obj[ type + fn ] = function(){ obj[ 'e' + type + fn ]( window.event ) };
            obj.attachEvent( 'on' + type, obj[ type + fn ] );
        } else obj.addEventListener( type, fn, false );
    };

// init
    function _init(){

        var body = document.body;
        $mylog = body.appendChild( _generateMarkup() );

        var n=document.createElement('link');
        n.setAttribute('rel','stylesheet');
        n.setAttribute('href', _mypath + _myurl_css);
        document.body.appendChild(n);

        // document.write('<link rel="stylesheet" href="'+_mypath+_myurl_css+'" />');

        $myconsole = document.getElementById('myconsole');
        $mymajor = document.getElementById('mymajor');
        $myminor = document.getElementById('myminor');
        $mynode = document.getElementById('mynode');
        $myevents = document.getElementById('myevents');
        $mytab = document.getElementsByClassName('mytab');

        $myphp_button = document.getElementById('myphp_button');
        $mymenu_button = document.getElementById('mymenu_button');
        $myedit_button = document.getElementById('myedit_button');
        $mytab_list = document.getElementById('mytab_list');
        $myreverse_button = document.getElementById('myreverse_button');
        $myreset_button = document.getElementById('myreset_button');

        _draggable( _mystart );
        _display_start();
        _mylogphp_start();
        _mymenu_start();
        _myedit_start();
        _mytab_start();
        _myreverse_start();

        for (var i = 0; i < $mytab.length; i++) {

            if($mytab[i].addEventListener){
                $mytab[i].addEventListener("mouseenter", _hover_tab_enter);
                $mytab[i].addEventListener("mouseleave", _hover_tab_leave);
            }else{
                $mytab[i].attachEvent("onmouseenter", _hover_tab_enter);
                $mytab[i].attachEvent("onmouseleave", _hover_tab_leave);
            }

            // $mytab[i].addEventListener('mouseenter', _hover_tab_enter);
            // $mytab[i].addEventListener('mouseleave', _hover_tab_leave);
        };
        document.onclick = _toggle_display;
        $mytab_list.onmouseup = _change_tab;
        $myphp_button.onmouseup = _toggle_myphp;
        $mymenu_button.onmouseup = _toggle_mymenu;
        $myedit_button.onmouseup = _toggle_myedit;
        $myreverse_button.onmouseup = _toggle_myreverse;
        $myreset_button.onmouseup = _myreset;

    };
 
    if(document.body) _init();
    else _addEvent( window, 'load', _init );

})();






