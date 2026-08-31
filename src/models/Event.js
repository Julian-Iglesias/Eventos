import mongoose from "mongoose"

const eventSchema=new mongoose.Schema({
    title:{
        type:String, required:true
    },
    description:{
        type:String, default:""
    },
    date:{
        type:Date
    },
    location:{
        type:String
    },
    capacity:{
        type:Number
    },
    organizer:{
        type:mongoose.Schema.Types.ObjectId, ref:"User", required:true
    }
})

const Event = mongoose.model("Event",eventSchema)
export default Event