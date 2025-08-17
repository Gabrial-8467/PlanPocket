const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name']
    },
    email:{
        type:String,
        required:[true,'Please add an email'],
        unique:true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    password:{
        type: String,
        required:[true,'Please add a password']
    },
},{timestamps:true});
module.exports=mongoose.model('User',userSchema);
