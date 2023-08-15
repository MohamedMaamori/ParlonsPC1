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

    // Get the verification code entered by the user
    $userVerificationCode = $formData['verificationCode'];

    // Check if the verification code matches and is not expired
    if (
        isset($_SESSION['verification_code']) &&
        $_SESSION['verification_code'] === $userVerificationCode &&
        time() <= $_SESSION['verification_expiration']
    ) {

        // Clear the verification session data
        unset($_SESSION['verification_code']);
        unset($_SESSION['verification_expiration']);


        echo json_encode(array("verification" => true, 'message' => 'Verification Sucessfull'));
        http_response_code(200);
        exit;

    } else {
        http_response_code(400);
        echo json_encode(array("verification" => false, 'error' => 'Invalid verification code'));
    }
} else {
    // Return an error response for non-POST requests
    http_response_code(405);
    echo json_encode(array('error' => 'Invalid request method'));
}
?>