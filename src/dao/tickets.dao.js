import Ticket from '../models/Ticket.js';

export const createTicketDAO = async (ticketData) => {
  return await Ticket.create(ticketData);
};

export const getTicketByIdDAO = async (id) => {
  return await Ticket.findById(id);
};

export const getActiveTicketByUserAndEventDAO = async (userId, eventId) => {
  return await Ticket.findOne({
    user: userId,
    event: eventId,
    status: { $ne: 'cancelled' }
  });
};

export const getUserTicketsDAO = async (userId) => {
  return await Ticket.find({ user: userId })
    .populate('event', 'title date location');
};

export const getEventTicketsDAO = async (eventId) => {
  return await Ticket.find({
    event: eventId
  });
};

export const getUsedCapacityDAO = async (eventId) => {
  const result = await Ticket.aggregate([
    {
      $match: {
        event: eventId,
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$quantity' }
      }
    }
  ]);

  return result.length > 0 ? result[0].total : 0;
};

export const updateTicketDAO = async (id, data) => {
  return await Ticket.findByIdAndUpdate(
    id,
    data,
    {
      returnDocument: 'after',
      runValidators: true
    }
  );
};