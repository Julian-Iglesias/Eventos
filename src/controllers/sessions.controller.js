import { generateToken } from "../utils/jwt.js";
import { HTTP_STATUS } from "../constants/httpStatus.js"
import { userDTO } from "../dto/user.dto.js";
import { getCurrentUserService } from "../services/users.service.js";

export const register = async (req, res) => {
  return res.status(HTTP_STATUS.CREATED).json({
    status: "success",
    payload: userDTO(req.user)
  });
};

export const login = async (req,res)=>{
    const token=generateToken(req.user)
    res.cookie('currentUser', token,{
        httpOnly:true, sameSite:'lax',maxAge:3600000,
        secure:process.env.node_env==='production'
    })
    return res.status(HTTP_STATUS.OK).json({
        status:'success',
        message:'Login correcto'
    })
}

export const current = async (req, res) => {
  try {
    const user = await getCurrentUserService(req.user.id);

    return res.status(HTTP_STATUS.OK).json({
      status: "success",
      payload: userDTO(user),
    });
  } catch (error) {
    return res
      .status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        status: "error",
        message: error.message || "Error interno del servidor",
      });
  }
};

export const logout=async(req,res)=>{
    res.clearCookie('currentUser',{
        httpOnly: true,
        sameSite:'lax',
        secure: process.env.node_env==='production'
    })
    return res.status(HTTP_STATUS.OK).json({
        status:'success',
        message:'Sesión cerrada'
    })
}