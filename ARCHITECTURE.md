"""
📊 SYSTEM ARCHITECTURE OVERVIEW

This document shows how the mock credentials and file system storage 
integrate with your Blog Application.
"""

# ============================================================================
# ARCHITECTURE DIAGRAM
# ============================================================================

LOGIN FLOW:
┌─────────────────────────────────────────────────────────────────────────┐
│ Frontend (React/Vue)                                                    │
│ POST /common-api/login {email, password}                               │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ commonAPI.js (/login endpoint)                                         │
│ - Receives email and password                                          │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Authentication Service                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐   │
│ │ CHECK: Is DB_MODE set to 'mock'?                               │   │
│ └─────────────────┬──────────────────────────────────────────┬────┘   │
│                   │                                          │        │
│         YES ▼                                          NO ▼         │
│   ┌──────────────────────┐                   ┌──────────────────┐   │
│   │ mockService.js       │                   │ authService.js   │   │
│   │ authenticateMock()    │                   │ authenticate()   │   │
│   └──────────────┬───────┘                   └────────┬─────────┘   │
│                  │                                    │              │
│                  ▼                                    ▼              │
│   ┌──────────────────────┐                   ┌──────────────────┐   │
│   │ findMockUserByEmail()│                   │ MongoDBQuery     │   │
│   │ Compare password     │                   │ UserTypeModel    │   │
│   │ ✓ Generate JWT       │                   │ findOne()        │   │
│   └──────────────────────┘                   └──────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘


ARTICLE CREATION FLOW:
┌─────────────────────────────────────────────────────────────────────────┐
│ Frontend (React/Vue)                                                    │
│ POST /author-api/articles {title, content, category, author}          │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ authorAPI.js (POST /articles endpoint)                                │
│ - Verify user is AUTHOR role                                           │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Article Service                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐   │
│ │ CHECK: Is STORAGE_MODE set to 'filesystem'?                    │   │
│ └─────────────────────┬──────────────────────────────────────┬────┘   │
│                       │                                      │        │
│           YES ▼                                      NO ▼           │
│ ┌──────────────────────────────┐           ┌──────────────────────┐ │
│ │ fileSystemStorage.js         │           │ ArticleModel.js      │ │
│ │ createArticleFile()           │           │ save()               │ │
│ │ - Generate ID                 │           │ - MongoDB            │ │
│ │ - Add timestamps              │           │ - Persist to DB      │ │
│ │ - Write to JSON file          │           └──────────────────────┘ │
│ └──────────────┬────────────────┘                                     │
│                │                                                      │
│                ▼                                                      │
│ ┌──────────────────────────────┐                                     │
│ │ backend/data/articles.json   │                                     │
│ │ {                            │                                     │
│ │   "articles": [              │                                     │
│ │     {                         │                                     │
│ │       "_id": "article-1",    │                                     │
│ │       "title": "...",        │                                     │
│ │       "content": "...",      │                                     │
│ │       ...                    │                                     │
│ │     }                        │                                     │
│ │   ],                         │                                     │
│ │   "nextId": 2               │                                     │
│ │ }                            │                                     │
│ └──────────────────────────────┘                                     │
└──────────────────────────────────────────────────────────────────────────┘


# ============================================================================
# CONFIGURATION TREE
# ============================================================================

.env Configuration
│
├─ DB_MODE
│  ├─ "mock"     → Use mockCredentials.js
│  └─ "database" → Use MongoDB
│
├─ STORAGE_MODE
│  ├─ "filesystem" → Use fileSystemStorage.js
│  └─ "database"   → Use MongoDB
│
├─ JWT_SECRET
│  └─ String → Used for token signing
│
└─ DB_URL (if needed)
   └─ MongoDB connection string


# ============================================================================
# DATA FLOW DIAGRAM
# ============================================================================

┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND APPLICATION                             │
│                      (React/Vue Components)                            │
└────────────────────────────────────────┬────────────────────────────────┘
                                         │
                    API Calls (HTTP/REST)│
                                         │
