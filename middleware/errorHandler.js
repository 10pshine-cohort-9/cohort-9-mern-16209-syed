const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {

    logger.error(err);

    res.status(err.status || 500).json({

        success:false,

        message:err.message || "Internal Server Error",

        stack:process.env.NODE_ENV==="development"
            ? err.stack
            : undefined

    });

};

module.exports = errorHandler;