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

// Définir l'en-tête HTTP pour autoriser les requêtes provenant de n'importe quelle origine (CORS).
header("Access-Control-Allow-Origin: *");

// Gérer les requêtes HTTP
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Créer un nouveau ticket
    if ($_POST["action"] === "createTicket") {
        $userID = $_POST["userID"];
        $title = $_POST["title"];
        $description = $_POST["description"];
        $priority = $_POST["priority"];
        $device = $_POST["device"]; // Récupérer le périphérique

        // Traitement du fichier joint
        $targetDirectory = "uploads/"; // Répertoire de destination
        $targetFile = $targetDirectory . basename($_FILES["file"]["name"]);

        if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
            // Le fichier a été téléchargé avec succès, vous pouvez enregistrer le chemin du fichier dans la base de données
            $filePath = $targetFile;
            $sql = "INSERT INTO Tickets (UserID, Title, Description, Status, FilePath, Priority, Device) VALUES ('$userID', '$title', '$description', 'Ouvert', '$filePath', '$priority', '$device')";

            if ($conn->query($sql) === TRUE) {
                echo "Le ticket a été créé avec succès.";
            } else {
                echo "Erreur lors de la création du ticket : " . $conn->error;
            }
        } else {
            echo "Erreur lors de l'envoi du fichier.";
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Récupérer la liste des tickets
    if ($_GET["action"] === "getTickets") {
        $sql = "SELECT * FROM Tickets";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $tickets = array();
            while ($row = $result->fetch_assoc()) {
                $tickets[] = $row;
            }
            echo json_encode($tickets);
        } else {
            echo "Aucun ticket n'a été trouvé.";
        }
    }
}

// Fermer la connexion à la base de données
$conn->close();
?>