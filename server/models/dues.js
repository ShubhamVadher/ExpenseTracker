const mongoose=require('mongoose');

const duesSchema=mongoose.Schema({
    due_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"exprenssuser"
    },
    title:{
        type:String,
        required:true
    },
    date_added:{
        type:Date,
        default:Date.now
    },
   due_date:{
        type:Date,
        required:true
    },
    due_to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"exprenssuser"
    },
    amount:{
        type:Number,
        required:true,
    },
    currency:{
        type:String,
        required:true
    },
    recurring:{
        type:String,
        required:true
    }

})

module.exports=mongoose.model('due',duesSchema);