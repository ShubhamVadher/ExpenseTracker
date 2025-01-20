const jwt=require('jsonwebtoken');
const jwt_key=process.env.JWT_KEY
const tokengen=(user)=>{
    const token=jwt.sign({id:user._id,email:user.email},jwt_key);
    return token;
}
module.exports={tokengen};
