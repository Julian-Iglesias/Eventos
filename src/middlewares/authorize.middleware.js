export const authorize=(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                status:'error',
                message:'No tenés permisos para relaizar esta acción'
            })
        }
        next()
    }
}
