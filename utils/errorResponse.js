// this is the template for sending error to the front end

class ErrorResponse extends Error{
    constructor(message, statusCode, custom_code){
        super(message)
        this.statusCode = statusCode
        this.custom_code = custom_code
    }
}

module.exports = ErrorResponse