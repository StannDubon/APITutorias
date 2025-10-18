USE master;
GO

DROP DATABASE IF EXISTS tutoriasUDB;
GO

CREATE DATABASE tutoriasUDB;
GO

CREATE LOGIN adminTutoria 
WITH PASSWORD = 'apiTutorias',
CHECK_POLICY = OFF; 

USE tutoriasUDB;
GO

CREATE USER adminTutoria FOR LOGIN adminTutoria;

ALTER ROLE db_datareader ADD MEMBER adminTutoria;
ALTER ROLE db_datawriter ADD MEMBER adminTutoria;

GRANT EXECUTE TO adminTutoria;
GO

-- Tabla Niveles Usuario --
CREATE TABLE tbNivelesUsuarios (
    id_nivel INT IDENTITY (1,1) NOT NULL,
    nivel NVARCHAR(50) NOT NULL

    CONSTRAINT PK_niveles_usuario PRIMARY KEY(id_nivel),
    CONSTRAINT UQ_nivel_usuario UNIQUE (nivel)
);
GO

-- Tabla de Usuarios --
CREATE TABLE tbUsuarios (
    id_usuario INT IDENTITY (1,1) NOT NULL,
    id_nivel INT NOT NULL,
    carnet NVARCHAR(15) NOT NULL,
	estado BIT DEFAULT (1),
    clave NVARCHAR(MAX) NOT NULL,
    nombre NVARCHAR(50) NOT NULL,
    apellido NVARCHAR(50) NOT NULL,
    correo NVARCHAR(75) NOT NULL,
    intentos_login TINYINT DEFAULT 0 NOT NULL,
    fecha_bloqueo DATETIME,

    CONSTRAINT PK_usuario PRIMARY KEY(id_usuario),
    CONSTRAINT FK_niveles_usuario FOREIGN KEY (id_nivel) REFERENCES tbNivelesUsuarios(id_nivel),
    CONSTRAINT UQ_carnet UNIQUE (carnet),
    CONSTRAINT UQ_correo UNIQUE (correo),
    CONSTRAINT CHK_correo_valido CHECK (correo LIKE '%_@__%.__%')
);
GO

-- Tabla de Tipos de Tutorías --
CREATE TABLE tbTiposTutoria (
    id_tipo_tutoria INT IDENTITY (1,1) NOT NULL,
    tipo_tutoria NVARCHAR(25) NOT NULL, -- Ciencias Básicas e Ingenierías
    
    CONSTRAINT PK_tipo_tutoria PRIMARY KEY (id_tipo_tutoria),
    CONSTRAINT UQ_tipo_tutoria UNIQUE (tipo_tutoria)
);
GO

-- Tabla de Tipo Carrera -- 
CREATE TABLE tbTiposCarrera (
    id_tipo_carrera INT IDENTITY (1,1) NOT NULL,
    tipo_carrera NVARCHAR(30) NOT NULL,
    
    CONSTRAINT PK_tipo_carrera PRIMARY KEY (id_tipo_carrera),
    CONSTRAINT UQ_tipo_carrera UNIQUE (tipo_carrera)
);
GO

-- Tabla de Carreras --
CREATE TABLE tbCarreras (
    id_carrera INT IDENTITY (1,1) NOT NULL,
    id_tipo_carrera INT NOT NULL,
    nombre_carrera NVARCHAR(25) NOT NULL,
    
    CONSTRAINT PK_carrera PRIMARY KEY (id_carrera),
    CONSTRAINT UQ_nombre_carrera UNIQUE (nombre_carrera),
    CONSTRAINT FK_tipo_carrera FOREIGN KEY (id_tipo_carrera) REFERENCES tbTiposCarrera(id_tipo_carrera)
);
GO

-- Tabla de Materias --
CREATE TABLE tbMaterias (
    id_materia INT IDENTITY (1,1) NOT NULL,
    nombre_materia NVARCHAR(30) NOT NULL,
    
    CONSTRAINT PK_materia PRIMARY KEY (id_materia)
);
GO

