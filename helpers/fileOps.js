const fs = require('fs')
const path = require('path')

function jsonReader(filePath, cb) {
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const obj = JSON.parse(fileData)
            return cb && cb(null, obj)
        } catch (err) {
            return cb && cb(err)
        }
    })
}

function jsonWriter(filePath, data, cb) {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            return cb && cb(null, 'Data is saved')
        } catch (err) {
            return cb && cb(err)
        }
    })
}

// jsonReader('./../database/PFMembers.json', (err, data) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(data)
//     }
// })

// let obj = {
//     "id": 4,
//     "name": "Johnny Smith",
//     "gender": "Male"
// }

// jsonWriter('./../database/PFMembers.json', obj, (err) => {
// jsonReader('./../database/PFMembers.json', (err, data) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(data)
//     }
// })
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(obj)
//     }
// })

module.exports = {
    jsonReader: jsonReader,
    jsonWriter: jsonWriter
}