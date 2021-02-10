const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const sendOTP = require('../utils/mailer')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
router.post('/admins/registration', async (req, res) => {
    let admin={};
    let otpGenerated=Math.floor(100000 + Math.random() * 900000)+"";
    /*
    *Sending OTP to the user
    */
    sendOTP(req.body.email,otpGenerated);

    /*
    *Storing Object into Database
    */
    try{
    admin = new Admin({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        otp: otpGenerated
    })
   const newadmin=await admin.save()
        res.json({
            message :{
                "status" : 200,
                "message" : "successfully Registered"
            },
            Adimin : newadmin
        })
    }catch(error){
       if(error.code==11000){
        res.status(200).json({ 
            user : admin,
            "message" : "Already Registered"
        })
       }else {
          res.status(200).json({error:error})
       }
       
    }
   
});

router.post('/admins/verify',async(req,res) =>{
    try{
    const email = req.body.email;
    const otp =req.body.otp;
    console.log(email)
    const admin = await Admin.findOne({email: email})
    admin.status = "active";
    const newAdmin = await admin.save();
    console.log(admin)
    if(otp === newAdmin.otp){
        res.send("You has been successfully registered");
    }
    else{
        res.send("otp is incorrect");
    }
    }catch(error){
        res.status(200).json({ error:error})
    }
});  

router.get('/admins/login', async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        console.log(email)
        const admin = await findByCredentials(email, password)
        console.log(admin ,"after find");
        const token = await generateAuthToken(admin);
        console.log(token, "token");
       if(admin && admin.status==="active"){
           res.status(200).json({
               "message" : "You have succeefully logged In.",
               token : token
               
           })
       }else {
           res.send("Enter details are invalid");
       }
    }catch(error){
        res.status(200).json({ error:error})
    }
})

findByCredentials = async(email, password) => {
    const admin = await Admin.findOne({email})
    if(!admin){
        throw new Error('unable to login');
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if(!isMatch){
        throw new Error('unable to login');
    }else{
        console.log(admin, "admin");
    }
    return admin;
};

generateAuthToken = async function(admin){
    const token = jwt.sign({_id : admin._id.toString() }, 'admin',{expiresIn:'864000'});
    return token;
  }
  
module.exports = router;