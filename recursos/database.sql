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
CREATE TABLE tbNivelesUsuarios
(
    id_nivel INT IDENTITY (1,1) NOT NULL,
    nivel NVARCHAR(50) NOT NULL

        CONSTRAINT PK_niveles_usuario PRIMARY KEY(id_nivel),
    CONSTRAINT UQ_nivel_usuario UNIQUE (nivel)
);
GO

-- Tabla de Usuarios --
CREATE TABLE tbUsuarios
(
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
CREATE TABLE tbTiposTutoria
(
    id_tipo_tutoria INT IDENTITY (1,1) NOT NULL,
    tipo_tutoria NVARCHAR(25) NOT NULL,
    -- Ciencias Básicas e Ingenierías

    CONSTRAINT PK_tipo_tutoria PRIMARY KEY (id_tipo_tutoria),
    CONSTRAINT UQ_tipo_tutoria UNIQUE (tipo_tutoria)
);
GO

-- Tabla de Tipo Carrera -- 
CREATE TABLE tbTiposCarrera
(
    id_tipo_carrera INT IDENTITY (1,1) NOT NULL,
    tipo_carrera NVARCHAR(30) NOT NULL,

    CONSTRAINT PK_tipo_carrera PRIMARY KEY (id_tipo_carrera),
    CONSTRAINT UQ_tipo_carrera UNIQUE (tipo_carrera)
);
GO

-- Tabla de Carreras --
CREATE TABLE tbCarreras
(
    id_carrera INT IDENTITY (1,1) NOT NULL,
    id_tipo_carrera INT NOT NULL,
    nombre_carrera NVARCHAR(25) NOT NULL,

    CONSTRAINT PK_carrera PRIMARY KEY (id_carrera),
    CONSTRAINT UQ_nombre_carrera UNIQUE (nombre_carrera),
    CONSTRAINT FK_tipo_carrera FOREIGN KEY (id_tipo_carrera) REFERENCES tbTiposCarrera(id_tipo_carrera)
);
GO

-- Tabla de Materias --
CREATE TABLE tbMaterias
(
    id_materia INT IDENTITY (1,1) NOT NULL,
    nombre_materia NVARCHAR(30) NOT NULL,

    CONSTRAINT PK_materia PRIMARY KEY (id_materia)
);
GO

-- Tabla de Materias por Carrera --
CREATE TABLE tbMateriasCarrera
(
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
CREATE TABLE tbHorarios
(
    id_horario INT IDENTITY (1,1) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL,

    CONSTRAINT PK_horario PRIMARY KEY (id_horario),
    CONSTRAINT CHK_horario_valido CHECK (hora_final > hora_inicio)
);
GO

-- Tabla de Horarios --
CREATE TABLE tbDiaSemanas
(
    id_dia_semana INT IDENTITY (1,1) NOT NULL,
    dia_semana VARCHAR(10) NOT NULL,

    CONSTRAINT PK_dias_semana PRIMARY KEY (id_dia_semana),
    CONSTRAINT UQ_dia_semana UNIQUE (dia_semana)
);
GO

-- Tabla de Horarios por Día de Semana --
CREATE TABLE tbHorarioDiaSemanas
(
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
CREATE TABLE tbTutorias
(
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
CREATE TABLE tbAsistencias
(
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

CREATE TABLE tbRefreshTokens
(
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
CREATE PROCEDURE procd_AgregarMateriaACarrera
    @id_carrera INT,
    @id_materia INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si la carrera existe
        IF NOT EXISTS (SELECT 1
    FROM tbCarreras
    WHERE id_carrera = @id_carrera)
        BEGIN
        SELECT 'Error' AS Resultado, 'La carrera no existe' AS Mensaje;
        RETURN;
    END
        
        -- Verificar si la materia existe
        IF NOT EXISTS (SELECT 1
    FROM tbMaterias
    WHERE id_materia = @id_materia)
        BEGIN
        SELECT 'Error' AS Resultado, 'La materia no existe' AS Mensaje;
        RETURN;
    END
        
        -- Verificar si ya existe la relación
        IF EXISTS (SELECT 1
    FROM tbMateriasCarrera
    WHERE id_carrera = @id_carrera AND id_materia = @id_materia)
        BEGIN
        SELECT 'Error' AS Resultado, 'La materia ya está asignada a esta carrera' AS Mensaje;
        RETURN;
    END
        
        -- Insertar la relación
        INSERT INTO tbMateriasCarrera
        (id_materia, id_carrera)
    VALUES
        (@id_materia, @id_carrera);
        
        COMMIT TRANSACTION;
        
        SELECT 'Success' AS Resultado,
        'Materia agregada correctamente a la carrera' AS Mensaje,
        SCOPE_IDENTITY() AS id_materia_carrera;
               
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado,
        ERROR_MESSAGE() AS Mensaje,
        NULL AS id_materia_carrera;
    END CATCH
END;
GO
-- Como se ejecuta -
EXEC procd_AgregarMateriaACarrera 
    @id_carrera = 2, 
    @id_materia = 8;
GO
CREATE PROCEDURE procd_EliminarMateriaDeCarrera
    @id_carrera INT,
    @id_materia INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si existe la relación
        IF NOT EXISTS (SELECT 1
    FROM tbMateriasCarrera
    WHERE id_carrera = @id_carrera AND id_materia = @id_materia)
        BEGIN
        SELECT 'Error' AS Resultado, 'La materia no está asignada a esta carrera' AS Mensaje;
        RETURN;
    END
        
        -- Eliminar la relación
        DELETE FROM tbMateriasCarrera 
        WHERE id_carrera = @id_carrera AND id_materia = @id_materia;
        
        COMMIT TRANSACTION;
        
        SELECT 'Success' AS Resultado,
        'Materia eliminada correctamente de la carrera' AS Mensaje;
               
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado,
        ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO

--Como se ejecuta--
EXEC procd_EliminarMateriaDeCarrera 
    @id_carrera = 1, 
    @id_materia = 5;
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
        BEGIN TRANSACTION;
        
        -- Validar que el usuario existe
        IF NOT EXISTS (SELECT 1
    FROM tbUsuarios
    WHERE id_usuario = @id_usuario AND estado = 1)
        BEGIN
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, 'El usuario no existe o está inactivo' AS Mensaje;
        RETURN;
    END
        
        -- Validar que la tutoría existe y está activa
        IF NOT EXISTS (SELECT 1
    FROM tbTutorias
    WHERE id_tutoria = @id_tutoria AND activo = 1)
        BEGIN
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, 'La tutoría no existe o está inactiva' AS Mensaje;
        RETURN;
    END
        
        -- Validar rangos de rendimiento (0-100)
        IF @rendimiento_aprendizaje < 0 OR @rendimiento_aprendizaje > 100
        BEGIN
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, 'El rendimiento de aprendizaje debe estar entre 0 y 100' AS Mensaje;
        RETURN;
    END
        
        IF @rendimiento_dedicacion < 0 OR @rendimiento_dedicacion > 100
        BEGIN
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, 'El rendimiento de dedicación debe estar entre 0 y 100' AS Mensaje;
        RETURN;
    END
        
        -- Verificar si ya existe una asistencia para este usuario en esta tutoría hoy
        IF EXISTS (SELECT 1
    FROM tbAsistencias
    WHERE id_usuario = @id_usuario
        AND id_tutoria = @id_tutoria
        AND CONVERT(DATE, fecha_asistencia) = CONVERT(DATE, GETDATE()))
        BEGIN
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, 'Ya existe una asistencia registrada para este usuario en esta tutoría hoy' AS Mensaje;
        RETURN;
    END
        
        -- Insertar la asistencia con fecha actual
        INSERT INTO tbAsistencias
        (
        id_usuario,
        id_tutoria,
        rendimiento_aprendizaje,
        rendimiento_dedicacion,
        fecha_asistencia
        )
    VALUES
        (
            @id_usuario,
            @id_tutoria,
            @rendimiento_aprendizaje,
            @rendimiento_dedicacion,
            GETDATE()
        );
        
        COMMIT TRANSACTION;
        
        SELECT 'Success' AS Resultado,
        'Asistencia registrada correctamente' AS Mensaje,
        SCOPE_IDENTITY() AS id_asistencia,
        GETDATE() AS fecha_registro;
               
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SELECT 'Error' AS Resultado,
        ERROR_MESSAGE() AS Mensaje,
        NULL AS id_asistencia,
        NULL AS fecha_registro;
    END CATCH
END;
GO

-- VISTAS --
GO
CREATE VIEW vw_MateriasConCarrera
AS
    SELECT DISTINCT
        m.id_materia,
        m.nombre_materia
    FROM tbMaterias m
        INNER JOIN tbMateriasCarrera mc ON m.id_materia = mc.id_materia;
GO

CREATE VIEW vw_UsuariosBasicos
AS
    SELECT
        u.id_usuario,
        u.carnet + ' - ' + u.nombre + ' ' + u.apellido AS usuario_completo
    FROM tbUsuarios u;