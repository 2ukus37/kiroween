import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';

interface Video {
  id: string;
  title: string;
  likes: number;
  shares: number;
  comments: number;
  views: number;
  nftTokenId: string;
  rewardsClaimed: boolean;
  createdAt: number;
  ipfsHash: string;
}

export const CreatorDashboard: React.FC = () => {
  const { account: address, isConnected } = useWeb3();
  const [videos, setVideos] = useState<Video[]>([]);
  const [balance, setBalance] = useState<string>('0');
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [claimingVideoId, setClaimingVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      fetchDashboardData();
    }
  }, [isConnected, address]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch token balance
      const balanceResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/blockchain/balance/${address}`
      );
      const balanceData = await balanceResponse.json();
      setBalance(balanceData.balance || '0');

      // Fetch creator's videos
      // Note: This endpoint needs to be implemented in backend
      const videosResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/creator/${address}`
      );
      
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        setVideos(videosData.videos || []);
        
        // Calculate total earnings
        const earnings = videosData.videos.reduce((total: number, video: Video) => {
          const videoEarnings = calculateVideoEarnings(video);
          return total + videoEarnings;
        }, 0);
        setTotalEarnings(earnings);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateVideoEarnings = (video: Video): number => {
    let earnings = 0;
    
    // Base engagement rewards
    earnings += video.likes * 0.1;
    earnings += video.shares * 0.5;
    earnings += video.comments * 0.2;
    
    // Viral bonus
    if (video.likes >= 1000) {
      earnings += 50;
    }
    
    return earnings;
  };

  const handleClaimRewards = async (videoId: string) => {
    if (!address) return;

    try {
      setClaimingVideoId(videoId);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/blockchain/claim-rewards`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoId,
            creatorAddress: address,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`Rewards claimed! 🎉\nTransaction: ${data.transactionHash || 'Pending'}`);
        
        // Refresh dashboard data
        await fetchDashboardData();
      } else {
        const errorMessage = data.error || data.message || 'Unknown error occurred';
        alert(`Failed to claim rewards: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error('Failed to claim rewards:', error);
      alert(`Failed to claim rewards: ${error.message || 'Network error. Please try again.'}`);
    } finally {
      setClaimingVideoId(null);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="text-6xl mb-4 animate-ghost-float">👻</div>
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400">
          Please connect your wallet to view your creator dashboard
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="text-6xl mb-4 animate-ghost-float">👻</div>
        <p className="text-gray-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Creator Dashboard 👻</h1>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-accent-purple/10 border border-accent-purple/30 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="flex-1">
            <h3 className="font-bold mb-1">About Blockchain Rewards</h3>
            <p className="text-sm text-gray-300">
              Your earnings are calculated based on engagement (likes, shares, comments). 
              The "Claim Rewards" feature requires blockchain configuration with a wallet private key. 
              You can still track your potential earnings and all platform features work without it!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Token Balance */}
        <div className="bg-bg-darker p-6 rounded-lg border border-accent-purple/30 shadow-glow">
          <div className="text-sm text-gray-400 mb-2">DTC Balance</div>
          <div className="text-3xl font-bold font-mono text-accent-purple">
            {parseFloat(balance).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-2">DeadTrendCreator Tokens</div>
        </div>

        {/* Total Earnings */}
        <div className="bg-bg-darker p-6 rounded-lg border border-accent-green/30 shadow-glow">
          <div className="text-sm text-gray-400 mb-2">Total Earnings</div>
          <div className="text-3xl font-bold font-mono text-accent-green">
            {totalEarnings.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-2">DTC from all videos</div>
        </div>

        {/* Total Videos */}
        <div className="bg-bg-darker p-6 rounded-lg border border-ghost/30 shadow-glow">
          <div className="text-sm text-gray-400 mb-2">Total Videos</div>
          <div className="text-3xl font-bold font-mono">
            {videos.length}
          </div>
          <div className="text-xs text-gray-500 mt-2">Videos uploaded</div>
        </div>
      </div>

      {/* Videos List */}
      <div className="bg-bg-darker rounded-lg border border-accent-purple/30 p-6">
        <h2 className="text-xl font-bold mb-4">Your Videos</h2>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎃</div>
            <p className="text-gray-400 mb-4">No videos uploaded yet</p>
            <a
              href="/upload"
              className="inline-block px-6 py-3 bg-accent-purple hover:bg-accent-purple/80 rounded-lg transition-colors"
            >
              Upload Your First Video
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => {
              const earnings = calculateVideoEarnings(video);
              
              return (
                <div
                  key={video.id}
                  className="bg-bg-dark p-4 rounded-lg border border-accent-purple/20 hover:border-accent-purple/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{video.title}</h3>
                      
                      {/* Engagement Stats */}
                      <div className="flex gap-4 text-sm mb-3">
                        <span className="flex items-center gap-1">
                          <span>👻</span>
                          <span className="font-mono">{video.likes}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🎃</span>
                          <span className="font-mono">{video.shares}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          <span className="font-mono">{video.comments}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>👁️</span>
                          <span className="font-mono">{video.views}</span>
                        </span>
                      </div>

                      {/* NFT Info */}
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>NFT Token ID: {video.nftTokenId ? `#${video.nftTokenId}` : 'Not minted'}</div>
                        <div>IPFS: {video.ipfsHash ? `${video.ipfsHash.substring(0, 20)}...` : 'Not pinned'}</div>
                        <div>
                          Created: {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Earnings & Claim */}
                    <div className="text-right">
                      <div className="mb-3">
                        <div className="text-sm text-gray-400">Earnings</div>
                        <div className="text-2xl font-bold font-mono text-accent-green">
                          {earnings.toFixed(2)} DTC
                        </div>
                        {video.likes >= 1000 && (
                          <div className="text-xs text-accent-purple mt-1">
                            🎉 Viral Bonus!
                          </div>
                        )}
                      </div>

                      {video.rewardsClaimed ? (
                        <div className="px-4 py-2 bg-bg-darker rounded-lg text-sm text-gray-500">
                          ✅ Claimed
                        </div>
                      ) : (
                        <div className="text-center">
                          <button
                            onClick={() => handleClaimRewards(video.id)}
                            disabled={claimingVideoId === video.id}
                            className="px-4 py-2 bg-accent-purple hover:bg-accent-purple/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                          >
                            {claimingVideoId === video.id ? (
                              <span>Claiming...</span>
                            ) : (
                              <span>Claim Rewards</span>
                            )}
                          </button>
                          <div className="text-xs text-gray-500">
                            (Requires blockchain setup)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Wallet Info */}
      <div className="mt-6 p-4 bg-bg-darker rounded-lg border border-accent-purple/20">
        <div className="text-sm text-gray-400 mb-1">Connected Wallet</div>
        <div className="font-mono text-sm">{address}</div>
      </div>
    </div>
  );
};
