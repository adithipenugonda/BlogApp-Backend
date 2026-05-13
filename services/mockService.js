/**
 * Mock Mode Authentication and Article Service
 * Replaces the need for database when DB_MODE=mock in .env
 * 
 * Usage:
 * 1. Set DB_MODE=mock in your .env file
 * 2. Set STORAGE_MODE=filesystem (optional) to use file system for articles
 * 3. Use the mock credentials provided in mockCredentials.js to login
 * 4. Articles will be stored in backend/data/articles.json
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { findMockUserByEmail, findMockUserById } from '../config/mockCredentials.js';
import { 
    createArticleFile,
    readArticleByIdFile,
    readArticlesByAuthorFile,
    updateArticleFile,
    deleteArticleFile,
    restoreArticleFile,
    getAllArticlesFile
} from '../utils/fileSystemStorage.js';

config();

const USE_MOCK_MODE = process.env.DB_MODE === 'mock';

/**
 * Authenticate with mock credentials or database
 */
export const authenticateMock = async ({ email, password }) => {
    let user = null;

    if (USE_MOCK_MODE) {
        user = findMockUserByEmail(email);
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
            userId: user._id,
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
 * Get user by ID with mock support
 */
export const getUserByIdMock = (userId) => {
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
    return null;
};

/**
 * Article operations with file system support
 */
export const articleOperations = {
    create: createArticleFile,
    readById: readArticleByIdFile,
    readByAuthor: readArticlesByAuthorFile,
    update: updateArticleFile,
    delete: deleteArticleFile,
    restore: restoreArticleFile,
    getAll: getAllArticlesFile
};

/**
 * Check if in mock mode
 */
export const isUsingMockMode = () => USE_MOCK_MODE;
