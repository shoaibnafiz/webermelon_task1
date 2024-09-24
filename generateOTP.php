<?php
require 'db.php';
require 'sendOTP.php';

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];

    $otp = rand(100000, 999999);
    $expiration_time = date('Y-m-d H:i:s', strtotime('+10 minutes'));

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $userExists = $stmt->fetch();

    $stmt = $pdo->prepare("INSERT INTO otp_store (email, otp, expiration_time) VALUES (?, ?, ?)");
    $stmt->execute([$email, $otp, $expiration_time]);

    if (sendOTPEmail($email, $otp)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send OTP email']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
