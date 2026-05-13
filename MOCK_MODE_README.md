# Mock Credentials & File System Storage Guide

## Overview
This system allows you to test the Blog Application without a database. It provides:

1. **Mock User Credentials** - Pre-defined users, authors, and admins
2. **File System Article Storage** - Stores articles in JSON format locally
3. **Full Application Testing** - Create, read, update, and delete articles without MongoDB

## Setup Instructions

### 1. Enable Mock Mode

Update your `.env` file:

```env
# Set to 'mock' to use mock credentials instead of database
DB_MODE=mock

# Set to 'filesystem' to store articles in files instead of database
STORAGE_MODE=filesystem

# Keep your JWT secret (required for token generation)
JWT_SECRET=your-secret-key

# Server port
PORT=5000
```

### 2. Mock Credentials

Use these credentials to login:

#### Regular Users
- **Email:** `user@example.com`
- **Password:** `user123`

- **Email:** `jane.user@example.com`
- **Password:** `user123`

#### Authors (Can create articles)
- **Email:** `author@example.com`
- **Password:** `author123`

- **Email:** `bob.author@example.com`
- **Password:** `author123`

#### Admins
- **Email:** `admin@example.com`
- **Password:** `admin123`

## File Structure

When using file system storage, articles are stored in:
```
backend/
└── data/
    └── articles.json
```

### articles.json Structure
```json
{
  "articles": [
    {
      "_id": "article-1",
      "author": "author-001",
      "title": "My First Article",
      "category": "Technology",
      "content": "Article content here...",
      "comments": [],
      "isArticleActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "nextId": 2
}
```

## Features Supported

### Authentication ✅
- Login with mock credentials
- JWT token generation
- Token validation

### Articles (With STORAGE_MODE=filesystem) ✅
- Create articles
- Read articles
- Update articles
- Delete articles (soft delete)
- Restore articles
- List articles by author
- List all articles

### User Features ✅
- User registration
- Profile management
- Role-based access control

## API Endpoints

All existing API endpoints work with mock mode:

### Common API
```
POST   /common-api/login
GET    /common-api/check-auth
POST   /common-api/logout
```

### Author API (with file storage)
```
POST   /author-api/users          - Register author
POST   /author-api/articles       - Create article
GET    /author-api/articles/:id   - Get author articles
PUT    /author-api/articles       - Update article
DELETE /author-api/articles/:id   - Delete article
PATCH  /author-api/articles/:id   - Restore article
```

### Common API (with file storage)
```
GET    /common-api/articles/:id   - Get article by ID
```

## Hybrid Mode

You can also run with:
- `DB_MODE=database` + `STORAGE_MODE=filesystem` - Authenticate with real database, store articles in files
- `DB_MODE=mock` + `STORAGE_MODE=database` - Authenticate with mock credentials, store articles in database (requires MongoDB)

## Testing Without Backend

If you want to test the frontend without running the backend:

1. Mock API responses in your frontend
2. Use the mock credentials as examples
3. Create sample article data matching the structure

## Limitations

When using mock mode:
- Users cannot register new accounts (only pre-defined mocks available)
- No user profile image uploads (uses placeholder URLs)
- Data is not persisted between server restarts
- Cannot modify user details

## Enabling Database Mode

To switch back to database mode, update `.env`:
```env
DB_MODE=database
STORAGE_MODE=database
DB_URL=mongodb://your-connection-string
```

## Troubleshooting

### "Invalid email" on login
- Make sure you're using one of the mock credentials above
- Check that `DB_MODE=mock` is set in `.env`

### Articles not saving
- Ensure `STORAGE_MODE=filesystem` is set
- Check that `backend/data/` directory has write permissions

### File permission errors
- Verify the `backend/data/` directory is writable
- On Windows, ensure the app has permission to create files

## Next Steps

1. Update `.env` with mock mode settings
2. Restart your backend server
3. Test login with mock credentials
4. Create and manage articles via the UI
