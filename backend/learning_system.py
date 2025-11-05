from models import Post, get_session
from sqlalchemy import func, and_, desc
from collections import defaultdict
import json


class LearningSystem:
    def __init__(self):
        self.session = get_session()

    def analyze_successful_patterns(self):
        """
        Analyze patterns from successful posts

        Returns:
            dict with insights about what works best
        """
        # Get all rated posts
        rated_posts = self.session.query(Post).filter(Post.rating.isnot(None)).all()

        if not rated_posts:
            return {
                'total_posts': 0,
                'message': 'No rated posts yet to analyze'
            }

        insights = {
            'total_posts': len(rated_posts),
            'average_rating': sum(p.rating for p in rated_posts) / len(rated_posts),
            'total_inquiries': sum(p.inquiries_count for p in rated_posts),
            'by_type': {},
            'by_tone': {},
            'by_audience': {},
            'by_platform': {},
            'by_season': {},
            'best_performing': [],
            'top_hashtags': []
        }

        # Analyze by different dimensions
        type_stats = defaultdict(lambda: {'count': 0, 'total_rating': 0, 'total_inquiries': 0})
        tone_stats = defaultdict(lambda: {'count': 0, 'total_rating': 0, 'total_inquiries': 0})
        audience_stats = defaultdict(lambda: {'count': 0, 'total_rating': 0, 'total_inquiries': 0})
        platform_stats = defaultdict(lambda: {'count': 0, 'total_rating': 0, 'total_inquiries': 0})
        season_stats = defaultdict(lambda: {'count': 0, 'total_rating': 0, 'total_inquiries': 0})
        hashtag_performance = defaultdict(lambda: {'count': 0, 'total_effectiveness': 0})

        for post in rated_posts:
            effectiveness = post.calculate_effectiveness_score()

            # By type
            if post.post_type:
                type_stats[post.post_type]['count'] += 1
                type_stats[post.post_type]['total_rating'] += post.rating
                type_stats[post.post_type]['total_inquiries'] += post.inquiries_count

            # By tone
            if post.tone:
                tone_stats[post.tone]['count'] += 1
                tone_stats[post.tone]['total_rating'] += post.rating
                tone_stats[post.tone]['total_inquiries'] += post.inquiries_count

            # By audience
            if post.target_audience:
                audience_stats[post.target_audience]['count'] += 1
                audience_stats[post.target_audience]['total_rating'] += post.rating
                audience_stats[post.target_audience]['total_inquiries'] += post.inquiries_count

            # By platform
            if post.platform:
                platform_stats[post.platform]['count'] += 1
                platform_stats[post.platform]['total_rating'] += post.rating
                platform_stats[post.platform]['total_inquiries'] += post.inquiries_count

            # By season
            if post.season:
                season_stats[post.season]['count'] += 1
                season_stats[post.season]['total_rating'] += post.rating
                season_stats[post.season]['total_inquiries'] += post.inquiries_count

            # Hashtag performance
            if post.hashtags:
                try:
                    hashtags = json.loads(post.hashtags) if isinstance(post.hashtags, str) else post.hashtags
                    if isinstance(hashtags, list):
                        for tag in hashtags:
                            hashtag_performance[tag]['count'] += 1
                            hashtag_performance[tag]['total_effectiveness'] += effectiveness
                except:
                    pass

        # Calculate averages
        for category, stats in [
            ('by_type', type_stats),
            ('by_tone', tone_stats),
            ('by_audience', audience_stats),
            ('by_platform', platform_stats),
            ('by_season', season_stats)
        ]:
            for key, data in stats.items():
                if data['count'] > 0:
                    insights[category][key] = {
                        'count': data['count'],
                        'avg_rating': round(data['total_rating'] / data['count'], 2),
                        'avg_inquiries': round(data['total_inquiries'] / data['count'], 2),
                        'effectiveness_score': round(
                            (data['total_rating'] / data['count']) * 20 +
                            (data['total_inquiries'] / data['count']) * 10, 2
                        )
                    }

        # Best performing posts
        best_posts = sorted(rated_posts, key=lambda p: p.calculate_effectiveness_score(), reverse=True)[:5]
        insights['best_performing'] = [
            {
                'id': p.id,
                'content': p.content[:100] + '...' if len(p.content) > 100 else p.content,
                'rating': p.rating,
                'inquiries': p.inquiries_count,
                'effectiveness_score': p.calculate_effectiveness_score(),
                'type': p.post_type,
                'platform': p.platform
            }
            for p in best_posts
        ]

        # Top hashtags
        top_hashtags = sorted(hashtag_performance.items(),
                            key=lambda x: x[1]['total_effectiveness'] / x[1]['count'] if x[1]['count'] > 0 else 0,
                            reverse=True)[:20]
        insights['top_hashtags'] = [
            {
                'tag': tag,
                'usage_count': data['count'],
                'avg_effectiveness': round(data['total_effectiveness'] / data['count'], 2) if data['count'] > 0 else 0
            }
            for tag, data in top_hashtags
        ]

        return insights

    def get_recommendations(self, post_params):
        """
        Get recommendations for new post based on historical data

        Args:
            post_params: dict with type, platform, audience, etc.

        Returns:
            dict with recommendations
        """
        insights = self.analyze_successful_patterns()

        if insights.get('total_posts', 0) == 0:
            return {
                'has_data': False,
                'message': 'Not enough historical data for recommendations. Start creating and rating posts!'
            }

        recommendations = {
            'has_data': True,
            'suggestions': [],
            'optimal_parameters': {},
            'learning_insights': {}
        }

        # Get post type from params
        post_type = post_params.get('type')
        platform = post_params.get('platform')
        audience = post_params.get('audience')

        # Recommendations based on post type
        if post_type and post_type in insights.get('by_type', {}):
            type_data = insights['by_type'][post_type]
            recommendations['suggestions'].append(
                f"Posts of type '{post_type}' have an average rating of {type_data['avg_rating']}/5 "
                f"and generate {type_data['avg_inquiries']} inquiries on average."
            )

        # Best tone for this audience
        if audience and insights.get('by_audience'):
            audience_data = insights['by_audience'].get(audience, {})
            if audience_data:
                recommendations['suggestions'].append(
                    f"For {audience}, posts typically get {audience_data['avg_rating']}/5 rating "
                    f"with {audience_data['avg_inquiries']} inquiries."
                )

        # Platform performance
        if platform and insights.get('by_platform'):
            platform_data = insights['by_platform'].get(platform, {})
            if platform_data:
                recommendations['suggestions'].append(
                    f"{platform.capitalize()} posts average {platform_data['avg_rating']}/5 rating."
                )

        # Optimal parameters (based on highest effectiveness scores)
        best_type = max(insights.get('by_type', {}).items(),
                       key=lambda x: x[1]['effectiveness_score'],
                       default=(None, None))
        best_tone = max(insights.get('by_tone', {}).items(),
                       key=lambda x: x[1]['effectiveness_score'],
                       default=(None, None))
        best_platform = max(insights.get('by_platform', {}).items(),
                          key=lambda x: x[1]['effectiveness_score'],
                          default=(None, None))

        if best_type[0]:
            recommendations['optimal_parameters']['best_post_type'] = best_type[0]
            recommendations['optimal_parameters']['best_type_score'] = best_type[1]['effectiveness_score']

        if best_tone[0]:
            recommendations['optimal_parameters']['best_tone'] = best_tone[0]
            recommendations['optimal_parameters']['best_tone_score'] = best_tone[1]['effectiveness_score']

        if best_platform[0]:
            recommendations['optimal_parameters']['best_platform'] = best_platform[0]

        # Top performing hashtags
        if insights.get('top_hashtags'):
            recommendations['optimal_parameters']['recommended_hashtags'] = [
                h['tag'] for h in insights['top_hashtags'][:10]
            ]

        # General learning insights
        recommendations['learning_insights'] = {
            'total_analyzed_posts': insights['total_posts'],
            'overall_avg_rating': round(insights['average_rating'], 2),
            'total_inquiries_generated': insights['total_inquiries']
        }

        return recommendations

    def find_similar_successful_posts(self, params, limit=5):
        """
        Find similar successful posts to use as examples

        Args:
            params: dict with type, platform, audience, etc.
            limit: number of posts to return

        Returns:
            list of similar successful posts
        """
        query = self.session.query(Post).filter(
            Post.rating.isnot(None),
            Post.rating >= 4  # Only highly rated posts
        )

        # Filter by similar parameters
        if params.get('type'):
            query = query.filter(Post.post_type == params['type'])

        if params.get('platform'):
            query = query.filter(
                (Post.platform == params['platform']) | (Post.platform == 'both')
            )

        if params.get('audience'):
            query = query.filter(Post.target_audience == params['audience'])

        if params.get('season'):
            query = query.filter(Post.season == params['season'])

        # Order by effectiveness score
        posts = query.all()
        posts_sorted = sorted(posts, key=lambda p: p.calculate_effectiveness_score(), reverse=True)

        return [p.to_dict() for p in posts_sorted[:limit]]

    def get_analytics_data(self):
        """
        Get comprehensive analytics data for dashboard

        Returns:
            dict with various analytics metrics
        """
        all_posts = self.session.query(Post).all()
        rated_posts = [p for p in all_posts if p.rating is not None]

        if not rated_posts:
            return {
                'total_posts': len(all_posts),
                'rated_posts': 0,
                'message': 'No rated posts for analytics yet'
            }

        # Timeline data (posts per month with avg effectiveness)
        timeline_data = defaultdict(lambda: {'count': 0, 'total_effectiveness': 0, 'total_inquiries': 0})

        for post in rated_posts:
            if post.created_at:
                month_key = post.created_at.strftime('%Y-%m')
                timeline_data[month_key]['count'] += 1
                timeline_data[month_key]['total_effectiveness'] += post.calculate_effectiveness_score()
                timeline_data[month_key]['total_inquiries'] += post.inquiries_count

        timeline = [
            {
                'month': month,
                'posts': data['count'],
                'avg_effectiveness': round(data['total_effectiveness'] / data['count'], 2) if data['count'] > 0 else 0,
                'inquiries': data['total_inquiries']
            }
            for month, data in sorted(timeline_data.items())
        ]

        # Get insights
        insights = self.analyze_successful_patterns()

        analytics = {
            'total_posts': len(all_posts),
            'rated_posts': len(rated_posts),
            'average_rating': round(sum(p.rating for p in rated_posts) / len(rated_posts), 2),
            'total_inquiries': sum(p.inquiries_count for p in rated_posts),
            'timeline': timeline,
            'performance_by_type': insights.get('by_type', {}),
            'performance_by_platform': insights.get('by_platform', {}),
            'performance_by_season': insights.get('by_season', {}),
            'best_posts': insights.get('best_performing', []),
            'top_hashtags': insights.get('top_hashtags', [])
        }

        return analytics

    def get_learning_insights_for_generation(self, params):
        """
        Get learning insights formatted for content generation

        Args:
            params: post parameters

        Returns:
            dict with successful_posts and insights for prompt
        """
        similar_posts = self.find_similar_successful_posts(params, limit=3)
        recommendations = self.get_recommendations(params)

        insights = {
            'best_tone': recommendations.get('optimal_parameters', {}).get('best_tone', 'friendly'),
            'optimal_length': 'medium',  # Can be enhanced based on analysis
            'best_post_type': recommendations.get('optimal_parameters', {}).get('best_post_type', params.get('type')),
            'effective_hashtags': recommendations.get('optimal_parameters', {}).get('recommended_hashtags', [])
        }

        return {
            'successful_posts': similar_posts,
            'insights': insights,
            'recommendations': recommendations.get('suggestions', [])
        }
