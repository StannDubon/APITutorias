import { config } from 'dotenv'

config()

export const PORT = process.env.PORT || 3000
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_USER = process.env.DB_USER || 'adminTutoria'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'apiTutorias'
export const DB_NAME = process.env.DB_NAME || 'tutoriasUDB'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
export const MAX_LOGIN_ATTEMPTS = process.env.MAX_LOGIN_ATTEMPTS || 5
export const JWT_SECRET = process.env.JWT_SECRET || 'ss'
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'sss'