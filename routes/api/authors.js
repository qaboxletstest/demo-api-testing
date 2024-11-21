const express = require('express')
const fs = require('fs')
const router = express.Router()
const { maxIdPlusOne, getIndexOfMember } = require('../../helpers/arrayManipulate')
const genders = ["male", "female"]
const path = require('path')
const filePath = path.normalize(__dirname + '../../../database/PFAuthors.json')
const authors = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const re = /^[A-Za-z ]+$/;

// Routes
/**
 * @swagger
 * /api/authors:
 *  get:
 *    description: Use to request all authors
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
 *        description: Author with gender "XYZ" doesn't exist response
 */
router.get('/', (req, res) => {
    const qr = req.query
    if (qr) {
        if ("gender" in qr) {
            const gn = qr.gender
            const found = authors.some(author => author.gender.toLowerCase() === gn.toLowerCase())
            if (found) {
                const author = authors.filter(author => author.gender.toLowerCase() === gn.toLowerCase())
                res.status(200).sendData(author.sort((m1, m2) => m1.id - m2.id))
            } else {
                res.status(404).sendData({
                    msg: `Author with gender ${gn} doesn't exist`
                })
            }
        }
    }
    res.sendData(authors.sort((m1, m2) => m1.id - m2.id))
})

/**
 * @swagger
 * /api/authors/{id}:
 *  get:
 *    description: Use to request an existing author
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
 *        description: Author with id "XYZ" doesn't exist response
 */
router.get('/:id', (req, res) => {
    const found = authors.some(author => author.id === parseInt(req.params.id))
    if (found) {
        const author = authors.filter(author => author.id === parseInt(req.params.id))
        res.status(200).sendData(author[0])
    } else {
        res.status(404).sendData({
            msg: `Author with id ${req.params.id} doesn't exist`
        })
    }
})

