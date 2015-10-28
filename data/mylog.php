<?php

	// @session_start();$action=isset($_POST['action'])?$_POST['action']:0;function mylog($obj='',$name='none',$color='none'){$mylog=array('id'=>'id_'.rand(1,9999999),'obj'=>$obj,'name'=>$name,'color'=>$color);$_SESSION['mylog'][]=$mylog;}
	
	session_start();

	$action = isset($_POST['action']) ? $_POST['action'] : 0;

	function mylog($obj='',$name='none',$color='none'){

		$mylog = array(
			'id'   =>'id_'.rand(1,9999999),
			'obj'  =>$obj,
			'name' =>$name,
			'color'=>$color
		);

		$_SESSION['mylog'][] = $mylog;

	}

?>