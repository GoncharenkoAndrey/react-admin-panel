<?php
    session_start();
    if($_SESSION["auth"] == false) {
        header("HTTP/1.0 403 Forbidden");
    }
    if(file_exists($_FILES["image"]["tmp_name"]) && is_uploaded_file($_FILES["image"]["tmp_name"])) {
        $fileExtension = explode('/', $_FILES["image"]["tmp_name"])[1];
        $fileName = uniqid() . "." . $fileExtension;
        if(!is_dir("../../img/")) {
            mkdir("../../img");
        }
        move_uploaded_file($_FILES["image"]["tmp_name"], "../../img/" . $fileName);
        echo json_encode(array("src" => $fileName));
    }