<?php
header('Content-Type: application/json');
require_once 'db_connection.php';

try {
    $searchTerm = isset($_GET['q']) ? trim($_GET['q']) : '';
    error_log("Received search term: '$searchTerm'");

    // Ensure search term is not empty
    if (empty($searchTerm)) {
        echo json_encode(['error' => 'No search term provided']);
        exit;
    }

    error_log("🔍 Search Term: " . $searchTerm);

    // Correct SQL query with proper parameter binding
    $sql = "SELECT * FROM products 
            WHERE product_name LIKE ? 
            OR product_category LIKE ? 
            OR product_brand LIKE ?";

    $stmt = $conn->prepare($sql);
    $searchParam = "%$searchTerm%";
    
    // Bind the same parameter three times (once per condition)
    $stmt->execute([$searchParam, $searchParam, $searchParam]);

    // After $stmt->execute(...)
    if ($stmt->errorCode() != '00000') {
        $error = $stmt->errorInfo();
        error_log("SQL Error: " . $error[2]);
    }
    
    $products = $stmt->fetchAll();
    
    error_log("✅ Results Found: " . count($products));
    
    echo json_encode($products);

} catch (PDOException $e) {
    error_log("❌ Search Query Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
}
?>