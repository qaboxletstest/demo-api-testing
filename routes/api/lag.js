const express = require('express')
const router = express.Router()

/**
 * @swagger
 * /api/lag:
 *  get:
 *    description: Use to request a delayed response
 *    parameters:
 *          - in : query
 *            name : delay
 *            required : true
 *    responses:
 *      '200':
 *        description: A successful response
 */
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