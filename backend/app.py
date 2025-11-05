from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime
import json

from models import Post, init_db, get_session
from content_generator import ContentGenerator
from learning_system import LearningSystem

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize database
init_db()

# Initialize services
content_generator = ContentGenerator()
learning_system = LearningSystem()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Module Masters Content Generator API'})


@app.route('/api/generate', methods=['POST'])
def generate_content():
    """
    Generate social media content

    Expected JSON body:
    {
        "type": "educational",
        "platform": "both",
        "tone": "friendly",
        "audience": "individual_owners",
        "topic": "ECU repair vs replacement",
        "season": "winter",
        "length": "medium"
    }
    """
    try:
        params = request.json

        # Validate required fields
        if not params.get('type'):
            return jsonify({'error': 'Post type is required'}), 400

        # Get learning insights
        learning_data = learning_system.get_learning_insights_for_generation(params)

        # Generate content
        result = content_generator.generate_post(params, learning_data)

        if 'error' in result:
            return jsonify({'error': result['error']}), 500

        # Return generated content with learning insights
        return jsonify({
            'content': result,
            'learning_insights': learning_data.get('recommendations', []),
            'similar_successful_posts': learning_data.get('successful_posts', [])
        })

    except Exception as e:
        print(f"Error in generate_content: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/posts', methods=['GET'])
def get_posts():
    """
    Get all posts with optional filters

    Query parameters:
    - type: filter by post type
    - platform: filter by platform
    - rating: minimum rating
    - season: filter by season
    - favorite: only favorites (1/0)
    - limit: number of posts to return
    - sort: sort by (created_at, rating, effectiveness)
    """
    try:
        session = get_session()
        query = session.query(Post)

        # Apply filters
        if request.args.get('type'):
            query = query.filter(Post.post_type == request.args.get('type'))

        if request.args.get('platform'):
            platform = request.args.get('platform')
            query = query.filter((Post.platform == platform) | (Post.platform == 'both'))

        if request.args.get('rating'):
            min_rating = int(request.args.get('rating'))
            query = query.filter(Post.rating >= min_rating)

        if request.args.get('season'):
            query = query.filter(Post.season == request.args.get('season'))

        if request.args.get('favorite') == '1':
            query = query.filter(Post.is_favorite == 1)

        # Get all matching posts
        posts = query.all()

        # Sort
        sort_by = request.args.get('sort', 'created_at')
        if sort_by == 'rating':
            posts = sorted(posts, key=lambda p: p.rating or 0, reverse=True)
        elif sort_by == 'effectiveness':
            posts = sorted(posts, key=lambda p: p.calculate_effectiveness_score(), reverse=True)
        else:  # created_at
            posts = sorted(posts, key=lambda p: p.created_at or datetime.min, reverse=True)

        # Apply limit
        limit = int(request.args.get('limit', 100))
        posts = posts[:limit]

        return jsonify({
            'posts': [post.to_dict() for post in posts],
            'count': len(posts)
        })

    except Exception as e:
        print(f"Error in get_posts: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """Get a specific post by ID"""
    try:
        session = get_session()
        post = session.query(Post).filter(Post.id == post_id).first()

        if not post:
            return jsonify({'error': 'Post not found'}), 404

        return jsonify(post.to_dict())

    except Exception as e:
        print(f"Error in get_post: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/posts', methods=['POST'])
def create_post():
    """
    Create a new post

    Expected JSON body:
    {
        "content": "Post content",
        "platform": "facebook",
        "post_type": "educational",
        "hashtags": ["#tag1", "#tag2"],
        "visual_suggestions": "Photo idea",
        "call_to_action": "CTA text",
        ...
    }
    """
    try:
        data = request.json
        session = get_session()

        # Convert hashtags to JSON string if it's a list
        hashtags = data.get('hashtags', [])
        if isinstance(hashtags, list):
            hashtags = json.dumps(hashtags)

        post = Post(
            content=data.get('content', ''),
            platform=data.get('platform', 'both'),
            post_type=data.get('post_type', 'educational'),
            tone=data.get('tone'),
            target_audience=data.get('target_audience'),
            topic=data.get('topic'),
            season=data.get('season'),
            hashtags=hashtags,
            prompt_used=data.get('prompt_used'),
            visual_suggestions=data.get('visual_suggestions'),
            call_to_action=data.get('call_to_action'),
            length=data.get('length')
        )

        session.add(post)
        session.commit()
        session.refresh(post)

        return jsonify(post.to_dict()), 201

    except Exception as e:
        print(f"Error in create_post: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    """
    Update a post (mainly for rating, inquiries, notes)

    Expected JSON body:
    {
        "rating": 5,
        "inquiries_count": 3,
        "notes": "Great response from fleet managers",
        "is_favorite": 1,
        "published_at": "2024-01-15T10:00:00"
    }
    """
    try:
        session = get_session()
        post = session.query(Post).filter(Post.id == post_id).first()

        if not post:
            return jsonify({'error': 'Post not found'}), 404

        data = request.json

        # Update fields if provided
        if 'rating' in data:
            post.rating = data['rating']
        if 'inquiries_count' in data:
            post.inquiries_count = data['inquiries_count']
        if 'notes' in data:
            post.notes = data['notes']
        if 'is_favorite' in data:
            post.is_favorite = data['is_favorite']
        if 'published_at' in data:
            post.published_at = datetime.fromisoformat(data['published_at'].replace('Z', '+00:00'))
        if 'scheduled_at' in data:
            post.scheduled_at = datetime.fromisoformat(data['scheduled_at'].replace('Z', '+00:00'))
        if 'content' in data:
            post.content = data['content']
        if 'hashtags' in data:
            hashtags = data['hashtags']
            if isinstance(hashtags, list):
                hashtags = json.dumps(hashtags)
            post.hashtags = hashtags

        session.commit()
        session.refresh(post)

        return jsonify(post.to_dict())

    except Exception as e:
        print(f"Error in update_post: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    """Delete a post"""
    try:
        session = get_session()
        post = session.query(Post).filter(Post.id == post_id).first()

        if not post:
            return jsonify({'error': 'Post not found'}), 404

        session.delete(post)
        session.commit()

        return jsonify({'message': 'Post deleted successfully'})

    except Exception as e:
        print(f"Error in delete_post: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/schedule', methods=['POST'])
def schedule_post():
    """
    Schedule a post for future publishing

    Expected JSON body:
    {
        "post_id": 123,
        "scheduled_at": "2024-02-15T10:00:00"
    }
    """
    try:
        data = request.json
        session = get_session()

        post = session.query(Post).filter(Post.id == data.get('post_id')).first()
        if not post:
            return jsonify({'error': 'Post not found'}), 404

        post.scheduled_at = datetime.fromisoformat(data['scheduled_at'].replace('Z', '+00:00'))
        session.commit()
        session.refresh(post)

        return jsonify(post.to_dict())

    except Exception as e:
        print(f"Error in schedule_post: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/calendar', methods=['GET'])
def get_calendar():
    """
    Get posts for calendar view

    Query parameters:
    - month: YYYY-MM format (optional, defaults to current month)
    """
    try:
        session = get_session()

        # Get month parameter or default to current month
        month_param = request.args.get('month')
        if month_param:
            year, month = map(int, month_param.split('-'))
        else:
            now = datetime.now()
            year, month = now.year, now.month

        # Query posts scheduled or published in this month
        from datetime import datetime as dt
        start_date = dt(year, month, 1)
        if month == 12:
            end_date = dt(year + 1, 1, 1)
        else:
            end_date = dt(year, month + 1, 1)

        posts = session.query(Post).filter(
            ((Post.scheduled_at >= start_date) & (Post.scheduled_at < end_date)) |
            ((Post.published_at >= start_date) & (Post.published_at < end_date))
        ).all()

        # Format for calendar
        events = []
        for post in posts:
            event_date = post.scheduled_at or post.published_at
            if event_date:
                events.append({
                    'id': post.id,
                    'title': post.topic or post.post_type,
                    'date': event_date.isoformat(),
                    'type': post.post_type,
                    'platform': post.platform,
                    'content': post.content[:100] + '...' if len(post.content) > 100 else post.content,
                    'status': 'published' if post.published_at else 'scheduled'
                })

        return jsonify({
            'events': events,
            'month': f"{year}-{month:02d}"
        })

    except Exception as e:
        print(f"Error in get_calendar: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics data for dashboard"""
    try:
        analytics_data = learning_system.get_analytics_data()
        return jsonify(analytics_data)

    except Exception as e:
        print(f"Error in get_analytics: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/learning-insights', methods=['GET'])
def get_learning_insights():
    """Get learning insights and patterns"""
    try:
        insights = learning_system.analyze_successful_patterns()
        return jsonify(insights)

    except Exception as e:
        print(f"Error in get_learning_insights: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """
    Get recommendations for a post based on parameters

    Expected JSON body:
    {
        "type": "educational",
        "platform": "facebook",
        "audience": "individual_owners"
    }
    """
    try:
        params = request.json
        recommendations = learning_system.get_recommendations(params)
        return jsonify(recommendations)

    except Exception as e:
        print(f"Error in get_recommendations: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/hashtags/popular', methods=['GET'])
def get_popular_hashtags():
    """Get most effective hashtags"""
    try:
        insights = learning_system.analyze_successful_patterns()
        hashtags = insights.get('top_hashtags', [])
        return jsonify({'hashtags': hashtags})

    except Exception as e:
        print(f"Error in get_popular_hashtags: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
