<?php
// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "parlons_pc";

// Créer une connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("La connexion à la base de données a échoué : " . $conn->connect_error);
}


// Autoriser toutes les origines (remplacez * par l'URL de votre application React en production)
header("Access-Control-Allow-Origin: *");




if ($_SERVER["REQUEST_METHOD"] === "GET") {
// Récupérer le nom du fichier à partir de la base de données en fonction de l'ID du ticket
if (isset($_GET["ticketID"])) {
$ticketID = $_GET["ticketID"];
$sql = "SELECT FilePath FROM Tickets WHERE TicketID = $ticketID";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
$row = $result->fetch_assoc();
$filePath = $row["FilePath"];

// Vérifier si le fichier existe
if (file_exists($filePath)) {
// Envoyer le fichier au navigateur
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
header('Content-Length: ' . filesize($filePath));
readfile($filePath);
exit;
} else {
echo "Le fichier n'existe pas.";
}
} else {
echo "Ticket non trouvé.";
}
} else {
echo "Paramètre 'ticketID' manquant.";
}
}

// Fermer la connexion à la base de données
$conn->close();
