# API Documentation

Complete API reference for Module Masters Content Generator backend.

Base URL: `http://localhost:5000/api`

## Table of Contents

- [Authentication](#authentication)
- [Content Generation](#content-generation)
- [Posts Management](#posts-management)
- [Calendar & Scheduling](#calendar--scheduling)
- [Analytics & Learning](#analytics--learning)
- [Error Handling](#error-handling)

---

## Authentication

Currently, the API does not require authentication. For production deployment, implement proper authentication middleware.

---

## Content Generation

### Generate Content

Generate social media content using AI based on parameters.

**Endpoint:** `POST /api/generate`

**Request Body:**
```json
{
  "type": "educational",
  "platform": "both",
  "tone": "friendly",
  "audience": "individual_owners",
  "topic": "ECU repair vs replacement",
  "season": "winter",
  "length": "medium"
}
```

**Parameters:**
- `type` (required): Post type
  - `educational`: Educational content about modules
  - `promotional`: Promotional offers and deals
  - `customer_story`: Success stories and testimonials
  - `seasonal`: Season-specific content

- `platform` (required): Target platform
  - `facebook`: Facebook only
  - `instagram`: Instagram only
  - `both`: Both platforms

- `tone`: Content tone
  - `friendly`: Casual and approachable
  - `professional`: Business-like and formal
  - `urgent`: Time-sensitive messaging
  - `educational`: Teaching and informative

- `audience`: Target audience
  - `individual_owners`: Individual car owners
  - `fleet_managers`: Fleet management companies
  - `shop_owners`: Auto shop owners

- `topic` (required): Main topic or module type
  - Examples: "ECU repair", "Winter ABS issues", "Fleet maintenance"

- `season`: Season context
  - `winter`, `spring`, `summer`, `fall`

- `length`: Desired content length
  - `short`: Brief, punchy content
  - `medium`: Balanced length
  - `long`: Detailed, comprehensive

**Response:**
```json
{
  "content": {
    "facebook": {
      "content": "Post content for Facebook...",
      "hashtags": ["#YYCAutoRepair", "#ECURepair", "..."],
      "visual_suggestions": "Photo of ECU module...",
      "call_to_action": "Call for free diagnostics"
    },
    "instagram": {
      "content": "Post content for Instagram...",
      "hashtags": ["#YYCAutoRepair", "#ECURepair", "...", "..."],
      "visual_suggestions": "Instagram-friendly photo...",
      "call_to_action": "DM us for quotes"
    },
    "reasoning": "Generated educational content because...",
    "prompt_used": "Full prompt sent to AI..."
  },
  "learning_insights": [
    "Educational posts average 4.5/5 rating",
    "Similar posts generated 8 inquiries on average"
  ],
  "similar_successful_posts": [
    {
      "id": 1,
      "content": "Previous successful post...",
      "rating": 5,
      "inquiries_count": 12
    }
  ]
}
```

---

## Posts Management

### List All Posts

Get all posts with optional filtering and sorting.

**Endpoint:** `GET /api/posts`

**Query Parameters:**
- `type`: Filter by post type
- `platform`: Filter by platform
- `rating`: Minimum rating (1-5)
- `season`: Filter by season
- `favorite`: Show only favorites (1/0)
- `limit`: Number of posts to return (default: 100)
- `sort`: Sort by field
  - `created_at`: Newest first (default)
  - `rating`: Highest rated first
  - `effectiveness`: Best performing first

**Example Request:**
```
GET /api/posts?type=educational&rating=4&sort=effectiveness&limit=10
```

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "content": "Post content...",
      "platform": "facebook",
      "post_type": "educational",
      "tone": "friendly",
      "target_audience": "individual_owners",
      "topic": "ECU repair",
      "season": "winter",
      "created_at": "2024-01-15T10:00:00",
      "published_at": "2024-01-16T09:00:00",
      "scheduled_at": null,
      "rating": 5,
      "inquiries_count": 8,
      "notes": "Great response!",
      "hashtags": "[\"#YYCAutoRepair\", \"#ECURepair\"]",
      "visual_suggestions": "Photo suggestion...",
      "call_to_action": "Call us today!",
      "is_favorite": 1,
      "length": "medium",
      "effectiveness_score": 180
    }
  ],
  "count": 1
}
```

### Get Single Post

**Endpoint:** `GET /api/posts/:id`

**Response:**
```json
{
  "id": 1,
  "content": "Post content...",
  // ... (same fields as above)
}
```

### Create Post

Manually create a post (usually done via Save button in UI).

**Endpoint:** `POST /api/posts`

**Request Body:**
```json
{
  "content": "Your post content here",
  "platform": "facebook",
  "post_type": "educational",
  "tone": "friendly",
  "target_audience": "individual_owners",
  "topic": "ECU basics",
  "season": "winter",
  "hashtags": ["#YYCAutoRepair", "#ECU"],
  "visual_suggestions": "Photo idea",
  "call_to_action": "Contact us",
  "length": "medium"
}
```

**Response:**
```json
{
  "id": 123,
  "content": "Your post content here",
  // ... full post object
}
```

### Update Post

Update post details, primarily for rating and tracking.

**Endpoint:** `PUT /api/posts/:id`

**Request Body:**
```json
{
  "rating": 5,
  "inquiries_count": 8,
  "notes": "Generated 8 calls within 2 days!",
  "is_favorite": 1,
  "published_at": "2024-01-16T09:00:00"
}
```

**Response:**
```json
{
  "id": 1,
  // ... updated post object
}
```

### Delete Post

**Endpoint:** `DELETE /api/posts/:id`

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

---

## Calendar & Scheduling

### Get Calendar Events

Get scheduled and published posts for a specific month.

**Endpoint:** `GET /api/calendar`

**Query Parameters:**
- `month`: Month in YYYY-MM format (optional, defaults to current month)

**Example:**
```
GET /api/calendar?month=2024-01
```

**Response:**
```json
{
  "events": [
    {
      "id": 1,
      "title": "ECU winter tips",
      "date": "2024-01-15T10:00:00",
      "type": "educational",
      "platform": "facebook",
      "content": "Post content...",
      "status": "scheduled"
    }
  ],
  "month": "2024-01"
}
```

### Schedule Post

Schedule a post for future publishing.

**Endpoint:** `POST /api/schedule`

**Request Body:**
```json
{
  "post_id": 123,
  "scheduled_at": "2024-01-20T10:00:00"
}
```

**Response:**
```json
{
  "id": 123,
  "scheduled_at": "2024-01-20T10:00:00",
  // ... full post object
}
```

---

## Analytics & Learning

### Get Analytics

Get comprehensive analytics and performance metrics.

**Endpoint:** `GET /api/analytics`

**Response:**
```json
{
  "total_posts": 50,
  "rated_posts": 35,
  "average_rating": 4.2,
  "total_inquiries": 156,
  "timeline": [
    {
      "month": "2024-01",
      "posts": 10,
      "avg_effectiveness": 145.5,
      "inquiries": 42
    }
  ],
  "performance_by_type": {
    "educational": {
      "count": 20,
      "avg_rating": 4.5,
      "avg_inquiries": 6.2,
      "effectiveness_score": 152
    }
  },
  "performance_by_platform": {
    "facebook": {
      "count": 25,
      "avg_rating": 4.3,
      "avg_inquiries": 5.8
    }
  },
  "performance_by_season": {
    "winter": {
      "count": 15,
      "effectiveness_score": 160
    }
  },
  "best_posts": [
    {
      "id": 5,
      "content": "Best performing post...",
      "rating": 5,
      "inquiries": 15,
      "effectiveness_score": 250,
      "type": "customer_story",
      "platform": "facebook"
    }
  ],
  "top_hashtags": [
    {
      "tag": "#YYCAutoRepair",
      "usage_count": 30,
      "avg_effectiveness": 155
    }
  ]
}
```

### Get Learning Insights

Get detailed learning system insights and patterns.

**Endpoint:** `GET /api/learning-insights`

**Response:**
```json
{
  "total_posts": 50,
  "average_rating": 4.2,
  "total_inquiries": 156,
  "by_type": {
    "educational": {
      "count": 20,
      "avg_rating": 4.5,
      "avg_inquiries": 6.2,
      "effectiveness_score": 152
    }
  },
  "by_tone": {
    "friendly": {
      "count": 25,
      "avg_rating": 4.6,
      "avg_inquiries": 7.1,
      "effectiveness_score": 163
    }
  },
  "by_audience": {
    "individual_owners": {
      "count": 30,
      "avg_rating": 4.3,
      "avg_inquiries": 5.5,
      "effectiveness_score": 141
    }
  },
  "by_platform": {
    "facebook": {
      "count": 25,
      "avg_rating": 4.4,
      "avg_inquiries": 6.8
    }
  },
  "by_season": {
    "winter": {
      "count": 15,
      "avg_rating": 4.6,
      "avg_inquiries": 8.2,
      "effectiveness_score": 174
    }
  },
  "best_performing": [
    // Top 5 posts
  ],
  "top_hashtags": [
    // Top 20 hashtags
  ]
}
```

### Get Recommendations

Get AI recommendations for new post parameters based on historical data.

**Endpoint:** `POST /api/recommendations`

**Request Body:**
```json
{
  "type": "educational",
  "platform": "facebook",
  "audience": "individual_owners"
}
```

**Response:**
```json
{
  "has_data": true,
  "suggestions": [
    "Posts of type 'educational' have an average rating of 4.5/5",
    "For individual_owners, posts typically get 4.3/5 rating with 5.5 inquiries"
  ],
  "optimal_parameters": {
    "best_post_type": "educational",
    "best_type_score": 152,
    "best_tone": "friendly",
    "best_tone_score": 163,
    "best_platform": "facebook",
    "recommended_hashtags": [
      "#YYCAutoRepair",
      "#ECURepair",
      "#RepairNotReplace"
    ]
  },
  "learning_insights": {
    "total_analyzed_posts": 35,
    "overall_avg_rating": 4.2,
    "total_inquiries_generated": 156
  }
}
```

### Get Popular Hashtags

Get most effective hashtags based on post performance.

**Endpoint:** `GET /api/hashtags/popular`

**Response:**
```json
{
  "hashtags": [
    {
      "tag": "#YYCAutoRepair",
      "usage_count": 30,
      "avg_effectiveness": 155.5
    },
    {
      "tag": "#RepairNotReplace",
      "usage_count": 25,
      "avg_effectiveness": 148.2
    }
  ]
}
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

### Success Codes
- `200 OK`: Successful GET/PUT/DELETE
- `201 Created`: Successful POST (creation)

### Error Codes
- `400 Bad Request`: Invalid parameters or missing required fields
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "error": "Description of what went wrong"
}
```

### Common Errors

**Missing Required Field:**
```json
{
  "error": "Post type is required"
}
```

**Resource Not Found:**
```json
{
  "error": "Post not found"
}
```

**AI Generation Error:**
```json
{
  "error": "Error generating content: API key invalid"
}
```

---

## Rate Limits

Currently no rate limiting is implemented. For production:
- Implement rate limiting middleware
- Recommended: 100 requests per minute per IP
- Content generation: 10 requests per minute (Claude API limits)

---

## Webhooks (Future)

Planned webhook support for:
- Post published
- High-performing post detected
- Weekly analytics summary

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- All core endpoints implemented
- Learning system functional

---

## Support

For API issues or questions:
- Check backend logs for detailed error messages
- Verify request format matches examples
- Ensure all required fields are provided
- Check database initialization

## Examples

See [examples/api_examples.py](examples/api_examples.py) for Python usage examples.
