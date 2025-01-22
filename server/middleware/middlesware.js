const User=require('../models/user')
const jwt=require('jsonwebtoken');
const jwt_key=process.env.JWT_KEY
const isloggedin = async (req, res, next) => {
    try {
        if (!req.cookies.token || req.cookies.token === '') {
            return res.status(401).json({ message: "Need to log in first" }); // Use 401 for unauthorized
        }
        const data = jwt.verify(req.cookies.token, jwt_key);
        const myuser = await User.findOne({ email: data.email });
        if (!myuser) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = myuser;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports={isloggedin};