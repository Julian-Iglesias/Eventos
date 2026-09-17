import { verifyToken } from "../utils/jwt.js";
import { HTTP_STATUS } from "../constants/httpStatus.js"


export const auth=(req,res,next)=>{
    try{
        const token = req.cookies?.currentUser
        if(!token){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                status:'error',
                message: 'No autenticado'
            })
        }
        const decoded= verifyToken(token)
        req.user=decoded
        next()
    } catch (error){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            status:'error',
            message:'No autenticado'
        })
    }
}

