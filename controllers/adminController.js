import bcrypt from 'bcrypt';
import User from '../models/user.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Utility for error handling
const handleError = (res, error, status = 500) => {
    res.status(status).send({ message: error.message || 'Server Error' });
};

// Get all admins
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find().select('-password');
        res.send(admins);
    } catch (error) {
        handleError(res, error);
    }
};

// Update admin
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedAdmin = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!updatedAdmin) {
            return res.status(404).send({ message: 'Admin not found.' });
        }

        res.send({ message: 'Admin updated successfully.', admin: updatedAdmin });
    } catch (error) {
        handleError(res, error);
    }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAdmin = await User.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return res.status(404).send({ message: 'Admin not found.' });
        }

        res.send({ message: 'Admin deleted successfully.' });
    } catch (error) {
        handleError(res, error);
    }
};

const resetTokens = new Map();

// Request Password Reset
export const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email exists
        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(404).send({ message: 'Admin with this email does not exist.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Store token with an expiry time of 15 minutes
        resetTokens.set(resetToken, { adminId: admin._id, expires: Date.now() + 15 * 60 * 1000 });

        // Send reset link via email (Using nodemailer for demonstration)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Your email
                pass: process.env.EMAIL_PASSWORD, // Your email password
            },
        });

        const resetLink = `${req.protocol}://${req.get('host')}/admin/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Request',
            text: `Click on the following link to reset your password: ${resetLink}. This link is valid for 15 minutes.`,
        });

        res.status(200).send({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        handleError(res, error);
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Validate new password
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).send({ message: 'Password must be at least 8 characters long.' });
        }

        // Check if the token exists and is valid
        const resetData = resetTokens.get(token);
        if (!resetData || resetData.expires < Date.now()) {
            return res.status(400).send({ message: 'Invalid or expired token.' });
        }

        // Fetch the admin from the database
        const admin = await User.findById(resetData.adminId);
        if (!admin) {
            return res.status(404).send({ message: 'Admin not found.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update admin's password
        admin.password = hashedPassword;
        await admin.save();

        // Invalidate the token
        resetTokens.delete(token);

        res.status(200).send({ message: 'Password has been reset successfully.' });
    } catch (error) {
        handleError(res, error);
    }
};