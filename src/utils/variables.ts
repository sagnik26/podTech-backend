import { Transport, TransportOptions } from "nodemailer"

const { env } = process as { env: { [key: string]: any  } }

export const MONGO_URI = env.MONGO_URI
export const PORT = env.PORT
export const MAILTRAP_USER = env.MAILTRAP_USER
export const MAILTRAP_PASSWORD = env.MAILTRAP_PASSWORD
export const MAILTRAP_PORT = env.MAILTRAP_PORT
export const MAILTRAP_HOST = env.MAILTRAP_HOST
export const PASSWORD_RESET_LINK = env.PASSWORD_RESET_LINK
export const SIGN_IN_URL = env.SIGN_IN_URL
export const JWT_SECRET = env.JWT_SECRET

