import express from "express";
import cors from "cors";

const app = express();

app.use(express.json("16kb"));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));


//CORS configuration
app.use(cors({
    origin:process.env.CORS_ORIGIN ?.split(",") || "http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}),)

//Importing Routes

import healthCheckRoute from "../routes/healthcheck.route.js";
import authRouter from "../routes/auth.routes.js";

app.use("/api/v1/healthcheck",healthCheckRoute);
app.use("/api/v1/auth",authRouter);




export default app