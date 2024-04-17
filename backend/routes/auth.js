const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Vasuisking#"

// ROUTE 1: CREATE a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a strong password').isLength({ min: 5 }),
], async (req, res) => {
    let success = false

    // If there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    // Check whether the user with the same email exists

    try {

        // Finding whether the user with the same email exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: 'Please login with correct Credentials' })
        }

        // Encrypting the password using hash function and salt
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Creating User
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })

        const data = {
            user: {
                id: user.id
            }
        }

        //Making an authentication token, so that the same user can login without using mail and password
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken})

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false
    
    // If there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    
    const {email, password} = req.body;

    try {

        // Finding whether the user with the same email exists
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({success, error: 'Wrong Username or Password' })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({success, error: 'Wrong Username or Password' })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        //Making an authentication token, so that the same user can login without using mail and password
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success, authtoken})

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 3: Get loggedin User details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router