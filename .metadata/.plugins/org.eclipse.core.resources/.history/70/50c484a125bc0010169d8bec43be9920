-- ==========================================
-- Crear roles si no existen
-- ==========================================
INSERT INTO rol (nombre)
SELECT 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre = 'ADMIN');

INSERT INTO rol (nombre)
SELECT 'CLIENTE'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre = 'CLIENTE');


-- ==========================================
-- Crear usuario ADMIN si no existe
-- ==========================================
INSERT INTO usuario (contrasena, correo, nombre, telefono, rol_id)
SELECT 'admin123', 'admin@lafrance.com', 'Administrador', '999888777', r.id
FROM rol r
WHERE r.nombre = 'ADMIN'
AND NOT EXISTS (SELECT 1 FROM usuario WHERE correo = 'admin@lafrance.com');


-- ==========================================
-- Crear usuario CLIENTE Juan Pérez
-- ==========================================
INSERT INTO usuario (contrasena, correo, nombre, telefono, rol_id)
SELECT '123456', 'juan.perez@gmail.com', 'Juan Pérez', '999666777', r.id
FROM rol r
WHERE r.nombre = 'CLIENTE'
AND NOT EXISTS (SELECT 1 FROM usuario WHERE correo = 'juan.perez@gmail.com');


-- ==========================================
-- Crear usuario CLIENTE María López
-- ==========================================
INSERT INTO usuario (contrasena, correo, nombre, telefono, rol_id)
SELECT '654321', 'maria.lopez@gmail.com', 'María López', '999555777', r.id
FROM rol r
WHERE r.nombre = 'CLIENTE'
AND NOT EXISTS (SELECT 1 FROM usuario WHERE correo = 'maria.lopez@gmail.com');


-- =====================================
--  CATEGORÍAS
-- =====================================
INSERT INTO categoria (nombre) VALUES
  ('Entrées (Entradas)'),
  ('Plats principaux (Platos principales)'),
  ('Salades (Ensaladas)'),
  ('Accompagnements (Guarniciones)'),
  ('Desserts (Postres)'),
  ('Boissons (Bebidas)'),
  ('Apéritifs (Aperitivos)'),
  ('Digestifs (Digestivos)'),
  ('Boulangerie (Panadería)'),
  ('Pâtisserie (Pastelería)'),
  ('Spécialités régionales (Especialidades regionales)');
  
  -- 🪑 Mesas disponibles
INSERT INTO mesa (numero, capacidad, disponible) VALUES (1, 4, true);
INSERT INTO mesa (numero, capacidad, disponible) VALUES (2, 6, true);
INSERT INTO mesa (numero, capacidad, disponible) VALUES (3, 8, true);
INSERT INTO mesa (numero, capacidad, disponible) VALUES (4, 4, true);
INSERT INTO mesa (numero, capacidad, disponible) VALUES (5, 6, true);
INSERT INTO mesa (numero, capacidad, disponible) VALUES (6, 8, true);
INSERT INTO mesa (numero, capacidad, disponible) VALUES (7, 4, true);
INSERT INTO mesa (numero, capacidad, disponible) VALUES (8, 5, true);
INSERT INTO mesa (numero, capacidad, disponible) VALUES (9, 7, true);
INSERT INTO mesa (numero, capacidad, disponible) VALUES (10, 6, true);
