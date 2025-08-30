<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "", "pmart");

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$category = isset($_GET['category']) ? $_GET['category'] : "shoes"; // Default category

$query = "SELECT * FROM products WHERE product_category = ? LIMIT 8"; // Fetch only 8 records
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $category);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);
?>