-- Tabla de Materias por Carrera --
CREATE TABLE tbMateriasCarrera (
    id_materia_carrera INT IDENTITY (1,1) NOT NULL,
    id_materia INT NOT NULL,
    id_carrera INT NOT NULL,
    
    CONSTRAINT PK_materia_carrera PRIMARY KEY(id_materia_carrera),
    CONSTRAINT FK_materia_carrera_materia FOREIGN KEY (id_materia) REFERENCES tbMaterias(id_materia),
    CONSTRAINT FK_materia_carrera_carrera FOREIGN KEY (id_carrera) REFERENCES tbCarreras(id_carrera),
    CONSTRAINT UQ_materia_carrera UNIQUE (id_materia, id_carrera)
);
GO

-- Tabla de Horarios --
CREATE TABLE tbHorarios (
    id_horario INT IDENTITY (1,1) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL,
    
    CONSTRAINT PK_horario PRIMARY KEY (id_horario),
    CONSTRAINT CHK_horario_valido CHECK (hora_final > hora_inicio)
);
GO

-- Tabla de Horarios --
CREATE TABLE tbDiaSemanas (
    id_dia_semana INT IDENTITY (1,1) NOT NULL,
    dia_semana VARCHAR(10) NOT NULL,
    
    CONSTRAINT PK_dias_semana PRIMARY KEY (id_dia_semana),
    CONSTRAINT UQ_dia_semana UNIQUE (dia_semana)
);
GO

-- Tabla de Horarios por Día de Semana --
CREATE TABLE tbHorarioDiaSemanas (
    id_horario_dia_semana INT IDENTITY (1,1) NOT NULL,
    id_horario INT NOT NULL,
    id_dia INT NOT NULL,
    activo BIT DEFAULT 1 NOT NULL,
    fecha_inicio_validez DATETIME,
    fecha_fin_validez DATETIME,
    
    CONSTRAINT PK_horario_dia_semana PRIMARY KEY (id_horario_dia_semana),
    CONSTRAINT FK_horario_dia_semana_horario FOREIGN KEY (id_horario) REFERENCES tbHorarios(id_horario),
    CONSTRAINT FK_horario_dia_semana_dia FOREIGN KEY (id_dia) REFERENCES tbDiaSemanas(id_dia_semana)
);
GO

-- Tabla de Tutorías --
CREATE TABLE tbTutorias (
    id_tutoria INT IDENTITY (1,1) NOT NULL,
    id_materia_carrera INT NOT NULL,
    id_tutor INT NOT NULL,
    id_tipo_tutoria INT NOT NULL,
    id_horario_dia_semana INT NOT NULL,
    activo BIT DEFAULT 1 NOT NULL,
    aula_tutoria NVARCHAR(10) NOT NULL,
    
    CONSTRAINT PK_tutoria PRIMARY KEY (id_tutoria),
    CONSTRAINT FK_tutoria_usuario FOREIGN KEY (id_tutor) REFERENCES tbUsuarios(id_usuario),
    CONSTRAINT FK_tutoria_tipo_tutoria FOREIGN KEY (id_tipo_tutoria) REFERENCES tbTiposTutoria(id_tipo_tutoria),
    CONSTRAINT FK_tutoria_materiaCarrera FOREIGN KEY (id_materia_carrera) REFERENCES tbMateriasCarrera(id_materia_carrera),
    CONSTRAINT FK_tutoria_horario_dia_semana FOREIGN KEY (id_horario_dia_semana) REFERENCES tbHorarioDiaSemanas(id_horario_dia_semana)
);
GO

-- Tabla de Asistencia --
CREATE TABLE tbAsistencias(
    id_asistencia INT IDENTITY (1,1) NOT NULL,
    id_usuario INT NOT NULL,
    id_tutoria INT NOT NULL,
    rendimiento_aprendizaje TINYINT NOT NULL,
    rendimiento_dedicacion TINYINT NOT NULL,
    fecha_asistencia DATETIME NOT NULL,
    
    CONSTRAINT PK_asistencia PRIMARY KEY (id_asistencia),
    CONSTRAINT FK_asistencia_usuario FOREIGN KEY (id_usuario) REFERENCES tbUsuarios(id_usuario),
    CONSTRAINT FK_asistencia_tutoria FOREIGN KEY (id_tutoria) REFERENCES tbTutorias(id_tutoria),
    CONSTRAINT CHK_Aprendizaje CHECK (rendimiento_aprendizaje BETWEEN 0 AND 100),
    CONSTRAINT CHK_dedicacion CHECK (rendimiento_dedicacion BETWEEN 0 AND 100)
);
GO  

