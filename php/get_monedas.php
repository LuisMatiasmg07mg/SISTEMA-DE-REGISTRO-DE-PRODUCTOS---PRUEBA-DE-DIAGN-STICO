<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT id, simbolo, nombre FROM monedas ORDER BY nombre ASC");
    $monedas = $stmt->fetchAll();
    
    echo json_encode(["status" => "success", "data" => $monedas]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al obtener las monedas"]);
}
?>
