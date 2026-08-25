import dotenv from 'dotenv'
import app from './app.js'
import {connectDB} from './config/database.js'

dotenv.config()

const port = process.env.port||8080

const startServer=async()=>{
    await connectDB()
    app.listen(port, ()=>{
    console.log(`Servidor levantado en el puerto ${port}`)
    })
}
startServer()
    
