const express = require('express')
const path = require('path')
const simpleAuth = require('./middleware/authentication')
const logger = require('./middleware/logger')
const fileUpload = require('express-fileupload')
const rateLimit = require("express-rate-limit");
const js2xmlparser = require("js2xmlparser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const customHeaders = require("./middleware/controlRespHeaders")
const checkContentType = require("./middleware/checkContentType")
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5002

// Extended: https://swagger.io/specification/#infoObject

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: "1.0.0",
            title: "Sample Rest APIs",
            description: "QA BOX LET'S TEST",
            contact: {
                name: "QA BOX LET'S TEST"
            },
            servers: [`http://localhost:${PORT}`]
        }
    },
    apis: ['./routes/api/*.js']
};

// Middleware 
// Moved to a separate folder

// Init middleware
app.use(logger)

// Enable CORS
app.use(cors())

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rate-Limit
const createAccountLimiter = rateLimit({
    windowMs: 20000, // 20 Seconds
    max: 2, // start blocking after 2 requests
    message: {
        error: "Too many requests being raised from this IP, please try again after 20 Seconds"
    }
});

// STEP 1
// app.get('/', (req, res) => {
//     // res.send('<h1>Hello World</h1>')
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

//Set Static Folder
// app.use(express.static(path.join(__dirname, 'public')))

// Init Basic Authentication Middleware
app.use(simpleAuth)

// Check ContentType Middleware
app.use(checkContentType)

// XML/JSON Serialization Middleware
app.use(function (req, res, next) {
    res.sendData = function (obj) {
        if (req.accepts('json')) {
            res.header('Content-Type', 'application/json');
            res.send(obj);
        } else if (req.accepts('application/xml')) {
            res.header('Content-Type', 'application/xml');
            var xml = js2xmlparser.parse("response", obj);
            res.send(xml);
        } else {
            res.send(406);
        }
    }
    next();
});

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.text())
app.use(fileUpload())

// Exclude Headers
app.use(customHeaders)

// API Members - persistence
app.use('/api/members', createAccountLimiter, require('./routes/api/members'))

// API Authors - persistence
app.use('/api/authors', createAccountLimiter, require('./routes/api/authors'))

// API File Upload
app.use('/api/upload', require('./routes/api/fileupload'))

// API File Download
app.use('/api/download', require('./routes/api/fileDownload'))

// API Lag Example
app.use('/api/lag', require('./routes/api/lag'))

// Request Header Example
app.use('/api/sendheader', require('./routes/api/checkHeader'))

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})