import jwt from 'jsonwebtoken'

export const generateToken = (user)=>{
    return jwt.sign(
        {
            id: user._id, email:user.email, role:user.role
        },
        process.env.jwt_secret,
        {
            expiresIn: process.env.jwt_expires_in || '1h'
        }
    )
}

export const verifyToken= (token)=> {
    return jwt.verify(token, process.env.jwt_secret)
}