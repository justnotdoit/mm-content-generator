# Module Masters Social Media Content Generator

AI-powered social media content generator with learning capabilities for Module Masters automotive electronics repair business.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎯 Features

### Core Functionality
- **AI Content Generation**: Generate engaging social media posts using Claude AI
- **Multi-Platform Support**: Optimized content for Facebook and Instagram
- **Learning System**: Analyzes post performance and improves future suggestions
- **Content Calendar**: Visual planning and scheduling interface
- **Post Library**: Manage, filter, and search all generated content
- **Analytics Dashboard**: Track performance metrics and insights

### Content Types
- **Educational Posts**: Teach customers about automotive modules (ECU, BCM, TCM, etc.)
- **Promotional Posts**: Special offers and seasonal deals
- **Customer Stories**: Success stories and testimonials
- **Seasonal Content**: Calgary/Alberta climate-specific content

### Key Capabilities
- ✨ Multi-step content generation wizard
- 📊 Performance tracking (ratings, inquiries, effectiveness scores)
- 📅 Visual content calendar with drag-and-drop (coming soon)
- 🎯 Platform-specific optimization (Facebook vs Instagram)
- 💡 Learning insights from successful posts
- 🏷️ Smart hashtag generation and tracking
- ⭐ Favorite posts system
- 📈 Comprehensive analytics and reporting

## 🏗️ Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: ORM for database management
- **Anthropic Claude API**: AI content generation
- **SQLite**: Database (easily upgradable to PostgreSQL)

