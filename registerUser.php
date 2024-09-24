<?php
require 'db.php';

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
    $username = $data['username'];
    $password = password_hash($data['password'], PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
    $success = $stmt->execute([$email, $username, $password]);

    if ($success) {
        $user_id = $pdo->lastInsertId();
        echo json_encode(['success' => true, 'user_id' => $user_id]);
    } else {
        echo json_encode(['success' => false]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
