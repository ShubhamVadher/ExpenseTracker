const mongoose=require('mongoose');
const groupSchema=mongoose.Schema({
    grp_name:{
        type:String,
        required:true
    },
    grp_admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    grp_members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    dues:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'groupDues'
        }
    ]
})
module.exports=mongoose.model('group',groupSchema);