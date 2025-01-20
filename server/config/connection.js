const mongoose=require('mongoose')
const conn=process.env.CONNECTION_STRING
mongoose.connect(`${conn}`);

module.exports=mongoose.connection;