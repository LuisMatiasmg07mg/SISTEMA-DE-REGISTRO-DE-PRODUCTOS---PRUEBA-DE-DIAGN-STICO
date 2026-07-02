<?php
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_GET['id_bodega'])) {
    echo json_encode(["status" => "error", "message" => "ID de bodega no proporcionado"]);
    exit;
}

$id_bodega = $_GET['id_bodega'];

try {
    $stmt = $pdo->prepare("SELECT id, nombre FROM sucursales WHERE id_bodega = :id_bodega ORDER BY nombre ASC");
    $stmt->execute(['id_bodega' => $id_bodega]);
    $sucursales = $stmt->fetchAll();
    
    echo json_encode(["status" => "success", "data" => $sucursales]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al obtener las sucursales"]);
}
?>
