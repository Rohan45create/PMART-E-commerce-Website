<?php
require_once '../config.php'; // Ensure correct path

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Debug: Print received data
    file_put_contents("debug.log", print_r($_POST, true)); 

    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $message = $_POST['message'] ?? '';

    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }

    echo json_encode(['success' => true, 'message' => 'Feedback received!']);
}

?>
