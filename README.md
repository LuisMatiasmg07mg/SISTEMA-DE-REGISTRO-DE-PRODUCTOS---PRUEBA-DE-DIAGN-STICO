# Prueba de Diagnóstico para Desis - Sistema de Registro de Productos

Este proyecto es una **Prueba de Diagnóstico de Desarrollo** para **Desis**. Consiste en un sistema web completo para el registro, validación y almacenamiento de productos en una base de datos relacional. 

El desarrollo se realizó bajo la directiva estricta de no utilizar librerías de terceros ni frameworks (tanto en Frontend como en Backend), garantizando un código limpio, estructurado y de alto rendimiento.

---

## 🛠️ Tecnologías Utilizadas y Versiones

### Frontend
* **HTML5**: Estructura de maquetación semántica nativa sin atributos `required` para delegar el control de validación a JavaScript.
* **CSS3**: Diseño responsivo y estilado visual a medida (sin frameworks como Bootstrap o Tailwind CSS).
* **Vanilla JavaScript (ES6+)**: Gestión e interactividad del DOM, validaciones del lado del cliente y comunicación asíncrona mediante Fetch API.

### Backend
* **PHP Puro (Recomendado 8.x / Compatible 7.4+)**: Desarrollo en PHP limpio y modular estructurado para retornar respuestas en formato JSON.
* **PDO (PHP Data Objects)**: Capa de abstracción de datos utilizada para realizar consultas preparadas seguras y evitar inyecciones SQL.

### Base de Datos
* **PostgreSQL (Recomendado 12 o superior)**: Motor de base de datos relacional utilizado para almacenar las tablas y relaciones.

---

## 🚀 Características Clave

1. **Validación en Doble Capa**:
   * **Frontend (JS)**: Comprobación estricta de formatos, longitudes, obligatoriedad y selección mínima (ej. al menos 2 materiales) con alertas personalizadas.
   * **Backend (PHP)**: Re-validación completa en el servidor antes de proceder a la inserción en base de datos.
2. **Cargado Dinámico y Relacional**:
   * Las Bodegas, Monedas y Materiales se cargan automáticamente desde PostgreSQL.
   * El selector de **Sucursal** se habilita dinámicamente y se filtra en tiempo real basándose en la **Bodega** elegida por el usuario.
3. **Unicidad de Código**:
   * Verificación asíncrona previa en la base de datos para confirmar que el código del producto no esté repetido antes de intentar guardar el formulario.

---

## 🔧 Instalación y Configuración

Para conocer los requisitos previos específicos del sistema, la importación del script SQL (`sql/database.sql`) y la configuración de las credenciales de conexión, por favor consulta el archivo de documentación detallada:

👉 **[LEEME.txt](LEEME.txt)**