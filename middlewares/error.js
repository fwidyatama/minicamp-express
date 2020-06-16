const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    //mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource for id ${err.value} not found`;
        error = new ErrorResponse(message, 404);
    }

    //duplicate name
    if(err.code===11000){
        const message = 'Duplicate value entered';
        error = new ErrorResponse(message,400);
    }

    //check all field if empty
    if(err.name ==='ValidationError'){
        const message = Object.values(err.errors).map((e)=>e.message);
        error = new ErrorResponse(message,400);
    }
    
    res.status(error.statusCode || 500).json({
        success: false,
        msg: error.message || 'Server Error'
    });

}

module.exports = errorHandler;