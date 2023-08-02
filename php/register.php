<?php
session_start();
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true"); // If you need to send credentials like cookies, set this to true

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    http_response_code(200);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the form data from the request
    // Get the JSON data from the request
    $jsonData = file_get_contents('php://input');
    // Decode the JSON data into a PHP array
    $formData = json_decode($jsonData, true);

    // Get the form data from the decoded array
    $email = $formData['email'];
    $firstName = $formData['firstName'];
    $lastName = $formData['lastName'];
    $userName = $formData['userName'];
    $gender = $formData['gender'];
    $country = $formData['country'];
    $birthDate = $formData['birthDate'];
    $password = $formData['password'];
    // Validate the form data (you can add more validation as needed)
    if (empty($email) || empty($firstName) || empty($lastName) || empty($gender) || empty($country) || empty($birthDate) || empty($password)) {
        // Return an error response if any required field is missing
        http_response_code(400);
        echo json_encode(array('error' => 'All fields are required'));
        exit;
    }

    // Hash the password for security (use a stronger hashing algorithm in production)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Replace the following with your actual database credentials
    $dbHost = 'localhost';
    $dbUsername = 'root';
    $dbPassword = '';
    $dbName = 'parlonspc';

    // Connect to the database
    $conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

    // Check the connection
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database connection failed'));
        exit;
    }

    // Prepare the SQL statement to insert the user into the database



    $stmt = $conn->prepare('INSERT INTO users (user_email, user_firstname, user_lastname, user_username, user_gender, user_country, user_birthdate, user_pass) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');


    $stmt->bind_param('ssssssss', $email, $firstName, $lastName, $userName, $gender, $country, $birthDate, $password);

    // Execute the SQL statement
    if ($stmt->execute()) {
        // User registration successful
        http_response_code(200);
        echo json_encode(array('message' => 'User registered successfully'));
        $stmt2 = $conn->prepare("SELECT * FROM users WHERE user_email = ? AND user_pass = ?");
        $stmt2->bind_param("ss", $email, $password);
        $stmt2->execute();
        $result = $stmt2->get_result();

        // If the email exists, fetch and store the user data in the session
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (!isset($_SESSION['user_id'])) {

                $_SESSION['user_id'] = $user['user_id'];
            }
        }

    } else {
        // Error occurred while inserting the user
        http_response_code(500);
        echo json_encode(array('error' => 'Error occurred during registration'));
    }

    // Close the database connection
    $stmt->close();
    $conn->close();
} else {
    // Return an error response for non-POST requests
    http_response_code(405);
    echo json_encode(array('error' => 'Invalid request method'));
}
?>