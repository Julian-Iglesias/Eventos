import User from '../models/User.js'

export const getUsers= async(req,res)=>{
    const users=await User.find({},'-password')
    return res.status(200).json({
        status:'success',
        payload: users
    })
}