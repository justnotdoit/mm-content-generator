# Quick Start Guide

Get Module Masters Content Generator up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Python version (need 3.8+)
python --version

# Check Node.js version (need 16+)
node --version

# Check npm
npm --version
```

## Step 1: Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy it (you'll need it in Step 3)

## Step 2: Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd mm-content-generator

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup (in a new terminal)
cd frontend
npm install
```

## Step 3: Configure Environment

```bash
# In backend directory
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
FLASK_ENV=development
DATABASE_URL=sqlite:///database.db
SECRET_KEY=change_this_to_random_string
FLASK_PORT=5000
```

## Step 4: Initialize Database

```bash
# In backend directory
python -c "from models import init_db; init_db()"

# Optional: Add sample data
python seed.py
```

## Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

You should see:
```
 * Running on http://0.0.0.0:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Browser should open automatically to `http://localhost:3000`

## Step 6: Test It Out!

1. Navigate to **Generate** in the top menu
2. Click "Educational" post type
3. Select "Both Platforms"
4. Fill in:
   - Topic: "ECU repair saves money"
   - Leave other settings as default
5. Click "Generate Content"
6. Wait 5-10 seconds
7. See your AI-generated content! 🎉

## Next Steps

### Create Your First Post
1. Generate content (as above)
2. Click "Save" on the generated post
3. Go to "Library" to see it

### Rate a Post
1. Go to "Library"
2. Click "Edit" on any post
3. Rate it with stars
4. Add inquiry count
5. Save

### View Analytics
1. Rate at least 2-3 posts
2. Go to "Analytics"
3. See your performance metrics

## Common Issues

### Backend won't start

**Problem**: `ModuleNotFoundError: No module named 'flask'`
**Solution**:
```bash
source venv/bin/activate  # Make sure venv is activated
pip install -r requirements.txt
```

### Frontend won't start

**Problem**: `Module not found` errors
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Content generation fails

**Problem**: API errors
**Solutions**:
1. Check your API key in `backend/.env`
2. Verify API key is valid at console.anthropic.com
3. Check backend terminal for error messages
4. Ensure backend is running on port 5000

### Port already in use

**Backend (port 5000)**:
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

**Frontend (port 3000)**:
```bash
# React will offer to use another port
# Or kill the process:
lsof -ti:3000 | xargs kill -9  # macOS/Linux
```

## Tips for Success

1. **Start with seed data**: Run `python seed.py` to have example posts
2. **Rate consistently**: The AI learns from your ratings
3. **Check Analytics**: After rating 5+ posts, analytics become meaningful
4. **Use Learning Insights**: Pay attention to recommendations

## Video Tutorial

[Coming soon]

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review [API_DOCS.md](API_DOCS.md) for API details
- Open an issue on GitHub

---

**Happy content generating! 🚀**
