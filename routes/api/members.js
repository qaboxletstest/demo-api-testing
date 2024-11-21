const express = require('express')
const fs = require('fs')
const router = express.Router()
const { maxIdPlusOne, getIndexOfMember } = require('../../helpers/arrayManipulate')
const genders = ["male", "female"]
const path = require('path')
const filePath = path.normalize(__dirname + '../../../database/PFMembers.json')
const members = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const re = /^[A-Za-z ]+$/;

// Routes
/**
 * @swagger
 * /api/members:
 *  get:
 *    description: Use to request all members
 *    parameters:
 *      -
 *          in : query
 *          name: gender
 *          required : false
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized response
 *      '404':
 *        description: Member with gender "XYZ" doesn't exist response
 */
router.get('/', (req, res) => {
    const qr = req.query
    if (qr) {
        if ("gender" in qr) {
            const gn = qr.gender
            const found = members.some(member => member.gender.toLowerCase() === gn.toLowerCase())
            if (found) {
                const member = members.filter(member => member.gender.toLowerCase() === gn.toLowerCase())
                res.status(200).sendData(member.sort((m1, m2) => m1.id - m2.id))
            } else {
                res.status(404).sendData({
                    msg: `Member with gender ${gn} doesn't exist`
                })
            }
        }
    }
    res.sendData(members.sort((m1, m2) => m1.id - m2.id))
})

/**
 * @swagger
 * /api/members/{id}:
 *  get:
 *    description: Use to request an existing member
 *    parameters:
 *          - in : path
 *            name : id
 *            type : integer
 *            required : true
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized response
 *      '404':
 *        description: Member with id "XYZ" doesn't exist response
 */
router.get('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {
        const member = members.filter(member => member.id === parseInt(req.params.id))
        res.status(200).sendData(member[0])
    } else {
        res.status(404).sendData({
            msg: `Member with id ${req.params.id} doesn't exist`
        })
    }
})

/**
 * @swagger
 * /api/members:
 *    post:
 *      description: Use to insert a new member
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The member's name
 *                              required: true
 *                          gender:
 *                              type: string
 *                              description: The member's gender
 *                              required: true
 *      responses:
 *          '201':
 *              description: Successfully created user
 *          '401':
 *              description: Unauthorized response
 *          '400':
 *              description: Bad Request
 */
router.post('/', (req, res) => {
    const newMember = {
        id: members.length === 0 ? 1 : maxIdPlusOne(members),
        name: req.body.name,
        gender: req.body.gender
    }
    if (Object.keys(req.body).length != 2 || !newMember.name || !newMember.gender) {
        return res.status(400).sendData({
            msg: "Please provide only name and gender"
        })
    } else if (newMember.name.trim().length < 4 || newMember.name.trim().length > 25) {
        return res.status(400).sendData({
            msg: "Name should be 4 to 25 characters long"
        })
    } else if (!genders.includes((newMember.gender).toLowerCase())) {
        return res.status(400).sendData({
            msg: "Gender should be either male or female only"
        })
    } else if (!re.test(newMember.name)) {
        return res.status(400).sendData({
            msg: "Name should only contain Alphabets"
        })
    }
    members.push(newMember)
    fs.writeFile(filePath, JSON.stringify(members.sort((m1, m2) => m1.id - m2.id), null, 2), err => {
        if (err) {
            res.status(500).sendData({
                msg: `Internal Server Error while writing data to file`
            })
        } else {
            res.status(201).sendData(newMember)
        }
    })
})

// Update a Member
/**
 * @swagger
 * /api/members/{id}:
 *    put:
 *      description: Use to update an existing member
 *      parameters:
 *          - in: path
 *            name: id
 *            type: integer
 *            required: true  
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The member's name
 *                              required: true
 *                          gender:
 *                              type: string
 *                              description: The member's gender
 *                              required: true
 *      responses:
 *          '200':
 *              description: Successfully updated user
 *          '401':
 *              description: Unauthorized response
 *          '400':
 *              description: Bad Request
 */
