import {getUserByEmail, saveUser} from '../repositories/users.repository.js'
import { createHash, isValidPassword } from '../utils/hash.js'
import { generateToken } from '../utils/jwt.js'

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

export const loginUser= async(email,password)=>{
    const normalizedEmail=email.trim().toLowerCase()
    const user=await getUserByEmail(normalizedEmail)

    if(!user){
        const error = new Error('Credencialess inválidas')
        error.statusCode= 401
        throw error
    }
    const validPassword= await isValidPassword(password, user.password)

    if(!validPassword){
        const error = new Error('Credenciales inválidas')
        error.statusCode=401
        throw error
    }
    const token= generateToken(user)
    return token
}