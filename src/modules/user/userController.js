const { getDB } = require("../../config/connectDB");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

const createUser = async (req, res) => {
    const Database = getDB();
    const registeredUser = Database.collection('registeredUser');

    try {
        const { fullName, email, phoneNumber, password, userRole, confirmPass } = req.body;

        if (!email || !phoneNumber || !password || !confirmPass) {
            return res.status(400).json({ "success": 'Email, phone number, password, and confirm password are required' });
        }

        if (!isNaN(fullName)) {
            return res.status(400).json({ error: 'Full name must be a String' });
        }

        if (validator.isNumeric(email)) {
            return res.status(400).json({ error: 'Email cannot be a number' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (!Number.isInteger(Number(phoneNumber))) {
            return res.status(400).json({ error: 'Phone number must be an integer' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        if (password !== confirmPass) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { fullName, email, phoneNumber, password: hashedPassword, userRole };

        await registeredUser.insertOne(newUser);

        const accessToken = jwt.sign({ email, phoneNumber }, 'your-secret-key', { expiresIn: '1h' });

        res.status(201).json({
            message: 'User successfully registered',
            accessToken: accessToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = createUser;