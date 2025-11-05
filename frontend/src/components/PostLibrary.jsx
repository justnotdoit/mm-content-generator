import React, { useState, useEffect } from 'react';
import { getPosts, updatePost, deletePost } from '../utils/api';
import PostEditor from './PostEditor';

function PostLibrary() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    platform: '',
    season: '',
    rating: '',
    favorite: false
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [posts, filters, sortBy]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts({ limit: 100 });
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...posts];

    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(p => p.post_type === filters.type);
    }
    if (filters.platform) {
      filtered = filtered.filter(p => p.platform === filters.platform || p.platform === 'both');
    }
    if (filters.season) {
      filtered = filtered.filter(p => p.season === filters.season);
    }
    if (filters.rating) {
      const minRating = parseInt(filters.rating);
      filtered = filtered.filter(p => p.rating && p.rating >= minRating);
    }
    if (filters.favorite) {
      filtered = filtered.filter(p => p.is_favorite === 1);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === 'effectiveness') {
        return (b.effectiveness_score || 0) - (a.effectiveness_score || 0);
      } else {
        return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    setFilteredPosts(filtered);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowEditor(true);
  };

  const handleSaveEdit = async (postId, updates) => {
    try {
      await updatePost(postId, updates);
      await loadPosts();
      setShowEditor(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(postId);
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert('Content copied to clipboard!');
  };

  const toggleFavorite = async (post) => {
    try {
      await updatePost(post.id, { is_favorite: post.is_favorite === 1 ? 0 : 1 });
      await loadPosts();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400 text-sm">Not rated</span>;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (showEditor && selectedPost) {
    return (
      <PostEditor
        post={selectedPost}
        onSave={handleSaveEdit}
        onCancel={() => {
          setShowEditor(false);
          setSelectedPost(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Post Library</h1>
        <p className="text-gray-600">Manage all your generated social media posts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Filters & Sorting</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="educational">Educational</option>
            <option value="promotional">Promotional</option>
            <option value="customer_story">Customer Story</option>
            <option value="seasonal">Seasonal</option>
          </select>

          <select
            value={filters.platform}
            onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="both">Both</option>
          </select>

          <select
            value={filters.season}
            onChange={(e) => setFilters({ ...filters, season: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Seasons</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
          </select>

          <select
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="created_at">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="effectiveness">Most Effective</option>
          </select>

          <label className="flex items-center border border-gray-300 rounded px-3 py-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.favorite}
              onChange={(e) => setFilters({ ...filters, favorite: e.target.checked })}
              className="mr-2"
            />
            <span>⭐ Favorites</span>
          </label>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredPosts.length} of {posts.length} posts
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">Loading posts...</div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-gray-600">No posts found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters or create a new post</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 flex-wrap">
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
                  {post.season && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      {post.season}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleFavorite(post)}
                  className="text-2xl"
                >
                  {post.is_favorite === 1 ? '⭐' : '☆'}
                </button>
              </div>

              {/* Topic */}
              {post.topic && (
                <h3 className="font-semibold text-gray-900 mb-2">{post.topic}</h3>
              )}

              {/* Content */}
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

              {/* Hashtags */}
              {post.hashtags && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {JSON.parse(post.hashtags).slice(0, 5).map((tag, i) => (
                    <span key={i} className="text-xs text-blue-600">
                      {tag}
                    </span>
                  ))}
                  {JSON.parse(post.hashtags).length > 5 && (
                    <span className="text-xs text-gray-500">
                      +{JSON.parse(post.hashtags).length - 5} more
                    </span>
                  )}
                </div>
              )}

              {/* Rating & Metrics */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  {renderStars(post.rating)}
                  {post.inquiries_count > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      📞 {post.inquiries_count} inquiries
                    </div>
                  )}
                </div>
                {post.effectiveness_score > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Effectiveness</div>
                    <div className="text-lg font-bold text-green-600">
                      {post.effectiveness_score}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleCopy(post.content)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostLibrary;
