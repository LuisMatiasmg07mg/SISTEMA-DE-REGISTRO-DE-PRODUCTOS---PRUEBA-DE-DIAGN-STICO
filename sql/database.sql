-- Script de Creación de Base de Datos para PostgreSQL

-- 1. Crear tablas

CREATE TABLE bodegas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE sucursales (
    id SERIAL PRIMARY KEY,
    id_bodega INTEGER REFERENCES bodegas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE monedas (
    id SERIAL PRIMARY KEY,
    simbolo VARCHAR(10) NOT NULL,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE materiales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(15) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    id_bodega INTEGER REFERENCES bodegas(id),
    id_sucursal INTEGER REFERENCES sucursales(id),
    id_moneda INTEGER REFERENCES monedas(id),
    precio NUMERIC(10, 2) NOT NULL,
    descripcion TEXT NOT NULL
);

CREATE TABLE producto_material (
    id_producto INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    id_material INTEGER REFERENCES materiales(id) ON DELETE CASCADE,
    PRIMARY KEY (id_producto, id_material)
);


-- 2. Insertar datos de prueba (seeds)

-- Bodegas
INSERT INTO bodegas (nombre) VALUES 
('Bodega Central'),
('Bodega Norte'),
('Bodega Sur');

-- Sucursales
-- Para Bodega Central (id: 1)
INSERT INTO sucursales (id_bodega, nombre) VALUES 
(1, 'Sucursal Centro 1'),
(1, 'Sucursal Centro 2');

-- Para Bodega Norte (id: 2)
INSERT INTO sucursales (id_bodega, nombre) VALUES 
(2, 'Sucursal Norte A'),
(2, 'Sucursal Norte B');

-- Para Bodega Sur (id: 3)
INSERT INTO sucursales (id_bodega, nombre) VALUES 
(3, 'Sucursal Sur Principal');

-- Monedas
INSERT INTO monedas (simbolo, nombre) VALUES 
('$', 'Peso Chileno'),
('USD', 'Dólar Estadounidense'),
('€', 'Euro');

-- Materiales
INSERT INTO materiales (nombre) VALUES 
('Plástico'),
('Metal'),
('Madera'),
('Vidrio'),
('Textil');