### Frontend
- **React**: UI framework
- **React Router**: Navigation
- **Tailwind CSS**: Styling
- **Recharts**: Analytics visualizations
- **date-fns**: Date manipulation
- **Axios**: HTTP client

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+ and npm
- Anthropic API key ([Get one here](https://www.anthropic.com))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mm-content-generator
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_api_key_here
FLASK_ENV=development
DATABASE_URL=sqlite:///database.db
SECRET_KEY=your_secret_key_here
FLASK_PORT=5000
```

### 3. Initialize Database

```bash
# Initialize the database
python -c "from models import init_db; init_db()"

# (Optional) Seed with sample data
python seed.py
```

### 4. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

## 🎮 Running the Application

### Start Backend Server

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 📖 Usage Guide

### 1. Generate Content

1. Navigate to **Generate** page
2. **Step 1**: Choose post type (Educational, Promotional, Customer Story, Seasonal)
3. **Step 2**: Select platform (Facebook, Instagram, or Both)
4. **Step 3**: Set detailed parameters:
   - Tone (Friendly, Professional, Urgent, Educational)
   - Target Audience (Individual Owners, Fleet Managers, Shop Owners)
   - Topic/Module (e.g., "ECU repair vs replacement")
   - Season (Winter, Spring, Summer, Fall)
   - Length (Short, Medium, Long)
5. **Step 4**: Review generated content
   - View platform-specific versions
   - Copy to clipboard
   - Save to library

### 2. Manage Posts (Library)

- **Filter**: By type, platform, season, rating, or favorites
- **Sort**: By date, rating, or effectiveness score
- **Edit**: Rate posts (1-5 stars), add inquiry counts, notes
- **Track**: Monitor which posts generate the most inquiries
- **Copy**: Quick copy to clipboard for posting

### 3. Rate Posts (Critical for Learning!)

After publishing a post:
1. Open it in the **Library**
2. Click **Edit**
3. Add:
   - **Rating** (1-5 stars) - How well it performed
   - **Inquiries Count** - Number of customer inquiries generated
   - **Notes** - Observations about performance
4. Save

The system learns from rated posts to improve future suggestions!

### 4. Content Calendar

- View scheduled posts by month
- Click on any date to schedule a post
- Visual color coding by post type
- See upcoming scheduled posts

### 5. Analytics Dashboard

- **Performance Metrics**: Total posts, ratings, inquiries
- **Charts**: Performance by type, platform, season
- **Timeline**: Track improvement over time
- **Top Posts**: See your best performing content
- **Hashtag Insights**: Most effective hashtags
- **AI Insights**: Best tone, type, and platform based on data

## 🧠 Learning System

The app learns from your post performance:

### How It Works

1. **Data Collection**: Ratings and inquiry counts from published posts
2. **Pattern Analysis**: Identifies what types of posts work best
3. **Smart Recommendations**: Suggests optimal parameters for new posts
4. **Example Integration**: Shows similar successful posts during generation

### Effectiveness Score Formula

```
Effectiveness Score = (Rating × 20) + (Inquiries × 10)
```

Example:
- 5-star rating with 8 inquiries = (5 × 20) + (8 × 10) = **180 points**

### Learning Insights Provided

- Best performing post type
- Optimal tone for each audience
- Most effective platform
- Top performing hashtags
- Seasonal trends
- Similar successful posts

## 🎨 Business Context: Module Masters

### About the Business

Module Masters is a Calgary-based automotive electronics repair company specializing in:
- ECU (Engine Control Unit)
- BCM (Body Control Module)
- TCM (Transmission Control Module)
- Airbag modules
- ABS modules
- BMW FRM modules
- Diesel modules

### Brand Voice

- **Philosophy**: "Repair first, not replace" - saving customers money
- **Tone**: Friendly expert, educational but approachable
- **Values**: Honesty, customer savings, technical expertise
- **Local**: Calgary pride, understands Alberta climate challenges
- **Experience**: 20+ years in the industry
- **Services**: In-shop repair + mobile service

### Target Audiences

1. **Individual Car Owners**: Worried about expensive dealership quotes
2. **Fleet Managers**: Managing 10+ vehicles, need reliability & cost efficiency
3. **Auto Shop Owners**: Partnership opportunities

### Seasonal Content Ideas

- **Winter** (Dec-Feb): Cold start issues, battery problems, ABS on ice
- **Spring** (Mar-May): Post-winter maintenance, spring deals
- **Summer** (Jun-Aug): Road trip prep, RV/boat modules
- **Fall** (Sep-Nov): Winter preparation, fleet contracts

## 📊 API Documentation

### Backend Endpoints

#### Content Generation
```
POST /api/generate
Body: {
  "type": "educational",
  "platform": "both",
  "tone": "friendly",
  "audience": "individual_owners",
  "topic": "ECU repair benefits",
  "season": "winter",
  "length": "medium"
}
```

#### Posts Management
```
GET    /api/posts              # List all posts (with filters)
GET    /api/posts/:id          # Get specific post
POST   /api/posts              # Create new post
PUT    /api/posts/:id          # Update post (rating, inquiries, etc.)
DELETE /api/posts/:id          # Delete post
```

#### Calendar & Scheduling
```
GET  /api/calendar?month=2024-01  # Get calendar events
POST /api/schedule                # Schedule a post
```

#### Analytics & Learning
```
GET  /api/analytics              # Get analytics data
GET  /api/learning-insights      # Get learning system insights
POST /api/recommendations         # Get recommendations for parameters
GET  /api/hashtags/popular       # Get top performing hashtags
```

## 🗂️ Project Structure

```
mm-content-generator/
├── backend/
│   ├── app.py                    # Flask application & API routes
│   ├── models.py                 # Database models
│   ├── content_generator.py     # Claude AI integration
│   ├── learning_system.py       # Learning & analytics logic
│   ├── seed.py                   # Sample data seeder
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example             # Environment template
│   └── database.db              # SQLite database (created on init)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ContentGenerator.jsx
│   │   │   ├── PostLibrary.jsx
│   │   │   ├── PostEditor.jsx
│   │   │   ├── ContentCalendar.jsx
│   │   │   └── Analytics.jsx
│   │   ├── utils/
│   │   │   └── api.js           # API client
│   │   ├── App.jsx              # Main app component
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend** (`.env`):
```
ANTHROPIC_API_KEY=sk-ant-...      # Required: Your Anthropic API key
FLASK_ENV=development              # development or production
DATABASE_URL=sqlite:///database.db # Database connection string
SECRET_KEY=your-secret-key         # Flask secret key
FLASK_PORT=5000                    # Backend port
```

**Frontend** (`.env`):
```
REACT_APP_API_URL=http://localhost:5000/api  # Backend API URL
```

## 🚦 Troubleshooting

### Backend Issues

**Error: Module not found**
```bash
pip install -r requirements.txt
```

**Database errors**
```bash
python -c "from models import init_db; init_db()"
```

**API key errors**
- Verify ANTHROPIC_API_KEY in `.env`
- Check API key is valid at anthropic.com

### Frontend Issues

**Port already in use**
```bash
# Change port in package.json or kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
```

**Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Roadmap

### Phase 1 (MVP) ✅
- [x] Content generation with Claude AI
- [x] Post library with filtering
- [x] Rating and tracking system
- [x] Basic analytics
- [x] Learning system

### Phase 2 (Enhancements)
- [ ] Advanced calendar features (drag-and-drop)
- [ ] Auto-posting to social media
- [ ] A/B testing framework
- [ ] Image generation integration
- [ ] Export to CSV/PDF

### Phase 3 (Advanced)
- [ ] Multi-user support
- [ ] HubSpot integration
- [ ] Advanced AI training
- [ ] Mobile app
- [ ] API for third-party integrations

## 📝 Best Practices

### For Best Results

1. **Rate Consistently**: Rate posts after publishing to train the AI
2. **Track Inquiries**: Record actual business impact
3. **Add Notes**: Document what worked and what didn't
4. **Use Learning Insights**: Pay attention to recommended parameters
5. **Test Variations**: Try different tones and lengths
6. **Season Appropriately**: Align content with Calgary weather/seasons

### Content Tips

- **Be Specific**: Mention actual module types and issues
- **Local References**: Calgary, Alberta, YYC hashtags
- **Real Savings**: Show actual cost comparisons
- **Mobile Service**: Emphasize convenience
- **Expertise**: Highlight 20+ years experience

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## 🙏 Acknowledgments

- Anthropic Claude AI for content generation
- Module Masters for business context
- React and Flask communities

---

**Built with ❤️ for Module Masters**

*Last updated: 2024*
