const express = require('express')
const fs = require('fs')
const router = express.Router()
const { maxIdPlusOne, getIndexOfMember } = require('../../helpers/arrayManipulate')
const genders = ["male", "female"]
const path = require('path')
const filePath = path.normalize(__dirname + '..\\..\\..\\database\\PFMembers.json')
const members = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const re = /^[A-Za-z ]+$/;

// Routes
/**
 * @swagger
 * /api/members:
 *  get:
 *    description: Use to request all members
 *    responses:
 *      '200':
 *        description: A successful response
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
 *    description: Use to request a delayed response
 *    parameters:
 *          - in : path
 *            name : id
 *            required : true
 *    responses:
 *      '200':
 *        description: A successful response
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
 * /api/member:
 *    post:
 *      description: Use to insert a new member
 *    parameters:
 *      - name: customer
 *        in: query
 *        description: Name of our customer
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully created user
 */
router.post('/', (req, res) => {
    const newMember = {
        id: members.length === 0 ? 1 : maxIdPlusOne(members),
        name: req.body.name,
        gender: req.body.gender
    }
    if (Object.keys(req.body).length > 2) {
        return res.status(400).sendData({
            msg: "Please provide only name and gender"
        })
    } else if (!newMember.name || !newMember.gender) {
        return res.status(400).sendData({
            msg: "Please provide a name and gender"
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
router.put('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {
        const updmember = req.body
        if (Object.keys(req.body).length > 2) {
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