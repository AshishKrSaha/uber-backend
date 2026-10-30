import { confirmRideHandler, createRideHandler, endRideHandler, startRideHandler } from "../controllers/ride.controller.js";
import { userMiddlewareHandler,captainMiddlewareHandler } from "../middleware/auth.middleware.js";
import { Router } from "express";

export const rideRouter = Router();
rideRouter.post('/create', userMiddlewareHandler, createRideHandler);
rideRouter.post('/confirm',captainMiddlewareHandler, confirmRideHandler)
rideRouter.post('/start', captainMiddlewareHandler, startRideHandler)
rideRouter.post('/end', captainMiddlewareHandler, endRideHandler);
