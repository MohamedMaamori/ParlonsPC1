<?php
session_start();
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true");
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './PHPMailer-master/src/Exception.php';
require './PHPMailer-master/src/PHPMailer.php';
require './PHPMailer-master/src/SMTP.php';

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
    $email = $formData['email'];
    $firstName = $formData['firstName'];
    $lastName = $formData['lastName'];
    $userName = $formData['userName'];
    $password = $formData['password'];

    if (empty($email) || empty($password)) {
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
    $stmt = $conn->prepare('INSERT INTO users (user_email, user_firstname, user_lastname, user_username, user_pass, user_creation_date) VALUES (?, ?, ?, ?, ?,?)');
    $stmt->bind_param('ssssss', $email, $firstName, $lastName, $userName, $hashedPassword, $date);

    // Execute the SQL statement
    if ($stmt->execute()) {
        // User registration successful
        http_response_code(200);
        echo json_encode(array('message' => 'User registered successfully'));

        // Retrieve the user's data and store it in the session
        $stmt2 = $conn->prepare("SELECT * FROM users WHERE user_email = ?");
        $stmt2->bind_param("s", $email);
        $stmt2->execute();
        $result = $stmt2->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['user_username'] = $user['user_username'];
        }
    } else {
        // Error occurred while inserting the user
        http_response_code(500);
        echo json_encode(array('error' => 'Error occurred during registration'));
    }

    // Close the database connection
    $stmt->close();
    $stmt2->close();
    $conn->close();
} else {
    // Return an error response for non-POST requests
    http_response_code(405);
    echo json_encode(array('error' => 'Invalid request method'));
}
?>