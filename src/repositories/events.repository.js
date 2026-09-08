import { createEventDAO,getEventByIdDAO,updateEventByIdDAO,getEventsDAO } from "../dao/events.dao.js"

export const createEventRepository=async(eventData)=>{
    return await createEventDAO(eventData)
}
export const getEventByIdRepository=async(id)=>{
    return await getEventByIdDAO(id)
}
export const updateEventRepository=async(id,data)=>{
    return await updateEventByIdDAO(id,data)
}
export const getEventsRepository=async(filter,options)=>{
    return await getEventsDAO(filter,options)
}