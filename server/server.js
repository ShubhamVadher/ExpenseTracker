require('dotenv').config()
const connection=require('./config/connection');
const express=require("express");
const bcrypt=require("bcrypt");
const User=require('./models/user');
const {otp}=require('./mailing/mail');
const {tokengen}=require('./jwt/gentoken');
const {isloggedin}=require('./middleware/middlesware');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Transection=require('./models/transection');
const Dues=require('./models/dues');
const Group=require('./models/group');
const GroupDue=require('./models/groupdues');
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

app.get('/dashboard', isloggedin, (req, res) => {
    // console.log("User data:", req.user); // Debugging line
    return res.status(200).json({ user: req.user });
});

app.get('/logout',isloggedin,(req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({message:"Logged out Successfully"});  
})

app.post('/editprofile', isloggedin, async (req, res) => {
    const { username, password, newpassword, cnewpassword } = req.body;
    console.log(req.body)

    // Validate password presence
    if (!password) {
        return res.status(400).json({ message: "Current password is required" });
    }

    const result = await bcrypt.compare(password, req.user.password);
    if (!result) {
        return res.status(401).json({ message: "Incorrect current password" });
    }

    // Update password if requested
    if (newpassword) {
        if (newpassword !== cnewpassword) {
            return res.status(400).json({ message: "New password and confirmation do not match" });
        }
        req.user.password = await bcrypt.hash(newpassword, 12);
    }

    // Update username if requested
    if (username) {
        req.user.name = username;
    }

    // Save the updated user
    await req.user.save();
    return res.status(200).json({ message: "Profile updated successfully" });
});

app.post('/adddues',isloggedin,async(req,res)=>{
    const{ title,dueDate,amount,dueTo,currency,recurring}=req.body;
    const currentDate = new Date();
    const parsedDueDate = new Date(dueDate); // Make sure to parse the dueDate as a Date object

    const myuser=await User.findOne({name:dueTo});
    if(!myuser){
        return res.status(400).json({ message: "User you want to pay is not found" });
    }
    if (parsedDueDate <= currentDate) {
        return res.status(400).json({ message: "Due date must be in the future." });
    }
    const due=await Dues.create({
        title,
        due_by:req.user._id,
        due_date:dueDate,
        due_to:myuser._id,
        amount,
        currency,
        recurring

    })
    req.user.dues.push(due._id);

    // Populate the dues after adding
    await req.user.save(); // Save the user after adding the due
    await req.user.populate("dues"); // Populate the dues array

    return res.status(200).json({ message: "Due Added successfully" });
})

app.get('/loaddues',isloggedin,async(req,res)=>{
    const myuser = await User.findOne({ _id: req.user._id })
            .populate({
                path: 'dues',
                populate: {
                    path: 'due_to',
                    model: 'user' 
                }
            });
    
    
    if(myuser){
        
        return res.status(200).json({dues:myuser.dues})
    }
    else{
        return res.status(400);
    }
})

app.post('/edit/:id',isloggedin,async(req,res)=>{
    const id=req.params.id;
    const{ title,dueDate,amount,dueTo,currency,recurring}=req.body;
    const currentDate = new Date();
    const parsedDueDate = new Date(dueDate); // Make sure to parse the dueDate as a Date object
    const myuser=await User.findOne({name:dueTo});
    if(!myuser){
        return res.status(400).json({ message: "User you want to pay is not found" });
    }
    if (parsedDueDate <= currentDate) {
        return res.status(400).json({ message: "Due date must be in the future." });
    }
    const due=await Dues.findOneAndUpdate({_id:id},{
        title,
        
        due_date:dueDate,
        due_to:myuser._id,
        amount,
        currency,
        recurring

    });
    await due.save();
    if(!due){
        return res.status(404).json({message:'Due Not Found'});
    }
    return res.status(200).json({message:"Updated successfully"});

})


