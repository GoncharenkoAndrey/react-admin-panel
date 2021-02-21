<?php
    session_start();
    if($_SESSION["auth"] == false) {
        header("HTTP/1.0 403 Forbidden");
    }
    $files = glob("../../*.html");
    $data = array();
    foreach ($files as $file) {
        array_push($data, basename($file));
    }
    echo json_encode($data);