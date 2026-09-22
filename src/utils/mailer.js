import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    host:process.env.mail_host, port:Number(process.env.mail_port),secure:false,auth:{user:process.env.mail_user,pass:process.env.mail_pass}
})

export const sendTicketConfirmation=async({to,eventTitle,reservationCode,quantity})=>{await transporter.sendMail({from: process.env.mail_from,to,subject:`Confirmación de inscripción - ${eventTitle}`,text:`Tu inscripción fue confimada. Evento:${eventTitle} Cantidad: ${quantity} Codigo de reserva: ${reservationCode}`})}

