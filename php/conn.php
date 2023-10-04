<?php
$dbHost = 'localhost';
$dbUsername = 'root';
$dbPassword = '';
$dbName = 'parlons_pc';

// Connect to the database
$conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);
if ($conn === false) {
    die("ERROR: Could not connect. " . mysqli_connect_error());
}


// Autoriser toutes les origines (remplacez * par l'URL de votre application React en production)
header("Access-Control-Allow-Origin: *");



?>