# Test Cases & Sample Data

## 🧪 Test Scenarios

### Test 1: User Login Flow
```
1. Send POST request to /common-api/login
   Body: {
     "email": "author@example.com",
     "password": "author123"
   }

2. Expected Response (200):
   {
     "message": "login success",
     "payload": {
       "_id": "author-001",
       "firstName": "Alice",
       "lastName": "Johnson",
       "email": "author@example.com",
       "profileImageUrl": "https://via.placeholder.com/150?text=Author1",
       "role": "AUTHOR",
       "isActive": true
     }
   }

3. Cookie Set: token (JWT token)
   - Token expires in 1 hour
   - Contains user ID and role
```

### Test 2: Invalid Credentials
```
1. Send POST request to /common-api/login
   Body: {
     "email": "invalid@example.com",
     "password": "wrongpassword"
   }

2. Expected Response (401):
   {
     "message": "error occurred",
     "error": "Invalid email"
   }
```

### Test 3: Create Article (Requires Author Role)
```
1. Login as author first
   Email: author@example.com
   Password: author123

2. Send POST request to /author-api/articles
   Headers: {
     "Authorization": "Bearer <JWT_TOKEN>",
     "Cookie": "token=<JWT_TOKEN>"
   }
   Body: {
     "author": "author-001",
     "title": "Getting Started with Node.js",
     "category": "Technology",
     "content": "Node.js is a powerful JavaScript runtime...",
     "comments": []
   }

3. Expected Response (201):
   {
     "message": "article created",
     "payload": {
       "_id": "article-1",
       "author": "author-001",
       "title": "Getting Started with Node.js",
       "category": "Technology",
       "content": "Node.js is a powerful JavaScript runtime...",
       "comments": [],
       "isArticleActive": true,
       "createdAt": "2024-01-15T10:30:00.000Z",
       "updatedAt": "2024-01-15T10:30:00.000Z"
     }
   }

4. Check: backend/data/articles.json should now contain this article
```

### Test 4: Read Article by ID
```
1. Send GET request to /common-api/articles/article-1
   Headers: {
     "Authorization": "Bearer <JWT_TOKEN>",
     "Cookie": "token=<JWT_TOKEN>"
   }

2. Expected Response (200):
   {
     "message": "article",
     "payload": {
       "_id": "article-1",
       "author": "author-001",
       "title": "Getting Started with Node.js",
       "category": "Technology",
       "content": "Node.js is a powerful JavaScript runtime...",
       "comments": [],
       "isArticleActive": true
     }
   }
```

### Test 5: Get Author's Articles
```
1. Login as author
   Email: author@example.com
   Password: author123

2. Send GET request to /author-api/articles/author-001
   Headers: {
     "Authorization": "Bearer <JWT_TOKEN>",
     "Cookie": "token=<JWT_TOKEN>"
   }

3. Expected Response (200):
   {
     "message": "articles",
     "payload": [
       {
         "_id": "article-1",
         "author": "author-001",
         "title": "Getting Started with Node.js",
         "category": "Technology",
         "content": "...",
         "comments": [],
         "isArticleActive": true
       }
     ]
   }
```

### Test 6: Update Article
```
1. Login as author first
   Email: author@example.com
   Password: author123

2. Send PUT request to /author-api/articles
   Body: {
     "articleId": "article-1",
     "author": "author-001",
     "title": "Advanced Node.js Techniques",
     "content": "Here are some advanced techniques...",
     "category": "Technology"
   }

3. Expected Response (200):
   {
     "message": "article updated",
     "payload": {
       "_id": "article-1",
       "author": "author-001",
       "title": "Advanced Node.js Techniques",
       "content": "Here are some advanced techniques...",
       "category": "Technology",
       "comments": [],
       "isArticleActive": true,
       "updatedAt": "2024-01-15T11:00:00.000Z"
     }
   }

4. Check: backend/data/articles.json should show updated article
```

### Test 7: Delete Article (Soft Delete)
```
1. Send DELETE request to /author-api/articles/authorId/author-001/articleId/article-1
   Headers: {
     "Authorization": "Bearer <JWT_TOKEN>"
   }

2. Expected Response (200):
   {
     "message": "article deleted",
     "payload": {
       "_id": "article-1",
       "author": "author-001",
       "title": "Advanced Node.js Techniques",
       "content": "...",
       "isArticleActive": false,  ← Now false
       "updatedAt": "2024-01-15T11:30:00.000Z"
     }
   }

3. Check: Article still in articles.json but isArticleActive is false
```

### Test 8: Restore Article
```
1. Send PATCH request to /author-api/articles/authorId/author-001/articleId/article-1
   Headers: {
     "Authorization": "Bearer <JWT_TOKEN>"
   }

2. Expected Response (200):
   {
     "message": "article restored",
     "payload": {
       "_id": "article-1",
       "author": "author-001",
       "isArticleActive": true,  ← Back to true
       ...
     }
   }
```

### Test 9: Check Authentication
```
1. Send GET request to /common-api/check-auth
   Headers: {
     "Authorization": "Bearer <JWT_TOKEN>"
   }

2. Expected Response (200):
   {
     "message": "Authenticated",
     "payload": {
       "_id": "author-001",
       "firstName": "Alice",
       "lastName": "Johnson",
       "email": "author@example.com",
       "role": "AUTHOR",
       "isActive": true
     }
   }
```

### Test 10: Invalid Token
```
1. Send GET request to /common-api/check-auth
   Headers: {
     "Authorization": "Bearer invalid_token_here"
   }

2. Expected Response (401):
   {
     "message": "error occurred",
     "error": "Token verification failed"
   }
```

