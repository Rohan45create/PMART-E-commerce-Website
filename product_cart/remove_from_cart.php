<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
header('Content-Type: application/json');  // Add this at the top

// Fix the config path to match your directory structure
include '../config.php';  // Changed from 'db_connection.php'

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

if (!isset($_POST['product_id']) || !isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];
    $product_id = intval($_POST['product_id']);

    // Use prepared statements from PDO (assuming config.php sets up $pdo)
    $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->execute([$user_id, $product_id]);

    echo json_encode(["success" => true, "message" => "Item removed successfully"]);
    
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>