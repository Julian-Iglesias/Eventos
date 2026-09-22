import {createTicketService, cancelTicketService,getMyTicketsService, getEventTicketsService} from '../services/tickets.service.js'
import{HTTP_STATUS} from '../constants/httpStatus.js'
import { ticketDTO } from '../dto/ticket.dto.js'

export const createTicket=async(req,res)=>{
    try{
        const ticket=await createTicketService(req.params.eid, req.body.quantity,req.user)
        return res.status(HTTP_STATUS.CREATED).json({status:'success',payload:ticketDTO(ticket)})
    } catch(error){
        return res.status(error.statusCode||HTTP_STATUS.INTERNAL_SERVER_ERROR).json({status:'error',message:error.message||'Error interno del servidor'})
    }
}


export const cancelTicket=async(req,res)=>{
    try{
        const ticket=await cancelTicketService(req.params.tid,req.user)
        return res.status(HTTP_STATUS.OK).json({status:'success',payload:ticketDTO(ticket)})
    } catch(error){return res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({status:'error',message:error.message||'Error interno del servidor'})}
}



export const getMyTickets = async (req, res) => {
  try {
    const tickets = await getMyTicketsService(req.user);

    return res.status(HTTP_STATUS.OK).json({
      status: "success",
      payload: tickets.map(ticketDTO)
    });
  } catch (error) {
    return res.status(
      error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json({
      status: "error",
      message: error.message || "Error interno del servidor"
    });
  }
};



export const getEventTickets=async(req,res)=>{
    try{
        const tickets=await getEventTicketsService(req.params.eid,req.user)
        return res.status(HTTP_STATUS.OK).json({status:'success',payload:tickets.map(ticketDTO)})
    } catch(error){return res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({status:'error',message:error.message||'Error interno del servidor'})}
}