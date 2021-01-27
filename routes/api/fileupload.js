const express = require('express')
const path = require("path");
const util = require("util");
const router = express.Router()
const PORT = process.env.PORT || 5002
const fs = require('fs')

router.post("/", async (req, res) => {
    try {
        const file = req.files.file;
        const fileName = file.name;
        const size = file.data.length;
        const extension = path.extname(fileName);

        const allowedExtensions = /png|jpeg|jpg|gif/;

        if (!allowedExtensions.test(extension)) throw "Unsupported extension!";
        if (size > 5000000) throw "File must be less than 5MB";

        const md5 = file.md5;
        const URL = md5 + extension;
        const dir = "./fileuploads/"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        await util.promisify(file.mv)(dir + URL);
        res.status(201)

        res.json({
            success: true,
            message: "File uploaded successfully!",
            url: `http://localhost:${PORT}/fileuploads/` + fileName,
        });
    } catch (err) {
        console.log(err);
        if (err === "Unsupported extension!" || err === "File must be less than 5MB") {
            res.status(400).json({
                success: false,
                message: err,
            });
        } else {
            res.status(500).json({
                success: false,
                message: err,
            });
        }

    }
});

module.exports = router