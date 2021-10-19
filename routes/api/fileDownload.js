const mime = require('mime');
const fs = require('fs');
const express = require('express')
const path = require("path");
const router = express.Router()

router.get('/', function (req, res) {
    const qr = req.query
    if (qr) {
        if ("name" in qr) {
            const fileInput = qr.name
            const file = path.normalize(__dirname + `..\\..\\..\\filedownload\\${fileInput}`)
            console.log(file)
            const filename = path.basename(file);
            const mimetype = mime.getType(file);
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);
            if (fs.existsSync(file)) {
                res.status(200)
                const filestream = fs.createReadStream(file);
                filestream.pipe(res);
            } else {
                res.status(404).sendData({
                    msg: `${fileInput} doesn't exist`
                })
            }
        }
    }
});

module.exports = router