import express from 'express'

const app=express()
app.use(express.json())

app.get('/api/healt', (req,res)=>{
    res.status(200).json({
        status:'ok',
        message: 'Servidor activo'
    })
})

export default app