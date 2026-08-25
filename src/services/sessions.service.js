import {getUserByEmail, saveUser} from '../repositories/users.repository.js'
import { createHash } from '../utils/hash.js'

export const registerUser= async (userData) =>{
    const {first_name, last_name,email,password} = userData
    const normalizedEmail= email.trim().toLowerCase()
    const existingUser = await getUserByEmail(normalizedEmail)
    
    if (existingUser){
        const error = new Error('El email ya esta registrado')
        error.statusCode = 409
        throw error
    }
    const hashedPassword = await createHash(password)
    const newUser= await saveUser({
        first_name,last_name,email: normalizedEmail,password: hashedPassword
    })
    return {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role
    }
}