CREATE TABLE tbRefreshTokens (
    id_refresh_token INT IDENTITY(1,1) NOT NULL,
    id_usuario INT NOT NULL,
    token NVARCHAR(MAX) NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_expiracion DATETIME NOT NULL,
    revocado BIT DEFAULT 0,
    activo BIT DEFAULT 1,
    fecha_revocacion DATETIME,
    
    CONSTRAINT PK_refresh_token PRIMARY KEY (id_refresh_token),
    CONSTRAINT FK_refresh_token_usuario FOREIGN KEY (id_usuario) 
        REFERENCES tbUsuarios(id_usuario)
);
GO

-- Procedimientos Almacenados --
CREATE OR ALTER PROCEDURE procd_AgregarMateriaACarrera
    @id_carrera INT,
    @id_materia INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Verificar si la carrera existe
        IF NOT EXISTS (SELECT 1 FROM tbCarreras WHERE id_carrera = @id_carrera)
        BEGIN
            SELECT 0 AS Resultado, 'La carrera no existe' AS Mensaje;
            RETURN;
        END
        
        -- Verificar si la materia existe
        IF NOT EXISTS (SELECT 1 FROM tbMaterias WHERE id_materia = @id_materia)
        BEGIN
            SELECT 0 AS Resultado, 'La materia no existe' AS Mensaje;
            RETURN;
        END
        
        -- Verificar si ya existe la relación
        IF EXISTS (SELECT 1 FROM tbMateriasCarrera 
                  WHERE id_carrera = @id_carrera AND id_materia = @id_materia)
        BEGIN
            SELECT 0 AS Resultado, 'La materia ya está asignada a esta carrera' AS Mensaje;
            RETURN;
        END
        
        -- Insertar la relación
        INSERT INTO tbMateriasCarrera (id_materia, id_carrera)
        VALUES (@id_materia, @id_carrera);
        
        SELECT 1 AS Resultado, 
               'Materia agregada correctamente a la carrera' AS Mensaje,
               SCOPE_IDENTITY() AS id_materia_carrera;
               
    END TRY
    BEGIN CATCH
        SELECT 0 AS Resultado, 
               ERROR_MESSAGE() AS Mensaje,
               NULL AS id_materia_carrera;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE procd_EliminarMateriaDeCarrera
    @id_carrera INT,
    @id_materia INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Verificar si existe la relación
        IF NOT EXISTS (SELECT 1 FROM tbMateriasCarrera 
                      WHERE id_carrera = @id_carrera AND id_materia = @id_materia)
        BEGIN
            SELECT 0 AS Resultado, 'La materia no está asignada a esta carrera' AS Mensaje;
            RETURN;
        END
        
        BEGIN TRANSACTION;
        
        -- Obtener el id_materia_carrera para usar en las eliminaciones
        DECLARE @id_materia_carrera INT;
        SELECT @id_materia_carrera = id_materia_carrera 
        FROM tbMateriasCarrera 
        WHERE id_carrera = @id_carrera AND id_materia = @id_materia;
        
        -- 1. Primero eliminar las asistencias relacionadas con las tutorías de esta materia-carrera
        DELETE a 
        FROM tbAsistencias a
        INNER JOIN tbTutorias t ON a.id_tutoria = t.id_tutoria
        WHERE t.id_materia_carrera = @id_materia_carrera;
        
        -- 2. Luego eliminar las tutorías que dependen de esta relación materia-carrera
        DELETE FROM tbTutorias 
        WHERE id_materia_carrera = @id_materia_carrera;
        
        -- 3. Finalmente eliminar la relación materia-carrera
        DELETE FROM tbMateriasCarrera 
        WHERE id_carrera = @id_carrera AND id_materia = @id_materia;
        
        COMMIT TRANSACTION;
        
        SELECT 1 AS Resultado, 
               'Materia eliminada correctamente de la carrera (incluyendo tutorías y asistencias relacionadas)' AS Mensaje;
               
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SELECT 0 AS Resultado, 
               ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE procd_CrearAsistencia
    @id_usuario INT,
    @id_tutoria INT,
    @rendimiento_aprendizaje TINYINT,
    @rendimiento_dedicacion TINYINT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Validar que el usuario existe
        IF NOT EXISTS (SELECT 1 FROM tbUsuarios WHERE id_usuario = @id_usuario AND estado = 1)
        BEGIN
            SELECT 0 AS Resultado, 'El usuario no existe o está inactivo' AS Mensaje;
            RETURN;
        END
        
        -- Validar que la tutoría existe y está activa
        IF NOT EXISTS (SELECT 1 FROM tbTutorias WHERE id_tutoria = @id_tutoria AND activo = 1)
        BEGIN
            SELECT 0 AS Resultado, 'La tutoría no existe o está inactiva' AS Mensaje;
            RETURN;
        END
        
        -- Validar rangos de rendimiento (0-100)
        IF @rendimiento_aprendizaje < 0 OR @rendimiento_aprendizaje > 100
        BEGIN
            SELECT 0 AS Resultado, 'El rendimiento de aprendizaje debe estar entre 0 y 100' AS Mensaje;
            RETURN;
        END
        
        IF @rendimiento_dedicacion < 0 OR @rendimiento_dedicacion > 100
        BEGIN
            SELECT 0 AS Resultado, 'El rendimiento de dedicación debe estar entre 0 y 100' AS Mensaje;
            RETURN;
        END
        
        -- Verificar si ya existe una asistencia para este usuario en esta tutoría hoy
        IF EXISTS (SELECT 1 FROM tbAsistencias 
                  WHERE id_usuario = @id_usuario 
                  AND id_tutoria = @id_tutoria
                  AND CONVERT(DATE, fecha_asistencia) = CONVERT(DATE, GETDATE()))
        BEGIN
            SELECT 0 AS Resultado, 'Ya existe una asistencia registrada para este usuario en esta tutoría hoy' AS Mensaje;
            RETURN;
        END
        
        -- Insertar la asistencia con fecha actual
        INSERT INTO tbAsistencias (
            id_usuario,
            id_tutoria,
            rendimiento_aprendizaje,
            rendimiento_dedicacion,
            fecha_asistencia
        )
        VALUES (
            @id_usuario,
            @id_tutoria,
            @rendimiento_aprendizaje,
            @rendimiento_dedicacion,
            GETDATE()
        );
        
        SELECT 1 AS Resultado, 
               'Asistencia registrada correctamente' AS Mensaje,
               SCOPE_IDENTITY() AS id_asistencia,
               GETDATE() AS fecha_registro;
               
    END TRY
    BEGIN CATCH
        SELECT 0 AS Resultado, 
               ERROR_MESSAGE() AS Mensaje,
               NULL AS id_asistencia,
               NULL AS fecha_registro;
    END CATCH
