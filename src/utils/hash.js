import bcrypt from 'bcrypt'

export const createHash = async (password) =>{
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}

export const isValidPassword = async (password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword)
}