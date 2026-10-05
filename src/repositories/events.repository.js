import {getEventsDAO} from "../dao/events.dao.js";

export const getEventsRepository= async () => {return await getEventsDAO();}