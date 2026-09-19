import mongoose from 'mongoose'
import { createTicketRepository, getActiveTicketByUserAndEventRepository, getUsedCapacityRepository,getTicketByIdRepository, updateTicketRepository, getUserTicketsRepository } from '../repositories/tickets.repository.js'
import{getEventByIdRepository} from '../repositories/events.repository.js'
import{HTTP_STATUS} from '../constants/httpStatus.js'
import { getEventTicketsRepository } from '../repositories/tickets.repository.js'
import { sendTicketConfirmation } from '../utils/mailer.js'




export const createTicketService= async(eventId,quantity,user)=>{
    if(!mongoose.Types.ObjectId.isValid(eventId)){
        const error=new Error('ID de evento invalido')
        error.statusCode=HTTP_STATUS.BAD_REQUEST
        throw error
    }

    const event = await getEventByIdRepository(eventId)

    if(!event){
        const error = new Error('Evento no econtrado')
        error.statusCode=HTTP_STATUS.NOT_FOUND
        throw error
    }

    if(event.status !=='published'){
        const error = new Error('El evento no esta disponible para inscripciones')
        error.statusCode=HTTP_STATUS.BAD_REQUEST
        throw error
    }

    if(!Number.isInteger(quantity)||quantity<=0){
        const error = new Error('La cantidad debe ser un numero mayor a 0')
        error.statusCode=HTTP_STATUS.BAD_REQUEST
        throw error
    }

    const existingTicket= await getActiveTicketByUserAndEventRepository(user.id,eventId)
    
    if(existingTicket){
        const error = new Error('Ya tenés una inscripción activa para este evento')
        error.statusCode=HTTP_STATUS.CONFLICT
        throw error
    }

    const usedCapacity=await getUsedCapacityRepository(new mongoose.Types.ObjectId(eventId))
    const availableCapacity=event.capacity-usedCapacity
    
    if(availableCapacity<quantity){
        const error = new Error('No hay cupos suficientes disponibles')
        error.statusCode=HTTP_STATUS.BAD_REQUEST
        throw error
    }

    const reservationCode=`RES-${Date.now()}-${Math.floor(Math.random()*10000)}`

    const ticket=await createTicketRepository({user:user.id,event:eventId,quantity,status:'confirmed', reservationCode})
    
    await sendTicketConfirmation({to: user.email, eventTitle: event.title, reservationCode, quantity})

    return ticket


    
}



export const cancelTicketService=async(ticketId,user)=>{
    if (!mongoose.Types.ObjectId.isValid(ticketId)){
        const error=new Error('ID de ticket invalido')
        error.statusCode=HTTP_STATUS.BAD_REQUEST
        throw error
    }
    const ticket=await getTicketByIdRepository(ticketId)
    if(!ticket){
        const error=new Error('Ticket no econtrado')
        error.statusCode=HTTP_STATUS.NOT_FOUND
        throw error
    }
    const isOwner=ticket.user.toString()===user.id
    const isAdmin=user.role==='admin'

    if(!isOwner&&!isAdmin){
        const error=new Error('No tenes permisos para cancelar este ticket')
        error.statusCode=HTTP_STATUS.FORBIDDEN
        throw error
    }

    if(ticket.status==='cancelled'){
        const error=new Error('El ticket ya esta cancelado')
        error.statusCode=HTTP_STATUS.BAD_REQUEST
        throw error
    }

    return await updateTicketRepository(ticketId,{status:'cancelled',cancelledAt:new Date()})

    
}




export const getMyTicketsService=async(user)=>{
    return await getUserTicketsRepository(user.id)
}




export const getEventTicketsService=async(eventId,user)=>{
    if (!mongoose.Types.ObjectId.isValid(eventId)){
        const error=new Error('ID de evento invalido')
        error.statusCode=HTTP_STATUS.BAD_REQUEST
        throw error
    }
    const event=await getEventByIdRepository(eventId)
    if(!event){
        const error=new Error('Evento no econtrado')
        error.statusCode=HTTP_STATUS.NOT_FOUND
        throw error
    }
    const isOwner=event.organizer.toString()===user.id
    const isAdmin=user.role==='admin'

    if(!isOwner&&!isAdmin){
        const error=new Error('No tenes permisos para ver los tickets de este evento')
        error.statusCode=HTTP_STATUS.FORBIDDEN
        throw error
    }

    return await getEventTicketsRepository(eventId)

    
}






