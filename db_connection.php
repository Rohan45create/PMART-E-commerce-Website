<?php
$host = '127.0.0.1'; // Use IP instead of 'localhost'
$db   = 'pmart'; // Ensure this database exists
$user = 'root';
$pass = ''; // Default XAMPP MySQL has no password
$charset = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass, $options);
    error_log("✅ Database connected successfully");
} catch (PDOException $e) {
    error_log("❌ Connection failed: " . $e->getMessage());
    die("Database connection failed: " . $e->getMessage());
}
?>
