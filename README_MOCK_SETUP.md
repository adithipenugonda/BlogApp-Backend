# BlogApp Backend - Mock Credentials & File System Storage

> **No database required!** Test your Blog App with mock credentials and file-based article storage.

## 🚀 Quick Start (30 seconds)

1. **Update `.env`:**
   ```env
   DB_MODE=mock
   STORAGE_MODE=filesystem
   JWT_SECRET=blog-secret-key
   PORT=5000
   ```

2. **Start server:**
   ```bash
   npm start
   ```

3. **Login with:**
   ```
   Email: author@example.com
   Password: author123
   ```

4. **Create articles** - They're saved to `data/articles.json`

✅ **Done!** No database, no setup, no configuration needed.

---

## 📚 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| [QUICK_START.md](QUICK_START.md) | Get started in 5 minutes | ⏱️ 5 min |
| [MOCK_MODE_README.md](MOCK_MODE_README.md) | Complete feature documentation | ⏱️ 10 min |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Test cases and examples | ⏱️ 15 min |
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | How to integrate with APIs | ⏱️ 10 min |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design and flow | ⏱️ 15 min |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | What was created | ⏱️ 5 min |
| [.env.example](.env.example) | Configuration examples | ⏱️ 2 min |

---

## 🔐 Login Credentials

### Authors (Can create articles)
```
Email: author@example.com
Password: author123

Email: bob.author@example.com
Password: author123
```

### Regular Users
```
Email: user@example.com
Password: user123

Email: jane.user@example.com
Password: user123
```

### Admin
```
Email: admin@example.com
Password: admin123
```

---

## 📁 Files Created

```
backend/
├── config/
│   ├── mockCredentials.js         # Mock user data
│   └── storageConfig.js           # Configuration helper
├── utils/
│   └── fileSystemStorage.js       # File storage operations
├── services/
│   └── mockService.js             # Mock authentication
├── data/
│   └── articles.json              # Article storage
│
├── QUICK_START.md                 # Start here!
├── MOCK_MODE_README.md            # Full documentation
├── TESTING_GUIDE.md               # Test scenarios
├── INTEGRATION_GUIDE.md           # Code examples
├── ARCHITECTURE.md                # System design
├── IMPLEMENTATION_SUMMARY.md      # What was added
├── .env.example                   # Example configs
└── THIS FILE                      # You are here!
```

---

## ⚙️ Configuration Modes

### Mode 1: Full Mock (Development) ⭐ RECOMMENDED
```env
DB_MODE=mock
STORAGE_MODE=filesystem
```
✅ No database needed
✅ Articles stored in JSON
✅ Perfect for testing

### Mode 2: Real Database (Production)
```env
DB_MODE=database
STORAGE_MODE=database
DB_URL=mongodb+srv://...
```
✅ Production ready
✅ Real MongoDB persistence
✅ User registration enabled

### Mode 3: Hybrid
```env
DB_MODE=mock
STORAGE_MODE=database
DB_URL=mongodb+srv://...
```
✅ Mock auth + Real DB articles
✅ Good for testing

---

## 🎯 What You Can Do

### ✅ Available Features

| Feature | File System | Database |
|---------|------------|----------|
| Login | ✅ Mock users | ✅ Real users |
| Create Articles | ✅ Yes | ✅ Yes |
| Read Articles | ✅ Yes | ✅ Yes |
| Update Articles | ✅ Yes | ✅ Yes |
| Delete Articles | ✅ Soft | ✅ Soft |
| Comments | ✅ Yes | ✅ Yes |
| User Registration | ❌ Mock only | ✅ Yes |

---

## 🔄 How It Works

### Authentication Flow
```
Frontend Login Request
         ↓
    Check DB_MODE
   ↙         ↘
mock       database
   ↓          ↓
mockService  authService
   ↓          ↓
findMock   MongoDB
```

### Article Storage Flow
```
Create Article Request
         ↓
  Check STORAGE_MODE
  ↙          ↘
filesystem   database
  ↓          ↓
JSON File    MongoDB
```

---

