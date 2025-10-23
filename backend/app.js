import express from 'express';
import cors from "cors"
const app = express();
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/errors.js';
import { connectDatabase } from './config/dbConnect.js';
import path from "path"
import {fileURLToPath} from "url"

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

process.on("uncaughtException", (err) => {
    console.log(err);
    console.log("Shutting down due to uncaughtException");
    process.exit(1);
})

if(process.env.NODE_ENV !== "PRODUCTION") {
dotenv.config({path:"backend/config/config.env"});
}

//connecting to database
connectDatabase();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: "10mb", verify: (req, res, buf) => {
    req.rawBody = buf.toString()
}}));
app.use(cookieParser());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//import all routes
import productRoutes from "../routes/products.js";
import authRoutes from "../routes/auth.js";
import orderRoutes from "../routes/order.js"
import paymentRoutes from "../routes/payment.js"

app.get('/api/v1', (req, res) => {
    res.json({ message: 'This is CORS-enabled for all origins!' });
});
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

if(process.env.NODE_ENV === "PRODUCTION") {
   app.use(express.static(path.join(_dirname, "../frontend/build")))
   app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "../frontend/build/index.html"))
   })
}

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {

    console.log("Server Started on port:",process.env.PORT,process.env.NODE_ENV);

});

process.on("unhandledRejection", (err) => {
    console.log(err);
    console.log("Shutting down the server due to unhandledRejection");
    server.close(() => {
       process.exit(1);
    });
});