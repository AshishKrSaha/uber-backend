import mongoose from "mongoose";


export const rideSchema = mongoose.Schema({
    captain : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'captain',
        required : false
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    pickup : {
        type : String,
        required : true
    },
    destination : {
        type : String,
        required : true
    },
    fare : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum : ['pending', 'cancelled', 'completed', 'ongoing', 'accepted'],
        default : 'pending'
    },
    duration : {
        type : Number
    },
    paymentID : {
        type : String,
        required : false
    },
    otp: {
        type : String,
        select:false
    }

},{timestamps : true});

export const rideModel = mongoose.model('ride', rideSchema);