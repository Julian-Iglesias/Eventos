import test from "node:test";
import assert from "node:assert";
import { ticketDTO } from "../src/dto/ticket.dto.js";

test("ticketDTO devuelve los datos principales del ticket", () => {
  const ticket = {
    _id: "ticket123",
    status: "confirmed",
    quantity: 1,
    reservationCode: "RES-123",
    createdAt: new Date(),
    cancelledAt: null,
    event: "evento123"
  };

  const result = ticketDTO(ticket);

  assert.strictEqual(result.id, "ticket123");
  assert.strictEqual(result.status, "confirmed");
  assert.strictEqual(result.quantity, 1);
  assert.strictEqual(result.event, "evento123");
});

test("ticketDTO filtra los datos de un evento populado", () => {
  const ticket = {
    _id: "ticket123",
    status: "confirmed",
    quantity: 1,
    reservationCode: "RES-123",
    createdAt: new Date(),
    cancelledAt: null,
    event: {
      _id: "evento123",
      title: "Workshop",
      date: new Date("2026-12-20"),
      location: "Buenos Aires",
      description: "Este campo no debería salir"
    }
  };

  const result = ticketDTO(ticket);

  assert.strictEqual(result.event.title, "Workshop");
  assert.strictEqual(result.event.description, undefined);
});