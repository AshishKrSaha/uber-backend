import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { db_connection } from "./db_connect.js";
import { authRouter } from "./routes/auth.route.js";
import { rideRouter } from "./routes/ride.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http"; 
import { initializeSocket } from "./socket.js";

const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173"}));
app.use('/auth',authRouter);
app.use('/ride',rideRouter);
app.use((err,req,res,next)=>{
    console.error(err.message);
    return res.status(500).json({'err':err.message});
})
const server = createServer(app);
initializeSocket(server);

db_connection().then(()=>{
    server.listen(process.env.PORT,()=>{
        console.log(`Server is running in PORT : ${process.env.PORT}`);
    })
}).catch((error)=>{
    console.error("Server failed to start:", error);
})



