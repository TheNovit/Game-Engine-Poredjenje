<?php
// contact.php - Obrada kontakt forme sa modernim sanitizacijama

// Provera da li je forma poslata
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Prikupljanje i sanitizacija podataka
    $name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8') : '';
    
    // Validacija
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Ime je obavezno polje.';
    } elseif (strlen($name) > 100) {
        $errors[] = 'Ime ne sme biti duže od 100 karaktera.';
    }
    
    if (empty($email)) {
        $errors[] = 'Email je obavezno polje.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Unesite validnu email adresu.';
    }
    
    if (empty($message)) {
        $errors[] = 'Poruka je obavezna.';
    } elseif (strlen($message) > 2000) {
        $errors[] = 'Poruka ne sme biti duža od 2000 karaktera.';
    }
    
    // Ako nema grešaka, obradi formu
    if (empty($errors)) {
        require_once 'config/database.php';
        
        try {
            $stmt = $pdo->prepare("INSERT INTO contacts (name, email, message, created_at) 
                                 VALUES (:name, :email, :message, NOW())");
            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':message' => $message
            ]);
            
            // Email obaveštenje
            $to = 'vaš@email.com';
            $subject = 'Nova poruka sa Game Engine sajta';
            $emailHeaders = [
                'From' => 'noreply@gameenginecomparison.com',
                'Reply-To' => $email,
                'X-Mailer' => 'PHP/' . phpversion(),
                'Content-Type' => 'text/plain; charset=utf-8'
            ];
            
            mail($to, $subject, $message, $emailHeaders);
            
            header('Location: index.html?contact=success#contact');
            exit;
        } catch (PDOException $e) {
            error_log('Database error: ' . $e->getMessage());
            $errors[] = 'Došlo je do greške pri snimanju poruke. Pokušajte ponovo kasnije.';
        }
    }
    
    // Ako ima grešaka, vrati korisnika nazad
    session_start();
    $_SESSION['contact_errors'] = $errors;
    $_SESSION['contact_form'] = compact('name', 'email', 'message');
    
    header('Location: index.html?contact=error#contact');
    exit;
}

header('Location: index.html');
exit;
?>