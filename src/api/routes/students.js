const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const isAuth = require('../middleware/auth');
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require('fs'); 

router.post('/students/addstudent',isAuth,async (req, res) => {
    let student={};
    try{
    student = new Student({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        email : req.body.email,
        contact : req.body.contact,
        totalmarks : req.body.totalmarks,
        cgpa : req.body.cgpa 
    })
   const newStudent = await student.save()
        res.json({
            message :{
                "status" : 200,
                "message" : "successfully Registered"
            },
            Student : newStudent
        })
    }catch(error){
       if(error.code==11000){
        res.status(200).json({ 
            user : student,
            "message" : "Already Registered"
        })
       }else {
          res.status(200).json({error:error})
       }
       
    }
   
});

router.get('/students',isAuth, (req, res) => {
    Student.find()
        .exec()
        .then(students =>{
            console.log(students); 
            res.status(200).json(students);
        })
        .catch(error => {
            res.status(200).json({ error:error})
        })
});

router.get('/students/deactive',isAuth, (req, res) => {
    Student.find({status:"deactive"})
        .exec()
        .then(students =>{
            console.log(students); 
            res.status(200).json(students);
        })
        .catch(error => {
            res.status(200).json({ error:error})
        })
});

router.get('/students/active',isAuth, (req, res) => {
    Student.find({status:"active"})
        .exec()
        .then(students =>{
            console.log(students); 
            res.status(200).json(students);
        })
        .catch(error => {
            res.status(200).json({ error:error})
        })
});

router.put('/students/:id',isAuth, async (req, res) => {
    try{
    const studentId = req.params.id;
    console.log(studentId, "id")
    const student = await Student.findById(studentId);
    if (student) {
      student.name = req.body.name || student.name;
      student.email = req.body.email || student.email;
      student.contact = req.body.contact || student.contact;
      student.totalmarks = req.body.totalmarks || student.totalmarks;
      student.cgpa = req.body.cgpa || student.cgpa;
      const updatedStudent = await student.save();
      res.send({
        _id: updatedStudent.id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        contact : updatedStudent.contact,
        totalmarks : updatedStudent.totalmarks,
        cgpa:updatedStudent.cgpa
       });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
}catch(error){
    res.status(200).json({ error:error})
}
});

router.delete('/students/:studentId',isAuth, async(req, res, next) => {
   
   try{
    const id = req.params.studentId;
    const student = await Student.findById(id);
    if(student){
    student.status = "deactive";
    const updatedStudent = await student.save();
    res.json({

        "message" : "Deleted Successfully"
    })
    }
   }catch(error){
    res.status(200).json({ error:error})
   }
});

router.get("/students/generateReport", async(req, res) => {
    const students = await Student.find({});
    //const newStudents = await students.save();
    ejs.renderFile(path.join(__dirname, '/../../../view/', "report-template.ejs"), {students: students}, (err, data) => {
    if (err) {
          res.send(err);
    } else {
        let options = {
            "height": "11.25in",
            "width": "8.5in",
            "header": {
                "height": "20mm"
            },
            "footer": {
                "height": "20mm",
            },
        };
        pdf.create(data, options).toFile("report.pdf", function (err, data) {
            if (err) {
                res.send(err);
            } else {
                var data = fs.readFileSync(path.join(__dirname, "/../../../report.pdf"));
                res.contentType("application/pdf");
                console.log(data, "report")
                res.send(data);
            }
        });
    }
});
})
module.exports = router;