<?php
    session_start();
    if($_SESSION["auth"] == false) {
        header("HTTP/1.0 403 Forbidden");
    }
    $_POST = json_decode(file_get_contents("php://input"), true);
    $newFile = "../../temp_123456.html";
    if($_POST["html"]){
        file_put_contents($newFile, $_POST["html"]);
    }
    else {
        header("HTTP/1.0 400 Bad Request");
    }