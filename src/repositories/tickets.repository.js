import {createTicketDAO, getTicketByIdDAO,getActiveTicketByUserAndEventDAO,getUserTicketsDAO,getEventTicketsDAO,getUsedCapacityDAO,updateTicketDAO} from '../dao/tickets.dao.js'

export const createTicketRepository=async(ticketData)=>{
  return await createTicketDAO(ticketData)
}

export const getTicketByIdRepository = async (id) => {
  return await getTicketByIdDAO(id);
};

export const getActiveTicketByUserAndEventRepository = async (userId, eventId) => {
  return await getActiveTicketByUserAndEventDAO(userId, eventId);
};

export const getUserTicketsRepository = async (userId) => {
  return await getUserTicketsDAO(userId);
};

export const getEventTicketsRepository = async (eventId) => {
  return await getEventTicketsDAO(eventId);
};

export const getUsedCapacityRepository = async (eventId) => {
  return await getUsedCapacityDAO(eventId);
};

export const updateTicketRepository = async (id, data) => {
  return await updateTicketDAO(id, data);
};