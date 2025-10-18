import sql from 'mssql'
import { getConnection } from '../db/conexion.js'

const tablasPermitidas = [
    "tbNivelesUsuarios",
    "tbUsuarios",
    "tbTiposTutoria",
    "tbTiposCarrera",
    "tbCarreras",
    "tbMaterias",
    "tbMateriasCarrera",
    "tbHorarios",
    "tbDiaSemanas",
    "tbHorarioDiaSemanas",
    "tbTutorias",
    "tbAsistencias",
    "tbRefreshTokens",
    "vw_MateriasConCarrera",
    "vw_UsuariosBasicos",
    "vw_HorariosCompletos",
    "vw_MateriasConIndicadorCarrera",
    "vw_TutoriasFormateadas",
    "vw_UsuariosAcademicos"
]

const procedimientos = [
    "procd_AgregarMateriaACarrera",
    "procd_EliminarMateriaDeCarrera",
    "procd_CrearAsistencia",
]

const camposId = {
    tbNivelesUsuarios: "id_nivel",
    tbUsuarios: "id_usuario",
    tbTiposTutoria: "id_tipo_tutoria",
    tbTiposCarrera: "id_tipo_carrera",
    tbCarreras: "id_carrera",
    tbMaterias: "id_materia",
    tbMateriasCarrera: "id_materia_carrera",
    tbHorarios: "id_horario",
    tbDiaSemanas: "id_dia_semana",
    tbHorarioDiaSemanas: "id_horario_dia_semana",
    tbTutorias: "id_tutoria",
    tbAsistencias: "id_asistencia"
}

export const todosDatos = async (tabla) => {
    const pool = await sql.connect(getConnection())
    if (!tablasPermitidas.includes(tabla)) {
        throw new Error("Tabla no permitida")
    }
    const result = await pool.request().query(`SELECT * FROM ${tabla}`)
    return result.recordset
}

export const unSoloDato = async (tabla, id) => {
    if (!tablasPermitidas.includes(tabla)) {
        throw new Error("Tabla no permitida")
    }
    if (id === undefined) {
        throw new Error("Id no proporcionado")
    }
    const pool = await sql.connect(getConnection())
    const campoId = camposId[tabla]
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`SELECT * FROM ${tabla} WHERE ${campoId} = @id`)
    return result.recordset
}

export const updateDato = async (tabla, id, campos) => {
    if (!tablasPermitidas.includes(tabla)) {
        throw new Error("Tabla no permitida")
    }
    if (!id) throw new Error("Id no proporcionado")

    const pool = await sql.connect(getConnection())
    const campoId = camposId[tabla]

    const keys = Object.keys(campos)
    const setString = keys.map(k => `${k} = @${k}`).join(", ")

    const request = pool.request()
    request.input("id", sql.Int, id)
    keys.forEach(k => {
        request.input(k, typeof campos[k] === "number" ? sql.Int : sql.NVarChar, campos[k])
    })

    const result = await request.query(`UPDATE ${tabla} SET ${setString} WHERE ${campoId} = @id`)
    
    return result.rowsAffected[0]
}

export const insertDato = async (tabla, campos) => {
    if (!tablasPermitidas.includes(tabla)) {
        throw new Error("Tabla no permitida")
    }
    const pool = await sql.connect(getConnection())

    const keys = Object.keys(campos)
    const columnas = keys.join(", ")
    const valores = keys.map(k => `@${k}`).join(", ")

    const request = pool.request()
    keys.forEach(k => {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k)) {
            throw new Error(`Nombre de parámetro inválido: ${k}`)
        }
        request.input(k, typeof campos[k] === "number" ? sql.Int : sql.NVarChar, campos[k])
    })

    const result = await request.query(`
        INSERT INTO ${tabla} (${columnas}) 
        OUTPUT INSERTED.* 
        VALUES (${valores})
    `)

    return result.recordset[0]
}

export const deleteDato = async (tabla, id) => {
    if (!tablasPermitidas.includes(tabla)) {
        throw new Error("Tabla no permitida")
    }
    if (!id) throw new Error("Id no proporcionado")
    
    const pool = await sql.connect(getConnection())
    const campoId = camposId[tabla]
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`DELETE FROM ${tabla} WHERE ${campoId} = @id`)

    return result.rowsAffected[0]
}

export const ejecutarProcedimiento = async (procedimiento, campos) => {
    if (!procedimientos.includes(procedimiento)) {
        throw new Error("Procedimiento no permitido")
    }

    const pool = await sql.connect(getConnection())
    const request = pool.request()
    const keys = Object.keys(campos)

    keys.forEach(k => {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k)) {
            throw new Error(`Nombre de parámetro inválido: ${k}`)
        }
        request.input(k, typeof campos[k] === "number" ? sql.Int : sql.NVarChar, campos[k])
    })

    const result = await request.execute(procedimiento)
    return result.recordset
}

export const ejecutarVista = async (vista, parametros = {}) => {
    if (!tablasPermitidas.includes(vista)) {
        throw new Error("Vista no permitida")
    }
    
    const pool = await sql.connect(getConnection())
    const request = pool.request()
    
    const keys = Object.keys(parametros)
    if (keys.length === 0) {
        const result = await request.query(`SELECT * FROM ${vista}`)
        return result.recordset
    }
    let whereConditions = []
    let orderByClause = ""
    
    keys.forEach(k => {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k)) {
            throw new Error(`Nombre de parámetro inválido: ${k}`)
        }
        
        if (k.startsWith('order_by_')) {
            const campoOrden = k.replace('order_by_', '')
            const direccion = parametros[k] === 'DESC' ? 'DESC' : 'ASC'
            orderByClause = `ORDER BY ${campoOrden} ${direccion}`
        } else {
            request.input(k, typeof parametros[k] === "number" ? sql.Int : sql.NVarChar, parametros[k])
            whereConditions.push(`${k} = @${k}`)
        }
    })
    let query = `SELECT * FROM ${vista}`
    
    if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`
    }
    
    if (orderByClause) {
        query += ` ${orderByClause}`
    }
    
    const result = await request.query(query)
    return result.recordset
}

