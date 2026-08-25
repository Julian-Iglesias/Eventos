import {registerUser} from '../services/sessions.service.js'

export const register=async(req,res)=>{
    try{
        const{first_name,last_name, email, password}=req.body
        
        if (!first_name|| !last_name||!email||!password){
            return res.status(400).json({
                status:'error',
                message: 'Faltan campos obligatorios'
        })
    }
        const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email.trim())){
            return res.status(400).json({
                status:'error',
                message: 'Email inválido'
            })
        }

        if(password.length<8){
            return res.status(400).json({
                status:'error',
                message:'La contraseña debe tener al menos 8 caracteres'
            })
        }

        const user = await registerUser({
            first_name, last_name, email, password
        })

        return res.status(201).json({
            status: 'success',
            payload:user
        })
    } catch(error){
        return res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Error interno del servidor'
        })
    }
}