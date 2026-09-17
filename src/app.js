import express from 'express'
import eventsRouter from './routes/events.router.js'
import sessionsRouter from './routes/sessions.router.js'
import cookieParser from 'cookie-parser'
import passport from './config/passport.config.js'
import usersRouter from './routes/users.router.js'
import { HTTP_STATUS } from './constants/httpStatus.js'

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use('/api/events', eventsRouter)
app.use('/api/sessions',sessionsRouter)
app.use('/api/users', usersRouter)

app.get('/api/health', (req,res)=>{
    return res.status(HTTP_STATUS.OK).json({
        status:'ok',
        message: 'Servidor activo'
    })
})

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode =
    err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    status: "error",
    message:
      err.message || "Error interno del servidor"
  });
});

export default app