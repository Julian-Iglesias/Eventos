import { generateToken } from "../utils/jwt.js";

export const register=async(req,res)=>{
    const user = req.user
    return res.status(201).json({
        status: 'success', payload:{
            id:user._id,
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            role:user.role,
        }
    })
}

export const login = async (req,res)=>{
    const token=generateToken(req.user)
    res.cookie('currentUser', token,{
        httpOnly:true, sameSite:'lax',maxAge:3600000,
        secure:process.env.node_env==='production'
    })
    return res.status(200).json({
        status:'success',
        message:'Login correcto'
    })
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