<?php
session_start();
if(isset($_SESSION['direct_order'])) {
    unset($_SESSION['cart']);
    unset($_SESSION['direct_order']);
}
$_SESSION['direct_order'] = true;
echo json_encode(['success' => true]);
?>