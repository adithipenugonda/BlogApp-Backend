/**
 * File System Storage for Articles
 * Provides functions to manage articles using file system when database is unavailable
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

/**
 * Initialize data directory and files
 */
export const initializeFileSystem = () => {
    try {
        // Create data directory if it doesn't exist
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        // Create articles file if it doesn't exist
        if (!fs.existsSync(ARTICLES_FILE)) {
            fs.writeFileSync(ARTICLES_FILE, JSON.stringify({ articles: [], nextId: 1 }, null, 2));
        }
    } catch (err) {
        console.error('Error initializing file system:', err.message);
    }
};

/**
 * Read all articles from file
 */
export const readArticlesFromFile = () => {
    try {
        if (!fs.existsSync(ARTICLES_FILE)) {
            initializeFileSystem();
        }
        const data = fs.readFileSync(ARTICLES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading articles file:', err.message);
        return { articles: [], nextId: 1 };
    }
};

/**
 * Write articles to file
 */
export const writeArticlesToFile = (data) => {
    try {
        fs.writeFileSync(ARTICLES_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing articles file:', err.message);
        throw err;
    }
};

/**
 * Create a new article
 */
export const createArticleFile = (articleObj) => {
    try {
        const data = readArticlesFromFile();
        
        const newArticle = {
            _id: `article-${data.nextId}`,
            ...articleObj,
            isArticleActive: true,
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.articles.push(newArticle);
        data.nextId += 1;

        writeArticlesToFile(data);

        return newArticle;
    } catch (err) {
        console.error('Error creating article:', err.message);
        throw err;
    }
};

/**
 * Read article by ID
 */
export const readArticleByIdFile = (articleId) => {
    try {
        const data = readArticlesFromFile();
        const article = data.articles.find(a => a._id === articleId);
        
        if (!article) {
            const err = new Error('Article not found');
            err.status = 404;
            throw err;
        }

        return article;
    } catch (err) {
        throw err;
    }
};

/**
 * Read articles by author ID
 */
export const readArticlesByAuthorFile = (authorId) => {
    try {
        const data = readArticlesFromFile();
        return data.articles.filter(a => a.author === authorId && a.isArticleActive === true);
    } catch (err) {
        console.error('Error reading articles by author:', err.message);
        throw err;
    }
};

/**
 * Update article by ID
 */
export const updateArticleFile = (articleId, updates) => {
    try {
        const data = readArticlesFromFile();
        const articleIndex = data.articles.findIndex(a => a._id === articleId);

        if (articleIndex === -1) {
            const err = new Error('Article not found');
            err.status = 404;
            throw err;
        }

        const updatedArticle = {
            ...data.articles[articleIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        data.articles[articleIndex] = updatedArticle;
        writeArticlesToFile(data);

        return updatedArticle;
    } catch (err) {
        throw err;
    }
};

/**
 * Delete article (soft delete) by ID
 */
export const deleteArticleFile = (articleId) => {
    try {
        return updateArticleFile(articleId, { isArticleActive: false });
    } catch (err) {
        throw err;
    }
};

/**
 * Restore article by ID
 */
export const restoreArticleFile = (articleId) => {
    try {
        return updateArticleFile(articleId, { isArticleActive: true });
    } catch (err) {
        throw err;
    }
};

/**
 * Add comment to article
 */
export const addCommentToArticleFile = (articleId, commentObj) => {
    try {
        const data = readArticlesFromFile();
        const article = data.articles.find(a => a._id === articleId);

        if (!article) {
            const err = new Error('Article not found');
            err.status = 404;
            throw err;
        }

        const newComment = {
            _id: `comment-${Date.now()}`,
            ...commentObj,
            createdAt: new Date().toISOString()
        };

        article.comments.push(newComment);
        writeArticlesToFile(data);

        return article;
    } catch (err) {
        throw err;
    }
};

/**
 * Get all articles
 */
export const getAllArticlesFile = () => {
    try {
        const data = readArticlesFromFile();
        return data.articles.filter(a => a.isArticleActive === true);
    } catch (err) {
        console.error('Error reading all articles:', err.message);
        throw err;
    }
};

// Initialize on module load
initializeFileSystem();
