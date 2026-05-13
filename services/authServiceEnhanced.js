/**
 * Enhanced Authentication Service
 * Supports both database and mock credentials for testing
 * When DB_MODE is set to 'mock', uses mock credentials
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserTypeModel } from '../models/userModel.js';
import { config } from 'dotenv';
import { findMockUserByEmail, findMockUserById } from '../config/mockCredentials.js';

config();

// Check if using mock mode
const USE_MOCK_MODE = process.env.DB_MODE === 'mock';

/**
 * Register function - supports both DB and mock mode
 */
export const register = async (userObj) => {
    if (USE_MOCK_MODE) {
        // Mock mode: return user without password
        const mockUser = { ...userObj };
        delete mockUser.password;
        return mockUser;
    }

    // Database mode: existing logic
    const userDoc = new UserTypeModel(userObj);
    await userDoc.validate();
    userDoc.password = await bcrypt.hash(userObj.password, 12);
    await userDoc.save();
    const newUserObj = userDoc.toObject();
    delete newUserObj.password;
    return newUserObj;
};

/**
 * Authenticate function - supports both DB and mock mode
 */
export const authenticate = async ({ email, password }) => {
    let user = null;

    if (USE_MOCK_MODE) {
        // Mock mode: find user in mock credentials
        user = findMockUserByEmail(email);
        if (!user) {
            const err = new Error("Invalid email");
            err.status = 401;
            throw err;
        }
    } else {
        // Database mode: find user in database
        user = await UserTypeModel.findOne({ email });
        if (!user) {
            const err = new Error("Invalid email");
            err.status = 401;
            throw err;
        }
    }

    // Compare password
    let passwordStatus = await bcrypt.compare(password, user.password);
    if (!passwordStatus) {
        const err = new Error("Invalid password");
        err.status = 401;
        throw err;
    }

    // Generate token
    let token = jwt.sign(
        {
            _id: user._id,
            userId: user._id, // Include userId for compatibility
            role: user.role,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    const userObj = { ...user };
    delete userObj.password;

    return { token, user: userObj };
};

/**
 * Get user by ID - supports both DB and mock mode
 */
export const getUserById = async (userId) => {
    if (USE_MOCK_MODE) {
        const user = findMockUserById(userId);
        if (!user) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }
        const userObj = { ...user };
        delete userObj.password;
        return userObj;
    }

    // Database mode
    const user = await UserTypeModel.findById(userId).select("-password");
    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }
    return user;
};

/**
 * Check if using mock mode
 */
export const isMockMode = () => USE_MOCK_MODE;
