import React from 'react';
import { useNavigate } from 'react-router-dom';

interface VideoCardProps {
  video: {
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
  };
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className="card-spooky cursor-pointer hover:scale-105 transition-transform duration-200"
      onClick={() => navigate(`/video/${video.id}`)}
    >
      <div className="aspect-video bg-bg-darker rounded-lg mb-4 flex items-center justify-center relative group">
        <video
          src={video.storageUrl}
          className="w-full h-full object-cover rounded-lg"
          poster={video.thumbnailUrl}
          muted
          loop
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all rounded-lg">
          <div className="text-6xl opacity-70 group-hover:opacity-100 transition-opacity">▶️</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{video.title}</h3>

      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{video.description}</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 font-mono text-accent-green">
          <span>❤️ {formatNumber(video.engagement.likes)}</span>
          <span>💬 {formatNumber(video.engagement.comments)}</span>
          <span>👁️ {formatNumber(video.engagement.views)}</span>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        {formatDate(video.createdAt)} • {video.creator.slice(0, 6)}...
      </div>
    </div>
  );
};
