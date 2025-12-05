import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoPlayer } from '../components/VideoPlayer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const VideoPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) {
        setError('No video ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/videos/${id}`);
        
        if (!response.ok) {
          throw new Error('Video not found');
        }

        const data = await response.json();
        setVideo(data);
      } catch (err: any) {
        console.error('Error fetching video:', err);
        setError(err.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-ghost-float text-4xl mb-4">👻</div>
        <p className="text-accent-purple">Loading video...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">😱</div>
        <p className="text-red-500 mb-4">{error || 'Video not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <VideoPlayer
      videoId={video.id}
      videoUrl={video.storageUrl}
      title={video.title}
      creator={video.creator || video.creatorWallet}
      initialLikes={video.engagement?.likes || 0}
      initialShares={video.engagement?.shares || 0}
      initialComments={video.engagement?.comments || 0}
    />
  );
};
