/**
 * Higgsfield AI API client
 * Handles communication with the Higgsfield video generation API
 */

const HIGGSFIELD_API_BASE = 'https://api.higgsfield.ai/v1';

/**
 * Generate a video using the Higgsfield AI API
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - Text prompt for video generation
 * @param {string} params.apiKey - Higgsfield API key
 * @param {string} [params.model] - Model to use for generation
 * @param {number} [params.duration] - Duration of the video in seconds
 * @param {string} [params.aspectRatio] - Aspect ratio of the video (e.g. '16:9')
 * @param {string} [params.resolution] - Resolution of the video (e.g. '1080p')
 * @returns {Promise<Object>} - Generation job response
 */
export async function generateVideo(params) {
  const { prompt, apiKey, model = 'higgsfield-1', duration = 5, aspectRatio = '16:9', resolution = '1080p' } = params;

  if (!apiKey) {
    throw new Error('API key is required');
  }

  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt is required');
  }

  const response = await fetch(`${HIGGSFIELD_API_BASE}/video/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: prompt.trim(),
      model,
      duration,
      aspect_ratio: aspectRatio,
      resolution,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Poll for the status of a video generation job
 * @param {string} jobId - The job ID to check
 * @param {string} apiKey - Higgsfield API key
 * @returns {Promise<Object>} - Job status response
 */
export async function getVideoStatus(jobId, apiKey) {
  if (!jobId) throw new Error('Job ID is required');
  if (!apiKey) throw new Error('API key is required');

  const response = await fetch(`${HIGGSFIELD_API_BASE}/video/status/${jobId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch job status: ${response.status}`);
  }

  return response.json();
}

/**
 * Poll a job until it completes or fails
 * @param {string} jobId - The job ID to poll
 * @param {string} apiKey - Higgsfield API key
 * @param {Function} [onProgress] - Callback for progress updates
 * @param {number} [intervalMs] - Polling interval in milliseconds
 * @param {number} [maxAttempts] - Maximum number of polling attempts
 * @returns {Promise<Object>} - Completed job data
 */
export async function pollVideoJob(jobId, apiKey, onProgress, intervalMs = 5000, maxAttempts = 100) {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      if (attempts