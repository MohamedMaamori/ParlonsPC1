<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Adjust the methods based on your requirements
header("Access-Control-Allow-Credentials: true"); // If you need to send credentials like cookies, set this to true

// Check if the user is authenticated
if (isset($_SESSION['user_id'])) {
    // If the user is authenticated, return the user ID
    echo json_encode(array("user_id" => $_SESSION['user_id']));
} else {
    // If the user is not authenticated, return an error response
    echo json_encode(array("user_id" => null));
}
?>