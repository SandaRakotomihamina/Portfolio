<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupération et nettoyage des données
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $subject = trim($_POST['subject']);
    $message = trim($_POST['message']);
    
    // Validation des champs
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo 'Tous les champs sont requis.';
        exit;
    }
    
    // Validation de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'Adresse email invalide.';
        exit;
    }
    
    // Configuration de l'email
    $to = 'rakotomihaminasandafitia@gmail.com';
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Corps de l'email
    $body = "Nom: $name\nEmail: $email\nSujet: $subject\n\nMessage:\n$message";
    
    // Envoi de l'email
    if (mail($to, $subject, $body, $headers)) {
        echo 'OK';
    } else {
        echo 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
    }
} else {
    echo 'Méthode non autorisée.';
}
?>