const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:2
    },
    email:{
        type:String,
        required:true,
        trim:true,
        
    },
    password:{
        type:String,
        required:true,
        
        minlength:7
    },
    cpassword:{
        type:String,
        required:true,
        
        minlength:7
    }

})

module.exports=mongoose.model('exprenssuser',userSchema);