<?php
$dbHost = 'localhost';
$dbUsername = 'root';
$dbPassword = '';
$dbName = 'parlonspc';

// Connect to the database
$conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);
if ($conn === false) {
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
?>