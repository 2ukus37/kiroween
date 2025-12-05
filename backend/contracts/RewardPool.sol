// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICreatorToken {
    function mint(address to, uint256 amount) external;
}

/**
 * @title RewardPool
 * @dev Manages reward distribution for content engagement on DeadTrendTracker
 */
contract RewardPool {
    
    ICreatorToken public creatorToken;
    
    // Mapping to track if rewards have been claimed for a video
    mapping(uint256 => bool) public rewardClaimed;
    
    // Mapping to track creator balances (for reference)
    mapping(address => uint256) public creatorBalances;
    
    // Reward rates (in wei, 18 decimals)
    uint256 public constant LIKE_REWARD = 1e17; // 0.1 DTC
    uint256 public constant SHARE_REWARD = 5e17; // 0.5 DTC
    uint256 public constant COMMENT_REWARD = 2e17; // 0.2 DTC
    uint256 public constant VIRAL_BONUS = 50e18; // 50 DTC
    uint256 public constant VIRAL_THRESHOLD = 1000; // 1000 likes
    
    // Events
    event RewardClaimed(address indexed creator, uint256 indexed videoId, uint256 amount);
    
    constructor(address _creatorTokenAddress) {
        require(_creatorTokenAddress != address(0), "Invalid token address");
        creatorToken = ICreatorToken(_creatorTokenAddress);
    }
    
    /**
     * @dev Claim engagement rewards for a video
     * @param videoId Unique identifier for the video
     * @param likes Number of likes the video received
     * @param shares Number of shares the video received
     * @param comments Number of comments the video received
     * @return rewardAmount The total amount of tokens rewarded
     */
    function claimEngagementReward(
        uint256 videoId,
        uint256 likes,
        uint256 shares,
        uint256 comments
    ) external returns (uint256) {
        require(!rewardClaimed[videoId], "Rewards already claimed");
        require(likes > 0 || shares > 0 || comments > 0, "No engagement to reward");
        
        uint256 rewardAmount = calculateReward(videoId, likes, shares, comments);
        require(rewardAmount > 0, "Reward amount must be positive");
        
        // Mark as claimed before minting to prevent reentrancy
        rewardClaimed[videoId] = true;
        creatorBalances[msg.sender] += rewardAmount;
        
        // Mint tokens to the creator
        creatorToken.mint(msg.sender, rewardAmount);
        
        emit RewardClaimed(msg.sender, videoId, rewardAmount);
        return rewardAmount;
    }
    
    /**
     * @dev Calculate the total reward amount based on engagement metrics
     * @param videoId Unique identifier for the video
     * @param likes Number of likes
     * @param shares Number of shares
     * @param comments Number of comments
     * @return Total reward amount in wei
     */
    function calculateReward(
        uint256 videoId,
        uint256 likes,
        uint256 shares,
        uint256 comments
    ) public pure returns (uint256) {
        uint256 baseReward = (likes * LIKE_REWARD) + (shares * SHARE_REWARD) + (comments * COMMENT_REWARD);
        
        // Add viral bonus if likes >= 1000
        uint256 viralBonus = likes >= VIRAL_THRESHOLD ? VIRAL_BONUS : 0;
        
        return baseReward + viralBonus;
    }
    
    /**
     * @dev Check if rewards have been claimed for a video
     * @param videoId The video ID to check
     * @return True if rewards have been claimed, false otherwise
     */
    function hasClaimedReward(uint256 videoId) public view returns (bool) {
        return rewardClaimed[videoId];
    }
}
