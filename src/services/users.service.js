import { getAllUsersRepository,getUserById } from "../repositories/users.repository.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const getAllUsersService = async () => {
  return await getAllUsersRepository();
};

export const getCurrentUserService = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  return user;
};