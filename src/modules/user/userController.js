const { getDB } = require("../../config/connectDB");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

const createUser = async (req, res) => {
    const Database = getDB();
    const registeredUser = Database.collection('registeredUser');

    try {
        const { fullName, email, phoneNumber, password, userRole, confirmPass } = req.body;

        const emailAllreadyRegistered =await  registeredUser.findOne({email});

        if(emailAllreadyRegistered) {
            return res.status(400).json({message: "Email All ready Registered. Please Login or Forget Password"})
        }

        if (!fullName || !email || !phoneNumber || !password || !confirmPass) {
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

        res.status(201).json({
            message: 'User successfully registered',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


const loginUser = async (req, res) => {
    const Database = getDB();
    const registeredUser = Database.collection('registeredUser');

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await registeredUser.findOne({ email });
        const userID = user._id;
        const phone = user.phoneNumber;
        const role = user.userRole;

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ email,phone,role,userID }, process.env.SECRET_KEY, { expiresIn: '1h' });

        const refreshToken = jwt.sign({ email,phone,role,userID }, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' });

        await registeredUser.updateOne({ email }, { $set: { refreshToken } });

        res.status(200).json({
            message: 'Login successful',
            accessToken: accessToken,
            refreshToken: refreshToken,
            userInformation: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};



module.exports = { createUser, loginUser };