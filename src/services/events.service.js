import {getEventsRepository} from "../repositories/events.repository.js"
export const getEventsService= async()=>{return await getEventsRepository()}