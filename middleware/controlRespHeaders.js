const express = require('express')
const app = express()

function customHeaders(req, res, next) {
    // Switch off the default 'X-Powered-By: Express' header
    app.disable('x-powered-by');

    // OR set your own header here
    res.setHeader('X-Powered-By', "QA BOX LET'S TEST");

    // .. other headers here

    next();
}

module.exports = customHeaders