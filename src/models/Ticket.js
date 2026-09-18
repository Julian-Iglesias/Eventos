import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId, ref:'User', required: true
        },
         event:{
            type: mongoose.Schema.Types.ObjectId, ref:'Event', required: true
        }, 
        status:{
            type: String, enum:['confirmed','pending','cancelled'], default: 'confirmed'
        }, 
        quantity:{
            type: Number, min:1, required: true
        }, 
        reservationCode:{
            type: String, unique: true, required: true
        }, 
        cancelledAt:{
            type: Date, default: null
        }
    },{
        timestamps:true
    }
)

const Ticket=mongoose.model('Ticket',ticketSchema)
export default Ticket