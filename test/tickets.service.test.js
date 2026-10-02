import test from "node:test";
import assert from "node:assert";

import { createTicketService } from "../src/services/tickets.service.js";

test("createTicketService rechaza un eventId inválido", async () => {
  const user = {
    id: "usuario123",
    email: "test@mail.com",
    role: "user"
  };

  await assert.rejects(
    () => createTicketService("id-invalido", 1, user),
    (error) => {
      assert.strictEqual(error.statusCode, 400);
      assert.strictEqual(error.message, "ID de evento invalido");
      return true;
    }
  );
});