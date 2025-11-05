import React, { useState } from 'react';

function PostEditor({ post, onSave, onCancel }) {
  const [editedPost, setEditedPost] = useState({
    content: post.content || '',
    rating: post.rating || null,
    inquiries_count: post.inquiries_count || 0,
    notes: post.notes || '',
    hashtags: post.hashtags ? JSON.parse(post.hashtags) : [],
    is_favorite: post.is_favorite || 0
  });

  const handleSave = () => {
    onSave(post.id, {
      ...editedPost,
      hashtags: JSON.stringify(editedPost.hashtags)
    });
  };

  const setRating = (rating) => {
    setEditedPost({ ...editedPost, rating });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

        {/* Post Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2 mb-2">
            <span className={`px-3 py-1 rounded text-sm font-medium ${
              post.platform === 'facebook' ? 'bg-blue-100 text-blue-800' :
              post.platform === 'instagram' ? 'bg-pink-100 text-pink-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {post.platform}
            </span>
            <span className="px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800">
              {post.post_type}
            </span>
          </div>
          {post.topic && <p className="text-sm text-gray-600">Topic: {post.topic}</p>}
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={editedPost.content}
            onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate this post (1-5 stars)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-4xl focus:outline-none transition transform hover:scale-110"
              >
                {editedPost.rating >= star ? '⭐' : '☆'}
              </button>
            ))}
            {editedPost.rating && (
              <button
                onClick={() => setRating(null)}
                className="ml-4 text-sm text-red-600 hover:text-red-800"
              >
                Clear rating
              </button>
            )}
          </div>
        </div>

        {/* Inquiries Count */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Inquiries Generated
          </label>
          <input
            type="number"
            min="0"
            value={editedPost.inquiries_count}
            onChange={(e) => setEditedPost({ ...editedPost, inquiries_count: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            How many customer inquiries did this post generate?
          </p>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={editedPost.notes}
            onChange={(e) => setEditedPost({ ...editedPost, notes: e.target.value })}
            rows={4}
            placeholder="Add notes about this post's performance, audience response, etc."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Hashtags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hashtags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {editedPost.hashtags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => {
                    const newHashtags = editedPost.hashtags.filter((_, i) => i !== index);
                    setEditedPost({ ...editedPost, hashtags: newHashtags });
                  }}
                  className="text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="new-hashtag"
              placeholder="Add hashtag (press Enter)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  let tag = e.target.value.trim();
                  if (tag && !tag.startsWith('#')) tag = '#' + tag;
                  if (tag && !editedPost.hashtags.includes(tag)) {
                    setEditedPost({ ...editedPost, hashtags: [...editedPost.hashtags, tag] });
                    e.target.value = '';
                  }
                }
              }}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Favorite Toggle */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={editedPost.is_favorite === 1}
              onChange={(e) => setEditedPost({ ...editedPost, is_favorite: e.target.checked ? 1 : 0 })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Mark as favorite ⭐
            </span>
          </label>
        </div>

        {/* Effectiveness Score Display */}
        {editedPost.rating && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Effectiveness Score</div>
            <div className="text-3xl font-bold text-green-600">
              {(editedPost.rating * 20) + (editedPost.inquiries_count * 10)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              (Rating × 20) + (Inquiries × 10)
            </div>
          </div>
        )}

        {/* Visual Suggestions & CTA (Read-only) */}
        {post.visual_suggestions && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visual Suggestions
            </label>
            <p className="text-sm text-gray-600">{post.visual_suggestions}</p>
          </div>
        )}

        {post.call_to_action && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call to Action
            </label>
            <p className="text-sm text-gray-900 font-medium">{post.call_to_action}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostEditor;
