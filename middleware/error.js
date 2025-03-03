const { zalgo } = require("colors");
const ErrorHandler = require("../utils/errorHandler")

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Product Not Founded  !";

    //console.log(err.statusCode, err.message)
    //for Invalid Product Id error handler
    //CastError

    if (err.name === 'CastError') {
        const message = `Resource Not Founded.Invalid:${err.path} `;
        err = new ErrorHandler(message, 400);

    }

    if (err.code === 11000) {
        return res.status(401).send({
            success: false,
            message: 'Duplicate Key Violation !.',
        });

    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).send({
            success: false,
            message: 'Invalid token. Please log in again.',
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).send({
            success: false,
            message: 'Json Web Token Expired. Please log in again.',
        });
    }
    res.status(err.statusCode).send({
        success: false,
        error: err.message,
        statusCode: err.statusCode
    })




}