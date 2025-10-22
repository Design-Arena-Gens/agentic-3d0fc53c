'use client';

import { useState } from 'react';
import { Wand2, Video, Loader, CheckCircle, AlertCircle } from 'lucide-react';

export default function AIVideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('professional');
  const [duration, setDuration] = useState('15');
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const styles = [
    { id: 'professional', name: 'Professional', description: 'Clean and corporate' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and friendly' },
    { id: 'energetic', name: 'Energetic', description: 'Fast-paced and exciting' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setGenerating(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, duration: parseInt(duration) }),
      });

      if (response.ok) {
        setStatus('success');
        setPrompt('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setStatus('error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Wand2 className="h-8 w-8 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold">AI Video Generator</h2>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-6">
        <p className="text-gray-700">
          Describe the video you want to create and let AI generate it for you. Perfect for daily
          content creation and automation.
        </p>
      </div>

      {/* Prompt Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Example: Create a motivational video about starting your day with positive affirmations. Include uplifting music and inspiring visuals of sunrise, people exercising, and healthy breakfast..."
        />
      </div>

      {/* Style Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Style
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`p-4 rounded-lg border-2 transition text-left ${
                style === s.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold mb-1">{s.name}</p>
              <p className="text-sm text-gray-600">{s.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration (seconds)
        </label>
        <div className="flex space-x-4">
          {['15', '30', '60'].map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-6 py-2 rounded-lg border-2 transition ${
                duration === d
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          {generating ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Generating Video...
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5 mr-2" />
              Generate Video
            </>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800">
            Video generation started! Check back in a few minutes.
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Generation failed. Please try again.</span>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about visuals, music, and mood you want</li>
          <li>• Include target audience and platform in your prompt</li>
          <li>• Mention any text overlays or captions you want included</li>
          <li>• Video generation typically takes 2-5 minutes</li>
        </ul>
      </div>
    </div>
  );
}
