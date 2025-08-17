const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const connectDB= async() =>{
    try{
        const conn=await mongoose.connect(process.env.MongoDB_URI);
        console.log(`MongoDB connected:${conn.connection.host}`);
    }
    catch(err){
        console.err(`MongoDB Connection Err:${err.message}`);
        process.exit(1);
    }   
};
module.exports=connectDB;