const express = require('express')
const fs = require('fs')
const router = express.Router()
const path = require('path')
const filePath = path.normalize(__dirname + '../../../database/Vehicles.json')
const vehicles = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

// Routes
/**
 * @swagger
 * /api/vehicles:
 *  get:
 *    description: Use to request all vehicles
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized response
 */
router.get('/', (req, res) => {
    res.sendData(vehicles)
})

module.exports = router