END;
GO

-- VISTAS --

CREATE OR ALTER VIEW vw_MateriasConCarrera
AS
SELECT 
    MIN(mc.id_materia_carrera) AS id_materia_carrera,
    m.nombre_materia
FROM tbMaterias m
INNER JOIN tbMateriasCarrera mc 
    ON m.id_materia = mc.id_materia
GROUP BY 
    m.nombre_materia;
GO

CREATE OR ALTER VIEW vw_UsuariosBasicos
AS
SELECT 
    u.id_usuario,
    u.carnet + ' - ' + u.nombre + ' ' + u.apellido AS usuario_completo
FROM tbUsuarios u;
GO

CREATE OR ALTER VIEW vw_HorariosCompletos
AS
SELECT 
    hds.id_horario_dia_semana,
    -- Concatenación en formato "DíaSemana HorarioFormateadoConAmPm"
    ds.dia_semana + ' ' + 
    CONVERT(VARCHAR(8), h.hora_inicio, 108) + ' - ' + 
    CONVERT(VARCHAR(8), h.hora_final, 108) AS horario_dia_completo
FROM tbHorarioDiaSemanas hds
    INNER JOIN tbHorarios h ON hds.id_horario = h.id_horario
    INNER JOIN tbDiaSemanas ds ON hds.id_dia = ds.id_dia_semana;
GO

-- Otras vistas

CREATE VIEW vw_MateriasConIndicadorCarrera
AS
SELECT 
    m.id_materia,
    m.nombre_materia,
    c.id_carrera,
    c.nombre_carrera,
    CASE 
        WHEN mc.id_materia_carrera IS NOT NULL THEN 1 
        ELSE 0 
    END AS pertenece_a_carrera
