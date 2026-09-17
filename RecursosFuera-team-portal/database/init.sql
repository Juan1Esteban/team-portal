-- Habilitar extensión para generar UUIDs automáticamente
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- 1. TABLA DE USUARIOS
-- =========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('Administrador', 'Usuario')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 2. TABLA DE NOTAS (Lienzo Libre)
-- =========================================
-- Para un lienzo sin columnas, necesitamos guardar las coordenadas exactas de cada "post-it".
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Pendiente', 'En curso', 'Hecho')) NOT NULL,
    position_x INTEGER NOT NULL DEFAULT 0, -- Coordenada horizontal en el lienzo
    position_y INTEGER NOT NULL DEFAULT 0, -- Coordenada vertical en el lienzo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 3. DATOS DE DEMOSTRACIÓN (Inicialización)
-- =========================================
-- Cuentas demo exigidas por la prueba técnica
INSERT INTO users (name, email, password, role, is_active) VALUES 
('Admin Demo', 'admin@demo.com', 'admin', 'Administrador', true),
('User Demo', 'user@demo.com', 'user', 'Usuario', true);

-- Notas de prueba posicionadas estratégicamente en el lienzo
INSERT INTO notes (title, content, status, position_x, position_y) VALUES 
('Bienvenida al Tablero', '¡Hola! Puedes arrastrar libremente esta nota. Su posición X y Y se guardará automáticamente.', 'Hecho', 50, 50),
('Configurar AWS Lambda', 'Crear función Lambda para calcular totales y distribución por estado para el Dashboard.', 'Pendiente', 350, 100),
('Dockerizar la API', 'Crear el Dockerfile para Node.js y el docker-compose.yml para levantar todo el entorno local.', 'En curso', 150, 300);