┌────────────────────────────────────────▼────────────────────────────────┐
│                        BACKEND SERVER (Node.js/Express)                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Route Handlers (commonAPI, authorAPI, userAPI, adminAPI)        │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               │                                         │
│         ┌─────────────────────┴──────────────────────┐                  │
│         │                                            │                  │
│         ▼                                            ▼                  │
│  ┌────────────────────────┐            ┌─────────────────────────┐     │
│  │  AUTHENTICATION        │            │ ARTICLE MANAGEMENT      │     │
│  ├────────────────────────┤            ├─────────────────────────┤     │
│  │ Check DB_MODE:         │            │ Check STORAGE_MODE:     │     │
│  │                        │            │                         │     │
│  │ "mock" → mockService   │            │ "filesystem" →          │     │
│  │ ├─ authenticateMock()  │            │ ├─ fileSystemStorage    │     │
│  │ └─ getUserByIdMock()   │            │ ├─ createArticleFile    │     │
│  │                        │            │ ├─ readArticleByIdFile  │     │
│  │ "database" →           │            │ └─ updateArticleFile    │     │
│  │ ├─ authenticate()      │            │                         │     │
│  │ └─ UserTypeModel       │            │ "database" →            │     │
│  └────────────────────────┘            │ ├─ ArticleModel         │     │
│                                        │ └─ MongoDB              │     │
│  ┌──────────────────────────────────┐  └─────────────────────────┘     │
│  │ Generate JWT Token               │                                  │
│  │ Set HTTP Cookie                  │                                  │
│  └──────────────────────────────────┘                                  │
└────────────────────────────────────────┬─────────────────────────────────┘
                                         │
                    Return JSON Response │
                                         │
┌────────────────────────────────────────▼─────────────────────────────────┐
│                     DATA STORAGE LAYER                                  │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                    ┌──────────────────────┐                        │ │
│ │                    │   DB_MODE + MODE    │                        │ │
│ │                    └───┬────────┬─────────┘                        │ │
│ │                        │        │                                 │ │
│ │        ┌───────────────┘        └──────────────┐                 │ │
│ │        │                                       │                 │ │
│ │        ▼                                       ▼                 │ │
│ │   ┌─────────────────┐                ┌──────────────────┐       │ │
│ │   │  FILE SYSTEM    │                │   MONGODB        │       │ │
│ │   ├─────────────────┤                ├──────────────────┤       │ │
│ │   │ mockCredentials │                │ UserTypeModel    │       │ │
│ │   │ fileSystemStore │                │ ArticleModel     │       │ │
│ │   │                 │                │ Comments         │       │ │
│ │   │ articles.json   │                │ Indexes          │       │ │
│ │   └─────────────────┘                └──────────────────┘       │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘


# ============================================================================
# FILE SYSTEM STORAGE STRUCTURE
# ============================================================================

backend/
│
├── data/
│   └── articles.json              ← All articles stored here
│                                    {
│                                      "articles": [ ... ],
│                                      "nextId": 1
│                                    }
│
├── config/
│   ├── mockCredentials.js         ← Mock user data
│   │   ├── mockUsers.users        (Regular users)
│   │   ├── mockUsers.authors      (Authors)
│   │   └── mockUsers.admins       (Admins)
│   │
│   └── storageConfig.js           ← Configuration helpers
│
├── utils/
│   └── fileSystemStorage.js       ← File I/O operations
│       ├── createArticleFile()
│       ├── readArticleByIdFile()
│       ├── updateArticleFile()
│       ├── deleteArticleFile()
│       └── restoreArticleFile()
│
└── services/
    └── mockService.js             ← Mock authentication
        ├── authenticateMock()
        ├── getUserByIdMock()
        └── articleOperations

        
# ============================================================================
# INTEGRATION CHECKLIST
# ============================================================================

✅ Files Created:
  ✓ config/mockCredentials.js
  ✓ utils/fileSystemStorage.js
  ✓ services/mockService.js
  ✓ config/storageConfig.js
  ✓ data/articles.json
  ✓ MOCK_MODE_README.md
  ✓ QUICK_START.md
  ✓ INTEGRATION_GUIDE.md
  ✓ .env.example
  ✓ IMPLEMENTATION_SUMMARY.md
  ✓ ARCHITECTURE.md (this file)

