const express = require('express')
const router = express.Router()

/**
 * @swagger
 * /api/sendheader/:
 *  get:
 *    description: Use to show mandatory header for a request
 *    parameters:
 *      -
 *          name: ChannelName
 *          in : header
 *          type: string
 *          description: Mandatory Header (Pass "qa box lets test" or something)
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Pass "qa box lets test"
 */
router.get("/", (req, res) => {
    const header = req.header("ChannelName")
    if (header) {
        if (header.toLowerCase() === "qa box lets test") {
            res.status(200).sendData({
                channelname: `You are watching  - ${header.toUpperCase()}`
            })
        } else {
            res.status(400).sendData({
                msg: `${header.toUpperCase()} is nice; you may also check QA BOX LET\'S TEST!!!`
            })
        }
    } else {
        res.status(400).sendData({
            msg: `You must send ChannelName header in this request!!!`
        })
    }
})

module.exports = router