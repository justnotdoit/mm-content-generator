import React, { useState, useEffect } from 'react';
import { getCalendar, schedulePost, getPosts } from '../utils/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';

function ContentCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendarData();
  }, [currentMonth]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const monthStr = format(currentMonth, 'yyyy-MM');
      const [calendarData, postsData] = await Promise.all([
        getCalendar(monthStr),
        getPosts({ limit: 100 })
      ]);
      setEvents(calendarData.events || []);
      setAllPosts(postsData.posts || []);
    } catch (error) {
      console.error('Error loading calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (postId, date) => {
    try {
      const scheduledAt = new Date(date);
      scheduledAt.setHours(10, 0, 0, 0); // Default to 10 AM
      await schedulePost(postId, scheduledAt.toISOString());
      await loadCalendarData();
      setShowScheduleModal(false);
      setSelectedDate(null);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert('Error scheduling post');
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  };

  const getPostTypeColor = (type) => {
    const colors = {
      educational: 'bg-blue-100 border-blue-300 text-blue-800',
      promotional: 'bg-green-100 border-green-300 text-green-800',
      customer_story: 'bg-purple-100 border-purple-300 text-purple-800',
      seasonal: 'bg-orange-100 border-orange-300 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const unscheduledPosts = allPosts.filter(post => !post.scheduled_at || post.published_at);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Content Calendar</h1>
        <p className="text-gray-600">Plan and schedule your social media posts</p>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            ← Previous
          </button>
          <h2 className="text-2xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Next →
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Educational</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Promotional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
            <span>Customer Story</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
            <span>Seasonal</span>
          </div>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading calendar...</div>
        ) : (
          <>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}

              {/* Days of the month */}
              {daysInMonth.map(date => {
                const dayEvents = getEventsForDate(date);
                const isToday = isSameDay(date, new Date());

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date);
                      setShowScheduleModal(true);
                    }}
                    className={`aspect-square border-2 rounded-lg p-2 cursor-pointer hover:shadow-md transition ${
                      isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {format(date, 'd')}
                    </div>
                    <div className="space-y-1 overflow-y-auto max-h-20">
                      {dayEvents.map((event, i) => (
                        <div
                          key={i}
                          className={`text-xs p-1 rounded border truncate ${getPostTypeColor(event.type)}`}
                          title={event.content}
                        >
                          {event.platform === 'facebook' ? '📘' : event.platform === 'instagram' ? '📸' : '🎯'}
                          {' '}{event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Upcoming Posts */}
      {events.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📅 Scheduled Posts</h2>
          <div className="space-y-3">
            {events
              .filter(e => e.status === 'scheduled')
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 10)
              .map((event, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border rounded-lg hover:shadow">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">{format(new Date(event.date), 'MMM')}</div>
                    <div className="text-2xl font-bold">{format(new Date(event.date), 'd')}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.platform === 'facebook' ? 'bg-blue-100 text-blue-800' :
                        event.platform === 'instagram' ? 'bg-pink-100 text-pink-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {event.platform}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{event.content}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Schedule Post for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedDate(null);
                  setSelectedPost(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Posts scheduled for this day */}
            {selectedDate && getEventsForDate(selectedDate).length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Already scheduled:</h3>
                <div className="space-y-2">
                  {getEventsForDate(selectedDate).map((event, i) => (
                    <div key={i} className="text-sm p-2 bg-white rounded">
                      <span className="font-medium">{event.platform}</span> - {event.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Select post to schedule */}
            <div>
              <h3 className="font-semibold mb-3">Select a post to schedule:</h3>
              {unscheduledPosts.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No unscheduled posts available. Create new posts first!
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {unscheduledPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                        selectedPost?.id === post.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex gap-2 mb-1">
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
                      <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedDate(null);
                  setSelectedPost(null);
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedDate && selectedPost && handleSchedule(selectedPost.id, selectedDate)}
                disabled={!selectedPost}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentCalendar;
