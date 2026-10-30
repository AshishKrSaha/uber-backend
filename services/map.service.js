import axios from "axios"
import { captainModel } from "../models/captain.model.js";
const mode = "drive";
export const getCoordinate= async(address)=>{

    try{
        if(! address){
        throw new Error(`Address not found`);
    }
    const apiKey = process.env.MAP_API_KEY;
    if (!apiKey) {
        throw new Error("MAP_API_KEY is not configured");
    }
    const response = await axios.get(`https://api.geoapify.com/v1/geocode/search`,{
        params:{
            text:address,
            format: 'json',
            apiKey
        }
    });
    const results = response.data.results;
    const location= results[0];
    if (!location) {
        throw new Error("Address not found");
    }
    return {
            address: location.formatted,
            ltd: location.lat,
            lng: location.lon
        };
    }catch(error){
        throw error;
    }
}

export const getDistanceTime = async (pickupAddress, dropAddress) => {
    try{

        const apiKey = process.env.MAP_API_KEY;
        if (!apiKey) {
            throw new Error("MAP_API_KEY is not configured");
        }

        const [pickup, drop] = await Promise.all([
            getCoordinate(pickupAddress.trim()),
            getCoordinate(dropAddress.trim())
        ]);

        const waypoints = `${pickup.ltd},${pickup.lng}|${drop.ltd},${drop.lng}`;
         const response = await axios.get(
            "https://api.geoapify.com/v1/routing",
            {
                params: {
                    waypoints,
                    mode,
                    format: "json",
                    units: "metric",
                    apiKey
                }
            }
        );

        const route = response.data.results?.[0];

        if (
            !route ||
            !Number.isFinite(route.distance) ||
            !Number.isFinite(route.time)
        ) {
            throw new Error("Route not found");
        }

        return {
            distanceKm: Number((route.distance / 1000).toFixed(2)),
            durationMinutes: Math.round(route.time / 60)
        };
    }catch (error){

        console.error(
            "Routing error:",
            error.response?.data || error.message
        );
        throw error;
    }
}

export async function getCaptainInRadius(ltd, lng, radius) {
    const captains = await captainModel.find({
        status: "available",
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });
    return captains;
}