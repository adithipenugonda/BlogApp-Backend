/**
 * Integration Guide for Mock Mode
 * Shows how to integrate mock credentials and file system storage
 * into existing API endpoints
 */

// ============================================================================
// EXAMPLE 1: Update commonAPI.js to support mock authentication
// ============================================================================

import express from 'express';
import { config } from 'dotenv';
import { authenticateMock, isUsingMockMode, getUserByIdMock } from '../services/mockService.js';
import { authenticate } from '../services/authService.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { UserTypeModel } from '../models/userModel.js';

config();

// Use mock service if in mock mode, otherwise use regular auth service
const authService = {
    authenticate: isUsingMockMode() ? authenticateMock : authenticate
};

export const commonRouter = express.Router();

// Login endpoint
commonRouter.post('/login', async (req, res, next) => {
    try {
        let userCred = req.body;
        let { token, user } = await authService.authenticate(userCred);
        
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });
        
        res.status(200).json({ message: "login success", payload: user });
    } catch (err) {
        next(err);
    }
});

// Check auth endpoint
commonRouter.get('/check-auth', verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId;
        
        let user;
        if (isUsingMockMode()) {
            user = getUserByIdMock(userId);
        } else {
            user = await UserTypeModel.findById(userId).select("-password");
        }
        
        if (!user || (user.isActive === false)) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        
        res.status(200).json({ message: "Authenticated", payload: user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ============================================================================
// EXAMPLE 2: Update authorAPI.js to support file system article storage
// ============================================================================

import { 
    articleOperations, 
    isUsingMockMode as isMockModeActive 
} from '../services/mockService.js';
import { ArticleModel } from '../models/articleModel.js';

export const authorRoute = express.Router();

// Create article
authorRoute.post("/articles", verifyToken("AUTHOR"), async (req, res) => {
    try {
        const articleObj = req.body;
        
        let savedArticle;
        if (isMockModeActive()) {
            // Use file system storage
            savedArticle = articleOperations.create(articleObj);
        } else {
            // Use database
            const articleDoc = new ArticleModel(articleObj);
            savedArticle = await articleDoc.save();
            savedArticle = savedArticle.toObject();
        }
        
        res.status(201).json({ message: "article created", payload: savedArticle });
    } catch (err) {
        next(err);
    }
});

// Get articles by author
authorRoute.get("/articles/:authorId", verifyToken("AUTHOR"), async (req, res) => {
    try {
        const authorId = req.params.authorId;
        
        let articles;
        if (isMockModeActive()) {
            // Use file system storage
            articles = articleOperations.readByAuthor(authorId);
        } else {
            // Use database
            articles = await ArticleModel.find({ 
                author: authorId, 
                isArticleActive: true 
            }).populate("author", "firstName email");
        }
        
        res.status(200).json({ message: "articles", payload: articles });
    } catch (err) {
        next(err);
    }
});

// Update article
authorRoute.put("/articles", verifyToken("AUTHOR"), async (req, res) => {
    try {
        const { articleId, title, content, category, author } = req.body;
        
        let updatedArticle;
        if (isMockModeActive()) {
            // Use file system storage
            updatedArticle = articleOperations.update(articleId, {
                title,
                content,
                category
            });
        } else {
            // Use database
            updatedArticle = await ArticleModel.findByIdAndUpdate(
                articleId,
                { $set: { title, content, category } },
                { new: true }
            );
        }
        
        res.status(200).json({ message: "article updated", payload: updatedArticle });
    } catch (err) {
        next(err);
    }
});

// Delete article (soft delete)
authorRoute.delete('/articles/authorId/:authorId/articleId/:articleId', 
    verifyToken("AUTHOR"), 
    async (req, res) => {
        try {
            const { articleId, authorId } = req.params;
            
            if ((req.user._id || req.user.userId) !== authorId) {
                return res.status(403).json({ message: "Forbidden." });
            }
            
            let article;
            if (isMockModeActive()) {
                // Use file system storage
                article = articleOperations.delete(articleId);
            } else {
                // Use database
                article = await ArticleModel.findByIdAndUpdate(
                    articleId,
                    { $set: { isArticleActive: false } },
                    { new: true }
                );
            }
            
            if (!article) {
                return res.status(404).json({ message: "article not found" });
            }
            
            res.status(200).json({ message: "article deleted", payload: article });
        } catch (err) {
            next(err);
        }
    }
);

// Restore article
authorRoute.patch('/articles/authorId/:authorId/articleId/:articleId',
    verifyToken("AUTHOR"),
    async (req, res) => {
        try {
            const { articleId, authorId } = req.params;
            
            if ((req.user._id || req.user.userId) !== authorId) {
                return res.status(403).json({ message: "Forbidden." });
            }
            
            let article;
            if (isMockModeActive()) {
                // Use file system storage
                article = articleOperations.restore(articleId);
            } else {
                // Use database
                article = await ArticleModel.findByIdAndUpdate(
                    articleId,
                    { $set: { isArticleActive: true } },
                    { new: true }
                );
            }
            
            if (!article) {
                return res.status(404).json({ message: "article not found" });
            }
            
            res.status(200).json({ message: "article restored", payload: article });
        } catch (err) {
            next(err);
        }
    }
);

// ============================================================================
// EXAMPLE 3: Update commonAPI.js for getting single article with file support
// ============================================================================

// Get single article by ID
commonRouter.get('/articles/:articleId', verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
    try {
        const articleId = req.params.articleId;
        
        let article;
        if (isMockModeActive()) {
            // Use file system storage
            article = articleOperations.readById(articleId);
        } else {
            // Use database
            article = await ArticleModel.findOne({ _id: articleId, isArticleActive: true })
                .populate("author", "firstName lastName email profileImageUrl")
                .populate("comments.user", "firstName lastName profileImageUrl");
        }
        
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        
        res.status(200).json({ message: "article", payload: article });
    } catch (err) {
        next(err);
    }
});

// ============================================================================
// SUMMARY OF CHANGES
// ============================================================================

/*
To integrate mock mode into your existing APIs:

1. Import the mock service:
   import { articleOperations, isUsingMockMode } from '../services/mockService.js';

2. Check mode before database operation:
   if (isUsingMockMode()) {
       // Use articleOperations for file system
   } else {
       // Use existing database code
   }

3. Available operations:
   - articleOperations.create(articleObj)           // Create article
   - articleOperations.readById(articleId)          // Get article by ID
   - articleOperations.readByAuthor(authorId)       // Get articles by author
   - articleOperations.update(articleId, updates)   // Update article
   - articleOperations.delete(articleId)            // Soft delete
   - articleOperations.restore(articleId)           // Restore article
   - articleOperations.getAll()                     // Get all articles

4. For authentication:
   import { authenticateMock } from '../services/mockService.js';
   
5. Configuration in .env:
   DB_MODE=mock              # Use mock credentials
   STORAGE_MODE=filesystem   # Use file system for articles

No need to modify existing code if you prefer! The mock system works
alongside your database system - just toggle the .env variables.
*/
