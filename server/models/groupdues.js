const mongoose=require('mongoose');
const groupDuesSchema=mongoose.Schema({
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'group'
    },
    dueAmount:{
        type:Number
    },
    name:{
        type:String,

    },
    description:String,
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ]
})
module.exports=mongoose.model('groupDues',groupDuesSchema);