import Event from "../models/Event.js"

export const getEvents= (req,res)=>{
    res.status(200).json({
        status:'success',
        message: 'Eventos funcionando',
        payload:[]
    })
}

export const createEvent=async(req,res)=>{
    try{
        const{
            title,description,date,location,capacity
        }= req.body

        if(!title){
            return res.status(400).json({
                status:'error', message:'El titulo es obligatorio'
            })
        }
        const event = await Event.create({
            title,description,date,location,capacity,organizer:req.user.id
        })

        return res.status(201).json({
            status:'success',
            payload:{
                id:event._id, title: event.title, organizer:event.organizer
            }
        })
    } catch(error){
        return res.status(500).json({
            status:'error',
            message: 'Error al crear el evento'
        })
    }
}

export const updateEvent= async(req,res)=>{
    try{
        const {id}=req.params
        const event=await Event.findById(id)
        if(!event){
            return res.status(404).json({
                status:'error',
                message:'Evento no encontrado'
            })
        }
        const isOwner= event.organizer.toString()===req.user.id
        const isAdmin=req.user.role==='admin'

        if(!isOwner&&!isAdmin){
            return res.status(403).json({
                status:'error',
                message:'No tenés permisos para modificar este evento'
            })
        }
        const updatedEvent=await Event.findByIdAndUpdate(
            id,req.body,{returnDocument:"after"}
        )
        return res.status(200).json({
            status:'success',payload:updatedEvent
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            status:'error',
            message: 'Error al actualizar el evento'
        })
    }
}