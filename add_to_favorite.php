<?php
require 'config.php';
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

if (!isset($_POST['product_id']) || !is_numeric($_POST['product_id'])) {
    echo json_encode(["success" => false, "message" => "Invalid product ID"]);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Authentication required"]);
    exit;
}

try {
    $userId = $_SESSION['user_id'];
    $productId = (int)$_POST['product_id'];

    // Check existing favorite
    $checkStmt = $pdo->prepare("SELECT * FROM favorites WHERE user_id = ? AND product_id = ?");
    $checkStmt->execute([$userId, $productId]);
    
    if ($checkStmt->rowCount() > 0) {
        // Remove favorite
        $deleteStmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND product_id = ?");
        $deleteStmt->execute([$userId, $productId]);
        echo json_encode(["success" => true, "action" => "removed"]);
    } else {
        // Add favorite
        $insertStmt = $pdo->prepare("INSERT INTO favorites (user_id, product_id) VALUES (?, ?)");
        $insertStmt->execute([$userId, $productId]);
        echo json_encode(["success" => true, "action" => "added"]);
    }

} catch (PDOException $e) {
    error_log("Favorite Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Database error"]);
}
?>