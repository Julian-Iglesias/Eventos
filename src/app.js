import express from 'express'
import eventsRouter from './routes/events.router.js'
import sessionsRouter from './routes/sessions.router.js'
import cookieParser from 'cookie-parser'

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/events', eventsRouter)
app.use('/api/sessions',sessionsRouter)

app.get('/api/health', (req,res)=>{
    res.status(200).json({
        status:'ok',
        message: 'Servidor activo'
    })
})

export default app