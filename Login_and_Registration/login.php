<?php
require 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login = $_POST['login'];
    $password = $_POST['password'];
    
    // Determine if login is email or mobile
    $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'mobile';
    
    $sql = "SELECT * FROM users WHERE $field = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if ($user && password_verify($password, $user['password'])) {
        // Start session and store user ID
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id']; // Ensure 'id' matches your users table column

        // Return user data as JSON
        $userData = [
            'success' => true,
            'user' => [
                'full_name' => $user['full_name'],
                'email' => $user['email'],
                'mobile' => $user['mobile']
            ]
        ];
        header('Content-Type: application/json');
        echo json_encode($userData);
    } else {
        $response = ['success' => false, 'message' => 'Invalid credentials'];
        header('Content-Type: application/json');
        echo json_encode($response);
    }
    $stmt->close();
}

$conn->close();
?>
