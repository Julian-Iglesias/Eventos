import { createEventRepository,getEventByIdRepository,updateEventRepository } from "../repositories/events.repository.js";
import { getEventsRepository } from "../repositories/events.repository.js";
import mongoose from "mongoose";

export const createEventService =async(eventData,user)=>{
    const{
        title,description, category, date,location,capacity,price
    }= eventData


if(!title||!description||!category||!date||!location||capacity===undefined||price===undefined){
    const error =new Error('Faltan campos obligatorios')
    error.statusCode=400
    throw error
}

const eventDate=new Date(date)

if (Number.isNaN(eventDate.getTime())){
    const error=new Error('La fecha del evento debe ser futura')
    error.statusCode=400
    throw error
}
if (eventDate<=new Date()){
    const error=new Error('La fecha del evento debe ser futura')
    error.statusCode=400
    throw error
}

if(capacity<=0){
    const error=new Error('La capacidad debe ser mayor a 0')
    error.statusCode=400
    throw error
}

if(price<0){
    const error=new Error('El precio no puede ser negativo')
    error.statusCode=400
    throw error
}

const newEvent=await createEventRepository({
    title,description,category,date:eventDate,location,capacity,price, organizer:user.id
})
return newEvent
}






export const updateEventService =async(id,data,user)=>{
    const event=await getEventByIdRepository(id)


if(!event){
    const error =new Error('Evento no encontrado')
    error.statusCode=404
    throw error
}

const isOwner=event.organizer.toString()===user.id
const isAdmin=user.role==='admin'

if (!isOwner && !isAdmin){
    const error=new Error('No tenes permisos para modificar este evento')
    error.statusCode=403
    throw error
}
if (event.status==='cancelled'){
    const error=new Error('No se puede modificar un evento cancelado')
    error.statusCode=400
    throw error
}

if(data.capacity!==undefined&& data.capacity<=0){
    const error=new Error('La capacidad debe ser mayor a 0')
    error.statusCode=400
    throw error
}

if(data.price!== undefined && data.capacity<=0){
    const error=new Error('El precio no puede ser negativo')
    error.statusCode=400
    throw error
}

if(data.date!== undefined){
    const eventDate=new Date(data.date)
        if (Number.isNaN(eventDate.getTime())){
        const error=new Error('Fecha invalida')
        error.statusCode=400
        throw error
    }
        if (eventDate<=new Date()){
            const error=new Error('La fecha del evento debe ser futura')
            error.statusCode=400
            throw error
    }
    data.date=eventDate
}
delete data.organizer
return await updateEventRepository(id,data)
}




export const updateEventStatusService =async (id,status,user)=>{
    const event =await getEventByIdRepository(id)
    if(!event){
    const error =new Error('Evento no encontrado')
    error.statusCode=404
    throw error
}
const isOwner=event.organizer.toString()===user.id
const isAdmin=user.role==='admin'

if (!isOwner && !isAdmin){
    const error=new Error('No tenes permisos para modificar este evento')
    error.statusCode=403
    throw error
}

const validStatuses=[
    'draft','published','cancelled','finished'
]

if(!validStatuses.includes(status)){
    const error = new Error ('Estado invalido')
    error.statusCode=400
    throw error
}

if(event.status==='cancelled'){
    const error = new Error ('No se puede cambiar el estado de un evento cancelado')
    error.statusCode=400
    throw error
}

if(status==='published'&&(event.status==='finished'||event.status==='cancelled')){
    const error = new Error ('No se puede publicar un evento finalizado o cancelado')
    error.statusCode=400
    throw error
}
return await updateEventRepository(id,{status})
}




export const getEventsService=async (query) => {
    const {
        status, category, location, dateFrom,dateTo, page=1,limit=10,sort='date'
    }=query
    const filter={}
    if(status){filter.status=status}
    if(category){filter.category=category}
    if(location){filter.location=location}
    if(dateFrom||dateTo){
        filter.date={}
        if(dateFrom){
            const fromDate=new Date(dateFrom)
            if(Number.isNaN(fromDate.getTime())){
                const error =new Error('adteFrom invalido')
                error.statusCode=400
                throw error
            }
            filter.date.$gte=fromDate
        }
        if(dateTo){
            const toDate=new Date(dateTo)
            if(Number.isNaN(toDate.getTime())){
                const error =new Error('dateTo invalido')
                error.statusCode=400
                throw error
            }
            filter.date.$lte=toDate
        }
    }
    const pageNumber = Number(page)
    const limitNumber=Number(limit)
    if(
        !Number.isInteger(pageNumber)|| pageNumber<=0||!Number.isInteger(limitNumber)|| limitNumber<=0
    ){
        const error = new Error('page y limit deven ser numeros mayores a 0')
        error.statusCode=400
        throw error
    }
    
    const allowedSorts=['date','-date','price','-price','tilte','-title']
    if (!allowedSorts.includes(sort)){
        const error = new Error('Ordenamiento invalido')
        error.statusCode=400
        throw error
    }
    const skip = (pageNumber-1)*limitNumber
    const result =await getEventsRepository(filter,{skip, limit:limitNumber,sort})

    return{
        data:result.data, page:pageNumber,limit:limitNumber,total:result.total,totalPages:Math.ceil(result.total/limitNumber)
    }
}




export const getEventByIdService = async (id) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("ID de evento inválido");
    error.statusCode = 400;
    throw error;
  }

  const event = await getEventByIdRepository(id);

  if (!event) {
    const error = new Error("Evento no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return event;
};