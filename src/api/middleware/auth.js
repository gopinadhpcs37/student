const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

isAuth = async (req, res, next) => {
  let token = req.header('Authorization')
  console.log(token, "token auth")
    if (!token) return res.status(401).send("Access Denied / Unauthorized request");

    try {
        token = token.split(' ')[1] // Remove Bearer from string
        console.log(token , "bear");
        let verifiedAdmin = jwt.verify(token, 'admin');
        console.log(verifiedAdmin, "verifiedAdmin"); 
        const admin = await Admin.findOne({_id : verifiedAdmin._id});
console.log(admin, "admin");
  
        if (!admin) return res.status(401).send('Unauthorized request')

        req.admin = admin; // user_id & user_type_id
        next();

    } catch (error) {
        res.status(400).send(error);
    }

}

module.exports = isAuth;