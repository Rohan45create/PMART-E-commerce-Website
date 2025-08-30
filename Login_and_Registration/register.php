<?php
include_once 'config.php'; // Make sure this file exists in the same directory

if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $full_name = $_POST['full_name'];
    $email = $_POST['email'];
    $mobile = $_POST['mobile'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Check for existing email or mobile
    $checkUser = "SELECT * FROM users WHERE email='$email' OR mobile='$mobile'";
    $result = $conn->query($checkUser);

    if ($result && $result->num_rows > 0) {
        echo "Email or Mobile already registered!";
    } else {
        $sql = "INSERT INTO users (full_name, email, mobile, password) VALUES ('$full_name', '$email', '$mobile', '$password')";
        if ($conn->query($sql) === TRUE) {
            echo "success";
        } else {
            echo "Error: " . $conn->error;
        }
    }
}
$conn->close();
?>
