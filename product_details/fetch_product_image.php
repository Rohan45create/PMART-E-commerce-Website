<?php
include './database.php';

if(isset($_GET['product_id'])){
    $product_id = (int)$_GET['product_id'];
    
    $stmt = $conn->prepare("SELECT product_image FROM products WHERE product_id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $stmt->bind_result($image_data);
    $stmt->fetch();
    
    if($image_data) {
        header("Content-Type: image/jpeg");
        echo $image_data;
        exit();
    }
}

// Fallback to default image
header("Location: ../Home Page/Images/default-product.jpg");
?>