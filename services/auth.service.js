import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword= async(password)=>{
    return await bcrypt.hash(password,12);
}
export const comparePassword= async function(password,hashedPassword){
    return await bcrypt.compare(password,hashedPassword);
}
export const generateAuthToken= function(userId){
    const token = jwt.sign({_id: userId},process.env.JWT_SECRET,{expiresIn: '24h'});
    return token;
}