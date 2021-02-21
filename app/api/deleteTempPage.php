<?php
    session_start();
    if($_SESSION["auth"] == false) {
        header("HTTP/1.0 403 Forbidden");
    }
    $file = "../../temp_123456.html";
    if(file_exists($file)){
        unlink($file);
    }
    else {
        header("HTTP/1.0 400 Bad Request");
    }