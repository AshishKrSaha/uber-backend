import { Router } from "express";
import { userRegisterHandler,userLoginHandler,captainLoginHandler,captainRegisterHandler, logOutHandler } from "../controllers/auth.controller.js";
import { userMiddlewareHandler,captainMiddlewareHandler } from "../middleware/auth.middleware.js";

export const authRouter = Router();
authRouter.post('/user-register', userRegisterHandler);
authRouter.post('/user-login', userLoginHandler);
authRouter.post('/captain-register', captainRegisterHandler);
authRouter.post('/captain-login', captainLoginHandler);
authRouter.get('/user-logout',userMiddlewareHandler,logOutHandler);
authRouter.get('/captain-logout',captainMiddlewareHandler,logOutHandler);