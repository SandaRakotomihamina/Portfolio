<?php
// Configuration de l'email
$receiving_email_address = 'rakotomihaminasandafitia@gmail.com'; // Votre email réel

header('Content-Type: application/json; charset=UTF-8');

// Vérifier si c'est une requête POST
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données du formulaire
    $name = trim(strip_tags($_POST['name'] ?? ''));
    $email = trim(strip_tags($_POST['email'] ?? ''));
    $subject = trim(strip_tags($_POST['subject'] ?? ''));
    $message = trim(strip_tags($_POST['message'] ?? ''));

    // Validation basique
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont requis.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Adresse email invalide.']);
        exit;
    }

    // Nettoyer le nom et le sujet pour éviter les injections d'en-têtes
    $name = str_replace(["\r", "\n"], [' ', ' '], $name);
    $subject = str_replace(["\r", "\n"], [' ', ' '], $subject);

    // Préparer l'email
    $to = $receiving_email_address;
    $email_subject = "Portfolio Contact: " . $subject;
    $email_body = "Nom: $name\n";
    $email_body .= "Email: $email\n\n";
    $email_body .= "Message:\n$message\n";

    $headers = [];
    $headers[] = 'From: "Portfolio Contact" <no-reply@gmail.com>';
    $headers[] = 'Reply-To: ' . $email;
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';

    $headers_string = implode("\r\n", $headers);

    // Envoyer l'email avec un expéditeur d'enveloppe explicite pour améliorer la délivrabilité
    $send_params = $email_subject; // Utiliser le sujet comme paramètre d'enveloppe pour éviter les problèmes de spam
    $mail_result = mail($to, $email_subject, $email_body, $headers_string, $send_params);

    if ($mail_result) {
        echo json_encode(['status' => 'success', 'message' => 'Votre message a été envoyé avec succès!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'envoi du message. Veuillez vérifier la configuration du serveur de messagerie.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée.']);
}
?>
