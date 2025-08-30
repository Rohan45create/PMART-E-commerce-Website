<?php
session_start();
header('Content-Type: application/json');
require '../config.php'; // Use require for critical dependencies

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Disable display in production

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    // Check user authentication
    if (!isset($_SESSION['user_id'])) {
        throw new Exception("User not authenticated");
    }

    // Validate input parameters
    if (!isset($_POST['product_id']) || !isset($_POST['quantity'])) {
        throw new Exception("Missing required parameters");
    }

    // Sanitize and validate inputs
    $user_id = $_SESSION['user_id'];
    $product_id = filter_var($_POST['product_id'], FILTER_VALIDATE_INT);
    $quantity = max(1, filter_var($_POST['quantity'], FILTER_VALIDATE_INT)); // Ensure minimum 1

    if (!$product_id || !$quantity) {
        throw new Exception("Invalid input parameters");
    }

    // Check product existence in favorites
    $stmt = $pdo->prepare("SELECT quantity FROM favorites WHERE user_id = ? AND product_id = ?");
    $stmt->execute([$user_id, $product_id]);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception("Product not found in favorites");
    }

    // Update quantity
    $updateStmt = $pdo->prepare("UPDATE favorites SET quantity = ? WHERE user_id = ? AND product_id = ?");
    $success = $updateStmt->execute([$quantity, $user_id, $product_id]);

    if (!$success) {
        throw new Exception("Failed to update favorites");
    }

    // Return success response with updated quantity
    echo json_encode([
        'success' => true,
        'message' => 'Favorites updated successfully',
        'newQuantity' => $quantity
    ]);

} catch (Exception $e) {
    // Log error (implement proper logging in production)
    error_log("Favorites update error: " . $e->getMessage());
    
    // Return error response
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>