<?php

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pmart";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if not exists
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully\n";
} else {
    echo "Error creating database: " . $conn->error;
}

$conn->select_db($dbname);

// Create products table
$sql = "CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255),
    product_description TEXT,
    product_category VARCHAR(100),
    product_brand VARCHAR(100),
    selling_price DECIMAL(10, 2),
    actual_price DECIMAL(10, 2),
    quantity INT
)";

if ($conn->query($sql) === TRUE) {
    echo "Table created successfully\n";
} else {
    echo "Error creating table: " . $conn->error;
}

// Fetch data from the Free E-Store API using cURL (more efficient than file_get_contents)
$api_url = "https://https://free-e-store-api.onrender.com/api/v1/products";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Skip SSL verification if needed
$response = curl_exec($ch);
curl_close($ch);

$products = json_decode($response, true);

if (!$products || !is_array($products)) {
    die("Failed to fetch or decode API data");
}

// Insert data efficiently using prepared statements
$stmt = $conn->prepare("INSERT INTO products (product_name, product_description, product_category, product_brand, selling_price, actual_price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssddi", $name, $description, $category, $brand, $selling_price, $actual_price, $quantity);

foreach ($products as $product) {
    $name = $product['name'];
    $description = $product['description'];
    $category = $product['category'];
    $brand = $product['brand'] ?? 'Unknown';
    $selling_price = $product['price']['selling'] ?? 0;
    $actual_price = $product['price']['actual'] ?? $selling_price * 1.2; // Default markup if not provided
    $quantity = $product['quantity'] ?? rand(1, 100);

    $stmt->execute();
}

echo "Data inserted successfully";

// Close connections
$stmt->close();
$conn->close();

?>
