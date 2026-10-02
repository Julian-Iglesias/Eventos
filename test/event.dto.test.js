import test from "node:test";
import assert from "node:assert";
import { eventDTO } from "../src/dto/event.dto.js";

test("eventDTO devuelve los datos principales del evento", () => {
  const event = {
    _id: "evento123",
    title: "Workshop Backend",
    description: "Evento de prueba",
    category: "workshop",
    date: new Date("2026-12-20"),
    location: "Buenos Aires",
    capacity: 50,
    price: 1000,
    status: "published",
    organizer: "usuario123"
  };

  const result = eventDTO(event);

  assert.strictEqual(result.id, "evento123");
  assert.strictEqual(result.title, "Workshop Backend");
  assert.strictEqual(result.status, "published");
  assert.strictEqual(result.capacity, 50);
});