app.get('/getdue/:id', isloggedin, async (req, res) => {
    const id = req.params.id;
    try {
      const due = await Dues.findOne({ _id: id }).populate('due_to'); // Populate due_to if it's a reference
      if (!due) {
        return res.status(400).json({ message: "No due found" });
      } else {
        return res.status(200).json({
          title: due.title,
          dueDate: due.due_date,
          amount: due.amount,
          dueTo: due.due_to?.name || "",
          currency: due.currency,
          recurring: due.recurring,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  });

  app.get('/deletedue/:id', isloggedin, async (req, res) => {
    const id = req.params.id;
    try {
      // Delete the due from the Dues collection
      const due = await Dues.findOneAndDelete({ _id: id });
  
      if (due) {
        // Get the user ID from the request (assuming req.user is set by the authentication middleware)
        const userId = req.user._id;
  
        // Remove the due ID from the user's dues array
        await User.updateOne(
          { _id: userId }, // Match the user
          { $pull: { dues: id } } // Remove the due ID from the dues array
        );
  
        return res.status(200).json({ message: 'Due deleted successfully.' });
      } else {
        return res.status(404).json({ message: 'Due not found.' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred while deleting the due.' });
    }
});

app.post('/addtransection',isloggedin,async(req,res)=>{
    const{type,currency,amount,catagory,date}=req.body;
    console.log(req.body);
    if(!type||!currency||!amount||!catagory||!date){
        return res.status(404).json({message:"Make sure to fill all the fields"});
    }
    const mytrans=await Transection.create({transection_user:req.user._id,transection_type:type,currency,amount,catagory,date});
    if(mytrans){
        req.user.transactions.push(mytrans._id);
        await req.user.save();
        return res.status(200).json({message:"transection added successfully"});
    }
    else{
        return res.status(400).json({message:"Something went wrong"});
    }

})



// GET /gettransections - Fetch all transactions for the logged-in user
app.get('/gettransections', isloggedin, async (req, res) => {
  try {
    // Populate transactions associated with the logged-in user
    const user = await req.user.populate('transactions');
    if (!user.transactions || user.transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found.' });
    }

    // Return the populated transactions
    return res.status(200).json({ transactions: user.transactions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



//creating group
app.post('/creategroup',isloggedin,async(req,res)=>{
    try{
        const{grp_name}=req.body;
        const my_group=await Group.create({grp_name,grp_admin:req.user._id});
        req.user.groups.push(my_group._id);
        my_group.grp_members.push(req.user._id);
        await my_group.save();
        await req.user.save();
        return res.status(200).json({message:"All good"});
    }
    catch(err){
        console.log(err);
        return res.status(400).json({message:"Something went Wrong"});
    }


})

//adding members
app.post('/addmember/:id', isloggedin, async (req, res) => {
    try {
        // Find the group by ID
        const mygrp = await Group.findOne({ _id: req.params.id });
        const { member_id } = req.body;
        const user=await User.findOne({_id:member_id});
        if(!user){
            return res.status(404).json({ message: "Please check the member id, No such member exist" });
        }   
        // Check if group exists
        if (!mygrp) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if the member is already added
        if (mygrp.grp_members.includes(member_id)) {
            return res.status(400).json({ message: "Member is already in the group" });
        }

        // Add the member to the group
        mygrp.grp_members.push(member_id);
        user.groups.push(mygrp);
        await user.save();
        await mygrp.save();
        
        return res.status(200).json({ message: "Member added successfully", group: mygrp });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
//show groups
app.get('/getgroups',isloggedin,async(req,res)=>{
    const myuser=await req.user.populate('groups');
    if(myuser){
        res.status(200).json({Groups:myuser.groups});
    }
    else{
        res.status(400).json({messge:"You are either not part of any groups or There is unxpected error occuring"});
    }
})

app.get('/getuser',isloggedin,async(req,res)=>{
    return res.status(200).json({user:req.user});
})

app.get('/getgroup/:id',isloggedin,async(req,res)=>{
    const group=await Group.findOne({_id:req.params.id});
    await group.populate("grp_admin");
    await group.populate("grp_members");
    await group.save();
    if(group){
        return res.status(200).json({group:group});
    }
    else{
        return res.status(400).json({message:"Unexpected Error Occured"});
    }
})


app.post('/addgrpdue/:id',isloggedin,async(req,res)=>{
    const id=req.params.id;
    const {dueAmount,name,description,members}=req.body;
    const group=await Group.findOne({_id:id});
    if(group){
        const due=await GroupDue.create({group:group._id,dueAmount,name,description,members});
        group.dues.push(due._id);
        await group.save();
        return res.status(200).json({message:"Dues added in the group"});
    }
    else{
        res.status(400).json({message:"Something went Wrong"});
    }
})

app.get('/getgrpdue/:id',isloggedin,async(req,res)=>{
    const id=req.params.id;
    const group=await Group.findOne({_id:id}).populate('dues');
    if(group){
        return res.status(200).json({dues:group.dues});

    }
    else{
        return res.status(400).json({message:"You either dont have any dues or there is an unexpected error"});
    }
})


const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`listening over port ${port}`)
})
