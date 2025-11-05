import React, { useState, useEffect } from 'react';
import { getAnalytics, getLearningInsights } from '../utils/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, insightsData] = await Promise.all([
        getAnalytics(),
        getLearningInsights()
      ]);
      setAnalytics(analyticsData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics || analytics.total_posts === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-2">No Analytics Data Yet</h2>
        <p className="text-gray-600">Create and rate posts to see analytics and insights</p>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Prepare data for charts
  const typeData = Object.entries(analytics.performance_by_type || {}).map(([key, value]) => ({
    name: key.replace('_', ' '),
    rating: value.avg_rating,
    inquiries: value.avg_inquiries,
    effectiveness: value.effectiveness_score
  }));

  const platformData = Object.entries(analytics.performance_by_platform || {}).map(([key, value]) => ({
    name: key,
    posts: value.count,
    rating: value.avg_rating
  }));

  const seasonData = Object.entries(analytics.performance_by_season || {}).map(([key, value]) => ({
    name: key,
    effectiveness: value.effectiveness_score,
    posts: value.count
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Insights and performance metrics for your content</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="text-sm opacity-90">Total Posts</div>
          <div className="text-4xl font-bold mt-2">{analytics.total_posts}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="text-sm opacity-90">Rated Posts</div>
          <div className="text-4xl font-bold mt-2">{analytics.rated_posts}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
          <div className="text-sm opacity-90">Average Rating</div>
          <div className="text-4xl font-bold mt-2">{analytics.average_rating}/5</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="text-sm opacity-90">Total Inquiries</div>
          <div className="text-4xl font-bold mt-2">{analytics.total_inquiries}</div>
        </div>
      </div>

      {/* Performance by Type */}
      {typeData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Performance by Post Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rating" fill="#3B82F6" name="Avg Rating" />
              <Bar dataKey="inquiries" fill="#10B981" name="Avg Inquiries" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Platform Comparison & Season Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        {platformData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Platform Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={platformData}
                  dataKey="posts"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Season Performance */}
        {seasonData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Seasonal Performance</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={seasonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="effectiveness" fill="#F59E0B" name="Effectiveness Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Timeline */}
      {analytics.timeline && analytics.timeline.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Performance Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avg_effectiveness" stroke="#3B82F6" name="Avg Effectiveness" />
              <Line type="monotone" dataKey="inquiries" stroke="#10B981" name="Inquiries" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Best Performing Posts */}
      {analytics.best_posts && analytics.best_posts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🏆 Top Performing Posts</h2>
          <div className="space-y-4">
            {analytics.best_posts.map((post, index) => (
              <div key={post.id} className="border rounded-lg p-4 flex items-start gap-4">
                <div className="text-3xl font-bold text-gray-300">#{index + 1}</div>
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      post.platform === 'facebook' ? 'bg-blue-100 text-blue-800' :
                      post.platform === 'instagram' ? 'bg-pink-100 text-pink-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {post.platform}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {post.type}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{post.content}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>⭐ {post.rating}/5</span>
                    <span>📞 {post.inquiries} inquiries</span>
                    <span className="font-semibold text-green-600">
                      Score: {post.effectiveness_score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Hashtags */}
      {analytics.top_hashtags && analytics.top_hashtags.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔥 Most Effective Hashtags</h2>
          <div className="flex flex-wrap gap-2">
            {analytics.top_hashtags.slice(0, 20).map((item, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full"
              >
                <span className="font-medium text-blue-900">{item.tag}</span>
                <span className="ml-2 text-sm text-blue-600">
                  ({item.usage_count}× • {item.avg_effectiveness} avg)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Insights Summary */}
      {insights && insights.total_posts > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-bold mb-4">💡 Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.by_type && Object.keys(insights.by_type).length > 0 && (
              <div className="bg-white bg-opacity-20 rounded p-4">
                <div className="text-sm opacity-90">Best Post Type</div>
                <div className="text-2xl font-bold mt-1">
                  {Object.entries(insights.by_type).reduce((a, b) =>
                    a[1].effectiveness_score > b[1].effectiveness_score ? a : b
                  )[0].replace('_', ' ')}
                </div>
              </div>
            )}
            {insights.by_tone && Object.keys(insights.by_tone).length > 0 && (
              <div className="bg-white bg-opacity-20 rounded p-4">
                <div className="text-sm opacity-90">Best Tone</div>
                <div className="text-2xl font-bold mt-1">
                  {Object.entries(insights.by_tone).reduce((a, b) =>
                    a[1].effectiveness_score > b[1].effectiveness_score ? a : b
                  )[0]}
                </div>
              </div>
            )}
            {insights.by_platform && Object.keys(insights.by_platform).length > 0 && (
              <div className="bg-white bg-opacity-20 rounded p-4">
                <div className="text-sm opacity-90">Best Platform</div>
                <div className="text-2xl font-bold mt-1">
                  {Object.entries(insights.by_platform).reduce((a, b) =>
                    a[1].effectiveness_score > b[1].effectiveness_score ? a : b
                  )[0]}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
