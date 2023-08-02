<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // If you need to send credentials like cookies, set this to true

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    session_start();
    // Get the raw POST data
    $raw_data = file_get_contents('php://input');
    // Decode the JSON data to an associative array
    $data = json_decode($raw_data, true);

    // Check if email and password exist for password validation
    if (isset($data["email"]) && isset($data["password"])) {
        $email = $data["email"];
        $password = $data["password"];

        // Database connection details
        $servername = "localhost";
        $username = "root";
        $dbpassword = ""; // Note: Changed variable name to avoid conflict with $password
        $dbname = "parlonspc";

        // Create a new connection
        $conn = new mysqli($servername, $username, $dbpassword, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Prepare and execute a SQL query to check if the email and password match
        $stmt = $conn->prepare("SELECT * FROM users WHERE user_email = ? AND user_pass = ?");
        $stmt->bind_param("ss", $email, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        // If the email exists, fetch and store the user data in the session
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $_SESSION['user_id'] = $user['user_id'];
        }

        // Close the connection
        $stmt->close();
        $conn->close();
        // Return true if the email and password are valid, otherwise false
        echo json_encode(array("valid" => $result->num_rows > 0, "message" => "This Password Exists: " . $_SESSION['user_id']));
        exit;
    }
}

// If the request method is not POST or email/password not found, return error response
echo json_encode(array("error" => "Invalid request"));