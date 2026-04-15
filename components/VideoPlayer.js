import { useState, useRef, useEffect } from 'react';

/**
 * VideoPlayer component for displaying generated videos
 * Handles loading states, errors, and playback controls
 */
export default function VideoPlayer({ videoUrl, isLoading, jobId }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset state when a new video URL is provided
    if (videoUrl) {
      setError(false);
      setIsPlaying(false);
      setProgress(0);
    }
  }, [videoUrl]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      setProgress((currentTime / duration) * 100 || 0);
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `higgsfield-${jobId || Date.now()}.mp4`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-900 rounded-xl border border-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4" />
        <p className="text-gray-400 text-sm">Generating your video...</p>
        {jobId && <p className="text-gray-600 text-xs mt-1">Job ID: {jobId}</p>}
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-900 rounded-xl border border-gray-700 border-dashed">
        <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
        <p className="text-gray-500 text-sm">Your generated video will appear here</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-900 rounded-xl border border-red-800">
        <p className="text-red-400 text-sm">Failed to load video</p>
        <button
          onClick={() => setError(false)}
          className="mt-2 text-xs text-gray-400 underline hover:text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full max-h-96 object-contain"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setError(true)}
        loop
      />

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-700">
        <div
          className="h-full bg-purple-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={handlePlayPause}
          className="flex items-center gap-2 text-white text-sm hover:text-purple-400 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}