FROM tbMaterias m
    CROSS JOIN tbCarreras c
    LEFT JOIN tbMateriasCarrera mc ON m.id_materia = mc.id_materia 
                                   AND c.id_carrera = mc.id_carrera;
GO

CREATE VIEW vw_AsistenciasUsuarioTutorias
AS
SELECT 
    -- Datos de la asistencia
    a.id_asistencia,
    a.id_usuario,
    a.rendimiento_aprendizaje,
    a.rendimiento_dedicacion,
    a.fecha_asistencia,
    
    -- Datos de la tutoría
    t.id_tutoria,
    t.activo AS tutoria_activa,
    t.aula_tutoria,
    
    -- Datos del tutor
    tutor.id_usuario AS id_tutor,
    tutor.nombre AS nombre_tutor,
    tutor.apellido AS apellido_tutor,
    tutor.carnet AS carnet_tutor,
    tutor.correo AS correo_tutor,
    
    -- Datos del tipo de tutoría
    tt.id_tipo_tutoria,
    tt.tipo_tutoria,
    
    -- Datos de la materia
    m.id_materia,
    m.nombre_materia,
    
    -- Datos de la carrera
    c.id_carrera,
    c.nombre_carrera,
    
    -- Datos del horario
    h.id_horario,
    h.hora_inicio,
    h.hora_final,
    
    -- Datos del día de la semana
    ds.id_dia_semana,
    ds.dia_semana,
    
    -- Datos del horario-día
    hds.id_horario_dia_semana,
    hds.activo AS horario_activo
    
FROM tbAsistencias a
    INNER JOIN tbTutorias t ON a.id_tutoria = t.id_tutoria
    INNER JOIN tbUsuarios tutor ON t.id_tutor = tutor.id_usuario
    INNER JOIN tbTiposTutoria tt ON t.id_tipo_tutoria = tt.id_tipo_tutoria
    INNER JOIN tbMateriasCarrera mc ON t.id_materia_carrera = mc.id_materia_carrera
    INNER JOIN tbMaterias m ON mc.id_materia = m.id_materia
    INNER JOIN tbCarreras c ON mc.id_carrera = c.id_carrera
    INNER JOIN tbHorarioDiaSemanas hds ON t.id_horario_dia_semana = hds.id_horario_dia_semana
    INNER JOIN tbHorarios h ON hds.id_horario = h.id_horario
    INNER JOIN tbDiaSemanas ds ON hds.id_dia = ds.id_dia_semana;
GO

CREATE OR ALTER VIEW vwTutoriasCompletas AS
SELECT 
    t.id_tutoria,
    t.id_tutor,  -- Agregado el ID del tutor
    CONCAT(
        m.nombre_materia, 
        ' - ', 
        ds.dia_semana, 
        ' ', 
        FORMAT(CAST(h.hora_inicio AS TIME), N'hh\:mm') , 
        ' a ', 
        FORMAT(CAST(h.hora_final AS TIME), N'hh\:mm')
    ) AS descripcion_tutoria,
    m.nombre_materia AS materia_tutoria,
    ds.dia_semana AS dia_tutoria,
    FORMAT(CAST(h.hora_inicio AS TIME), N'hh\:mm') AS hora_inicio_formateada,
    FORMAT(CAST(h.hora_final AS TIME), N'hh\:mm') AS hora_final_formateada,
    CONCAT(FORMAT(CAST(h.hora_inicio AS TIME), N'hh\:mm'), ' a ', FORMAT(CAST(h.hora_final AS TIME), N'hh\:mm')) AS horario_formateado,
    t.aula_tutoria,
    tt.tipo_tutoria,
    CONCAT(u.nombre, ' ', u.apellido) AS nombre_tutor,
    c.nombre_carrera
