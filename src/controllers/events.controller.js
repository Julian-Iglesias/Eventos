import {getEventsService} from "../services/events.service.js";

export const getEvents =async(req,res) => {
  const events = await getEventsService();
  res.status(200).json({
    status: "success",payload: events})
}