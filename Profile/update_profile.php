<?php
session_start();
require '../product_details/database.php';

$data = json_decode(file_get_contents('php://input'), true);

// Validate user input
$required = ['id', 'firstName', 'lastName', 'email', 'mobile'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        die(json_encode(['success' => false, 'message' => "Missing required field: $field"]));
    }
}

try {
    // Fetch existing user data
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$data['id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify password if changing sensitive fields or password
    if ($data['email'] !== $user['email'] || $data['mobile'] !== $user['mobile'] || !empty($data['newPassword'])) {
        if (!password_verify($data['currentPassword'], $user['password'])) {
            die(json_encode(['success' => false, 'message' => 'Incorrect current password']));
        }
    }

    // Prepare update query
    $updates = [];
    $params = [];
    
    $updates[] = "full_name = :full_name";
    $params[':full_name'] = $data['firstName'] . ' ' . $data['lastName'];
    
    $updates[] = "email = :email";
    $params[':email'] = $data['email'];
    
    $updates[] = "mobile = :mobile";
    $params[':mobile'] = $data['mobile'];
    
    $updates[] = "address = :address";
    $params[':address'] = $data['address'];
    
    if (!empty($data['newPassword'])) {
        $updates[] = "password = :password";
        $params[':password'] = password_hash($data['newPassword'], PASSWORD_DEFAULT);
    }

    $params[':id'] = $data['id'];
    
    $query = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    // Fetch updated user data
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$data['id']]);
    $updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $updatedUser['id'],
            'full_name' => $updatedUser['full_name'],
            'email' => $updatedUser['email'],
            'mobile' => $updatedUser['mobile'],
            'address' => $updatedUser['address'],
            'created_at' => $updatedUser['created_at'],
            'updated_at' => $updatedUser['updated_at']
        ]
    ]);
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]));
}