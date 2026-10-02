import test from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import Ticket from "../src/models/Ticket.js";

test("Ticket acepta una quantity mayor a 0", () => {
  const ticket = new Ticket({
    user: new mongoose.Types.ObjectId(),
    event: new mongoose.Types.ObjectId(),
    quantity: 1,
    status: "confirmed",
    reservationCode: "RES-TEST-1"
  });

  const error = ticket.validateSync();

  assert.strictEqual(error, undefined);
});

test("Ticket rechaza quantity igual a 0", () => {
  const ticket = new Ticket({
    user: new mongoose.Types.ObjectId(),
    event: new mongoose.Types.ObjectId(),
    quantity: 0,
    status: "confirmed",
    reservationCode: "RES-TEST-2"
  });

  const error = ticket.validateSync();

  assert.ok(error);
  assert.ok(error.errors.quantity);
});

test("Ticket rechaza un status inválido", () => {
  const ticket = new Ticket({
    user: new mongoose.Types.ObjectId(),
    event: new mongoose.Types.ObjectId(),
    quantity: 1,
    status: "cualquier_cosa",
    reservationCode: "RES-TEST-3"
  });

  const error = ticket.validateSync();

  assert.ok(error);
  assert.ok(error.errors.status);
});