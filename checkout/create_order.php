<?php
header('Content-Type: application/json');
require '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['user_id']) || empty($data['products']) || empty($data['delivery_address'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request data']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Validate products and stock availability before proceeding
    foreach ($data['products'] as $product) {
        $checkStmt = $pdo->prepare("SELECT quantity FROM products WHERE product_id = :product_id");
        $checkStmt->execute([':product_id' => $product['product_id']]);
        $stock = $checkStmt->fetchColumn();

        if ($stock === false) {
            throw new PDOException("Product ID {$product['product_id']} not found.");
        }
        if ($stock < $product['quantity']) {
            throw new PDOException("Insufficient stock for Product ID {$product['product_id']}.");
        }
    }

    // Prepare order details
    $productIds = json_encode(array_column($data['products'], 'product_id'));
    $quantities = json_encode(array_column($data['products'], 'quantity'));

    $deliveryAddress = json_encode([
        'name' => $data['delivery_address']['name'],
        'phone' => $data['delivery_address']['phone'],
        'state' => $data['delivery_address']['state'],
        'city' => $data['delivery_address']['city'],
        'line1' => $data['delivery_address']['line1'],
        'line2' => $data['delivery_address']['line2'],
        'zip' => $data['delivery_address']['zip']
    ]);

    $paymentStatus = ($data['payment_method'] === 'pay-on-delivery') ? 'pending' : 'completed';

    // Insert order
    $stmt = $pdo->prepare("
        INSERT INTO orders 
        (user_id, product_ids, quantities, total_amount, delivery_address, payment_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['user_id'],
        $productIds,
        $quantities,
        $data['totals']['subtotal'],
        $deliveryAddress,
        $paymentStatus
    ]);

    $orderId = $pdo->lastInsertId();

    // Update product stock
    foreach ($data['products'] as $product) {
        $updateStmt = $pdo->prepare("
            UPDATE products 
            SET quantity = quantity - :quantity 
            WHERE product_id = :product_id
        ");

        $updateStmt->execute([
            ':quantity' => $product['quantity'],
            ':product_id' => $product['product_id']
        ]);
    }

    // Clear cart if requested
    if (!empty($data['clear_cart'])) {
        $deleteCart = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
        $deleteCart->execute([$data['user_id']]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'order_id' => $orderId,
        'message' => 'Order placed successfully'
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
