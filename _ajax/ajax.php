<?php

	// chdir('../');
	// echo getcwd();
	include_once('../data/mylog.php');

	$data = isset($_POST['data']) ? $_POST['data'] : 'error';

	// mylog();

	mylog('1111','thename','violet');
	// mylog('2222','thename','violet');

	// mylog( 'a a' ,'test','violet');

	// mylog( '<p>a+a a</p>' ,'test','violet');
	// mylog( htmlspecialchars($test) ,'test','violet');




// 	mylog( array('aaa'=>0,'bbb'=>'<p>é+a a
// a</p>') ,'test','orange');
	// mylog( array('aaa'=>0,'bbb'=>'<p>a+a a</p>') );

	echo "<p>ceci est un $data<p>";



?>