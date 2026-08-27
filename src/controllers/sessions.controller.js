import {registerUser,loginUser} from '../services/sessions.service.js'

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

export const login = async (req,res)=>{
    try{
        const{email,password}= req.body
        if(!email||!password){
            return res.status(400).json({
                status:'error',
                message:'Faltan campos obligatorios'
            })
        }
        const token= await loginUser(email,password)
        res.cookie('currentUser',token,{
            httpOnly: true,
            sameSite:'lax',
            maxAge: 3600000,
            secure: process.env.node_env==='production'
        })
        return res.status(200).json({
            status:'success',
            message:'Login correcto'
        })
    } catch(error){
        return res.status(error.statusCode ||500).json({
            status:'error',
            message:error.message||'Error interno del servidor'
        })
    }
}

export const current= async (req,res)=>{
    return res.status(200).json({
        status:'success',
        payload:{
            id:req.user.id,
            email:req.user.email,
            role:req.user.role,
        }
    })
}

export const logout=async(req,res)=>{
    res.clearCookie('currentUser',{
        httpOnly: true,
        sameSite:'lax',
        secure: process.env.node_env==='production'
    })
    return res.status(200).json({
        status:'success',
        message:'Sesión cerrada'
    })
}