FROM tbTutorias t
INNER JOIN tbMateriasCarrera mc ON t.id_materia_carrera = mc.id_materia_carrera
INNER JOIN tbMaterias m ON mc.id_materia = m.id_materia
INNER JOIN tbCarreras c ON mc.id_carrera = c.id_carrera
INNER JOIN tbHorarioDiaSemanas hds ON t.id_horario_dia_semana = hds.id_horario_dia_semana
INNER JOIN tbHorarios h ON hds.id_horario = h.id_horario
INNER JOIN tbDiaSemanas ds ON hds.id_dia = ds.id_dia_semana
INNER JOIN tbTiposTutoria tt ON t.id_tipo_tutoria = tt.id_tipo_tutoria
INNER JOIN tbUsuarios u ON t.id_tutor = u.id_usuario;
GO

CREATE OR ALTER VIEW vw_TutoriasFormateadas AS
SELECT 
    t.id_tutoria,
    t.id_tutor,  -- ID del tutor agregado
    CONCAT(
        m.nombre_materia, 
        ' - ', 
        t.aula_tutoria, 
        ' - ',
        ds.dia_semana, 
        ' ',
        FORMAT(CAST(h.hora_inicio AS TIME), N'hh\:mm'), 
        ' a ', 
        FORMAT(CAST(h.hora_final AS TIME), N'hh\:mm')
    ) AS descripcion_tutoria,
    m.nombre_materia,
    t.aula_tutoria AS salon,
    ds.dia_semana,
    FORMAT(CAST(h.hora_inicio AS TIME), N'hh\:mm') AS hora_inicio,
    FORMAT(CAST(h.hora_final AS TIME), N'hh\:mm') AS hora_final,
    CONCAT(FORMAT(CAST(h.hora_inicio AS TIME), N'hh\:mm'), ' a ', FORMAT(CAST(h.hora_final AS TIME), N'hh\:mm')) AS horario_formateado,
    tt.tipo_tutoria,
    CONCAT(u.nombre, ' ', u.apellido) AS nombre_tutor,
    c.nombre_carrera,
    t.activo
FROM tbTutorias t
INNER JOIN tbMateriasCarrera mc ON t.id_materia_carrera = mc.id_materia_carrera
INNER JOIN tbMaterias m ON mc.id_materia = m.id_materia
INNER JOIN tbCarreras c ON mc.id_carrera = c.id_carrera
INNER JOIN tbHorarioDiaSemanas hds ON t.id_horario_dia_semana = hds.id_horario_dia_semana
INNER JOIN tbHorarios h ON hds.id_horario = h.id_horario
INNER JOIN tbDiaSemanas ds ON hds.id_dia = ds.id_dia_semana
INNER JOIN tbTiposTutoria tt ON t.id_tipo_tutoria = tt.id_tipo_tutoria
INNER JOIN tbUsuarios u ON t.id_tutor = u.id_usuario;
GO

CREATE OR ALTER VIEW vw_UsuariosAcademicos AS
SELECT 
    u.id_usuario,
    u.carnet,
    CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo,
    u.estado,
    n.nivel
FROM tbUsuarios u
INNER JOIN tbNivelesUsuarios n ON u.id_nivel = n.id_nivel
WHERE n.nivel IN ('alumno', 'estudiante', 'profesor')
    AND u.estado = 1;  -- Solo usuarios activos
GO

CREATE OR ALTER VIEW vw_AsistenciasSimplificadas AS
SELECT 
    a.id_asistencia,
    CONCAT(u.nombre, ' ', u.apellido) AS nombre,
    
    -- Fecha formateada como DD/MM/AAAA
    CASE 
        WHEN a.fecha_asistencia IS NOT NULL THEN
            RIGHT('0' + CAST(DAY(a.fecha_asistencia) AS VARCHAR(2)), 2) + '/' + 
            RIGHT('0' + CAST(MONTH(a.fecha_asistencia) AS VARCHAR(2)), 2) + '/' + 
            CAST(YEAR(a.fecha_asistencia) AS VARCHAR(4))
        ELSE NULL 
    END AS fecha,
    
    -- Hora formateada en AM/PM
    CASE 
        WHEN a.fecha_asistencia IS NOT NULL THEN
            CASE 
                WHEN DATEPART(HOUR, a.fecha_asistencia) = 0 THEN '12:' + RIGHT('0' + CAST(DATEPART(MINUTE, a.fecha_asistencia) AS VARCHAR(2)), 2) + ' AM'
                WHEN DATEPART(HOUR, a.fecha_asistencia) < 12 THEN RIGHT('0' + CAST(DATEPART(HOUR, a.fecha_asistencia) AS VARCHAR(2)), 2) + ':' + RIGHT('0' + CAST(DATEPART(MINUTE, a.fecha_asistencia) AS VARCHAR(2)), 2) + ' AM'
                WHEN DATEPART(HOUR, a.fecha_asistencia) = 12 THEN '12:' + RIGHT('0' + CAST(DATEPART(MINUTE, a.fecha_asistencia) AS VARCHAR(2)), 2) + ' PM'
                ELSE RIGHT('0' + CAST(DATEPART(HOUR, a.fecha_asistencia) - 12 AS VARCHAR(2)), 2) + ':' + RIGHT('0' + CAST(DATEPART(MINUTE, a.fecha_asistencia) AS VARCHAR(2)), 2) + ' PM'
            END
        ELSE NULL 
    END AS hora,
    
    u.carnet AS carnet,
    a.id_tutoria
