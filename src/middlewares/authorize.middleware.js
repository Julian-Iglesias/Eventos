import { HTTP_STATUS } from "../constants/httpStatus.js"


export const authorize=(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                status:'error',
                message:'No tenés permisos para relaizar esta acción'
            })
        }
        next()
    }
}
