<?php
require 'config.php';
session_start();

header('Content-Type: application/json');


if(isset($_SESSION['direct_order'])) {
    $_SESSION['cart'] = []; // Reset cart for direct orders
    unset($_SESSION['direct_order']);
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['product_id'])) {
    $user_id = $_SESSION['user_id'];
    $product_id = $_POST['product_id'];

    try {
        // Check if the product already exists in the cart
        $stmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$user_id, $product_id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "Product already in cart"]);
            exit;
        }

        // Insert product into cart
        $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)");
        $insertSuccess = $stmt->execute([$user_id, $product_id]);

        if ($insertSuccess) {
            // Check if insertion really happened
            $checkStmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?");
            $checkStmt->execute([$user_id, $product_id]);
            $product = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if ($product) {
                echo json_encode(["success" => true, "message" => "Product added successfully!", "cart" => $product]);
            } else {
                echo json_encode(["success" => false, "message" => "Insert failed, product not found after insert"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Database insert failed"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}
?>