FROM tbAsistencias a
INNER JOIN tbUsuarios u ON a.id_usuario = u.id_usuario;
GO

-- Falta por añadir

CREATE OR ALTER VIEW vw_AsistenciasEstudiante AS
SELECT 
    a.id_asistencia,
    a.id_usuario,
    
    -- Información de la tutoría asistida
    t.id_tutoria,
    m.nombre_materia,
    t.aula_tutoria,
    
    -- Información del tutor
    tutor.id_usuario AS id_tutor,
    CONCAT(tutor.nombre, ' ', tutor.apellido) AS nombre_tutor,
    tutor.carnet AS carnet_tutor,
    tutor.correo AS correo_tutor,
    
    -- Información del tipo de tutoría
    tt.tipo_tutoria,
    
    -- Información de la carrera
    c.nombre_carrera,
    
    -- Información del horario
    ds.dia_semana,
    CONCAT(FORMAT(CAST(h.hora_inicio AS TIME), N'hh\:mm'), ' a ', FORMAT(CAST(h.hora_final AS TIME), N'hh\:mm')) AS horario_tutoria,
    
    -- Fecha y hora de asistencia formateadas
    CASE 
        WHEN a.fecha_asistencia IS NOT NULL THEN
            RIGHT('0' + CAST(DAY(a.fecha_asistencia) AS VARCHAR(2)), 2) + '/' + 
            RIGHT('0' + CAST(MONTH(a.fecha_asistencia) AS VARCHAR(2)), 2) + '/' + 
            CAST(YEAR(a.fecha_asistencia) AS VARCHAR(4))
        ELSE NULL 
    END AS fecha_asistencia,
    
    -- Hora de asistencia formateada en AM/PM
    CASE 
        WHEN a.fecha_asistencia IS NOT NULL THEN
            CASE 
                WHEN DATEPART(HOUR, a.fecha_asistencia) = 0 THEN '12:' + RIGHT('0' + CAST(DATEPART(MINUTE, a.fecha_asistencia) AS VARCHAR(2)), 2) + ' AM'
                WHEN DATEPART(HOUR, a.fecha_asistencia) < 12 THEN RIGHT('0' + CAST(DATEPART(HOUR, a.fecha_asistencia) AS VARCHAR(2)), 2) + ':' + RIGHT('0' + CAST(DATEPART(MINUTE, a.fecha_asistencia) AS VARCHAR(2)), 2) + ' AM'
                WHEN DATEPART(HOUR, a.fecha_asistencia) = 12 THEN '12:' + RIGHT('0' + CAST(DATEPART(MINUTE, a.fecha_asistencia) AS VARCHAR(2)), 2) + ' PM'
                ELSE RIGHT('0' + CAST(DATEPART(HOUR, a.fecha_asistencia) - 12 AS VARCHAR(2)), 2) + ':' + RIGHT('0' + CAST(DATEPART(MINUTE, a.fecha_asistencia) AS VARCHAR(2)), 2) + ' PM'
            END
        ELSE NULL 
    END AS hora_asistencia,
    
    -- Rendimientos
    a.rendimiento_aprendizaje,
    a.rendimiento_dedicacion

