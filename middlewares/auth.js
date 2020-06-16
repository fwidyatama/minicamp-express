const jwt = require('jsonwebtoken');
const errorResponser = require('../utils/errorResponse');
const User = require('../models/user');


exports.authMiddleware = async (req, res, next) => {

    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        next(new errorResponser('This user not authorized', 401));
    }
    else {
        const decodedData = jwt.verify(token, process.env.JWT_KEY);
        req.user = await User.findById(decodedData.id);
    }
    next();
}

exports.roleCheck = (...role) => {
    return (req,res,next)=>{
        if(role.includes(req.user.role)){
            next(); 
        }
        else{
            next(new errorResponser(`Role ${req.user.role} is not authorized for this action`,401));
        }
    };
}