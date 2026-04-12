import { useState } from 'react';

/**
 * VideoGenerator component
 * Handles the main video generation interface including prompt input,
 * parameter controls, and generation trigger.
 */
export default function VideoGenerator({ apiKey, onVideoGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [duration, setDuration] = useState(4);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [motionStrength, setMotionStrength] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const aspectRatios = ['16:9', '9:16', '1:1', '4:3', '3:4'];
  const durations = [2, 4, 6, 8];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate a video.');
      return;
    }
    if (!apiKey) {
      setError('API key is required. Please set your Higgsfield API key.');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          negative_prompt: negativePrompt.trim(),
          duration,
          aspect_ratio: aspectRatio,
          motion_strength: motionStrength,
          api_key: apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      if (onVideoGenerated) {
        onVideoGenerated(data);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      {/* Main prompt input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">Prompt</label>
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 transition-colors"
          rows={4}
          placeholder="Describe the video you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      {/* Negative prompt input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">Negative Prompt (optional)</label>
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 transition-colors"
          rows={2}
          placeholder="What to avoid in the video..."
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      {/* Parameter controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Aspect ratio selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Aspect Ratio</label>
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            disabled={isGenerating}
          >
            {aspectRatios.map((ratio) => (
              <option key={ratio} value={ratio}>{ratio}</option>
            ))}
          </select>
        </div>

        {/* Duration selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Duration (seconds)</label>
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={isGenerating}
          >
            {durations.map((d) => (
              <option key={d} value={d}>{d}s</option>
            ))}
          </select>
        </div>
      </div>

      {/* Motion strength slider */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">
          Motion Strength: <span className="text-blue-400">{motionStrength}</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={motionStrength}
          onChange={(e) => setMotionStrength(Number(e.target.value))}
          disabled={isGenerating}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtle</span>
          <span>Dynamic</span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Generating...
          </>
        ) : (
          'Generate Video'
        )}
      </button>
    </div>
  );
}
