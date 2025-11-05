import React, { useState } from 'react';
import { generateContent, createPost } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function ContentGenerator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [params, setParams] = useState({
    type: 'educational',
    platform: 'both',
    tone: 'friendly',
    audience: 'individual_owners',
    topic: '',
    season: getCurrentSeason(),
    length: 'medium'
  });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [learningInsights, setLearningInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 11 || month <= 1) return 'winter';
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    return 'fall';
  }

  const handleGenerate = async () => {
    if (!params.topic) {
      alert('Please enter a topic');
      return;
    }

    try {
      setLoading(true);
      const result = await generateContent(params);
      setGeneratedContent(result.content);
      setLearningInsights(result.learning_insights || []);
      setStep(4);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Error generating content. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (platform) => {
    try {
      setSaving(true);
      const content = generatedContent[platform];
      const postData = {
        content: content.content,
        platform: platform,
        post_type: params.type,
        tone: params.tone,
        target_audience: params.audience,
        topic: params.topic,
        season: params.season,
        length: params.length,
        hashtags: JSON.stringify(content.hashtags || []),
        visual_suggestions: content.visual_suggestions,
        call_to_action: content.call_to_action,
        prompt_used: generatedContent.prompt_used
      };

      await createPost(postData);
      alert('Post saved successfully!');
      navigate('/library');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Step 1: Choose Post Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { value: 'educational', label: 'Educational', icon: '📚', desc: 'Teach customers about modules' },
          { value: 'promotional', label: 'Promotional', icon: '🎉', desc: 'Special offers and deals' },
          { value: 'customer_story', label: 'Customer Story', icon: '⭐', desc: 'Success stories and testimonials' },
          { value: 'seasonal', label: 'Seasonal', icon: '🌤️', desc: 'Season-specific content' }
        ].map((type) => (
          <button
            key={type.value}
            onClick={() => {
              setParams({ ...params, type: type.value });
              setStep(2);
            }}
            className={`p-6 rounded-lg border-2 text-left transition hover:shadow-lg ${
              params.type === type.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-3xl mb-2">{type.icon}</div>
            <div className="font-semibold text-lg">{type.label}</div>
            <div className="text-sm text-gray-600">{type.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Step 2: Select Platform</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { value: 'facebook', label: 'Facebook', icon: '📘', color: 'blue' },
          { value: 'instagram', label: 'Instagram', icon: '📸', color: 'pink' },
          { value: 'both', label: 'Both Platforms', icon: '🎯', color: 'purple' }
        ].map((platform) => (
          <button
            key={platform.value}
            onClick={() => {
              setParams({ ...params, platform: platform.value });
              setStep(3);
            }}
            className={`p-6 rounded-lg border-2 text-center transition hover:shadow-lg ${
              params.platform === platform.value
                ? `border-${platform.color}-500 bg-${platform.color}-50`
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-4xl mb-2">{platform.icon}</div>
            <div className="font-semibold text-lg">{platform.label}</div>
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(1)}
        className="text-blue-600 hover:text-blue-800"
      >
        ← Back
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Step 3: Detailed Parameters</h2>

      {/* Learning Insights */}
      {learningInsights.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Learning Insights</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            {learningInsights.map((insight, i) => (
              <li key={i}>• {insight}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
          <select
            value={params.tone}
            onChange={(e) => setParams({ ...params, tone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="urgent">Urgent</option>
            <option value="educational">Educational</option>
          </select>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
          <select
            value={params.audience}
            onChange={(e) => setParams({ ...params, audience: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="individual_owners">Individual Car Owners</option>
            <option value="fleet_managers">Fleet Managers</option>
            <option value="shop_owners">Auto Shop Owners</option>
          </select>
        </div>

        {/* Season */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
          <select
            value={params.season}
            onChange={(e) => setParams({ ...params, season: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
          </select>
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content Length</label>
          <select
            value={params.length}
            onChange={(e) => setParams({ ...params, length: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
      </div>

      {/* Topic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Topic / Module</label>
        <input
          type="text"
          value={params.topic}
          onChange={(e) => setParams({ ...params, topic: e.target.value })}
          placeholder="e.g., ECU repair vs replacement, Winter ABS problems, Fleet maintenance benefits"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Popular modules: ECU, BCM, TCM, Airbag, ABS, BMW FRM, Diesel modules
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-2 text-blue-600 hover:text-blue-800"
        >
          ← Back
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading || !params.topic}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : '✨ Generate Content'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    if (!generatedContent) return null;

    const renderPlatformContent = (platform, data) => (
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${
            platform === 'facebook' ? 'text-blue-600' : 'text-pink-600'
          }`}>
            {platform === 'facebook' ? '📘 Facebook' : '📸 Instagram'}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(data.content)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              📋 Copy
            </button>
            <button
              onClick={() => handleSave(platform)}
              disabled={saving}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm disabled:bg-gray-400"
            >
              💾 Save
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Content:</label>
            <p className="mt-1 p-3 bg-gray-50 rounded border">{data.content}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Hashtags:</label>
            <div className="mt-1 flex flex-wrap gap-1">
              {data.hashtags?.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Visual Suggestion:</label>
            <p className="mt-1 text-sm text-gray-600">{data.visual_suggestions}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Call to Action:</label>
            <p className="mt-1 text-sm font-medium text-gray-900">{data.call_to_action}</p>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Generated Content</h2>
          <button
            onClick={() => {
              setStep(3);
              setGeneratedContent(null);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            🔄 Regenerate
          </button>
        </div>

        {generatedContent.reasoning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">AI Reasoning:</h3>
            <p className="text-sm text-yellow-800">{generatedContent.reasoning}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {generatedContent.facebook && renderPlatformContent('facebook', generatedContent.facebook)}
          {generatedContent.instagram && renderPlatformContent('instagram', generatedContent.instagram)}
        </div>

        <button
          onClick={() => {
            setStep(1);
            setGeneratedContent(null);
            setParams({
              type: 'educational',
              platform: 'both',
              tone: 'friendly',
              audience: 'individual_owners',
              topic: '',
              season: getCurrentSeason(),
              length: 'medium'
            });
          }}
          className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold"
        >
          ➕ Create Another Post
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Type</span>
            <span>Platform</span>
            <span>Details</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
}

export default ContentGenerator;
