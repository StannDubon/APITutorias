-- Insertar datos en tbNivelesUsuarios
INSERT INTO tbNivelesUsuarios (nivel) VALUES 
('admin'),
('profesor'),
('alumno');
GO

-- Insertar datos en tbUsuarios (usando hash BCrypt para "123")
INSERT INTO tbUsuarios (id_nivel, carnet, clave, nombre, apellido, correo) VALUES
(1, 'ADM001', '$2b$10$VIRupsmO0oxU3JNRKWcA2uI.5LZwaRo.goFjxRbZezXNTYZzIPKma', 'Carlos', 'Administrador', 'carlos.admin@udb.edu.sv'),
(2, 'TUT001', '$2b$10$VIRupsmO0oxU3JNRKWcA2uI.5LZwaRo.goFjxRbZezXNTYZzIPKma', 'Ana', 'Tutora', 'ana.tutor@udb.edu.sv'),
(2, 'TUT002', '$2b$10$VIRupsmO0oxU3JNRKWcA2uI.5LZwaRo.goFjxRbZezXNTYZzIPKma', 'Luis', 'Pérez', 'luis.tutor@udb.edu.sv'),
(3, 'EST001', '$2b$10$VIRupsmO0oxU3JNRKWcA2uI.5LZwaRo.goFjxRbZezXNTYZzIPKma', 'María', 'Estudiante', 'maria.est@udb.edu.sv'),
(3, 'EST002', '$2b$10$VIRupsmO0oxU3JNRKWcA2uI.5LZwaRo.goFjxRbZezXNTYZzIPKma', 'José', 'Gómez', 'jose.est@udb.edu.sv'),
(3, 'EST003', '$2b$10$VIRupsmO0oxU3JNRKWcA2uI.5LZwaRo.goFjxRbZezXNTYZzIPKma', 'Sofia', 'Rodríguez', 'sofia.est@udb.edu.sv');
GO

-- Insertar datos en tbTiposTutoria
INSERT INTO tbTiposTutoria (tipo_tutoria) VALUES 
('Ciencias Básicas'),
('Ingenierías'),
('Idiomas'),
('Matemáticas'),
('Programación');
GO

-- Insertar datos en tbTiposCarrera
INSERT INTO tbTiposCarrera (tipo_carrera) VALUES 
('Ingeniería'),
('Licenciatura'),
('Técnico'),
('Maestría');
GO

-- Insertar datos en tbCarreras
INSERT INTO tbCarreras (id_tipo_carrera, nombre_carrera) VALUES
(1, 'Ing. en Sistemas'),
(1, 'Ing. Civil'),
(1, 'Ing. Industrial'),
(2, 'Lic. en Administración'),
(2, 'Lic. en Contaduría'),
(3, 'Téc. en Redes');
GO

-- Insertar datos en tbMaterias
INSERT INTO tbMaterias (nombre_materia) VALUES
('Matemática I'),
('Física I'),
('Programación I'),
('Base de Datos'),
('Inglés I'),
('Cálculo Diferencial'),
('Estadística'),
('Química General'),
('Algoritmos'),
('Redes de Computadoras');
GO

-- Insertar datos en tbMateriasCarrera
INSERT INTO tbMateriasCarrera (id_materia, id_carrera) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (9, 1), (10, 1),  -- Ing. en Sistemas
(1, 2), (2, 2), (6, 2), (7, 2),                    -- Ing. Civil
(1, 3), (6, 3), (7, 3),                            -- Ing. Industrial
(1, 4), (7, 4), (5, 4),                            -- Lic. en Administración
(1, 5), (7, 5),                                    -- Lic. en Contaduría
(3, 6), (10, 6);                                   -- Téc. en Redes
GO

-- Insertar datos en tbHorarios
INSERT INTO tbHorarios (hora_inicio, hora_final) VALUES
('07:00:00', '08:30:00'),
('08:30:00', '10:00:00'),
('10:00:00', '11:30:00'),
('13:00:00', '14:30:00'),
('14:30:00', '16:00:00'),
('16:00:00', '17:30:00'),
('17:30:00', '19:00:00');
GO

-- Insertar datos en tbDiaSemanas
INSERT INTO tbDiaSemanas (dia_semana) VALUES
('Lunes'),
('Martes'),
('Miércoles'),
('Jueves'),
('Viernes'),
('Sábado');
GO

-- Insertar datos en tbHorarioDiaSemanas
INSERT INTO tbHorarioDiaSemanas (id_horario, id_dia, fecha_inicio_validez, fecha_fin_validez) VALUES
(1, 1, '2024-01-01', '2024-12-31'), -- Lunes 7:00-8:30
(2, 1, '2024-01-01', '2024-12-31'), -- Lunes 8:30-10:00
(3, 1, '2024-01-01', '2024-12-31'), -- Lunes 10:00-11:30
(1, 2, '2024-01-01', '2024-12-31'), -- Martes 7:00-8:30
(2, 2, '2024-01-01', '2024-12-31'), -- Martes 8:30-10:00
(4, 3, '2024-01-01', '2024-12-31'), -- Miércoles 13:00-14:30
(5, 3, '2024-01-01', '2024-12-31'), -- Miércoles 14:30-16:00
(6, 4, '2024-01-01', '2024-12-31'), -- Jueves 16:00-17:30
(7, 4, '2024-01-01', '2024-12-31'), -- Jueves 17:30-19:00
(4, 5, '2024-01-01', '2024-12-31'), -- Viernes 13:00-14:30
(5, 5, '2024-01-01', '2024-12-31'), -- Viernes 14:30-16:00
(1, 6, '2024-01-01', '2024-12-31'); -- Sábado 7:00-8:30
GO

-- Insertar datos en tbTutorias
INSERT INTO tbTutorias (id_materia_carrera, id_tutor, id_tipo_tutoria, id_horario_dia_semana, aula_tutoria) VALUES
(1, 2, 4, 1, 'A-101'),  -- Matemática I - Ana - Lunes 7:00-8:30
(3, 2, 5, 2, 'A-102'),  -- Programación I - Ana - Lunes 8:30-10:00
(2, 3, 1, 4, 'B-201'),  -- Física I - Luis - Martes 7:00-8:30
(4, 3, 5, 5, 'LAB-1'),  -- Base de Datos - Luis - Martes 8:30-10:00
(5, 2, 3, 6, 'C-301'),  -- Inglés I - Ana - Miércoles 13:00-14:30
(9, 3, 5, 7, 'LAB-2');  -- Algoritmos - Luis - Miércoles 14:30-16:00
GO

-- Insertar datos en tbAsistencias
INSERT INTO tbAsistencias (id_usuario, id_tutoria, rendimiento_aprendizaje, rendimiento_dedicacion, fecha_asistencia) VALUES
(4, 1, 85, 90, '2024-01-15 07:30:00'),
(5, 1, 78, 85, '2024-01-15 07:45:00'),
(6, 1, 92, 88, '2024-01-15 07:20:00'),
(4, 2, 88, 92, '2024-01-15 09:00:00'),
(5, 3, 75, 80, '2024-01-16 07:45:00'),
(6, 4, 90, 85, '2024-01-16 09:15:00'),
(4, 5, 82, 78, '2024-01-17 13:30:00'),
(5, 6, 95, 90, '2024-01-17 15:00:00');
GO