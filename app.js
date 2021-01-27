const express = require('express')
const path = require('path')
const simpleAuth = require('./middleware/authentication')
const logger = require('./middleware/logger')
const fileUpload = require('express-fileupload')

const app = express()
const PORT = process.env.PORT || 5002

// Middleware 
// Moved to a separate folder

// Init middleware
// app.use(logger)

// STEP 1
// app.get('/', (req, res) => {
//     // res.send('<h1>Hello World</h1>')
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

//Set Static Folder
// app.use(express.static(path.join(__dirname, 'public')))

// Init Basic Authentication Middleware
app.use(simpleAuth)

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.text())
app.use(fileUpload())

// API Members - persistence
app.use('/api/members', require('./routes/api/members'))

// API File Upload
app.use('/api/upload', require('./routes/api/fileupload'))

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})