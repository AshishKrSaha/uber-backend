import { getCoordinate,getDistanceTime,getCaptainInRadius } from "../services/map.service.js";
import { getFare, getOtp } from "../services/ride.service.js";
import { rideModel } from "../models/ride.model.js";
import { sendMessageToSocketId } from "../socket.js";
import { captainModel } from "../models/captain.model.js";


export const createRideHandler= async(req, res)=>{

 const {pickup, drop, vechileType}= await req.body;
 if (!pickup && !drop){
    return res.status(400).json('Please provide pickup and drop point');
 }
 const distAndTime = await getDistanceTime(pickup, drop);

 if (!distAndTime){
    return res.status(400).json('Couldn\'t find distance and time');
 }
 const calculateFare = await getFare(pickup, drop);
 if(!calculateFare){
    return res.status(400).json('Couldn\'t calculate the fare');
 }
 const ride = await rideModel.create({
    user : req.user._id,
    pickup : pickup,
    destination : drop,
    duration : distAndTime.durationMinutes,
    fare : Number(calculateFare[vechileType])
 })
 const { ltd, lng } = await getCoordinate(pickup);
 const captainsInRadius = await getCaptainInRadius(ltd, lng, 2);
 const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
   captainsInRadius.map(captain => {
      sendMessageToSocketId(captain.socketId, {
            event: 'new-ride',
            data: rideWithUser
         })
      })
      return res.json(rideWithUser);
}

export const confirmRideHandler = async(req, res)=>{
   const otp = await getOtp();
   const {rideId} = req.body;
   await rideModel.findOneAndUpdate({_id:rideId},{status: 'accepted', captain:req.captain._id, otp:otp});
   await captainModel.findOneAndUpdate({_id:req.captain._id},{status:'booked'});
   const ride= await rideModel.findOne({_id:rideId}).populate('user').populate('captain').select('+otp');
   const rideData=ride.toObject();
   delete rideData.user.password;
   delete rideData.captain.password;
   console.log('User socket ID:', rideData.user.socketId);
   sendMessageToSocketId(rideData.user.socketId, {
            event: 'ride-confirmed',
            data: rideData.otp
        })
   return res.status(200).json(rideData);
}

export const startRideHandler = async(req, res)=>{
   const {rideId, otp}=req.body;
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })
    sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })
        return res.status(200).json(ride);
}

export const endRideHandler = async(req, res)=>{
   const {rideId}= req.body;
   if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: req.captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    await captainModel.findOneAndUpdate({_id:req.captain._id},{status:'available'});
   sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })
        return res.status(200).json(ride);
}