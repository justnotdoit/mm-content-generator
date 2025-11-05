import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, getAnalytics } from '../utils/api';

function Dashboard() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [postsData, analyticsData] = await Promise.all([
        getPosts({ limit: 3, sort: 'created_at' }),
        getAnalytics()
      ]);
      setRecentPosts(postsData.posts || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">Not rated</span>;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Module Masters Content Generator</h1>
        <p className="text-blue-100">Create, manage, and optimize your social media content with AI assistance</p>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm font-medium">Total Posts</div>
            <div className="text-3xl font-bold text-blue-600">{analytics.total_posts || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm font-medium">Rated Posts</div>
            <div className="text-3xl font-bold text-green-600">{analytics.rated_posts || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm font-medium">Avg Rating</div>
            <div className="text-3xl font-bold text-yellow-600">
              {analytics.average_rating ? `${analytics.average_rating}/5` : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm font-medium">Total Inquiries</div>
            <div className="text-3xl font-bold text-purple-600">{analytics.total_inquiries || 0}</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/generate"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-6 text-center transition transform hover:scale-105"
          >
            <div className="text-3xl mb-2">✨</div>
            <div className="text-lg font-semibold">Generate New Content</div>
            <div className="text-sm text-blue-100 mt-1">Create AI-powered social media posts</div>
          </Link>
          <Link
            to="/library"
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 text-center transition transform hover:scale-105"
          >
            <div className="text-3xl mb-2">📚</div>
            <div className="text-lg font-semibold">View Post Library</div>
            <div className="text-sm text-green-100 mt-1">Browse and manage your posts</div>
          </Link>
          <Link
            to="/calendar"
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-6 text-center transition transform hover:scale-105"
          >
            <div className="text-3xl mb-2">📅</div>
            <div className="text-lg font-semibold">Content Calendar</div>
            <div className="text-sm text-purple-100 mt-1">Plan your posting schedule</div>
          </Link>
          <Link
            to="/analytics"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-6 text-center transition transform hover:scale-105"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="text-lg font-semibold">View Analytics</div>
            <div className="text-sm text-orange-100 mt-1">Insights and performance metrics</div>
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Posts</h2>
          <Link to="/library" className="text-blue-600 hover:text-blue-800">
            View all →
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No posts yet. Start by generating your first post!</p>
            <Link to="/generate" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Generate Now →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        post.platform === 'facebook' ? 'bg-blue-100 text-blue-800' :
                        post.platform === 'instagram' ? 'bg-pink-100 text-pink-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {post.platform}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {post.post_type}
                      </span>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{post.content}</p>
                  </div>
                  <div className="ml-4">
                    {renderStars(post.rating)}
                  </div>
                </div>
                {post.inquiries_count > 0 && (
                  <div className="text-sm text-gray-600 mt-2">
                    📞 {post.inquiries_count} inquiries
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
