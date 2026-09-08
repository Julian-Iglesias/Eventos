
import {createEventService,updateEventService,updateEventStatusService, getEventsService,getEventByIdService}from'../services/events.service.js'

export const getEvents=async (req,res)=>{
    try{
        const result=await getEventsService(req.query)
        return res.status(200).json({
        status:'success', ...result
    })
    } catch (error){
        return res.status(error.statusCode||500).json({
            status:'error',message:error.message||'Error interno del servidor'
        })
    }
}

export const createEvent=async(req,res)=>{
    try{
        const event=await createEventService(req.body, req.user)

        return res.status(201).json({
            status:'success',
            payload:{
                id:event._id, title: event.title, organizer:event.organizer
            }
        })
    } catch(error){
        return res.status(error.statusCode||500).json({
            status:'error',
            message: error.message||'Error interno del servidor'
        })
    }
}

export const updateEvent= async(req,res)=>{
    try{
        const event= await updateEventService(
            req.params.id,req.body,req.user
        )
        return res.status(200).json({
            status:'success',payload:event
        })
    } catch(error){
        return res.status(error.statusCode||500).json({
            status:'error',
            message: error.message||'Error interno del servidor'
        })
    }
}

export const updateEventStatus=async(req,res)=>{
    try{
        const event= await updateEventStatusService(
            req.params.id,req.body.status,req.user
        )
        return res.status(200).json({
            status:'success',payload:event
        })
    } catch(error){
        return res.status(error.statusCode||500).json({
            status:'error',
            message: error.message||'Error interno del servidor'
        })
    } 
}





export const getEventById=async(req,res)=>{
    try{
        const event = await getEventByIdService(req.params.id)
        return res.status(200).json({
            status:'success',
            payload:event
        })
    } catch (error){
        return res.status(error.statusCode||500).json({
            status:'error',
            message:error.message|| 'Error interno del servidor'
        })
    }
}