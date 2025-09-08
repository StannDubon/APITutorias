import sql from 'mssql'
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME} from '../config.js'

const dbConfig = {
    user: DB_USER,
    password: DB_PASSWORD,
    server: DB_HOST,
    database: DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbConfig)
        return pool

    } catch (error) {
        console.log(error)
        
    }
}