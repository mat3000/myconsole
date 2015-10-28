<?php

	$action = isset($_POST['action']) ? $_POST['action'] : 0;

	function db(){
		try { $db = new PDO('mysql:host=mysql51-74.perso;dbname=matdevsql', 'matdevsql', 'nDjx0sfK'); }
		catch(Exception $e) { die('Erreur : '.$e->getMessage()); }
		$db->query("SET NAMES 'utf8'");
		return $db;
	}

	if($action==='load_note'){

		$query = "SELECT s_text FROM mylog WHERE s_name='note'";

		$req = db()->query($query);
		$datas = $req->fetch(PDO::FETCH_ASSOC);

		echo $datas['s_text'];
		
	}

	if($action==='save_note'){

		$note = isset($_POST['note']) ? addslashes($_POST['note']) : 0;

		$query = "UPDATE mylog SET s_text='$note' WHERE s_name='note'";

		echo db()->exec($query);

	}

	if($action==='read_mylog'){

		session_start();

		echo json_encode( $_SESSION['mylog'] );
		$_SESSION['mylog'] = '';

	}

?>