/**
 * @swagger
 * /api/authors:
 *    post:
 *      description: Use to insert a new author
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The author's name
 *                              required: true
 *                          gender:
 *                              type: string
 *                              description: The author's gender
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
    const newAuthor = {
        id: authors.length === 0 ? 1 : maxIdPlusOne(authors),
        name: req.body.name,
        gender: req.body.gender,
        books: req.body.books
    }
    if (Object.keys(req.body).length != 3 || !newAuthor.name || !newAuthor.gender || !newAuthor.books) {
        return res.status(400).sendData({
            msg: "Please provide only name, gender and books"
        })
    } else if (newAuthor.name.trim().length < 4 || newAuthor.name.trim().length > 25) {
        return res.status(400).sendData({
            msg: "Name should be 4 to 25 characters long"
        })
    } else if (!genders.includes((newAuthor.gender).toLowerCase())) {
        return res.status(400).sendData({
            msg: "Gender should be either male or female only"
        })
    } else if (!re.test(newAuthor.name)) {
        return res.status(400).sendData({
            msg: "Name should only contain Alphabets"
        })
    } else if (books.length === 0) {
        return res.status(400).sendData({
            msg: "Author must have written atleast one Book"
        })
    }
    authors.push(newAuthor)
    fs.writeFile(filePath, JSON.stringify(authors.sort((m1, m2) => m1.id - m2.id), null, 2), err => {
        if (err) {
            res.status(500).sendData({
                msg: `Internal Server Error while writing data to file`
            })
        } else {
            res.status(201).sendData(newAuthor)
        }
    })
})

// Update an Author
/**
 * @swagger
 * /api/authors/{id}:
 *    put:
 *      description: Use to update an existing author
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
 *                              description: The author's name
 *                              required: true
 *                          gender:
 *                              type: string
 *                              description: The author's gender
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
    const found = authors.some(author => author.id === parseInt(req.params.id))
    if (found) {
        const updAuthor = req.body
        if (Object.keys(req.body).length != 3 || !newAuthor.name || !newAuthor.gender || !newAuthor.books) {
            return res.status(400).sendData({
                msg: "Please provide only name, gender and books"
            })
        } else if (updAuthor.hasOwnProperty('name') && (updAuthor.name.trim().length < 4 || updAuthor.name.trim().length > 25)) {
            return res.status(400).sendData({
                msg: "Name should be 4 to 25 characters long"
            })
        } else if (updAuthor.hasOwnProperty('gender') && !genders.includes((updAuthor.gender).toLowerCase())) {
            return res.status(400).sendData({
                msg: "Gender should be either male or female only"
            })
        } else if (updAuthor.hasOwnProperty('name') && !re.test(updAuthor.name)) {
            return res.status(400).sendData({
                msg: "Name should only contain Alphabets"
            })
        }
        authors.forEach(author => {
            if (author.id == req.params.id) {
                author.name = updAuthor.name
                author.gender = updAuthor.gender
                author.books = updAuthor.books
                fs.writeFile(filePath, JSON.stringify(authors.sort((m1, m2) => m1.id - m2.id), null, 2), err => {
                    if (err) {
                        res.status(500).sendData({
                            msg: `Internal Server Error while writing data to file`
                        })
                    } else {
                        res.status(200).sendData({
                            msg: `author with id ${req.params.id} is updated successfully`,
                            author: author
                        })
                    }
                })
            }
        })
    } else {
        res.status(404).sendData({
            msg: `Author with id ${req.params.id} doesn't exist`
        })
    }
})

// Patch an exisiting Member

/**
 * @swagger
 * /api/authors/{id}:
 *    patch:
 *      description: Use to update an existing author
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
 *                              description: The author's name
 *                              required: false
 *                          gender:
 *                              type: string
 *                              description: The author's gender
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
    const found = authors.some(member => member.id === parseInt(req.params.id))
    if (found) {
        const updAuthor = req.body
        const payloadLength = Object.keys(req.body).length
        if (payloadLength > 2 || payloadLength === 0) {
            return res.status(400).sendData({
                msg: "Please provide only name and gender"
            })
        } else if (updAuthor.hasOwnProperty('name') && (updAuthor.name.trim().length < 4 || updAuthor.name.trim().length > 25)) {
            return res.status(400).sendData({
                msg: "Name should be 4 to 25 characters long"
            })
        } else if (updAuthor.hasOwnProperty('gender') && !genders.includes((updAuthor.gender).toLowerCase())) {
            return res.status(400).sendData({
                msg: "Gender should be either male or female only"
            })
        } else if (updAuthor.hasOwnProperty('name') && !re.test(updAuthor.name)) {
            return res.status(400).sendData({
                msg: "Name should only contain Alphabets"
            })
        }
        authors.forEach(member => {
            if (member.id == req.params.id) {
                member.name = updAuthor.name ? updAuthor.name : member.name
                member.gender = updAuthor.gender ? updAuthor.gender : member.gender
                fs.writeFile(filePath, JSON.stringify(authors.sort((m1, m2) => m1.id - m2.id), null, 2), err => {
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
            msg: `Author with id ${req.params.id} doesn't exist`
        })
    }
})

// Delete an Author
/**
 * @swagger
 * /api/authors/{id}:
 *  delete:
 *    description: Use to delete an existing author
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
 *        description: Author with id "XYZ" doesn't exist response
 */
router.delete('/:id', (req, res) => {
    const found = authors.some(member => member.id === parseInt(req.params.id))
    if (found) {
        authors.splice(getIndexOfMember(authors, parseInt(req.params.id)), 1)
        fs.writeFile(filePath, JSON.stringify(authors.sort((m1, m2) => m1.id - m2.id), null, 2), err => {
            if (err) {
                res.status(500).sendData({
                    msg: `Internal Server Error while writing data to file`
                })
            } else {
                res.status(200).sendData({
                    msg: `Author with id ${req.params.id} is deleted successfully`,
                    authors: authors.sort((m1, m2) => m1.id - m2.id)
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