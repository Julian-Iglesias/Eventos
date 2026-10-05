import dotenv from 'dotenv'
import app from './app.js'
import { config } from "./config/config.js"

dotenv.config()

const port = process.env.port||8080
app.listen(config.port, () => {console.log(`Servidor escuchando en puerto ${config.port}`)})