import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const VideoUpload: React.FC = () => {
  const { account, isConnected } = useWeb3();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateVideo = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;

        if (duration < 6) {
          reject('Video must be at least 6 seconds long');
        } else if (duration > 60) {
          reject('Video must be no longer than 60 seconds');
        } else {
          resolve(duration);
        }
      };

      video.onerror = () => {
        reject('Failed to load video');
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    try {
      await validateVideo(selectedFile);
      setFile(selectedFile);
    } catch (err: any) {
      setError(err);
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !isConnected || !account) {
      setError('Please connect your wallet and select a video');
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const duration = await validateVideo(file);

      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('duration', duration.toString());
      formData.append('walletAddress', account);
      formData.append('userId', account); // Using wallet as userId for now

      await axios.post(`${API_BASE_URL}/api/videos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });

      setSuccess(true);
      setFile(null);
      setTitle('');
      setDescription('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  if (!isConnected) {
    return (
      <div className="card-spooky text-center">
        <p className="text-accent-purple">Please connect your wallet to upload videos</p>
      </div>
    );
  }

  return (
    <div className="card-spooky max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-accent-purple">Upload Video 👻</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Video File (6-60 seconds)</label>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            className="input-spooky w-full"
            disabled={uploading}
          />
          {file && <p className="text-sm text-accent-green mt-2">✓ {file.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title (max 100 characters)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="input-spooky w-full"
            placeholder="Enter video title..."
            disabled={uploading}
          />
          <p className="text-xs text-gray-400 mt-1">{title.length}/100</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description (max 500 characters)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={4}
            className="input-spooky w-full"
            placeholder="Enter video description..."
            disabled={uploading}
          />
          <p className="text-xs text-gray-400 mt-1">{description.length}/500</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-green-300">
            ✓ Video uploaded successfully!
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="w-full bg-bg-darker rounded-full h-2">
              <div
                className="bg-accent-purple h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-center text-accent-purple">Uploading... {progress}%</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || uploading || !title.trim()}
          className="btn-primary w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};
