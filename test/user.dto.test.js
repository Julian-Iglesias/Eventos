import test from "node:test";
import assert from "node:assert";
import { userDTO } from "../src/dto/user.dto.js";

test("userDTO devuelve los datos permitidos", () => {
  const user = {
    _id: "123",
    first_name: "Julian",
    last_name: "Iglesias",
    email: "julian@mail.com",
    password: "password_hasheada",
    role: "user"
  };

  const result = userDTO(user);

  assert.strictEqual(result.id, "123");
  assert.strictEqual(result.email, "julian@mail.com");
  assert.strictEqual(result.role, "user");
});

test("userDTO no expone password", () => {
  const user = {
    _id: "123",
    first_name: "Julian",
    last_name: "Iglesias",
    email: "julian@mail.com",
    password: "password_hasheada",
    role: "user"
  };

  const result = userDTO(user);

  assert.strictEqual(result.password, undefined);
});