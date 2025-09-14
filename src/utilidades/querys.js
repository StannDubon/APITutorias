import sql from 'mssql'
import { getConnection } from '../db/conexion.js'

const tablasPermitidas = [
    "tb_niveles_usuario",
    "tb_usuarios",
    "tb_tipos_tutoria",
    "tb_tipos_carrera",
    "tb_carreras",
    "tb_materias",
    "tb_materias_carrera",
    "tb_horarios",
    "tb_dias_semana",
    "tb_horarios_dia_semana",
    "tb_tutorias",
    "tb_asistencia"]

const camposId = {
    tb_niveles_usuario: "id_nivel",
    tb_usuarios: "id_usuario",
    tb_tipos_tutoria: "id_tipo_tutoria",
    tb_tipos_carrera: "id_tipo_carrera",
    tb_carreras: "id_carrera",
    tb_materias: "id_materia",
    tb_materias_carrera: "id_materia_carrera",
    tb_horarios: "id_horario",
    tb_dias_semana: "id_dia_semana",
    tb_horarios_dia_semana: "id_horario_dia_semana",
    tb_tutorias: "id_tutoria",
    tb_asistencia: "id_asistencia"
}


export const todosDatos = async (tabla) => {
    const pool = await sql.connect(getConnection())
    if (!tablasPermitidas.includes(tabla)) {
        throw new Error("Tabla no permitida")
    }
    const result = await pool.request().query(`SELECT * FROM  ${tabla}`,)
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

    // Generarando SET dinámico y parámetros
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
    if(!tablasPermitidas.includes(tabla)) {
        throw new Error("Tabla no permitida")
    }
    const pool = await sql.connect(getConnection())

    const keys = Object.keys(campos) 
    const columnas = keys.join(", ")   
    const valores = keys.map(k => `@${k}`).join(", ") 

    const request = pool.request()
    keys.forEach(k => {
        request.input(k, typeof campos[k] === "number" ? sql.Int : sql.NVarChar, campos[k])
    })

    const result = await request.query(`INSERT INTO ${tabla} (${columnas}) VALUES (${valores})`)
    return result.rowsAffected[0] 
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