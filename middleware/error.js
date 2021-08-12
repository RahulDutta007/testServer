const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err,req, res, next)=>{
    let error = { ...err }   // copy all properties of err in error
    error.message = err.message
    console.log(err.stack.red)

    // mongoose bad ObjectID error is called CastError
    if(err.name === 'CastError')
    {
        const message = `Response not found with id ${err.value}`
        error = new ErrorResponse(message, 404)

    }

    //Mongo duplicate entry error
    if(err.code === 11000)
    {
        console.log(err.message )
        const message = `Already registered`
        error = new ErrorResponse(message, 400, 501)
    }

    if(err.name === 'ValidationError')
    {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)

    }
    // error handler and response back to user
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        custom_code: error.custom_code
    })
} 

module.exports = errorHandler