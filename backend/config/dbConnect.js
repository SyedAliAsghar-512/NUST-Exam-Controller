import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({path:"backend/config/config.env"});

let DB_URL = "mongodb+srv://aligee512:Shaneali1@cluster0.ubc9f.mongodb.net/ED-Nust?retryWrites=true&w=majority&appName=Cluster0";

export const connectDatabase = () => { 
    mongoose.connect(DB_URL)
    .then((con) => {
        console.log('connected with database',DB_URL);
    })
    .catch(err => console.error("error:",err));    
};