---

## 📊 Sample Data Files

### articles.json (After Creating Articles)

```json
{
  "articles": [
    {
      "_id": "article-1",
      "author": "author-001",
      "title": "Getting Started with Node.js",
      "category": "Technology",
      "content": "Node.js is a powerful JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to use JavaScript to write server-side code.",
      "comments": [
        {
          "_id": "comment-1705316400000",
          "user": "user-001",
          "comment": "Great article! Very helpful.",
          "createdAt": "2024-01-15T12:00:00.000Z"
        }
      ],
      "isArticleActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "article-2",
      "author": "author-001",
      "title": "Express.js Best Practices",
      "category": "Web Development",
      "content": "Express.js is a minimal and flexible Node.js web application framework. Here are some best practices...",
      "comments": [],
      "isArticleActive": true,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    },
    {
      "_id": "article-3",
      "author": "author-002",
      "title": "MongoDB Indexing Strategies",
      "category": "Databases",
      "content": "Proper indexing is crucial for MongoDB performance. In this article, we'll explore various indexing strategies...",
      "comments": [],
      "isArticleActive": false,  ← Soft deleted
      "createdAt": "2024-01-15T11:30:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  ],
  "nextId": 4
}
```

### User Authentication Token (JWT Decoded)

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "_id": "author-001",
    "userId": "author-001",
    "role": "AUTHOR",
    "email": "author@example.com",
    "iat": 1705316400,
    "exp": 1705320000
  },
  "signature": "HMAC_SHA256(base64(header) + '.' + base64(payload), 'your-secret-key')"
}
```

---

## 🔐 Mock Credentials Complete List

| Role | ID | First Name | Last Name | Email | Password |
|------|----|-|-|-|-|
| USER | user-001 | John | Doe | user@example.com | user123 |
| USER | user-002 | Jane | Smith | jane.user@example.com | user123 |
| AUTHOR | author-001 | Alice | Johnson | author@example.com | author123 |
| AUTHOR | author-002 | Bob | Wilson | bob.author@example.com | author123 |
| ADMIN | admin-001 | Admin | User | admin@example.com | admin123 |

---

## 🧪 Using Postman or cURL

### Login Request (cURL)
```bash
curl -X POST http://localhost:5000/common-api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@example.com",
    "password": "author123"
  }' \
  -c cookies.txt
```

### Create Article (cURL)
```bash
curl -X POST http://localhost:5000/author-api/articles \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "author": "author-001",
    "title": "My New Article",
    "category": "Technology",
    "content": "This is my article content..."
  }'
```

### Get Article (cURL)
```bash
curl -X GET http://localhost:5000/common-api/articles/article-1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -b cookies.txt
```

---

## 📝 Testing Checklist

Use this checklist when testing the mock system:

### Setup
- [ ] Set DB_MODE=mock in .env
- [ ] Set STORAGE_MODE=filesystem in .env
- [ ] Server started without database errors
- [ ] backend/data/ directory created

### Authentication
- [ ] Can login with author@example.com / author123
- [ ] Can login with user@example.com / user123
- [ ] Can login with admin@example.com / admin123
- [ ] Invalid credentials return 401
- [ ] JWT token is generated
- [ ] Check-auth endpoint works
- [ ] Logout clears cookie

### Articles (File System)
- [ ] Can create article as author
- [ ] Article appears in articles.json
- [ ] Can read article by ID
- [ ] Can list author's articles
- [ ] Can update article
- [ ] Updated data in articles.json
- [ ] Can soft delete article
- [ ] isArticleActive becomes false
- [ ] Can restore deleted article
- [ ] isArticleActive becomes true

### Error Handling
- [ ] Invalid email returns proper error
- [ ] Invalid password returns proper error
- [ ] Expired token returns 401
- [ ] Non-existent article returns 404
- [ ] Unauthorized access returns 403

### File System
- [ ] articles.json is created
- [ ] articles.json is valid JSON
- [ ] nextId increments properly
- [ ] Created timestamps are correct
- [ ] Updated timestamps reflect changes

---

## 🐛 Debugging Tips

### Check if Mock Mode is Active
```bash
# Look for this in server logs:
# "Mock mode enabled" or check DB_MODE in .env
```

### View Current Articles
```bash
# Open this file in VS Code or any editor:
# backend/data/articles.json
```

### Clear All Articles
```bash
# Edit backend/data/articles.json to:
# {
#   "articles": [],
#   "nextId": 1
# }
```

### Verify JWT Token
```bash
# Use jwt.io to decode your token and check:
# - Expiration time
# - User ID
# - Role
# - Email
```

### Check Server Logs
```bash
# Look for:
# - "DB_MODE=mock" 
# - "STORAGE_MODE=filesystem"
# - "Reading articles from file"
# - Error messages
```

---

## ✅ All Tests Passing Checklist

When all these tests pass, your system is working perfectly:

- [ ] Test 1: User Login Flow ✅
- [ ] Test 2: Invalid Credentials ✅
- [ ] Test 3: Create Article ✅
- [ ] Test 4: Read Article by ID ✅
- [ ] Test 5: Get Author's Articles ✅
- [ ] Test 6: Update Article ✅
- [ ] Test 7: Delete Article ✅
- [ ] Test 8: Restore Article ✅
- [ ] Test 9: Check Authentication ✅
- [ ] Test 10: Invalid Token ✅

🎉 **You're ready to use the Blog App!**
