const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan');
const compression=require('compression');
const connectDB=require('./config/db.js');

const PORT=process.env.PORT || 5000;
// load environment variables
dotenv.config();
// connect to mongoDB
connectDB();
// initialize Express app
const app=express();
app.use(express.json());
// cors
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

// routes
app.use('/api/auth',require('./routes/authRoute.js'));

// root Route
app.get('/',(req,res)=>{
    res.send('PlanPocket Server is running..'); 
});

// server listen
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});
