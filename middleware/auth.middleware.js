import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { userModel } from "../models/user.model.js";
import { captainModel } from "../models/captain.model.js";

export const userMiddlewareHandler=async(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded= jwt.verify(token,process.env.JWT_SECRET);
    const user = await userModel.findById({_id : decoded._id});
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user=user;
    return next();
}

export const captainMiddlewareHandler= async(req, res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded= jwt.verify(token,process.env.JWT_SECRET);
    const captain = await captainModel.findById({_id : decoded._id});
    if (!captain) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.captain=captain;
    return next();
}