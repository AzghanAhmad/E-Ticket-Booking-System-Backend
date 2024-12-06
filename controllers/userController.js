import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';


// Utility for error handling
const handleError = (res, error, status = 500) => {
    res.status(status).send({ message: error.message || 'Server Error' });
};

// User Signup
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: 'Invalid email format.' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Use 'user', not 'admin'
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).send({
            message: 'User registered successfully',
            token,
            role: user.role, // Explicitly return role
        });
    } catch (error) {
        handleError(res, error);
    }
};

// User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: 'Invalid email or password.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password); // Corrected to 'user'
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Corrected to 'user'
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.send({
            message: 'Login successful',
            token,
            role: user.role, // Explicitly return role
        });
    } catch (error) {
        handleError(res, error);
    }
};
