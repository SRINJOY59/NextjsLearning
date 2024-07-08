import mongoose from "mongoose";

export async function connect(){
    try{
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;
        console.log(`Connecting to MongoDB at ${process.env.MONGO_URI}`);

        connection.on('connected', ()=>{
            console.log("MongoDB connected successfully!!!");
        })
        connection.on('error', (err)=>{
            console.log("MongoDB connection error!!!");
            console.log(err);
            process.exit();
        })
    }
    catch(error){
        console.log("some error occurred!!");
        console.log(error);
    }
}