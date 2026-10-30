import { userModel } from "../models/user.model.js";
import { captainModel } from "../models/captain.model.js";
import { tokenBlackListModel } from "../models/blackListToken.model.js";

// User register method
export const userRegisterHandler= async(req,res,next)=>{
    try{
        const {firstName, lastName, email, phone, password}= await req.body;
        if(! firstName || ! email || ! password || ! phone){
            return res.status(406).json('Please provide details in the required fields');
        }
        const matchedEmail = await userModel.findOne({email: email.trim()});
        if(matchedEmail){
            return res.status(400).json('User already registered');
        }
        const hashedPassword=await userModel.hashPassword(password);
        const user= await userModel.create({
            firstName : firstName.trim(),
            lastName : lastName.trim(),
            phone : phone.trim(), 
            email : email.trim(),
            password : hashedPassword
        })
        const token = user.generateAuthToken(user._id);
        if( user && token){

            res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
            })

            const  userResponse = user.toObject();
            delete userResponse.password;
            delete userResponse._id;
            return res.status(201).json({'message' : 'User registered successfully', 'token':token, 'user' : userResponse});
        }
    }catch(error){
        next(error);
    }
}

//user login method

export const userLoginHandler= async(req,res,next)=>{

   try{

    const {email,password}=await req.body;
    if(! email || ! password){
        return res.status(406).json('Please provide the required details');
    }
    const user= await userModel.findOne({email: email.trim()});
    if(! user){
        return res.status(400).json('Invalid email');
    }
    const isValidPassword = await user.comparePassword(password);
    if(! isValidPassword){
        return res.status(400).json('Invalid password');
    }
    const token= user.generateAuthToken(user._id);
    if( user && token){
            res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
            })
            return res.status(201).json({'message' : 'User logged in successful', 'token':token});
        }

   }catch(error){
        next(error);
   }
}

// captain register method
export const captainRegisterHandler= async(req,res,next)=>{
    try{
        const {firstName, lastName, email, phone, password,vechile,}= await req.body;
        if(! firstName || ! email || ! password || ! phone || ! vechile){
            return res.status(406).json('Please provide details in the required fields');
        }
        const matchedEmail = await captainModel.findOne({email: email.trim()});
        if(matchedEmail){
            return res.status(400).json('Captain already registered');
        }
        const hashedPassword=await captainModel.hashPassword(password);
        const captain= await captainModel.create({
            firstName : firstName.trim(),
            lastName : lastName.trim(),
            phone : phone.trim(), 
            email : email.trim(),
            password : hashedPassword,
            vechile:vechile
        })
        const token = captain.generateAuthToken(captain._id);
        if( captain && token){

            res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
            })

            const  captainResponse = captain.toObject();
            delete captainResponse.password;
            delete captainResponse._id;
            return res.status(201).json({'message' : 'Captain registered successfully', 'token':token, 'captain' : captainResponse});
        }
    }catch(error){
        next(error);
    }
}

//captain login method

export const captainLoginHandler= async(req,res,next)=>{

   try{
    const {email,password}=await req.body;
    if(! email || ! password){
        return res.status(406).json('Please provide the required details');
    }
    const captain= await captainModel.findOne({email: email.trim()});
    if(! captain){
        return res.status(400).json('Invalid email');
    }
    const isValidPassword = await captain.comparePassword(password);
    if(! isValidPassword){
        return res.status(400).json('Invalid password');
    }
    const token= captain.generateAuthToken(captain._id);
    if( captain && token){
            res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
            })
            return res.status(201).json({'message' : 'Captain logged in successful', 'token':token});
        }
   }catch(error){
        next(error);
   }
}

export const logOutHandler= async(req,res,next)=>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    tokenBlackListModel.create({token});
    return res.status(201).json('Logged Out Successfully');
}