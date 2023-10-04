<?php
// Start the PHP session// Start the PHP session
// Start the PHP session
session_start();
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

// Check if the user is authenticated
if (isset($_SESSION['user_id'])) {
    echo json_encode(array("authenticated" => true, "message" => "user"));
} elseif (isset($_SESSION["admin_id"])) {
    echo json_encode(array("authenticated" => true, "message" => "admin"));
} elseif (isset($_SESSION['technician_id'])) {
    echo json_encode(array("authenticated" => true, "message" => "technician"));
} else {
    echo json_encode(array("authenticated" => false));
}
