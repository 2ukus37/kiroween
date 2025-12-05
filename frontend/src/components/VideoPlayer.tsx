import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface VideoPlayerProps {
  videoId: string;
  videoUrl: string;
  title: string;
  creator: string;
  initialLikes: number;
  initialShares: number;
  initialComments: number;
}

interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  videoUrl,
  title,
  creator,
  initialLikes,
  initialShares,
  initialComments,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const [likes, setLikes] = useState(initialLikes);
  const [shares, setShares] = useState(initialShares);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(initialComments);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Fetch existing comments
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${videoId}/comments`
        );
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();

    // Connect to Socket.IO
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socketRef.current = socket;

    // Join video room
    socket.emit('watch_video', { videoId });

    // Listen for engagement updates
    socket.on('like_update', (data: { likes: number }) => {
      setLikes(data.likes);
      triggerAnimation();
    });

    socket.on('share_update', (data: { shares: number }) => {
      setShares(data.shares);
      triggerAnimation();
    });

    socket.on('new_comment', (data: Comment) => {
      setComments((prev) => [...prev, data]);
      setCommentCount((prev) => prev + 1);
      triggerAnimation();
    });

    socket.on('initial_state', (data: any) => {
      setLikes(data.likes || initialLikes);
      setShares(data.shares || initialShares);
      setCommentCount(data.comments || initialComments);
    });

    return () => {
      socket.emit('leave_video', { videoId });
      socket.disconnect();
    };
  }, [videoId, initialLikes, initialShares, initialComments]);

  const triggerAnimation = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const handleLike = async () => {
    if (isLiked) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${videoId}/like`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'anonymous' }),
        }
      );

      if (response.ok) {
        setIsLiked(true);
        const data = await response.json();
        setLikes(data.likes);
      }
    } catch (error) {
      console.error('Failed to like video:', error);
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${videoId}/share`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'anonymous' }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShares(data.shares);
        
        // Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard! 👻');
      }
    } catch (error) {
      console.error('Failed to share video:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${videoId}/comment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'anonymous', // Replace with actual user ID from wallet
            content: commentText,
          }),
        }
      );

      if (response.ok) {
        setCommentText('');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="relative bg-bg-darker rounded-lg overflow-hidden shadow-glow">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full aspect-video"
          autoPlay
        />
        
        {/* Ghost Animation Overlay */}
        {showAnimation && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-6xl animate-ghost-float">👻</div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="mt-4 p-4 bg-bg-darker rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-accent-purple mb-4">by {creator}</p>

        {/* Engagement Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleLike}
            disabled={isLiked}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isLiked
                ? 'bg-accent-purple text-white'
                : 'bg-bg-dark hover:bg-accent-purple/20 hover:shadow-glow'
            }`}
          >
            <span className="text-xl">👻</span>
            <span className="font-mono">{likes}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-dark hover:bg-accent-green/20 hover:shadow-glow transition-all"
          >
            <span className="text-xl">🎃</span>
            <span className="font-mono">{shares}</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-dark">
            <span className="text-xl">💬</span>
            <span className="font-mono">{commentCount}</span>
          </div>
        </div>

        {/* Comment Section */}
        <div className="border-t border-accent-purple/30 pt-4">
          <h3 className="text-lg font-bold mb-3">Comments</h3>
          
          {/* Comment Form */}
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a spooky comment..."
                className="flex-1 px-4 py-2 bg-bg-dark border border-accent-purple/30 rounded-lg focus:outline-none focus:border-accent-purple"
                maxLength={200}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-accent-purple hover:bg-accent-purple/80 rounded-lg transition-colors"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No comments yet. Be the first! 👻
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 bg-bg-dark rounded-lg border border-accent-purple/20"
                >
                  <p className="text-sm text-accent-purple mb-1">
                    {comment.userId}
                  </p>
                  <p>{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
