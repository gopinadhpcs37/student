const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const studentSchema = mongoose.Schema({
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
    contact : {
        type: Number,
        required: true,
        unique : true,
        minlength: 10
    },
    totalmarks :{
        type: Number,
        required: true,
    },
    cgpa : {
        type: Number,
        required: true,
    },
    status : {
        type: String,
        required : true,
        default : "active"
    }

})

module.exports = mongoose.model('Student', studentSchema)