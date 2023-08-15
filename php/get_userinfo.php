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
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    require_once("conn.php");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
    $stmt->bind_param("s", $_SESSION["user_id"]);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(array("user_username" => $user['user_username']));
        exit;
    } else {
        echo json_encode(array("user_username" => null));
        exit;
    }
}

?>