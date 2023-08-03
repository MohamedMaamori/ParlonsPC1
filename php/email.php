<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // If you need to send credentials like cookies, set this to true

// Function to check if the email exists in the database
function checkEmailExists($email)
{
    // Database connection details
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "parlonspc";

    // Create a new connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare and execute a SQL query
    $stmt = $conn->prepare("SELECT * FROM users WHERE user_email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // If the email exists, fetch and store the user data in the session
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $_SESSION['user_username'] = $user['user_username'];
        // You can also store other user data in the session if needed
        // For example: $_SESSION['user_name'] = $user['user_name'];
        return true;
    } else {
        $stmt = $conn->prepare("SELECT * FROM admins WHERE admin_email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        // If the email exists in admins table, return admin data in the session
        if ($result->num_rows > 0) {
            return true;
        } else {
            $stmt = $conn->prepare("SELECT * FROM technicians WHERE technician_email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                return true;
            }
            ;
        }
    }

    // Close the connection
    $stmt->close();
    $conn->close();

    // Return false if the email does not exist in users or admins table
    return false;
}

// Check if the form has been submitted
if ($_SERVER["REQUEST_METHOD"] === "POST" || $_SERVER["REQUEST_METHOD"] === "GET") {
    // Get the form data
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if email exists
    if (isset($data["email"])) {
        $email = $data["email"];

        if (checkEmailExists($email)) {
            // Email exists, return success response for email validation
            $response = array("exists" => true, "message" => "Email exists in the database");
            if (isset($_SESSION['user_username'])) {
                $response["user"] = true;
            } else {
                $response["user"] = false;
            }
            echo json_encode($response);
            exit;
        } else {
            // Email does not exist, return error response for email validation
            $response = array("exists" => false, "message" => "Email does not exist in the database");
            echo json_encode($response);
            exit;
        }

    }
}
// If the request method is not POST or email not found, return error response
echo json_encode(array("error" => "Invalid request"));
?>