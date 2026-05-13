/**
 * Environment Configuration Helper
 * Determines whether to use Database or File System storage
 */

import { isMockMode as isMockModeAuth } from '../services/authServiceEnhanced.js';
import { config } from 'dotenv';

config();

// Storage mode: 'database' or 'filesystem'
const STORAGE_MODE = process.env.STORAGE_MODE || 'database';

/**
 * Check if using database storage
 */
export const isDatabaseMode = () => {
    return STORAGE_MODE === 'database';
};

/**
 * Check if using file system storage
 */
export const isFileSystemMode = () => {
    return STORAGE_MODE === 'filesystem';
};

/**
 * Check if running in mock/demo mode (no database)
 */
export const isMockMode = () => {
    return process.env.DB_MODE === 'mock';
};

/**
 * Get current storage configuration
 */
export const getStorageConfig = () => {
    return {
        storageMode: STORAGE_MODE,
        dbMode: process.env.DB_MODE || 'database',
        isMockMode: isMockMode(),
        isFileSystemMode: isFileSystemMode(),
        isDatabaseMode: isDatabaseMode()
    };
};