FROM tbAsistencias a
    INNER JOIN tbTutorias t ON a.id_tutoria = t.id_tutoria
    INNER JOIN tbMateriasCarrera mc ON t.id_materia_carrera = mc.id_materia_carrera
    INNER JOIN tbMaterias m ON mc.id_materia = m.id_materia
    INNER JOIN tbCarreras c ON mc.id_carrera = c.id_carrera
    INNER JOIN tbHorarioDiaSemanas hds ON t.id_horario_dia_semana = hds.id_horario_dia_semana
    INNER JOIN tbHorarios h ON hds.id_horario = h.id_horario
    INNER JOIN tbDiaSemanas ds ON hds.id_dia = ds.id_dia_semana
    INNER JOIN tbTiposTutoria tt ON t.id_tipo_tutoria = tt.id_tipo_tutoria
    INNER JOIN tbUsuarios tutor ON t.id_tutor = tutor.id_usuario;
GO

CREATE OR ALTER VIEW vw_PanoramaTutoria AS
SELECT 
    -- Información básica de la tutoría
    t.id_tutoria,
    t.aula_tutoria,
    t.activo,
    
    -- Información del tutor
    tutor.id_usuario AS id_tutor,
    CONCAT(tutor.nombre, ' ', tutor.apellido) AS nombre_tutor,
    tutor.carnet AS carnet_tutor,
    tutor.correo AS correo_tutor,
    
    -- Información académica
    m.id_materia,
    m.nombre_materia,
    c.id_carrera,
    c.nombre_carrera,
    tc.id_tipo_carrera,
    tc.tipo_carrera,
    
    -- Información del tipo de tutoría
    tt.id_tipo_tutoria,
    tt.tipo_tutoria,
    
    -- Información del horario
    h.id_horario,
    h.hora_inicio,
    h.hora_final,
    CONCAT(FORMAT(CAST(h.hora_inicio AS TIME), N'hh\:mm'), ' a ', FORMAT(CAST(h.hora_final AS TIME), N'hh\:mm')) AS horario_formateado,
    
    -- Información del día
    ds.id_dia_semana,
    ds.dia_semana,
    
    -- Información del horario-día
    hds.id_horario_dia_semana,
    hds.activo AS horario_activo,
    hds.fecha_inicio_validez,
    hds.fecha_fin_validez,
    
    -- Estadísticas de asistencia
    (SELECT COUNT(*) FROM tbAsistencias WHERE id_tutoria = t.id_tutoria) AS total_asistencias,
    (SELECT COUNT(DISTINCT id_usuario) FROM tbAsistencias WHERE id_tutoria = t.id_tutoria) AS estudiantes_unicos,
    
    -- Descripción completa para mostrar
    CONCAT(
        'Tutoría de ', m.nombre_materia, 
        ' - Aula: ', t.aula_tutoria,
        ' - Día: ', ds.dia_semana,
        ' - Horario: ', FORMAT(CAST(h.hora_inicio AS TIME), N'hh\:mm'), ' a ', FORMAT(CAST(h.hora_final AS TIME), N'hh\:mm'),
        ' - Tutor: ', tutor.nombre, ' ', tutor.apellido,
        ' - Carrera: ', c.nombre_carrera
    ) AS descripcion_completa,

    -- Información de contacto extendida
    CONCAT(
        'Para más información contactar al tutor: ',
        tutor.nombre, ' ', tutor.apellido,
        ' - Correo: ', tutor.correo,
        ' - Carnet: ', tutor.carnet
    ) AS informacion_contacto

FROM tbTutorias t
    INNER JOIN tbUsuarios tutor ON t.id_tutor = tutor.id_usuario
    INNER JOIN tbMateriasCarrera mc ON t.id_materia_carrera = mc.id_materia_carrera
    INNER JOIN tbMaterias m ON mc.id_materia = m.id_materia
    INNER JOIN tbCarreras c ON mc.id_carrera = c.id_carrera
    INNER JOIN tbTiposCarrera tc ON c.id_tipo_carrera = tc.id_tipo_carrera
    INNER JOIN tbHorarioDiaSemanas hds ON t.id_horario_dia_semana = hds.id_horario_dia_semana
    INNER JOIN tbHorarios h ON hds.id_horario = h.id_horario
    INNER JOIN tbDiaSemanas ds ON hds.id_dia = ds.id_dia_semana
    INNER JOIN tbTiposTutoria tt ON t.id_tipo_tutoria = tt.id_tipo_tutoria;
GO