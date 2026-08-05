const logger = require("../config/logger");

const requestLogger = (req, res, next) => {

    logger.info({
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        ip: req.ip
    });

    next();

};

module.exports = requestLogger;