import { getDistanceTime } from "./map.service.js";
import { captainModel } from "../models/captain.model.js";
import crypto from 'node:crypto';

export const getFare= async(pickup, destination)=>{

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distanceKm / 1000) * perKmRate.auto) + ((distanceTime.durationMinutes) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distanceKm / 1000) * perKmRate.car) + ((distanceTime.durationMinutes) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distanceKm / 1000) * perKmRate.moto) + ((distanceTime.durationMinutes) * perMinuteRate.moto))
    };

    return fare;
}
export const getOtp = async (num = 4) => {
    return crypto.randomInt(10 ** (num - 1), 10 ** num).toString();
}