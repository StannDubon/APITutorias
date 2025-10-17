import { config } from 'dotenv'

config()

export const PORT = process.env.PORT || 3000
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_USER = process.env.DB_USER || 'adminTutoria'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'apiTutorias'
export const DB_NAME = process.env.DB_NAME || 'tutoriasUDB'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '50min'
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
export const MAX_LOGIN_ATTEMPTS = process.env.MAX_LOGIN_ATTEMPTS || 5
export const JWT_SECRET = process.env.JWT_SECRET || 'dc91d885347097070f82e9aa23145595dc997985bc5f99e6ef992fe11ce6082b0e1acf0c9cff6323f89d6ae63c26641f9ce89e840f0065f1f95d78d9aeca81ee'
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dc91d885347097070f82e9aa23145595dc997985bc5f99e6ef992fe11ce6082b0e1acf0c9cff6323f89d6ae63c26641f9ce89e840f0065f1f95d78d9aeca81ee'