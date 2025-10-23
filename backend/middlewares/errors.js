import errorHandler from "../utils/errorHandler.js"

export default (err, req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal Server Error",
    };

    if(err.name === "CastError") {
        const message = "Resource not found"
        error = new errorHandler(message, 404)
    }

    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        error = new errorHandler(message, 400)
    }

    if(err.name === "JsonWebTokenError") {
        const message = "Token is invalid. Try again!"
        error = new errorHandler(message, 400)
    }

    if(err.name === "TokenExpiredError") {
        const message = "Token has been expired. Try again!"
        error = new errorHandler(message, 400)
    }

    if(err.name === "ValidationError") {
        const message = Object.values(err.errors).map((values) => values.message )
        error = new errorHandler(message, 400)
    }

    if (process.env.NODE_ENV === "DEVELOPMENT"){    
        res.status(error.statusCode).json ({
        message: error.message,
        error: err,
        stack: err?.stack,
    })
}

    if (process.env.NODE_ENV === "PRODUCTION"){ 
        res.status(error.statusCode).json ({
        message: error.message,
    })
}
}