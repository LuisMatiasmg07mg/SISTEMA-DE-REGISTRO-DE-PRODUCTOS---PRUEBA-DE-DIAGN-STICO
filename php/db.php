<?php
// Configuración de la base de datos PostgreSQL
$host = 'localhost';
$dbname = 'productos_db'; // Cambiar por el nombre de tu base de datos
$username = 'postgres'; // Cambiar por tu usuario
$password = 'postgres'; // Cambiar por tu contraseña
$port = '5432';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $username, $password);
    
    // Configurar PDO para que lance excepciones en caso de error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Configurar el fetch mode por defecto a asociativo
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // Para producción, no deberías mostrar detalles exactos del error.
    die(json_encode(["error" => "Error de conexión a la base de datos: " . $e->getMessage()]));
}
?>
