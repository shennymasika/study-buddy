<?php
// logout.php — Destroys current session and redirects to login.php
session_start();
session_unset();
session_destroy();
header('Location: index.php');
exit;
