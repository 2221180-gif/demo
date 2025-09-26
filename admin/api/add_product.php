<?php
header('Content-Type: application/json');
require 'db.php';

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['name'], $data['price'], $data['stock'], $data['image'])) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO products (name, price, stock, image) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['name'], $data['price'], $data['stock'], $data['image']]);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
