<?php
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_GET['codigo'])) {
    echo json_encode(["status" => "error", "message" => "Código no proporcionado"]);
    exit;
}

$codigo = trim($_GET['codigo']);

try {
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM productos WHERE codigo = :codigo");
    $stmt->execute(['codigo' => $codigo]);
    $row = $stmt->fetch();
    
    $existe = ($row['total'] > 0);
    
    echo json_encode(["status" => "success", "existe" => $existe]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al verificar el código"]);
}
?>