router.put('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {
        const updmember = req.body
        if (Object.keys(req.body).length != 2 || !updmember.hasOwnProperty('name') || !updmember.hasOwnProperty('gender')) {
            return res.status(400).sendData({
                msg: "Please provide only name and gender"
            })
        } else if (updmember.hasOwnProperty('name') && (updmember.name.trim().length < 4 || updmember.name.trim().length > 25)) {
            return res.status(400).sendData({
                msg: "Name should be 4 to 25 characters long"
            })
        } else if (updmember.hasOwnProperty('gender') && !genders.includes((updmember.gender).toLowerCase())) {
            return res.status(400).sendData({
                msg: "Gender should be either male or female only"
            })
        } else if (updmember.hasOwnProperty('name') && !re.test(updmember.name)) {
            return res.status(400).sendData({
                msg: "Name should only contain Alphabets"
            })
        }
        members.forEach(member => {
            if (member.id == req.params.id) {
                member.name = updmember.name
                member.gender = updmember.gender
                fs.writeFile(filePath, JSON.stringify(members.sort((m1, m2) => m1.id - m2.id), null, 2), err => {
                    if (err) {
                        res.status(500).sendData({
                            msg: `Internal Server Error while writing data to file`
                        })
                    } else {
                        res.status(200).sendData({
                            msg: `Member with id ${req.params.id} is updated successfully`,
                            member: member
                        })
                    }
                })
            }
        })
    } else {
        res.status(404).sendData({
            msg: `Member with id ${req.params.id} doesn't exist`
        })
    }
})

// Patch an exisiting Member

/**
 * @swagger
 * /api/members/{id}:
 *    patch:
 *      description: Use to update an existing member
 *      parameters:
 *          - in: path
 *            name: id
 *            type: integer
 *            required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The member's name
 *                              required: false
 *                          gender:
 *                              type: string
 *                              description: The member's gender
 *                              required: false
 *      responses:
 *          '200':
 *              description: Successfully updated user
 *          '401':
 *              description: Unauthorized response
 *          '400':
 *              description: Bad Request
 */

router.patch('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {
        const updmember = req.body
        const payloadLength = Object.keys(req.body).length
        if (payloadLength > 2 || payloadLength === 0) {
            return res.status(400).sendData({
                msg: "Please provide only name and gender"
            })
        } else if (updmember.hasOwnProperty('name') && (updmember.name.trim().length < 4 || updmember.name.trim().length > 25)) {
            return res.status(400).sendData({
                msg: "Name should be 4 to 25 characters long"
            })
        } else if (updmember.hasOwnProperty('gender') && !genders.includes((updmember.gender).toLowerCase())) {
            return res.status(400).sendData({
                msg: "Gender should be either male or female only"
            })
        } else if (updmember.hasOwnProperty('name') && !re.test(updmember.name)) {
            return res.status(400).sendData({
                msg: "Name should only contain Alphabets"
            })
        }
        members.forEach(member => {
            if (member.id == req.params.id) {
                member.name = updmember.name ? updmember.name : member.name
                member.gender = updmember.gender ? updmember.gender : member.gender
                fs.writeFile(filePath, JSON.stringify(members.sort((m1, m2) => m1.id - m2.id), null, 2), err => {
                    if (err) {
                        res.status(500).sendData({
                            msg: `Internal Server Error while writing data to file`
                        })
                    } else {
                        res.status(200).sendData({
                            msg: `Member with id ${req.params.id} is updated successfully`,
                            member: member
                        })
                    }
                })
            }
        })
    } else {
        res.status(404).sendData({
            msg: `Member with id ${req.params.id} doesn't exist`
        })
    }
})

// Delete a Member
/**
 * @swagger
 * /api/members/{id}:
 *  delete:
 *    description: Use to delete an existing member
 *    parameters:
 *          - in : path
 *            name : id
 *            type : integer
 *            required : true
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized response
 *      '404':
 *        description: Member with id "XYZ" doesn't exist response
 */
router.delete('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {
        members.splice(getIndexOfMember(members, parseInt(req.params.id)), 1)
        fs.writeFile(filePath, JSON.stringify(members.sort((m1, m2) => m1.id - m2.id), null, 2), err => {
            if (err) {
                res.status(500).sendData({
                    msg: `Internal Server Error while writing data to file`
                })
            } else {
                res.status(200).sendData({
                    msg: `Member with id ${req.params.id} is deleted successfully`,
                    members: members.sort((m1, m2) => m1.id - m2.id)
                })
            }
        })
    } else {
        res.status(404).sendData({
            msg: `Member with id ${req.params.id} doesn't exist`
        })
    }
})

module.exports = router