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
    $raw_data = file_get_contents('php://input');
    // Decode the JSON data into a PHP array
    $data = json_decode($raw_data, true);

    // Get the form data from the decoded array
    $email = trim($data['email']);
    $firstName = trim($data['firstName']);
    $lastName = trim($data['lastName']);
    $userName = trim($data['userName']);
    $googleID = trim($data['googleID']); // Password is user googleID

    // Validate the form data (you can add more validation as needed)
    if (empty($email)) {
        http_response_code(400);
        echo json_encode(array('error' => 'All fields are required'));
        exit;
    }



    // Replace the following with your actual database credentials
    require_once("conn.php");

    // Check the connection
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database connection failed'));
        exit;
    }

    // Prepare the SQL statement to insert the user into the database
    $login = $conn->prepare("SELECT * FROM users WHERE user_email = ?");
    $login->bind_param('s', $email);
    $login->execute();
    $result = $login->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (empty($user['social_google_id'])) {
            $update_google_id = $conn->prepare('UPDATE `users` SET `social_google_id` = ? WHERE user_email = ?');
            $update_google_id->bind_param('ss', $googleID, $email);
            $update_google_id->execute();
            $update_google_id->close();
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['user_username'] = $user['user_username'];
            echo json_encode(array("success" => true, "usersid" => $user['user_id'], "message" => "Linking"));
            exit;
        }
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_username'] = $user['user_username'];
        echo json_encode(array("success" => true, "usersid" => $user['user_id'], "message" => "Linked"));
        exit;
    } else {
        $date = date('Y-m-d H:i:s');
        $insert = $conn->prepare('INSERT INTO users (user_email, user_firstname, user_lastname, user_username, user_creation_date,social_google_id ) VALUES (?, ?, ?, ?, ?, ?)');
        $insert->bind_param('ssssss', $email, $firstName, $lastName, $userName, $date, $googleID);

        if ($insert->execute()) {
            // User registration successful
            http_response_code(200);
            echo json_encode(array("success" => true, 'message' => 'User registered successfully'));

            // Retrieve the user's data and store it in the session
            $stmt = $conn->prepare("SELECT * FROM users WHERE user_email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['user_username'] = $user['user_username'];
            }
        } else {
            http_response_code(500);
            echo json_encode(array('error' => 'Error occurred during registration'));
        }
    }

    // Close the database connection
    $login->close();
    $stmt->close();
    $conn->close();
} else {
    // Return an error response for non-POST requests
    http_response_code(405);
    echo json_encode(array('error' => 'Invalid request method'));
}
?>