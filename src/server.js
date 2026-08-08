import dotenv from 'dotenv'
import app from './app.js'

dotenv.config()

const port = process.env.port||8080

app.listen(port, ()=>{
    console.log(`Servidor levantado en el puerto ${port}`)
})