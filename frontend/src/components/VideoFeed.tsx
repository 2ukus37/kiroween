import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VideoCard } from './VideoCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Video {
  id: string;
  title: string;
  description: string;
  creator: string;
  storageUrl: string;
  thumbnailUrl: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  createdAt: number;
}

export const VideoFeed: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/videos/feed`, {
        params: { offset, limit: 10 },
      });

      setVideos((prev) => [...prev, ...response.data.videos]);
      setHasMore(response.data.hasMore);
      setOffset((prev) => prev + 10);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      hasMore &&
      !loading
    ) {
      setLoading(true);
      fetchVideos();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  if (loading && videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-ghost-float text-4xl">👻</div>
        <p className="text-accent-purple mt-4">Loading videos...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-accent-purple">No videos yet. Be the first to upload!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-accent-purple">Video Feed 🎬</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      {loading && (
        <div className="text-center py-4">
          <div className="animate-ghost-float text-2xl">👻</div>
          <p className="text-accent-purple mt-2">Loading more...</p>
        </div>
      )}
    </div>
  );
};
