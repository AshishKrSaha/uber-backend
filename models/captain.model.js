import mongoose from "mongoose";
import { comparePassword, hashPassword,generateAuthToken } from "../services/auth.service.js";


const captainSchema= mongoose.Schema({
    firstName : {
        type : String,
        required : [true,'First Name is required'],
        maxLength : [18, 'Invalid Name']
    },
    lastName : {
        type : String,
        maxLength : [12, 'Invalid user name']
    },
    email : {
        type : String,
        required : [true,'Email is required'],
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide valid email'],
        unique : [true, 'Captain already registered'],
    },
    phone : {
        type: String,
        required: [true,'Phone number is required'],
        unique: [true, 'Captain already registered'],
        match: [/^\+?[1-9]\d{7,14}$/, "Please enter a valid phone number"]
    },
    status: {
        type: String,
        enum:['available', 'booked'],
        default: 'available'
    },
    password : {
        type : String,
        required : [true,'password is required']
    },
    vechile : {
        model : {
            type: String,
            required: [true,'Vechile model is required'],

        },
        license :{
            type: Boolean,
            required: [true,' Do you have license? please mention']
        },
        color : {
            type : String,
        },
        licNumber : {
            type:String,
            unique : [true,'Captain already registered'],
            required : [true,'Please enter the license number']
        }
    },
    socketId: {
    type: String
}
},{timeStamp:true});

captainSchema.statics.hashPassword=hashPassword;
captainSchema.methods.comparePassword=function(password){
    return comparePassword(password,this.password);
}
captainSchema.methods.generateAuthToken=function(){
    return generateAuthToken(this._id);
}

export const captainModel=mongoose.model('captain',captainSchema);