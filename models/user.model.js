import mongoose from "mongoose";
import { hashPassword,comparePassword,generateAuthToken } from "../services/auth.service.js";


const userSchema=mongoose.Schema({
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
        unique: true,
        match: [/^\+?[1-9]\d{7,14}$/, "Please enter a valid phone number"]
    },
    password : {
        type : String,
        required : [true,'password is required']
    },
    socketId: {
    type: String
}
},{ timestamps: true});

userSchema.statics.hashPassword= hashPassword;
userSchema.methods.comparePassword= function(password){
    return comparePassword(password, this.password);
}
userSchema.methods.generateAuthToken= function(){
    return generateAuthToken(this._id);
}
export const userModel= mongoose.model('user', userSchema);