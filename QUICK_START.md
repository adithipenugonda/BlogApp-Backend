# Quick Start Guide - Mock Credentials & File System Storage

## 🚀 Quick Setup (5 minutes)

### Step 1: Update .env file
Create or update `.env` in your `backend` folder:

```env
DB_MODE=mock
STORAGE_MODE=filesystem
JWT_SECRET=blog-app-secret-key-2024
PORT=5000
```

### Step 2: Start your server
```bash
npm start
# or
node server.js
```

### Step 3: Login with test credentials

**For Authors (who can create articles):**
- Email: `author@example.com`
- Password: `author123`

**For Regular Users:**
- Email: `user@example.com`
- Password: `user123`

**For Admin:**
- Email: `admin@example.com`
- Password: `admin123`

---

## 📁 File Structure

After creating articles, check:
```
backend/data/articles.json
```

This file stores all your articles locally!

---

## ✨ What You Can Do

✅ **Login** with mock credentials (no database needed)
✅ **Create** articles (stored in JSON file)
✅ **Read** all articles
✅ **Edit** your articles
✅ **Delete** articles (soft delete)
✅ **Restore** deleted articles

---

## 🔄 Configuration Modes

### Mode 1: Full Mock (Recommended for Testing)
```env
DB_MODE=mock
STORAGE_MODE=filesystem
# Uses mock users, stores articles in files
# Perfect for: Development, demos, quick testing
```

### Mode 2: Real Database
```env
DB_MODE=database
STORAGE_MODE=database
DB_URL=your-mongodb-url
# Requires MongoDB connection
# Perfect for: Production, real users
```

### Mode 3: Mixed (Mock Users + Real DB Articles)
```env
DB_MODE=mock
STORAGE_MODE=database
DB_URL=your-mongodb-url
# Uses mock for auth, real DB for articles
# Perfect for: Testing with real storage
```

---

## 📝 Sample Article Data Format

When you create an article, it looks like:
```json
{
  "_id": "article-1",
  "author": "author-001",
  "title": "My First Blog Post",
  "category": "Technology",
  "content": "This is my article content...",
  "comments": [],
  "isArticleActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 🧪 Testing Checklist

- [ ] Set DB_MODE=mock in .env
- [ ] Set STORAGE_MODE=filesystem in .env
- [ ] Start the server
- [ ] Try logging in with author@example.com / author123
- [ ] Create a test article
- [ ] Check backend/data/articles.json (should have your article)
- [ ] Edit the article in UI
- [ ] Delete the article
- [ ] Restore the article

---

## ⚠️ Important Notes

- **Mock users are fixed:** You cannot register new users in mock mode (only use provided credentials)
- **Data not persistent:** Articles are cleared when you restart the server (they're stored locally)
- **No uploads:** Profile images use placeholder URLs
- **No email verification:** Auth is simple for testing

---

## 📚 Files Created

| File | Purpose |
|------|---------|
| `config/mockCredentials.js` | Stores mock user/author/admin data |
| `utils/fileSystemStorage.js` | Handles file-based article storage |
| `services/mockService.js` | Mock authentication & article operations |
| `config/storageConfig.js` | Configuration helper |
| `MOCK_MODE_README.md` | Detailed documentation |
| `INTEGRATION_GUIDE.md` | How to integrate into your APIs |
| `.env.example` | Example environment configuration |

---

## 🔑 All Mock Credentials

| Role | Email | Password |
|------|-------|----------|
| User | user@example.com | user123 |
| User | jane.user@example.com | user123 |
| Author | author@example.com | author123 |
| Author | bob.author@example.com | author123 |
| Admin | admin@example.com | admin123 |

---

## 🐛 Troubleshooting

**"Invalid email" error on login?**
- Check spelling of email
- Verify DB_MODE=mock is set

**Articles not saving?**
- Make sure STORAGE_MODE=filesystem
- Check backend/data/ folder permissions

**Getting database connection errors?**
- If using mock mode, you don't need a database!
- Set DB_MODE=mock in .env

---

## 🎯 Next Steps

1. **Local Testing:** Use mock mode to test your app locally
2. **Frontend Integration:** Test your frontend with mock backend
3. **Database Ready:** Switch to real database when needed
4. **Production:** Use proper database and remove mock credentials

---

**Enjoy testing your Blog App! 🎉**
