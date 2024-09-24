<?php
require 'db.php';

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $first_name = $data['first_name'];
    $last_name = $data['last_name'];
    $phone_number = $data['phone_number'];
    $event_date = $data['event_date'];
    $pricing_plan = $data['pricing_plan'];
    $user_id = $data['user_id'];

    $stmt = $pdo->prepare("SELECT * FROM event_register WHERE event_date = ?");
    $stmt->execute([$event_date]);
    $eventExists = $stmt->fetch();

    if ($eventExists) {
        echo json_encode(['success' => false, 'message' => 'Already have a registered event on this date.']);
    } else {
        $stmt = $pdo->prepare("INSERT INTO event_register (user_id, first_name, last_name, phone_number, event_date, pricing_plan) VALUES (?, ?, ?, ?, ?, ?)");
        $success = $stmt->execute([$user_id, $first_name, $last_name, $phone_number, $event_date, $pricing_plan]);

        echo json_encode(['success' => $success]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
