<?php
session_start();
$host = "localhost";
$user = "root";
$password = "";
$database = "pmart"; // Update this with your database name

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$user_id = $_SESSION['user_id'];

$query = "SELECT c.product_id, p.product_name, p.selling_price, p.actual_price, c.quantity, p.product_image 
          FROM cart c 
          JOIN products p ON c.product_id = p.product_id 
          WHERE c.user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$cart_items = [];
$total_price = 0;
$total_savings = 0;

while ($row = $result->fetch_assoc()) {
    $item_total = $row['selling_price'] * $row['quantity'];
    $item_savings = ($row['actual_price'] - $row['selling_price']) * $row['quantity'];

    $total_price += $item_total;
    $total_savings += $item_savings;

    $cart_items[] = [
        "product_id" => $row['product_id'],
        "product_name" => $row['product_name'],
        "selling_price" => $row['selling_price'],
        "actual_price" => $row['actual_price'],
        "quantity" => $row['quantity'],
        "product_image" => $row['product_image']
    ];
}

$response = [
    "status" => "success",
    "total_price" => $total_price,
    "total_savings" => $total_savings,
    "cart_items" => $cart_items
];

echo json_encode($response);
?>
