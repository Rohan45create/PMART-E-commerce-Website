<?php
session_start();
$_SESSION['direct_order'] = true;
echo json_encode(['success' => true]);
?>
