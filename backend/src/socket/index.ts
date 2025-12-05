import { Server, Socket } from 'socket.io';
import { db } from '../config/firebase.js';
import admin from 'firebase-admin';

export const setupSocketIO = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // User joins a video room
    socket.on('watch_video', (videoId: string) => {
      socket.join(`video_${videoId}`);
      console.log(`Socket ${socket.id} joined video room: ${videoId}`);
    });

    // User leaves a video room
    socket.on('leave_video', (videoId: string) => {
      socket.leave(`video_${videoId}`);
      console.log(`Socket ${socket.id} left video room: ${videoId}`);
    });

    // Like video event
    socket.on('like_video', async (data: { videoId: string; userId: string }) => {
      try {
        const { videoId, userId } = data;
        
        // Update Firestore
        const videoRef = db.collection('videos').doc(videoId);
        await videoRef.update({
          'engagement.likes': admin.firestore.FieldValue.increment(1),
        });

        // Get updated count
        const videoDoc = await videoRef.get();
        const newLikeCount = videoDoc.data()?.engagement?.likes || 0;

        // Broadcast to all watching
        io.to(`video_${videoId}`).emit('like_update', {
          videoId,
          totalLikes: newLikeCount,
          animate: true,
        });
      } catch (error) {
        console.error('Error handling like:', error);
        socket.emit('error', { message: 'Failed to process like' });
      }
    });

    // Share video event
    socket.on('share_video', async (data: { videoId: string; userId: string }) => {
      try {
        const { videoId, userId } = data;
        
        const videoRef = db.collection('videos').doc(videoId);
        await videoRef.update({
          'engagement.shares': admin.firestore.FieldValue.increment(1),
        });

        const videoDoc = await videoRef.get();
        const newShareCount = videoDoc.data()?.engagement?.shares || 0;

        io.to(`video_${videoId}`).emit('share_update', {
          videoId,
          totalShares: newShareCount,
          animate: true,
        });
      } catch (error) {
        console.error('Error handling share:', error);
        socket.emit('error', { message: 'Failed to process share' });
      }
    });

    // Comment on video event
    socket.on('comment_video', async (data: { videoId: string; userId: string; content: string }) => {
      try {
        const { videoId, userId, content } = data;
        
        // Store comment
        const commentRef = await db.collection('comments').add({
          videoId,
          userId,
          content,
          likes: 0,
          createdAt: Date.now(),
        });

        // Update comment count
        const videoRef = db.collection('videos').doc(videoId);
        await videoRef.update({
          'engagement.comments': admin.firestore.FieldValue.increment(1),
        });

        // Broadcast new comment
        io.to(`video_${videoId}`).emit('new_comment', {
          commentId: commentRef.id,
          videoId,
          userId,
          content,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Error handling comment:', error);
        socket.emit('error', { message: 'Failed to process comment' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
