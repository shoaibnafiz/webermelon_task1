<?php
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$otp = $data['otp'];

$stmt = $pdo->prepare("SELECT * FROM otp_store WHERE email = ? AND otp = ?");
$stmt->execute([$email, $otp]);
$otpRecord = $stmt->fetch();

if ($otpRecord) {
    $stmt1 = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt1->execute([$email]);
    $user = $stmt1->fetch();

    if ($user) {
        $stmt2 = $pdo->prepare("SELECT * FROM event_register WHERE user_id = ?");
        $stmt2->execute([$user['id']]);
        $registeredUser = $stmt2->fetch();

        echo json_encode(['success' => true, 'isNewUser' => false, 'user_id' => $user['id'], 'userData' => $user, 'registeredUser' => $registeredUser]);
    } else {
        echo json_encode(['success' => true, 'isNewUser' => true]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid OTP']);
}
