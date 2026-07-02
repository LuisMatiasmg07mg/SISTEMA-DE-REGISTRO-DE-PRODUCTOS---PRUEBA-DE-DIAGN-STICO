<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT id, nombre FROM materiales ORDER BY nombre ASC");
    $materiales = $stmt->fetchAll();
    
    echo json_encode(["status" => "success", "data" => $materiales]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al obtener los materiales"]);
}
?>
