/*!
 * myconsole v6.0.0-beta
 * http://mathieu-bruno.com
 * Copyright 2014, Mathieu BRUNO
 */


/****

idee : afficher la ligne du log.green('okok') du le fichier js

todo :
    - css resize
    - php
    
****/

(function() {

    var _myversion = '6.0.0-beta';
    var _myname = 'log';
    // var _mypath = 'http://matdev.fr/myconsole/myconsole/';
    var _mypath = 'http://localhost:8888/myconsole/';
    var _myurl_css   = 'data/mylog.css';
    // var _myurl_action = 'data/action.php';

    var _mycookies_days = 30;

    var start_panel = {
        t : 10,
        l : 410,
        w : 250,
        h : 150
    }

    window[ _myname ] = {

        loop: function( obj, name, color ) {
            if (typeof color == 'undefined') color='loop';
            if( name=='red' || name=='orange' || name=='yellow' || name=='green' || name=='blue' || name=='violet' ){
                color = name;
                name = 'none';
            };
            _mypanel.element(obj, name, color, 'major');
        },

        info: function( obj, name, color ) {
            if( name=='red' || name=='orange' || name=='yellow' || name=='green' || name=='blue' || name=='violet' ){
                color = name;
                name = 'none';
            };
            _mypanel.element(obj, name, color, 'minor');
        },

        red: function( obj, name ) {
            _mypanel.element( obj, name, 'red', 'minor' );
        },

        orange: function( obj, name ) {
            _mypanel.element( obj, name, 'orange', 'minor' );
        },

        yellow: function( obj, name ) {
            _mypanel.element( obj, name, 'yellow', 'minor' );
        },

        green: function( obj, name ) {
            _mypanel.element( obj, name, 'green', 'minor' );
        },

        Green: function( obj, name ) {
            _mypanel.element( obj, name, 'green', 'minor' );
        },
 
        blue: function( obj, name ) {
            _mypanel.element( obj, name, 'blue', 'minor' );
        },

        violet: function( obj, name ) {
            _mypanel.element( obj, name, 'violet', 'minor' );
        },

        white: function( obj, name ) {
            _mypanel.element( obj, name, 'white', 'minor' );
        },
 
        grey: function( obj, name ) {
            _mypanel.element( obj, name, 'grey', 'minor' );
        },

        black: function( obj, name ) {
            _mypanel.element( obj, name, 'black', 'minor' );
        },



        time: function( name, color ) {
            if (typeof color == 'undefined') color='loop';
            if (typeof name == 'undefined') name='time';
            _mypanel.time( name, color ); 

        },
 
        size: function( color ) {
            if (typeof color == 'undefined') color='loop';
            _mypanel.size( color );
        },

        key: function( color ) {
            if (typeof color == 'undefined') color='loop';
            _mypanel.key( color );
        },

        button: function( name, callback ) {

            if (typeof name == 'undefined') test='button';
            if (typeof callback == 'undefined') test='button';
            else test = name;

            _mypanel.button( 'loop', test, function(i){
                if(callback) callback(i);
                else if(name) name(i);
            });
        },

        range: function( name, data, callback ) {

            min = data.min ? 0 : 0;
            max = data.max ? data.max : 10;
            step = data.step ? data.step : 1;

            _mypanel.range( name, 'loop', min, max, step, function(i){
                if(callback) callback(i);
            });
        }

    };

    _mypanel = {

        _display : 'none',
        _reverse : true,
        _moveOrSelect : 'move',
        _max_arbo : 5,

        $mypanel : null,
        $myconsole : null,
        $mymajor : null,
        $myminor : null,
        $myreverse_button : null,
        $mymoveorselect_button : null,
        $mytab : null,
        _mymajor : [],
        _myminor : [],
        _refMajor : [],
        _i_major : {},
        _i_minor : 0,
        _i_arbo : 0,
        _newtime : false,
        _time1 : null,
        _time2 : null,


        init : function(){
            
            var self = this;

            var n = document.createElement('link');
            n.setAttribute('rel', 'stylesheet');
            n.setAttribute('href', _mypath + _myurl_css);
            document.body.appendChild(n);

            self.display('cookie');
            self.reverse('cookie');
            self.moveOrSelect('cookie');

            self.$mypanel = document.body.appendChild( self.generatePanel() );
            self.$myconsole = document.getElementById('myconsole');
            self.$mymajor = document.getElementById('mymajor');
            self.$myminor = document.getElementById('myminor');
            self.$myreverse_button = document.getElementById('myreverse_button');
            self.$mymoveorselect_button = document.getElementById('myedit_button');

            // var $myphp_button = document.getElementById('myphp_button');
            // var $mymenu_button = document.getElementById('mymenu_button');
            var $myedit_button = document.getElementById('myedit_button');
            var $myreverse_button = document.getElementById('myreverse_button');
            var $myreset_button = document.getElementById('myreset_button');

            self.dragNsize.init(self.$mypanel);

            self.$mytab = document.getElementsByClassName('mytab');
            for (var i = 0; i < self.$mytab.length; i++) {

                if(self.$mytab[i].addEventListener){
                    self.$mytab[i].addEventListener("mouseenter", self.hover_tab_enter);
                    self.$mytab[i].addEventListener("mouseleave", self.hover_tab_leave);
                }else{
                    self.$mytab[i].attachEvent("onmouseenter", self.hover_tab_enter);
                    self.$mytab[i].attachEvent("onmouseleave", self.hover_tab_leave);
                }

            };

            // $myphp_button.onmouseup = _toggle_myphp;
            // $mymenu_button.onmouseup = _toggle_mymenu;
            $myedit_button.onmouseup = function(){ _mypanel.moveOrSelect('toggle') };
            $myreverse_button.onmouseup = function(){ _mypanel.reverse('toggle') };
            $myreset_button.onmouseup = function(){ _mypanel.clear() };
            document.onclick = function(event){ 
                event = event || window.event;
                if ( event.altKey )
                    _mypanel.display('toggle');
            
            };

        },

        time : function ( name, color ){

            var self = this;

            if (!Date.now) {
                Date.now = function() {
                    return new Date().valueOf();
                }
            };

            if (!self._newtime) {

                self._time1 = Date.now();
                self._newtime=true;

            } else {

                self._time2 = Date.now();

                self._generate_line( '<span class="mywhite">'+((self._time2-self._time1)/1000)+'</span>', name, color, 'major');

                self._newtime=false;

            };

        },

        size : function(color){

            var self = this;

            function resize(){

                var sizeWindow={
                    x : window.innerWidth,
                    y : window.innerHeight
                };

                self._generate_line( '<span class="mywhite">w: '+sizeWindow.x+'px | h: '+sizeWindow.y+'px</span>', 'size', color, 'major');

            }

            resize();

            window.onresize = function(event) {

                resize();

            }
        },

        key : function(color){

            var self = this;

            self._generate_line( '<span class="mywhite">press key</span>', 'key', color, 'major' );

            document.onkeydown = function(event){

                event = event || window.event; // Compatibilité IE

                var CharCodeW = event.which;
                var CharCodeK = event.keyCode; //verif
                var letter = String.fromCharCode(CharCodeW);

                self._generate_line( '<span class="mywhite">letter: '+letter+' | CharCode: '+CharCodeW+' - '+CharCodeK+'</span>', 'key', color, 'major' );

            }

        },

        button : function(color, name, callback){

            var self = this;
            var id = Math.round(Math.random()*100000);

            self._generate_line( '<button id="mybutton'+name+'" class="stop-move" data-click="0">action</button>', name, color, 'major' );

            function mybutton(event){
                event = event || window.event; // Compatibilité IE
                var $target = event.target || event.srcElement;
                if( $target.getAttribute('id')=='mybutton'+name && callback ){
                    var i = parseInt( $target.getAttribute('data-click') ) + 1;
                    $target.setAttribute('data-click', i);
                    callback(i);
                }

            }

            if(document.documentElement.addEventListener)
                document.documentElement.addEventListener("mouseup", mybutton);
            else
                document.documentElement.attachEvent("onmouseup", mybutton);
            
        },

        range : function( name, color, min, max, step, callback){

            var self = this;

            self._generate_line( '<input type="range" id="myrange-'+name+'" class="stop-move" min="'+min+'" max="'+max+'" step="'+step+'" value="0" /><span id="myrangeval-'+name+'" class="mywhite"></span>', name, color, 'major' );

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
                document.documentElement.addEventListener("input", myrange2);
            }else{
                document.documentElement.attachEvent("onchange", myrange1);
                document.documentElement.attachEvent("oninput", myrange2);
            }

        },

        element : function( object, name, color, value ){

            var self = this;

            if (typeof name == 'undefined') name='none';
            if (typeof color == 'undefined') color='none';

            self._i_arbo = 0;
            var markup = self._generate_markup(object);
            if(name=='none') name = markup['type'];
            self._generate_line( markup['html'], name, color, value );

        },

        _generate_markup : function(object,count){

            var self = this;

    // undefined
            if( typeof object == 'undefined' ) {

                // if(_debug_mylog) console.log('undefined');
                return { html:'<span class="mygrey">undefined</span>', type:'var' };
                
    // null
            }else if( object == null ) {

                // if(_debug_mylog) console.log('null');
                return { html:'<span class="mygrey">NULL</span>', type:'var' };

    // string
            }else if ( typeof object == 'string' ) {
                
                // if(_debug_mylog) console.log('string');
                return { html:'<span class="mystring">&quot;'+self.tools.escapeHtml(object)+'&quot;</span>', type:'string' };

    // boolean
            }else if (typeof object == 'boolean') {

                // if(_debug_mylog) console.log('boolean');
                var tf = object ? 'mytrue' : 'myfalse';
                return { html:'<span class="'+tf+'">'+object+'</span>', type:'boolean' };

    // number
            }else if (typeof object == 'number') {
                
                // if(_debug_mylog) console.log('number');
                return { html:'<span class="mynumber">'+object+'</span>', type:'number' };

    // array
            }else if( object instanceof Array ) {

                // if(_debug_mylog) console.log('array');
                var html='';
                if( ++self._i_arbo>self._max_arbo && count ) return { html:'<span class="mygrey">[array]</span>', type:'' };

                for (var i=0, a=object.length; i<a; i++) {

                    html += '<div class="mytab">';
                    html += '<span class="myblack">'+i+' : </span>';
                    html += self._generate_markup( object[i], true )['html'];
                    html += '</div>';
                     
                };

                self._i_arbo=0;

                return { html:'<span class="myblack">[</span>'+html+'<div class="myblack">]</div>', type:'array' };

    // object literal
            }else if( object.constructor == Object ){

                // if(_debug_mylog) console.log('object literal');
                var html='';
                if( ++self._i_arbo>self._max_arbo && count ) return { html:'<span class="mygrey">{object}</span>', type:'' };

                for (var i in object) {

                    html += '<div class="mytab">';
                    html += '<span class="myblack">'+i+' : </span>';
                    html += self._generate_markup( object[i], true )['html'];
                    html += '</div>';

                };

                self._i_arbo=0;

                return { html:'<span class="myblack">{</span>'+html+'<div class="myblack">}</div>', type:'object literal' };

    // object object
            }else if( typeof object == 'object'){

                var html='';

                
                if( object.length ){ // jquery

                    for (var i = 0; i < object.length; i++) {

                        html += '<div class="mytab">';
                        html += '<span class="myblack">'+i+' : </span>';

                        var id = Math.round(Math.random()*100000000);
                        html += '<div id="min_'+id+'" onclick="javascript:this.style.display=\'none\';document.getElementById(\'dev_'+id+'\').style.display=\'block\';">' + self.tools.htmlConverter(object[i], true) + '</div>';
                        html += '<div id="dev_'+id+'" onclick="javascript:this.style.display=\'none\';document.getElementById(\'min_'+id+'\').style.display=\'block\';" style="display:none;">' + self.tools.htmlConverter(object[i]) + '</div>';
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

                        if( ++self._i_arbo>self._max_arbo && count ) return { html:'<span class="mygrey">{Object}</span>', type:'' };

                        var __i=0;
                        for (var i in object) {

                            html += '<div class="mytab">';
                            html += '<span class="myblack">'+i+' : </span>';
                            // if(++__i==38){
                                html += self._generate_markup( object[i], true )['html'];
                            // }else{
                                // html += "_generate_markup()";
                            // }
                            html += '</div>';

                        };

                        self._i_arbo=0;

                        return { html:'<span class="myblack">{</span>'+html+'<div class="myblack">}</div>', type:'object' };

                    }else{

                        var id = Math.round(Math.random()*100000000);
                        html += '<div id="min_'+id+'" onclick="javascript:this.style.display=\'none\';document.getElementById(\'dev_'+id+'\').style.display=\'block\';">' + self.tools.htmlConverter(object, true) + '</div>';
                        html += '<div id="dev_'+id+'" onclick="javascript:this.style.display=\'none\';document.getElementById(\'min_'+id+'\').style.display=\'block\';" style="display:none;">' + self.tools.htmlConverter(object) + '</div>';


                    }

                    
                }else{

                    html = '<span class="mygrey">undefined</span>';

                }
               
                return { html:html, type:'object object' };

    // unknow
            }else{

                // if(_debug_mylog) console.log('unknow');
                return { html:'<span class="mygrey">'+self.tools.escapeHtml(object)+'</span>', type:'unknow' };

            };
        },

        _generate_line : function(markup, name, color, value){

            var self = this;

            if(value=='major'){

                if( self.tools.indexof( self._refMajor, name ) == -1 ) {

                    self._refMajor.push(name);
                    var i_array = self.tools.indexof( self._refMajor, name );
                    self._i_major[name] = 1;

                    var html =  '<div class="myback_color"></div>'+
                                '<div class="myline"><span class="mynumberline">'+(i_array+1)+'</span><span class="myname">'+name+' : </span>'+markup+'</div>';

                    if(self.$mypanel){

                        var insert = document.createElement('div');
                        insert.setAttribute('id','mymajor_'+i_array);
                        insert.setAttribute('class','mysection '+color);

                        insert.innerHTML = html;

                        if(self._reverse) {
                            var last = document.getElementById('mymajor_'+(i_array-1));
                            self.$mymajor.insertBefore(insert,last);
                        }else
                            self.$mymajor.appendChild(insert);

                    }else
                        self._mymajor.push('<div id="mymajor_'+i_array+'" class="mysection '+color+'">'+html+'</div>');

                }else{

                    var i_array = self.tools.indexof( self._refMajor, name );
                    self._i_major[name]++;

                    var html =  '<div class="myback_color"></div>'+
                                '<div class="myline"><span class="mynumberline">'+(i_array+1)+'</span><span class="myname">'+name+' : </span>'+markup+'<span class="mycount">'+self._i_major[name]+'</span></div>';
                                
                    if(self.$mypanel){

                        var $el = document.getElementById('mymajor_'+i_array);
                        $el.className = 'mysection '+color;
                        $el.innerHTML = html;

                    }else
                        self._mymajor[i_array] = '<div id="mymajor_'+i_array+'" class="mysection '+color+'">'+html+'</div>';

                }

            }else if(value=='minor'){

                self._i_minor++;

                var html =  '<div class="myback_color"></div>'+
                            '<div class="myline"><span class="mynumberline">'+self._i_minor+'</span><span class="myname">'+name+' : </span>'+markup+'</div>';

                if(self.$mypanel){

                    var insert = document.createElement('div');
                    insert.setAttribute('id','myminor_'+self._i_minor);
                    insert.setAttribute('class','mysection '+color);

                    insert.innerHTML = html;

                    if(self._reverse) {
                        var last = document.getElementById('myminor_'+(self._i_minor-1));
                        self.$myminor.insertBefore(insert,last);
                    }else
                        self.$myminor.appendChild(insert);

                }else
                    self._myminor.push('<div id="myminor_'+self._i_minor+'" class="mysection '+color+'">'+html+'</div>');

            }

        },

        //  tab event
        hover_tab_enter : function(event){

            event = event || window.event;

            for (var i = 0; i < _mypanel.$mytab.length; i++) {
                _mypanel.tools.removeClass( _mypanel.$mytab[i], 'hover' );
            };
            
            var target = event.target;
            if( _mypanel.tools.hasClass(target, 'mytab') )
                _mypanel.tools.addClass(target, 'hover');

        },

        hover_tab_leave : function(event){

            event = event || window.event;

            for (var i = 0; i < _mypanel.$mytab.length; i++) {
                _mypanel.tools.removeClass( _mypanel.$mytab[i], 'hover' );
            };
            
            var target = event.toElement;
            if( _mypanel.tools.parent_hasClass( target, 'mytab' ) )
                _mypanel.tools.addClassToParent( target, 'mytab', 'hover' );

        },

        /**
         * move or select panel
         * @param : status -> 'move', 'select', 'toggle', 'cookie'
         */
        moveOrSelect : function(status){

            var self = this;

            if(status==='move'){

                if(self.$mypanel){
                    self.tools.removeClass( self.$myconsole, 'stop-move' );
                    self.tools.removeClass( self.$mymoveorselect_button, 'active' );
                }else
                    self._moveOrSelect = 'move';
                self.tools.add_cookie('moveOrSelect', 'move');

            }else if(status==='select'){
                
                if(self.$mypanel){
                    self.tools.addClass( self.$myconsole, 'stop-move' );
                    self.tools.addClass( self.$mymoveorselect_button, 'active' );
                }else
                    self._moveOrSelect = 'select';
                self.tools.add_cookie('moveOrSelect', 'select');

            }else if(status==='toggle'){
                
                if(self.$mypanel){
                    self.tools.toggleClass( self.$myconsole, 'stop-move' );
                    self.tools.toggleClass( self.$mymoveorselect_button, 'active' );
                    if( self.tools.hasClass(self.$myconsole, 'stop-move') ){
                        self.tools.add_cookie('moveOrSelect', 'select');
                    }else{
                        self.tools.add_cookie('moveOrSelect', 'move');
                    }
                }

            }else if(status==='cookie'){

                if(self.tools.get_cookie('moveOrSelect')=='move')
                    self._moveOrSelect = 'move'
                else if(self.tools.get_cookie('moveOrSelect')=='select')
                    self._moveOrSelect = 'select'

            }

        },

        /**
         * clear lines
         */
        clear : function(){

            var self = this;
            
            self.$myminor.innerHTML = '';
            self.$mymajor.innerHTML = '';
            self._refMajor = [];
            self._i_major = {};
            self._i_minor = 0;

        },

        /**
         * show / hide panel 
         * @param : status -> 'block', 'none', 'toggle', 'cookie'
         */
        display : function(status){

            var self = this;
            
            if(status=='block'){
                if(self.$mypanel) self.$mypanel.style.display = 'block';
                self._display = 'block';
                self.tools.add_cookie('display', 'block');
            }else if(status=='toggle'){
                if(!self.$mypanel) return;
                if(self.$mypanel.style.display=='none'){
                    self.$mypanel.style.display = 'block';
                    self.tools.add_cookie('display', 'block');
                }else{
                    self.$mypanel.style.display = 'none';
                    self.tools.add_cookie('display', 'none');
                }
            }else if(status=='cookie'){
                self._display = self.tools.get_cookie('display')=='block' ? 'block' : 'none';
            }else{
                if(self.$mypanel) self.$mypanel.style.display = 'none';
                self._display = 'none';
                self.tools.add_cookie('display', 'none');
            }

        },

        /**
         * reading direction
         * @param : status -> true, false, 'toggle', 'cookie'
         */
        reverse : function(status){

            var self = this;
            var array_minor = [];
            var array_major = [];

            if((status===true||status==='true')&&self._reverse===false){
                self._reverse = true;
                self.tools.add_cookie('reverse', 'true');
                if(self.$mypanel){
                    self.tools.removeClass(self.$myreverse_button, 'active');
                    var $myminorsection = self.$myminor.getElementsByClassName('mysection');
                    for (var i = $myminorsection.length - 1; i >= 0; i--) array_minor.push($myminorsection[i]);
                    self.$myminor.innerHTML = '';
                    for (var i = 0; i < array_minor.length; i++) self.$myminor.innerHTML += array_minor[i].outerHTML;

                    var $mymajorsection = self.$mymajor.getElementsByClassName('mysection');
                    for (var i = $mymajorsection.length - 1; i >= 0; i--) array_major.push($mymajorsection[i]);
                    self.$mymajor.innerHTML = '';
                    for (var i = 0; i < array_major.length; i++) self.$mymajor.innerHTML += array_major[i].outerHTML;
                }
            }else if((status===false||status==='false')&&self._reverse===true){
                self._reverse = false;
                self.tools.add_cookie('reverse', 'false');
                if(self.$mypanel){
                    self.tools.addClass(self.$myreverse_button, 'active');
                    var $myminorsection = self.$myminor.getElementsByClassName('mysection');
                    for (var i = $myminorsection.length - 1; i >= 0; i--) array_minor.push($myminorsection[i]);
                    self.$myminor.innerHTML = '';
                    for (var i = 0; i < array_minor.length; i++) self.$myminor.innerHTML += array_minor[i].outerHTML;

                    var $mymajorsection = self.$mymajor.getElementsByClassName('mysection');
                    for (var i = $mymajorsection.length - 1; i >= 0; i--) array_major.push($mymajorsection[i]);
                    self.$mymajor.innerHTML = '';
                    for (var i = 0; i < array_major.length; i++) self.$mymajor.innerHTML += array_major[i].outerHTML;
                }
            }else if(status==='toggle'){
                if(!self.$mypanel) return;
                if(self._reverse){
                    self.reverse(false);
                }else{
                    self.reverse(true);
                }
            }else if(status=='cookie'){
                if(self.tools.get_cookie('reverse')==='true')
                    self._reverse = true;
                else if(self.tools.get_cookie('reverse')==='false')
                    self._reverse = false;
            }

        },

        generatePanel : function() {
            
            var self = this;
            var reverse = '';
            var moveOrSelect = '';

            if( self._reverse ) {
                self._mymajor = self._mymajor.reverse();
                self._myminor = self._myminor.reverse();
            }else{
                reverse = ' active';
            }

            if( self._moveOrSelect=='select' )
                moveOrSelect = ' active';

            var newNode = document.createElement('DIV');
            newNode.id = 'mylog';
            newNode.setAttribute('style', 'display:'+self._display+';');

            newNode.innerHTML = 
                '<div class="myback"></div>'+
                '<div id="mynav_list">'+
                    '<div id="myphp_button" class="mybutton"></div>'+
                    '<div id="myedit_button" class="mybutton'+moveOrSelect+'"></div>'+
                    '<div id="mymenu_button" class="mybutton"></div>'+
                    '<div id="myreverse_button" class="mybutton'+reverse+'"></div>'+
                    '<div id="myreset_button" class="mybutton"></div>'+
                    '<div id="myclose_button" class="myclose"></div>'+
                '</div>'+

                '<div id="mytab_list">'+
                    '<div class="mytab current" data-content-selected="myconsole">console</div>'+
                '</div>'+

                '<div id="mycontent_list">'+
                    '<div id="myconsole" class="mycontent current'+(self._moveOrSelect=='select' ? ' stop-move' : '')+'">'+
                        '<div id="mymajor" class="highlight_html">'+self._mymajor.join('')+'</div>'+
                        '<div id="myminor" class="highlight_html">'+self._myminor.join('')+'</div>'+
                    '</div>'+
                '</div>'+

                '<div id="myfooter"><div id="myconslog"></div><div class="myversion">v.'+_myversion+'</div></div>'+

                '<div class="rsz rsz_t"></div>'+
                '<div class="rsz rsz_r"></div>'+
                '<div class="rsz rsz_b"></div>'+
                '<div class="rsz rsz_l"></div>'+
                '<div class="rsz rsz_tr"></div>'+
                '<div class="rsz rsz_rb"></div>'+
                '<div class="rsz rsz_bl"></div>'+
                '<div class="rsz rsz_lt"></div>'+
                '';

            return newNode;

        },

// drag and resize
        dragNsize : {

            $node : null,
            scrollStart : 0,
            drag : null,
            drag_end : null,
            start : {
                t : null,
                l : null,
                w : null,
                h : null
            },
            opt : {
                minSize : { 
                    width : 100, 
                    height : 100 
                },
                limit : 10
            },

            init : function(node){

                var self = this;

                self.$node = node;

                self.start.t = _mypanel.tools.get_cookie('top') ? parseInt(_mypanel.tools.get_cookie('top')) : start_panel.t;
                self.start.l = _mypanel.tools.get_cookie('left') ? parseInt(_mypanel.tools.get_cookie('left')) : start_panel.l;
                self.start.w = _mypanel.tools.get_cookie('width') ? parseInt(_mypanel.tools.get_cookie('width')) : start_panel.w;
                self.start.h = _mypanel.tools.get_cookie('height') ? parseInt(_mypanel.tools.get_cookie('height')) : start_panel.h;

                var parentW = window.innerWidth,
                    parentH = window.innerHeight;

                if(self.start.w > parentW - self.opt.limit * 2)
                    self.start.w = parentW - self.opt.limit * 2;

                if(self.start.h > parentH - self.opt.limit * 2)
                    self.start.h = parentH - self.opt.limit * 2;

                if(self.start.w < self.opt.minSize.width)
                    self.start.w = self.opt.minSize.width;

                if(self.start.h < self.opt.minSize.height)
                    self.start.h = self.opt.minSize.height;

                if(self.start.t < self.opt.limit)
                    self.start.t = self.opt.limit;

                if(self.start.l < self.opt.limit)
                    self.start.l = self.opt.limit;

                if(self.start.l + self.start.w - self.opt.limit > parentW - self.opt.limit * 2 )
                    self.start.l = parentW - self.opt.limit - self.start.w;

                if(self.start.t + self.start.h - self.opt.limit > parentH - self.opt.limit * 2 )
                    self.start.t = parentH - self.opt.limit - self.start.h;

                self.$node.style.width = self.start.w + 'px';
                self.$node.style.height = self.start.h + 'px';
                self.$node.style.top = self.start.t + 'px';
                self.$node.style.left = self.start.l + 'px';

                self.$node.onmousedown  = function(){ self._start(); };
                self.$node.ontouchstart = function(){ self._start(); };

                document.onmousemove = function(){ self._drag(); };
                document.ontouchmove = function(){ self._drag(); };

                document.onmouseup  = function(){ self._end(); };
                document.ontouchend = function(){ self._end(); };

            },

            _start : function(event) {

                var self = this;

                event = event || window.event;
                if(event.type == 'touchstart') event = event.touches[0];
                if(event.button==2) {
                    self._end();
                    return;
                }

                var $target = event.target || event.srcElement;
                if( _mypanel.tools.parent_hasClass($target, 'stop-move') ) return;

                _mypanel.tools.addClass(self.$node, 'moving');

                event.preventDefault ? event.preventDefault() : event.returnValue = false;

                var target_class = $target.getAttribute('class');
                target_class = target_class ? target_class.split(' ') : [];

                self.drag = {
                    target : target_class[0]=='rsz' ? target_class[1] : 'move',
                    clientX : event.clientX,
                    clientY : event.clientY,
                    objX : self.$node.offsetLeft,
                    objY : self.$node.offsetTop,
                    objW : self.$node.offsetWidth,
                    objH : self.$node.offsetHeight,
                    parentW : window.innerWidth,
                    parentH : window.innerHeight
                };

                self.drag_end = {};

                // scrollStart = $target.scrollTop;

            },

            _drag : function(event) {

                var self = this;

                if (!self.drag) return;
                event = event || window.event;
                if(event.type == 'touchmove') event = event.touches[0];

                var $target = event.target || event.srcElement;

                /*if($target.scrollTop!=scrollStart) {
                    _end();
                    return false;
                }*/

                event.preventDefault ? event.preventDefault() : event.returnValue = false;

                var newPosition={
                        x : self.drag.objX + (event.clientX - self.drag.clientX),
                        y : self.drag.objY + (event.clientY - self.drag.clientY)
                    };

                if(self.drag.target=='move') self._move(newPosition.x, newPosition.y);
                else self._resize(newPosition.x, newPosition.y);

            },

            _move : function(x, y) {

                var self = this;

                if( x < self.opt.limit - self.drag.objW + 1 ) 
                    x = self.opt.limit - self.drag.objW + 1;

                if( y < self.opt.limit - self.drag.objH + 1 ) 
                    y = self.opt.limit - self.drag.objH + 1;

                if( x > self.drag.parentW - self.opt.limit - 1 ) 
                    x = self.drag.parentW - self.opt.limit - 1;

                if( y > self.drag.parentH - self.opt.limit - 1 ) 
                    y = self.drag.parentH - self.opt.limit - 1;

                self.$node.style.left = x + 'px';
                self.$node.style.top = y + 'px';

                self.drag_end = {
                    left    : x,
                    top     : y
                }

            },

            _resize : function(x, y){

                var self = this;

                if( self.drag.target=='rsz_r' || self.drag.target=='rsz_tr' || self.drag.target=='rsz_rb' ){

                    var width = self.drag.objW + x - self.drag.objX;

                    if(self.drag.objX + width < self.opt.limit + 1 ) 
                        width = self.opt.limit - self.drag.objX + 1;

                    if( width < self.opt.minSize.width ) width = self.opt.minSize.width;

                    self.$node.style.width = width + 'px';

                    self.drag_end.width = width;

                };

                if( self.drag.target=='rsz_b' || self.drag.target=='rsz_rb' || self.drag.target=='rsz_bl' ){

                    var height = self.drag.objH + y - self.drag.objY;

                    if(self.drag.objY + height < self.opt.limit + 1 ) 
                        height = self.opt.limit - self.drag.objY + 1;
                    
                    if( height < self.opt.minSize.height ) height = self.opt.minSize.height;

                    self.$node.style.height = height + 'px';

                    self.drag_end.height = height;

                };

                if( self.drag.target=='rsz_l' || self.drag.target=='rsz_bl' || self.drag.target=='rsz_lt' ){

                    var left = x;
                    var width = self.drag.objW - x + self.drag.objX;

                    if(left > self.drag.parentW - self.opt.limit - 1 ){
                        left = self.drag.parentW - self.opt.limit - 1;
                        width = self.drag.objX + self.drag.objW - self.drag.parentW + self.opt.limit;
                    }

                    if( width < self.opt.minSize.width ){
                        width = self.opt.minSize.width;
                        left = self.drag.objX + self.drag.objW - self.opt.minSize.width;
                    }

                    self.$node.style.left = left + 'px';
                    self.$node.style.width = width + 'px';

                    
                    self.drag_end.left = left;
                    self.drag_end.width = width;

                };

                if( self.drag.target=='rsz_t' || self.drag.target=='rsz_tr' || self.drag.target=='rsz_lt' ){

                    var top = y ;
                    var height = self.drag.objH - y + self.drag.objY;

                    if(top > self.drag.parentH - self.opt.limit - 1 ){
                        top = self.drag.parentH - self.opt.limit -1;
                        height = self.drag.objY + self.drag.objH - self.drag.parentH + self.opt.limit;
                    }

                    if( height < self.opt.minSize.height ){
                        height = self.opt.minSize.height;
                        top = self.drag.objY + self.drag.objH - self.opt.minSize.height;
                    }

                    self.$node.style.top = top + 'px';
                    self.$node.style.height = height + 'px';

                    self.drag_end.top = top;
                    self.drag_end.height = height;

                };

            },

            _end : function(){

                var self = this;

                for(v in self.drag_end)
                    _mypanel.tools.add_cookie(v, self.drag_end[v]);

                _mypanel.tools.removeClass(self.$node, 'moving');

                self.drag = null;

            }

        },

// TOOLS
        tools : {

            hasClass : function ( node, className ){
                var attr = node.className.split(' ');
                for (var i = attr.length - 1; i >= 0; i--)
                    if(attr[i]===className) return true;
                return false;
            },

            addClass : function ( node, className ){
                var self = this;
                var attr = node.className;
                if(!attr){
                    node.className = className;
                }else{
                    var attr = node.className.split(' ');
                    if(self.indexof(attr, className)>0) return;
                    if(!attr) attr[className]
                    else attr.push(className);
                    node.className = attr.join(' ');
                }
            },

            removeClass : function ( node, className ){
                var self = this;
                var attr = node.className.split(' ');
                if(self.indexof(attr, className)<0) return;
                var newClassName = [];
                for (var i = 0; i < attr.length; i++)
                    if(attr[i]!==className) newClassName.push(attr[i]);
                node.className = newClassName.join(' ');
            },

            toggleClass : function ( node, className ){
                var self = this;
                var attr = node.className.split(' ');
                if(self.indexof(attr, className)>0)
                    self.removeClass( node, className );
                else
                    self.addClass( node, className );
            },

            parent_hasClass : function (node, className, max){

                var self = this;

                if(!max) max = 50;

                if( self.hasClass(node, className) ) return true;

                var $new_node_parent = node;
                for (var i = max; i >= 0; i--) {
                    var $this = $new_node_parent.parentElement;
                    if( !$this ) return false;
                    if( self.hasClass($this, className) ) return true;
                    else $new_node_parent = $this;
                };
                return false;

            },

            addClassToParent : function (node, classNameToSearch, classNametoAdd){

                var self = this;

                var max = 50;

                if( self.hasClass(node, classNameToSearch) ) {
                    self.addClass(node, classNametoAdd);
                    return;
                }

                var $new_node_parent = node;
                for (var i = max; i >= 0; i--) {
                    var $this = $new_node_parent.parentElement;
                    if( !$this ) break;
                    if( self.hasClass($this, classNameToSearch) ) {
                        self.addClass($this, classNametoAdd);
                        break;
                    }else 
                        $new_node_parent = $this;
                };

            },

            getStyle : function (el, style){
                return el.currentStyle ? el.currentStyle[style] : getComputedStyle(el, null)[style];
            },

            search_parents_attr : function (node, attribute, max){
                
                if( node.getAttribute(attribute) ) return node.getAttribute(attribute);
                if(!max) max = 20;
                var $new_node_parent = node;
                for (var i = max; i >= 0; i--) {
                    var $this = $new_node_parent.parentElement;
                    if( !$this ) return false;
                    if( $this.getAttribute(attribute) ) return $this.getAttribute(attribute);
                    else $new_node_parent = $this;
                };
                return false;
            },

            search_parents_id : function (node, id, max){
                
                if( node.id === id ) return true;
                if(!max) max = 50;
                var $new_node_parent = node;
                for (var i = max; i >= 0; i--) {
                    var $this = $new_node_parent.parentElement;
                    if( !$this ) return false;
                    if( $this.id === id ) return true;
                    else $new_node_parent = $this;
                };
                return false;
            },

            add_cookie : function(name, value){
                var self = this;
                var cookie = self._readCookie('mylog');
                cookie = cookie ? cookie.split('&') : [];
                var c = {};
                for (var i = 0; i < cookie.length; i++) {
                    var split = cookie[i].split('=');
                    c[split[0]] = split[1];
                };
                c[name] = value;
                var a = [];
                for(v in c) a.push(v+'='+c[v]);
                self._createCookie('mylog', a.join('&'));

            },

            get_cookie : function(name){
                var self = this;
                var cookie = self._readCookie('mylog');
                cookie = cookie ? cookie.split('&') : [];
                var c = {};
                for (var i = 0; i < cookie.length; i++) {
                    var split = cookie[i].split('=');
                    c[split[0]] = split[1];
                };
                // c[name] = c[name]==='true' ? true : c[name];
                // c[name] = c[name]==='false' ? false : c[name];
                // console.log(name, c[name])
                return c[name] ? c[name] : false;
            },

            _createCookie : function (name, value) {
                var date = new Date();

                if(value=='remove') date.setTime(date.getTime()-(_mycookies_days*24*60*60*1000));
                else date.setTime(date.getTime()+(_mycookies_days*24*60*60*1000));

                var expires = "; expires="+date.toGMTString();
                document.cookie = name+"="+value+expires+"; path=/";
            },

            _readCookie : function (name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for(var i=0;i < ca.length;i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1,c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                };
                return 0;
            },

            indexof : function (array, string){
                for (var i=0, j = array.length; i < j; i++) {
                    if (array[i] === string) { return i; }
                }
                return -1;
            },

            trim : function (string){
                return string.replace(/^\s*|\s*$/g, '');
            },

            /*before : function(node, html){

                var insert = document.createElement('div');
                insert.setAttribute('id','myminor_'+self._i_minor);
                insert.setAttribute('class','mysection '+color);

                insert.innerHTML = html;

                last = document.getElementById('myminor_'+(self._i_minor-1));
                node.insertBefore(insert, last);
            },

            after : function(node, html){

                var insert = document.createElement('div');
                insert.setAttribute('id','myminor_'+self._i_minor);
                insert.setAttribute('class','mysection '+color);

                insert.innerHTML = html;

                self.$myminor.appendChild(insert);
                
            },*/

            ajax : function (obj){
    
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
                }

                xhr.open('POST', obj.url);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(variables);

            },

            escapeHtml : function (text) {

                if(typeof text == 'string'){

                    return text
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");

                }else{
                    return text;
                }
            },

            htmlConverter : function (element, minimize){

                var self = this;

                var exception_tag = ['!--', 'input','img', 'br', 'meta', 'link', 'param'],
                    result = '',
                    array = [],
                    ii = -1,
                    comment = false,
                    script1 = false,
                    script2 = true;

                var string = element.outerHTML;


                if(!string) return 'mylog error:1575';

                string = string.replace(/^\s+|\s+$/g, '');
                string = string.replace(/(\n|\r)/g, ' ').replace(/(\s)+/g, ' ').replace(/>(\n|\r)</g, '><').replace(/>(\s)<+/g, '><');

                
                // array
                for (var i = 0; i < string.length; i++) {

                    if( string.substr(i,7) === '<script' || script1 ){

                        if(!script1){

                            script1 = true;
                            array[++ii] = { tagName:null, type:'tag', info:null, tab:null, html:string.charAt(i) };

                        }else if( string.charAt(i-1) === '>' && string.charAt(i) !== '<' && script2 ){

                            script2 = false;
                            array[++ii] = { tagName:null, type:'javascript', info:null, tab:null, html:string.charAt(i) };

                        }else if( string.substr(i,9) === '</script>' ){

                            script1 = false;
                            script2 = true;
                            array[++ii] = { tagName:null, type:'tag', info:null, tab:null, html:string.charAt(i) };

                        }else{

                            array[ii]['html'] += string.charAt(i);

                        };

                    }else if( string.substr(i,4) === '<!--' || comment ){

                        if(comment){

                            array[ii]['html'] += string.charAt(i);
                            if( string.substr(i,3) === '-->' )
                                comment = false;

                        }else{

                            comment = true;
                            array[++ii] = { tagName:null, type:'comment', info:null, tab:null, html:string.charAt(i) };

                        }

                    }else if( string.charAt(i) === '<' || string.charAt(i-1) === '>' ){

                        array[++ii] = { tagName:null, type:'tag', info:null, tab:null, html:string.charAt(i) };

                    }else{

                        array[ii]['html'] += string.charAt(i);

                    }

                };

                // log.yellow(array)

                // tagName + info
                for (var i = 0; i < array.length; i++) {

                    var tag = '';

                    array[i]['html'] = array[i]['html'].replace(/^\s+|\s+$/g, '');

                    if( array[i]['html'][0] === '<'  && array[i]['html'][1] === '/' ){

                        for (var ii = 2; ii < array[i]['html'].length; ii++) {

                            if( array[i]['html'][ii] == ' ' || array[i]['html'][ii] == '>' )
                                break;
                            else
                                tag += array[i]['html'][ii];

                        };

                        array[i]['tagName'] = tag.toLowerCase();
                        array[i]['info'] = 'close';

                    }else if( array[i]['html'][0] === '<' ){

                        for (var ii = 1; ii < array[i]['html'].length; ii++) {

                            if( array[i]['html'].charAt(ii) == ' ' || array[i]['html'].charAt(ii) == '>' || array[i]['html'].charAt(ii) == '/' || array[i]['html'].charAt(ii) == '[' )
                                break;
                            else{
                                tag += array[i]['html'].charAt(ii);
                            }

                        };

                        tag = tag.toLowerCase();

                        array[i]['tagName'] = tag;

                        if( self.indexof(exception_tag, array[i]['tagName']) !== -1 )
                            array[i]['info'] = 'null';
                        else
                            array[i]['info'] = 'open';

                    }else{

                        array[i]['tagName'] = false;
                        if( array[i]['type']==='tag')
                            array[i]['type'] = 'string';
                        array[i]['info'] = 'null';

                    }

                };

                // log.orange(array)

                // tabulation
                var i_tab = 0;
                for (var i = 0; i < array.length; i++) {

                    if( !array[i-1] ){

                        array[i]['tab'] = i_tab;

                    }else if( array[i]['info'] === 'close' ){

                        if( array[i-1]['info'] === 'open' )
                            array[i]['tab'] = i_tab;
                        else
                            array[i]['tab'] = --i_tab;

                    }else if( array[i]['info'] === 'open' ){

                        if( array[i-1]['info'] !== 'open' )
                            array[i]['tab'] = i_tab;
                        else
                            array[i]['tab'] = ++i_tab;

                    }else if( array[i]['info'] === 'null' ){

                        if( array[i-1]['info'] === 'open' )
                            array[i]['tab'] = ++i_tab;
                        else
                            array[i]['tab'] = i_tab;

                    }else{

                        array[i]['tab'] = i_tab;

                    }

                };

                // log.red(array)

                if(minimize){

                    if( self.indexof(exception_tag, array[0]['tagName']) !== -1 ){
                        
                        array = [ 
                            {tagName:array[0]['tagName'], type:array[0]['type'], info:array[0]['info'], tab:0, html:array[0]['html']}
                        ];

                    }else{

                        array = [ 
                            {tagName:array[0]['tagName'], type:array[0]['type'], info:array[0]['info'], tab:0, html:array[0]['html']},
                            {tagName:false, type:'string', info:'null', tab:1, html:'...'},
                            {tagName:array[array.length-1]['tagName'], type:array[array.length-1]['type'], info:array[array.length-1]['info'], tab:0, html:array[array.length-1]['html']} 
                        ];

                    }

                }

            // convertion special character
                result += '<div class="mytab">';

                var ref = 0;
                for (var i = 0; i < array.length; i++) {

                    var string = array[i]['html'];
                    var tab    = array[i]['tab'];

                    var string = self.encodeHtml( string );

                    if( array[i]['type'] === 'tag' )
                        string = self.colorAttribut( string );

                    if( array[i-1] && array[i+1] && array[i+1]['info'] === 'close' && array[i]['type'] === 'string' && array[i-1]['info'] === 'open' )
                        result += '';
                    else if( array[i-2] && array[i]['info'] === 'close' && array[i-1]['type'] === 'string' && array[i-2]['info'] === 'open' )
                        result += '';
                    else if( array[i-1] && array[i]['info'] === 'close' && array[i-1]['info'] === 'open' )
                        result += '';
                    else if( tab > ref )
                        result += '<div class="mytab">';
                    else if( tab < ref )
                        result += '</div>';
                    else if( tab || ref )
                        result += '</div><div class="mytab">';
                
                    if( array[i]['type'] === 'comment' )
                        result += '<span style="color:#666;">' + string + '</span>';
                    else if( array[i]['type'] === 'string' )
                        result += '<span style="color:#000;">' + string + '</span>';
                    else if( array[i]['type'] === 'javascript' )
                        result += '<span style="color:#333;">' + string + '</span>';
                    else
                        result += string;

                    ref = tab;

                };

                result += '</div>';

                // log.red(result)

                return result;

            },

            encodeHtml : function (string){

                // characteres speciaux
                string = string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
                // string = string.replace(/</g, '&lt;');

                return string;

            },

            colorAttribut : function (string){

                var tag = '';
                var array = [];
                var ii = -1;
                var start = false;

                for (var i = 0; i < string.length; i++) {
                    if( string[i] === ' '){
                        break
                    }else{
                        tag += string[i];
                    }
                };

                for (var i = 0; i < string.length; i++) {

                    if( string[i-7] && start && string[i-7] !== '=' && string[i-6] === '&' && string[i-5] === 'q' && string[i-4] === 'u' && string[i-3] === 'o' && string[i-2] === 't' && string[i-1] === ';'  ){

                        start = false;

                    }else if( string[i-1] && string[i-1] === ' ' && !start ){

                        array[++ii] = string[i];
                        start = true;

                    }else{

                        array[ii] += string[i];

                    }

                };

                if(array.length === 0)
                    return string;

                for (var i = 0; i < array.length; i++) {
                    var machin = array[i].replace(/&quot;/g,'');
                    machin = machin.split('=');
                    array[i] = machin;
                };

                for (var i = 0; i < array.length; i++) {

                    array[i] = '<span class="myyellow">' + array[i][0] + '</span>=&quot;<span class="myred">' + array[i][1] + '</span>&quot;';

                };

                string = tag + ' ' + array.join(' ') + '>';

                return string;

            }

        }

    };

    function _addEvent( obj, fn ) {
        var obj = ( obj.constructor === String ) ? document.getElementById( obj ) : obj;
        if ( obj.attachEvent ) {
            obj[ 'eload' + fn ] = fn;
            obj[ 'load' + fn ] = function(){ obj[ 'eload' + fn ]( window.event ) };
            obj.attachEvent( 'onload', obj[ 'load' + fn ] );
        } else {
            obj.addEventListener( 'load', fn, false )
        };
    };

    if(document.body) _mypanel.init();
    else _addEvent( window, function(){
        _mypanel.init();
    });

})();