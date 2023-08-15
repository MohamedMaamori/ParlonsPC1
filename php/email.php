<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // If you need to send credentials like cookies, set this to true



// Check if the form has been submitted
if ($_SERVER["REQUEST_METHOD"] === "POST" || $_SERVER["REQUEST_METHOD"] === "GET") {
    // Get the form data
    $data = json_decode(file_get_contents('php://input'), true);
    // Database connection details
    require_once("conn.php");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    // Check if email exists
    if (isset($data["email"])) {
        $email = $data["email"];
        $_SESSION["email"] = $email;
        // Prepare and execute a SQL query
        $stmt = $conn->prepare("SELECT * FROM users WHERE user_email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        // If the email exists, fetch and store the user data in the session
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $_SESSION["user_id"] = $user["user_id"];

            echo json_encode(array("exists" => true, "message" => "Email exists in the database"));
            exit;
        } else {
            $stmt = $conn->prepare("SELECT * FROM admins WHERE admin_email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            // If the email exists in admins table, return admin data in the session
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                $_SESSION["user_id"] = $user["user_id"];
                echo json_encode(array("exists" => true, "message" => "Email exists in the database"));
                exit;

            } else {
                $stmt = $conn->prepare("SELECT * FROM technicians WHERE technician_email = ?");
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();
                if ($result->num_rows > 0) {
                    $user = $result->fetch_assoc();
                    $_SESSION["user_id"] = $user["user_id"];
                    echo json_encode(array("exists" => true, "message" => "Email exists in the database"));
                    exit;
                }
                ;
            }
            echo json_encode(array("exists" => false, "message" => "Email does not exist in the database"));
            ;
        }
        ;

    }
    // Close the connection
    $stmt->close();
    $conn->close();
}

// If the request method is not POST or email not found, return error response
echo json_encode(array("error" => "Invalid request"));
?>