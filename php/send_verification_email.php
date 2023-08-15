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
    $email = $_SESSION['email'];

    if (empty($email)) {
        http_response_code(400);
        echo json_encode(array('error' => 'All fields are required'));
        exit;
    }
    // Generate and store verification code
    $_SESSION['verification_code'] = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
    $_SESSION['verification_expiration'] = time() + 600; // 10 minutes expiration
    // Generate and store verification code
    $mail = new PHPMailer(true); // Passing `true` enables exceptions
    try {
        //Server settings
        $mail->SMTPDebug = 2; // Enable verbose debug output
        $mail->isSMTP(); // Set mailer to use SMTP
        $mail->Host = 'smtp-relay.brevo.com'; // Specify main and backup SMTP servers
        $mail->SMTPAuth = true; // Enable SMTP authentication
        $mail->Username = "gegapacacia@gmail.com";
        $mail->Password = "WOjKTVqDsIJGB0vx";
        $mail->Port = 587; // TCP port to connect to
        //Recipients
        $mail->setFrom('Verify@PalonsPC.fr', 'ParlonsPC'); //This is the email your form sends From
        $mail->addAddress($email, 'User'); // Add a recipient address
        //Content
        $mail->isHTML(true); // Set email format to HTML
        $mail->Subject = 'Verify Your Email';
        $mail->Body = 'Verification Code is - ' . $_SESSION['verification_code'];
        if ($mail->send()) {
            echo json_encode(array("success" => true, 'message' => 'mail has been sent'));
        } else {
            echo json_encode(array("success" => false, 'message' => 'mail cannot be sent'));
        }

    } catch (Exception $e) {
        echo json_encode(array("success" => false, 'message' => 'mail can not be send'));

        echo json_encode(array('message' => $mail->ErrorInfo));
    }

} else {
    // Return an error response for non-POST requests
    http_response_code(405);
    echo json_encode(array('error' => 'Invalid request method'));
}
?>