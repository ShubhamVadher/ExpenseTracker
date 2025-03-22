const mongoose=require('mongoose');
const transectionSchema=mongoose.Schema({
    transection_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    transection_type:{
        type:String,
        required:true
    },
    currency:{
        type:String,
        required:true,
        default:"INR"
    },
    amount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        default:"No Description"
    },
    catagory:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    }
})
module.exports=mongoose.model('transactions',transectionSchema);