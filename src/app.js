import express from 'express'
import eventsRouter from './routes/events.router.js'
import sessionsRouter from './routes/sessions.router.js'
import cookieParser from 'cookie-parser'
import passport from './config/passport.config.js'

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use('/api/events', eventsRouter)
app.use('/api/sessions',sessionsRouter)

app.get('/api/health', (req,res)=>{
    res.status(200).json({
        status:'ok',
        message: 'Servidor activo'
    })
})

app.use((err,req,res,next)=>{
    console.error(err)
    if (err && err.status===401 && err.message){
        const statusCode= err.message=== 'El email ya está registrado'?409:400
        return res.status(statusCode).json({
            status:'error',
            message:err.message
        })
    }
    return res.status(500).json({
        status:'error',
        message:'Error interno del servidor'
    })
})

export default app