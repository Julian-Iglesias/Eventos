import {createTicketService} from '../services/tickets.service.js'
import{HTTP_STATUS} from '../constants/httpStatus.js'

export const createTicket=async(req,res)=>{
    try{
        const ticket=await createTicketService(req.params.eid, req.body.quantity,req.user)
        return res.status(HTTP_STATUS.CREATED).json({status:'success',payload:ticket})
    } catch(error){
        return res.status(error.statusCode||HTTP_STATUS.INTERNAL_SERVER_ERROR).json({status:'error',message:error.message||'Error interno del servidor'})
    }
}