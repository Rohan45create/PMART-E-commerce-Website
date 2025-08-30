<?php
require 'config.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Authentication required"]);
    exit;
}

try {
    $productFilter = isset($_GET['product_id']) ? "AND p.product_id = ".(int)$_GET['product_id'] : "";
    $stmt = $pdo->prepare("
        SELECT p.* 
        FROM favorites f
        JOIN products p ON f.product_id = p.product_id
        WHERE f.user_id = ? $productFilter
    ");
    $stmt->execute([$_SESSION['user_id']]);
    
    $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // In fetch_favorite.php
    $response = [
        "success" => true,
        "favorites" => $favorites,
        "count" => count($favorites),
        "timestamp" => time() // For debugging
    ];

    // Add error logging at the end
    if (!$response['success']) {
        error_log("Favorite fetch error: " . $response['message']);
    }
    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>