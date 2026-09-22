import { HTTP_STATUS } from "../constants/httpStatus.js"
import { getAllUsersService } from "../services/users.service.js";
import { userDTO } from "../dto/user.dto.js";


export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();

    return res.status(HTTP_STATUS.OK).json({
      status: "success",
      payload: users.map(userDTO)
    });
  } catch (error) {
    return res.status(
      error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json({
      status: "error",
      message: error.message || "Error interno del servidor"
    });
  }
};