<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT id, nombre FROM bodegas ORDER BY nombre ASC");
    $bodegas = $stmt->fetchAll();
    
    echo json_encode(["status" => "success", "data" => $bodegas]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al obtener las bodegas"]);
}
?>