## 📊 Example Data

### Sample Article (in articles.json)
```json
{
  "_id": "article-1",
  "author": "author-001",
  "title": "Getting Started with Node.js",
  "category": "Technology",
  "content": "Node.js is a powerful runtime...",
  "comments": [],
  "isArticleActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Sample Login Response
```json
{
  "message": "login success",
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

---

## 🧪 Quick Test

### Using cURL:

```bash
# Login
curl -X POST http://localhost:5000/common-api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@example.com",
    "password": "author123"
  }'

# Create Article
curl -X POST http://localhost:5000/author-api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "author": "author-001",
    "title": "My Article",
    "category": "Tech",
    "content": "Content here..."
  }'
```

---

## 🔧 Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `DB_MODE` | Yes | `mock` or `database` |
| `STORAGE_MODE` | Yes | `filesystem` or `database` |
| `JWT_SECRET` | Yes | `secret-key-123` |
| `PORT` | No | `5000` |
| `DB_URL` | If DB enabled | `mongodb+srv://...` |

---

## 📖 Documentation Quick Links

**Getting Started:**
1. First read: [QUICK_START.md](QUICK_START.md)
2. Full guide: [MOCK_MODE_README.md](MOCK_MODE_README.md)

**For Developers:**
3. Integration: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
4. Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)

**For Testing:**
5. Test cases: [TESTING_GUIDE.md](TESTING_GUIDE.md)

**Reference:**
6. Summary: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
7. Config: [.env.example](.env.example)

---

## 💡 Key Features

### ✨ No Setup Required
- No MongoDB installation
- No connection strings
- No environment configuration
- Just update `.env` and go!

### 🎭 Mock Users Ready
- 5 pre-defined users
- Different roles (User, Author, Admin)
- Test all permission levels

### 💾 File-Based Storage
- Articles stored in JSON
- Human-readable format
- Easy to backup/share
- No external dependencies

### 🔒 Security Included
- JWT token authentication
- Hashed passwords (bcrypt)
- Role-based access control
- Token expiration (1 hour)

### 🔄 Flexible Modes
- Switch between mock/database anytime
- Hybrid mode available
- No code changes needed
- Environment-based configuration

---

## 🚀 Next Steps

### Option 1: Development
```
1. Update .env with mock settings
2. npm start
3. Test with mock credentials
4. Build your frontend
```

### Option 2: Production
```
1. Update .env with database settings
2. Connect to MongoDB
3. Deploy backend
4. Deploy frontend
```

### Option 3: Hybrid Testing
```
1. Use mock auth for testing
2. Connect real database for articles
3. Test complex scenarios
```

---

## ❓ FAQ

**Q: Do I need MongoDB to test?**
A: No! Use `DB_MODE=mock` and `STORAGE_MODE=filesystem`

**Q: Can I switch from mock to database later?**
A: Yes! Just update `.env` and restart the server

**Q: Are mock credentials secure?**
A: No! Only use for development/testing. Never production!

**Q: Will data persist between restarts?**
A: Yes! Articles are saved in `data/articles.json`

**Q: Can I add new mock users?**
A: Edit `config/mockCredentials.js` and add to the array

**Q: How do I clear all articles?**
A: Delete contents of `data/articles.json` or edit it

---

## 🎉 You're Ready!

1. ✅ Set `DB_MODE=mock` in `.env`
2. ✅ Set `STORAGE_MODE=filesystem` in `.env`
3. ✅ Run `npm start`
4. ✅ Login with `author@example.com` / `author123`
5. ✅ Create and manage articles!

**Have fun building! 🚀**

---

## 📞 Need Help?

- **Quick setup:** Read [QUICK_START.md](QUICK_START.md)
- **Stuck somewhere:** Check [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Want details:** See [MOCK_MODE_README.md](MOCK_MODE_README.md)
- **Integration help:** Review [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **Architecture:** Study [ARCHITECTURE.md](ARCHITECTURE.md)

---

**Version:** 1.0.0 | **Status:** Ready to Use ✅

Made with ❤️ for developers who want to test fast!