✅ Ready to Use:
  - No modifications to existing code needed!
  - Set DB_MODE=mock in .env
  - Set STORAGE_MODE=filesystem in .env
  - Restart server
  - Login with mock credentials

✅ Optional Enhancements:
  - Update API endpoints for full file system support
  - See INTEGRATION_GUIDE.md for examples
  - Add UI indicators for mock mode


# ============================================================================
# CONNECTIONS SUMMARY
# ============================================================================

Component                 Depends On              Used By
───────────────────────────────────────────────────────────────────────────
mockCredentials.js   →    (standalone)     ←    mockService.js
                                           ←    authService (optional)

fileSystemStorage.js →    fs module        ←    mockService.js
                      →   path module      ←    API endpoints

mockService.js       →    mockCredentials  ←    commonAPI.js
                     →    fileSystemStorage ←    authorAPI.js
                     →    bcrypt           ←    (all auth endpoints)
                     →    jsonwebtoken     ←

storageConfig.js     →    dotenv           ←    Conditional logic
                     →    (standalone)     ←    API endpoints

articles.json        →    (data file)      ←    fileSystemStorage.js

.env                 →    Configuration   ←    All services
                     →    DB_MODE          ←    Routing decisions
                     →    STORAGE_MODE     ←    Data storage decisions


# ============================================================================
# DECISION TREE FOR API ENDPOINTS
# ============================================================================

When API endpoint receives request:

1. Check Authentication
   │
   ├─ Is DB_MODE='mock'?
   │  ├─ YES → Use mockService.authenticate()
   │  │        Check mockCredentials.findMockUserByEmail()
   │  │
   │  └─ NO  → Use authService.authenticate()
   │           Query MongoDB for user
   │
   └─ Return JWT Token

2. Check Article Storage
   │
   ├─ Is STORAGE_MODE='filesystem'?
   │  ├─ YES → Use fileSystemStorage functions
   │  │        Read/Write from articles.json
   │  │
   │  └─ NO  → Use ArticleModel
   │           Query/Save to MongoDB
   │
   └─ Return Article Data


# ============================================================================
# ENVIRONMENT COMBINATIONS
# ============================================================================

Combination 1: DB_MODE=mock + STORAGE_MODE=filesystem
├─ ✅ No database needed
├─ ✅ Full local testing
├─ ✅ Mock users + file articles
├─ ✅ RECOMMENDED FOR DEVELOPMENT
└─ ❌ Not for production

Combination 2: DB_MODE=database + STORAGE_MODE=database
├─ ✅ Production ready
├─ ✅ Real MongoDB persistence
├─ ✅ User registration enabled
├─ ✅ RECOMMENDED FOR PRODUCTION
└─ ❌ Requires MongoDB

Combination 3: DB_MODE=mock + STORAGE_MODE=database
├─ ✅ Test auth with mock users
├─ ✅ Real database articles
├─ ✅ Good for hybrid testing
└─ ❌ Mixed mode complexity

Combination 4: DB_MODE=database + STORAGE_MODE=filesystem
├─ ✅ Real users
├─ ✅ File-based articles
├─ ✅ Good for testing article features
└─ ❌ Unusual setup


# ============================================================================
# KEY TAKEAWAYS
# ============================================================================

1. NO DATABASE REQUIRED
   - Set DB_MODE=mock
   - Set STORAGE_MODE=filesystem
   - Everything works locally

2. MOCK CREDENTIALS PROVIDED
   - 5 pre-defined test users
   - Emails and passwords included
   - Ready to use immediately

3. FILE-BASED ARTICLES
   - Articles stored in JSON
   - Human-readable format
   - Easy to backup/share

4. FLEXIBLE CONFIGURATION
   - Mix and match modes
   - Easy to switch to database later
   - No code changes needed

5. BACKWARD COMPATIBLE
   - Existing code works unchanged
   - Optional integrations available
   - Gradual adoption possible
"""
