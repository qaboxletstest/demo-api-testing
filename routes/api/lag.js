const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    const qr = req.query
    if (qr) {
        if ("delay" in qr) {
            const lag = qr.delay
            setTimeout(() => {
                res.status(200).sendData({
                    msg: `Intentional Delayed Response - ${lag}`
                })
            }, lag)
        }
    }
})

module.exports = router