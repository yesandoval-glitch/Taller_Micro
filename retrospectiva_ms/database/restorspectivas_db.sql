-- Crear base de datos
CREATE DATABASE IF NOT EXISTS registro_retro_db;
USE registro_retro_db;

-- Tabla de Sprints
CREATE TABLE sprints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla única para items de retrospectiva (acciones, logros, impedimentos, etc.)
CREATE TABLE retro_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sprint_id INT NOT NULL,
    categoria ENUM('accion', 'logro', 'impedimento', 'comentario', 'otro') NOT NULL,
    descripcion TEXT NOT NULL,
    cumplida BOOLEAN DEFAULT NULL, -- sólo aplica para acciones; NULL para los demás
    fecha_revision DATE DEFAULT NULL, -- fecha para revisar cumplimiento o seguimiento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE CASCADE
);