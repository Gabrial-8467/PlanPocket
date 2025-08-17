const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register=async (req,res)=>{
    try{
        const {fullName,email,password,contactNumber,address,occupationType} =req.body;
        //check if user exists
        const existingUser=await User.findOne({email});
        if (existingUser) return res.status(400).json({message:'User already Exists.'});
        //Hash password
        const hashedPassword=await bcrypt.hash(password,10);
        //Save User
        const user=await User.create({fullName,email, password:hashedPassword,contactNumber, address, occupationType});

        res.status(201).json({message:'User Registered Successfully',user});
    }catch(err) {
        res.status(500).json({message:err.message});
    }
};

exports.login =async(req,res)=>{
    try{
        const{ email, password}=req.body;
        //find user
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:'Invalid credentials'});
        //Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message:'Invalid credentials'});
        //Create JWT
        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET,{ expiresIn:'30d'});
        res.json({message:'Login successful',token});
    }catch(err){
        res.status(500).json({message:err.message});
    }
};
exports.getProfile= async(req,res)=>{
    try{
        const user =await User.findByID(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};