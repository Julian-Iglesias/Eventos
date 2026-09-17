import User from '../models/User.js'
import { HTTP_STATUS } from "../constants/httpStatus.js"


export const getUsers= async(req,res)=>{
    const users=await User.find({},'-password')
    return res.status(HTTP_STATUS.OK).json({
        status:'success',
        payload: users
    })
}