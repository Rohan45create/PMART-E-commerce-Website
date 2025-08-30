<?php
header('Content-Type: application/json');

// Get JSON data
$input = json_decode(file_get_contents('php://input'), true);

// Database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pmart";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception('Connection failed: ' . $conn->connect_error);
    }

    // Validate required fields
    if (empty($input['name']) || empty($input['email']) || empty($input['feedback'])) {
        throw new Exception('All required fields must be filled');
    }

    // Prepare statement
    $stmt = $conn->prepare("INSERT INTO feedback (name, email, feedback, rating) VALUES (?, ?, ?, ?)");
    
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    // Bind parameters
    $rating = !empty($input['rating']) ? intval($input['rating']) : NULL;
    $stmt->bind_param("sssi", 
        $conn->real_escape_string($input['name']),
        $conn->real_escape_string($input['email']),
        $conn->real_escape_string($input['feedback']),
        $rating
    );

    // Execute and respond
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Execute failed: ' . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
?>