import Event from '../models/Event.js'

export const createEventDAO= async (eventData)=>{
    return await Event.create(eventData)
}
export const getEventByIdDAO=async (id)=>{
    return await Event.findById(id)
}
export const updateEventByIdDAO=async(id,data)=>{
    return await Event.findByIdAndUpdate(
        id,data,{returnDocument:'after',runValidators:true}
    )
}
export const getEventsDAO=async(filter,options)=>{
    const{skip,limit,sort}=options
    const sortObject={}
    if(sort.startsWith('-')){
        sortObject[sort.substring(1)]=-1
    } else{
        sortObject[sort]=1
    }
    const data= await Event.find(filter).sort(sortObject).skip(skip).limit(limit)
    const total= await Event.countDocuments(filter)
    return{data,total}
}