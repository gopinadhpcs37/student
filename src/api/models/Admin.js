const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type : String, 
        required :true,
        minlength : 3
    },
    email : {
        type : String, 
        required : true,
        unique : true,
        dropDups : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid');
            }
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    },
    otp : {
        type : String,
        required : true,
        minlength : 6
    },
    status : {
        type: String,
        required : true,
        default : "dective"
    }
})

adminSchema.pre('save', async function(next){
    const admin = this
    if(admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
})

module.exports = mongoose.model('Admin', adminSchema)