export const ticketDTO = (ticket) => {
  const populatedEvent =
    ticket.event && typeof ticket.event === "object" && ticket.event.title;

  return {
    id: ticket._id || ticket.id,
    status: ticket.status,
    quantity: ticket.quantity,
    reservationCode: ticket.reservationCode,
    createdAt: ticket.createdAt,
    cancelledAt: ticket.cancelledAt,

    event: populatedEvent
      ? {
          id: ticket.event._id,
          title: ticket.event.title,
          date: ticket.event.date,
          location: ticket.event.location
        }
      : ticket.event
  };
};