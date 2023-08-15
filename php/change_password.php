<?php
session_start();
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON data from the request
    $jsonData = file_get_contents('php://input');
    // Decode the JSON data into a PHP array
    $formData = json_decode($jsonData, true);

    // Get the form data from the decoded array
    $password = $formData['password'];

    if (empty($password)) {
        http_response_code(400);
        echo json_encode(array('error' => 'All fields are required'));
        exit;
    }

    // Hash the password for security using PASSWORD_ARGON2ID (or PASSWORD_BCRYPT)
    $hashedPassword = password_hash($password, PASSWORD_ARGON2ID);

    // Replace the following with your actual database credentials
    require_once("conn.php");

    // Check the connection
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database connection failed'));
        exit;
    }
    $date = date('Y-m-d H:i:s');
    // Prepare the SQL statement to insert the user into the database
    $stmt = $conn->prepare('UPDATE users SET user_pass = ? WHERE user_id = ?');
    $stmt->bind_param('ss', $hashedPassword, $_SESSION["user_id"]);

    // Execute the SQL statement
    if ($stmt->execute()) {
        // User registration successful
        http_response_code(200);
        echo json_encode(array('message' => 'User registered successfully'));
    }
} else {
    // Return an error response for non-POST requests
    http_response_code(405);
    echo json_encode(array('error' => 'Invalid request method'));
}
?>