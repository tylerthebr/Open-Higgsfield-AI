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
  // bumped default motion strength down to 3 - 5 felt too shaky for most prompts
  const [motionStrength, setMotionStrength] = useState(3);
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
        {/* show character count - helpful to stay concise with prompts */}
        <span className="text-xs text-gray-500 text-right">{prompt.length} chars</span>
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
    </div>
  );
}
