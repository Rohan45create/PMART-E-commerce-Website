<?php
require_once 'db_connection.php';

try {
    $stmt = $conn->query("SELECT 1");
    echo ($stmt->fetchColumn() == 1) ? "✅ DB Connection OK" : "❌ DB Connection Failed";
} catch (PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage();
}
?>
