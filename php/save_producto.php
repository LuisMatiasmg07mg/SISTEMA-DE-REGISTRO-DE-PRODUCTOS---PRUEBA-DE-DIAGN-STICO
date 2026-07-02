<?php
require_once 'db.php';

header('Content-Type: application/json');

// Recibir JSON del frontend
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Datos inválidos"]);
    exit;
}

// Validaciones en backend (defensa adicional)
$codigo = trim($data['codigo'] ?? '');
$nombre = trim($data['nombre'] ?? '');
$id_bodega = $data['bodega'] ?? '';
$id_sucursal = $data['sucursal'] ?? '';
$id_moneda = $data['moneda'] ?? '';
$precio = trim($data['precio'] ?? '');
$materiales = $data['materiales'] ?? [];
$descripcion = trim($data['descripcion'] ?? '');

$errores = [];

if (empty($codigo)) $errores[] = "El código del producto no puede estar en blanco.";
else if (!preg_match('/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,15}$/', $codigo)) $errores[] = "El código del producto debe contener letras y números, entre 5 y 15 caracteres.";

if (empty($nombre)) $errores[] = "El nombre del producto no puede estar en blanco.";
else if (strlen($nombre) < 2 || strlen($nombre) > 50) $errores[] = "El nombre del producto debe tener entre 2 y 50 caracteres.";

if (empty($id_bodega)) $errores[] = "Debe seleccionar una bodega.";
if (empty($id_sucursal)) $errores[] = "Debe seleccionar una sucursal para la bodega seleccionada.";
if (empty($id_moneda)) $errores[] = "Debe seleccionar una moneda para el producto.";

if (empty($precio)) $errores[] = "El precio del producto no puede estar en blanco.";
else if (!preg_match('/^\d+(\.\d{1,2})?$/', $precio) || $precio <= 0) $errores[] = "El precio del producto debe ser un número positivo con hasta dos decimales.";

if (empty($materiales) || count($materiales) < 2) $errores[] = "Debe seleccionar al menos dos materiales para el producto.";

if (empty($descripcion)) $errores[] = "La descripción del producto no puede estar en blanco.";
else if (strlen($descripcion) < 10 || strlen($descripcion) > 1000) $errores[] = "La descripción del producto debe tener entre 10 y 1000 caracteres.";

if (!empty($errores)) {
    echo json_encode(["status" => "error", "message" => "Errores de validación en el servidor", "errors" => $errores]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Insertar el producto
    $stmt = $pdo->prepare("INSERT INTO productos (codigo, nombre, id_bodega, id_sucursal, id_moneda, precio, descripcion) VALUES (:codigo, :nombre, :id_bodega, :id_sucursal, :id_moneda, :precio, :descripcion)");
    $stmt->execute([
        'codigo' => $codigo,
        'nombre' => $nombre,
        'id_bodega' => $id_bodega,
        'id_sucursal' => $id_sucursal,
        'id_moneda' => $id_moneda,
        'precio' => $precio,
        'descripcion' => $descripcion
    ]);
    
    $id_producto = $pdo->lastInsertId();

    // Insertar la relación con materiales
    $stmtMat = $pdo->prepare("INSERT INTO producto_material (id_producto, id_material) VALUES (:id_producto, :id_material)");
    foreach ($materiales as $id_mat) {
        $stmtMat->execute([
            'id_producto' => $id_producto,
            'id_material' => $id_mat
        ]);
    }

    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Producto guardado exitosamente"]);

} catch (PDOException $e) {
    $pdo->rollBack();
    // Verificar si es error de clave única (código repetido)
    if ($e->getCode() == 23505) { // Error de unique constraint en PostgreSQL
        echo json_encode(["status" => "error", "message" => "El código del producto ya está registrado."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al guardar el producto en la base de datos."]);
    }
}
?>
