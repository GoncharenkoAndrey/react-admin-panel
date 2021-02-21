<?php
    session_start();
    if($_SESSION["auth"] == true) {
        session_destroy();
    }