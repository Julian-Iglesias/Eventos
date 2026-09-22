import { findUserByEmail, createUser,getAllUsersDAO,findUserById} from "../dao/users.dao.js";

export const getUserByEmail= async(email)=>{
    return await findUserByEmail(email)
}

export const saveUser=async (userData)=>{
    return await createUser(userData)
}


export const getAllUsersRepository = async () => {
  return await getAllUsersDAO();
};

export const getUserById = async (id) => {
  return await findUserById(id);
};