<?php
// Start the PHP session
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Adjust the methods based on your requirements
header("Access-Control-Allow-Credentials: true"); // If you need to send credentials like cookies, set this to true


// Unset all session variables
session_unset();

// Destroy the session
session_destroy();


exit;
?>