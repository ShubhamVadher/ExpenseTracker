require('dotenv').config()
const connection=require('./config/connection');
const express=require("express");
const bcrypt=require("bcrypt");
const User=require('./models/user');
const {otp}=require('./mailing/mail');
const {tokengen}=require('./jwt/gentoken');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const otp_check=process.env.OTP_CHECK
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    const myuser=await User.findOne({email});
    if(myuser){
        const pass=await bcrypt.compare(password,myuser.password);
        if(pass){
            const token=tokengen(myuser);
            res.cookie("token",token);
            return res.status(200).json({message:"Signin success"});
        }
        else{
            return res.status(401).json({message:"Wrong email or password"})
        }
    }
    else{
        return res.status(401).json({message:"Wrong email or password"})
    }
    
})

app.post('/signup', async (req, res) => {
    const {name,email,password,cpassword} = req.body;
    console.log(req.body);
    const find_user = await User.findOne({ email });
    if (find_user) {
        return res.status(401).json({ message: "User Already exists, try signing in instead" });
    } 

    else if (password!=cpassword) {
        console.log(password);
        console.log(cpassword);
        return res.status(401).json({ message: "Password and Confirm password do not match" });
    } 
    else {
        const otpCode = await otp(email);  // OTP generation
        try {
            const hashedPassword = await bcrypt.hash(password, 12);  // Use await to ensure completion
            const otpcheck = jwt.sign({ name, email, password: hashedPassword, cpassword: hashedPassword, otp: otpCode }, otp_check);
            res.cookie('otpCookie', otpcheck);
            return res.status(200).json({ message: "Signup auth success" });
        } catch (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: "Error processing signup" });
        }
    }
});


app.post('/signupotp',async(req,res)=>{
    const{otp,email,attempts_left}=req.body;
    try{
        if(!req.cookies.otpCookie){
            return res.status(404).json({message:"Something Went Wrong"});
        }
        const data=jwt.verify(req.cookies.otpCookie,otp_check);
        if(otp==data.otp){
            const created_user=await User.create({name:data.name,email:data.email,password:data.password,cpassword:data.password});
            res.clearCookie("otpCookie");
            const token=tokengen(created_user);
            res.cookie('token',token);
            return res.status(200).json({message:"Signup Success"});
        }
        else if(attempts_left>1){
            return res.status(401).json({message:"Incorrect OTP"});
        }
        else{
            res.clearCookie("otpCookie");
            return res.status(401).json({message:"Incorrect OTP"});
        }
    }
    catch(error){
        console.log(error);
    }

})




const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`listening over port ${port}`)
})
