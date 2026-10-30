import mongoose from "mongoose";

const tokenBlackListSchema= new mongoose.Schema({
    token : {
        type : String,
        unique : true
    }
},{timestamps: true});

export const tokenBlackListModel= mongoose.model('token-blacklist', tokenBlackListSchema);