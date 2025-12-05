# Requirements Document

## Introduction

DeadTrendTracker is a Web3-powered short-form video platform that resurrects the essence of dead social media platforms (Vine, Clubhouse, Quora Spaces) by combining blockchain technology, creator monetization, and decentralized content verification. The platform enables creators to upload 6-60 second videos, earn cryptocurrency tokens through engagement, mint NFTs for their content, and participate in a transparent, community-owned ecosystem.

## Glossary

- **Platform**: The DeadTrendTracker web application system
- **Creator**: A user who uploads video content to the Platform
- **Viewer**: A user who watches and engages with video content
- **Video Content**: Short-form videos between 6 and 60 seconds in duration
- **Creator Token**: An ERC-20 cryptocurrency token (DTC) used for rewards and platform economy
- **Content NFT**: An ERC-721 non-fungible token representing ownership of video content
- **Engagement**: User interactions including likes, shares, comments, and views
- **IPFS**: InterPlanetary File System, a decentralized storage protocol
- **Wallet**: A blockchain wallet address (Polygon network) associated with a user account
- **Reward Pool**: A smart contract that distributes Creator Tokens based on engagement metrics
- **Firebase Storage**: Cloud storage service for video file hosting
- **Firestore**: NoSQL database for storing metadata and user profiles
- **Polygon Network**: Layer 2 blockchain network for smart contract deployment
- **Moderation System**: AI-powered content review system using Gemini API

## Requirements

### Requirement 1

**User Story:** As a creator, I want to upload short-form videos to the platform, so that I can share content and earn rewards from engagement.

#### Acceptance Criteria

1. WHEN a creator selects a video file from their device THEN the Platform SHALL validate the video duration is between 6 and 60 seconds
2. WHEN a creator uploads a valid video file THEN the Platform SHALL store the video in Firebase Storage and generate a unique identifier
3. WHEN a video upload completes THEN the Platform SHALL create an IPFS hash for the video content
4. WHEN a video is stored THEN the Platform SHALL mint a Content NFT on the Polygon Network with the IPFS hash and assign ownership to the creator's Wallet
5. WHEN a video upload completes THEN the Platform SHALL store video metadata in Firestore including creator ID, IPFS hash, NFT token ID, and timestamp

### Requirement 2

**User Story:** As a creator, I want to earn Creator Tokens based on engagement with my videos, so that I can monetize my content through blockchain rewards.

#### Acceptance Criteria

1. WHEN a Viewer likes a video THEN the Reward Pool SHALL allocate 0.1 Creator Tokens to the video creator's Wallet
2. WHEN a Viewer shares a video THEN the Reward Pool SHALL allocate 0.5 Creator Tokens to the video creator's Wallet
3. WHEN a Viewer comments on a video THEN the Reward Pool SHALL allocate 0.2 Creator Tokens to the video creator's Wallet
4. WHEN a video reaches 1000 likes THEN the Reward Pool SHALL allocate 50 bonus Creator Tokens to the creator's Wallet
5. WHEN a creator claims rewards for a video THEN the Platform SHALL prevent duplicate reward claims for the same video

### Requirement 3

**User Story:** As a viewer, I want to see real-time engagement updates on videos, so that I can experience live interaction with the community.

#### Acceptance Criteria

1. WHEN a Viewer likes a video THEN the Platform SHALL broadcast the updated like count to all users currently watching that video within 2 seconds
2. WHEN a Viewer shares a video THEN the Platform SHALL broadcast the updated share count to all users currently watching that video within 2 seconds
3. WHEN a Viewer comments on a video THEN the Platform SHALL broadcast the new comment to all users currently watching that video within 2 seconds
4. WHEN engagement metrics update THEN the Platform SHALL trigger visual animations to indicate the change
5. WHEN a user joins a video viewing session THEN the Platform SHALL send the current engagement metrics to that user

### Requirement 4

**User Story:** As a platform administrator, I want automated content moderation, so that inappropriate content is flagged before it reaches viewers.

#### Acceptance Criteria

1. WHEN a creator uploads a video THEN the Moderation System SHALL analyze the video title and description using the Gemini API
2. WHEN the Moderation System detects policy violations THEN the Platform SHALL mark the video as unsafe and prevent public display
3. WHEN the Moderation System approves content THEN the Platform SHALL mark the video as safe and make it available in the video feed
4. WHEN content is flagged as unsafe THEN the Platform SHALL categorize the violation as violence, hate speech, explicit content, or spam
5. WHEN content is flagged THEN the Platform SHALL notify the creator with the reason for flagging

### Requirement 5

**User Story:** As a creator, I want to view my token balance and earnings analytics, so that I can track my monetization performance.

#### Acceptance Criteria

1. WHEN a creator accesses their dashboard THEN the Platform SHALL display their current Creator Token balance from the blockchain
2. WHEN a creator accesses their dashboard THEN the Platform SHALL display total earnings across all videos
3. WHEN a creator accesses their dashboard THEN the Platform SHALL display engagement metrics for each video including likes, shares, comments, and views
4. WHEN a creator accesses their dashboard THEN the Platform SHALL display the NFT token IDs for all their minted content
5. WHEN a creator's token balance changes THEN the Platform SHALL update the displayed balance within 10 seconds

### Requirement 6

**User Story:** As a user, I want to connect my blockchain wallet to the platform, so that I can participate in the token economy and own my content.

#### Acceptance Criteria

1. WHEN a user initiates wallet connection THEN the Platform SHALL prompt the user to connect via Web3 provider (MetaMask or similar)
2. WHEN a user successfully connects their Wallet THEN the Platform SHALL store the Wallet address in the user's Firestore profile
3. WHEN a user connects their Wallet THEN the Platform SHALL verify the Wallet is on the Polygon Network
4. WHEN a user attempts to upload content without a connected Wallet THEN the Platform SHALL prevent the upload and prompt wallet connection
5. WHEN a user disconnects their Wallet THEN the Platform SHALL clear the Wallet address from the active session

### Requirement 7

**User Story:** As a viewer, I want to browse a personalized video feed, so that I can discover content relevant to my interests.

#### Acceptance Criteria

1. WHEN a Viewer accesses the home page THEN the Platform SHALL display a feed of videos sorted by recency
2. WHEN a Viewer scrolls through the feed THEN the Platform SHALL load additional videos in batches of 10
3. WHEN a Viewer watches a video THEN the Platform SHALL increment the view count in Firestore
4. WHEN a video is displayed in the feed THEN the Platform SHALL show the video thumbnail, title, creator name, and engagement metrics
5. WHEN a Viewer clicks on a video THEN the Platform SHALL play the video from Firebase Storage

### Requirement 8

**User Story:** As a creator, I want my video content to be stored on decentralized infrastructure, so that my content ownership is preserved and verifiable.

#### Acceptance Criteria

1. WHEN a video is uploaded THEN the Platform SHALL generate an IPFS hash for the video file
2. WHEN an IPFS hash is generated THEN the Platform SHALL store the hash in the Content NFT metadata
3. WHEN a Content NFT is minted THEN the Platform SHALL include the IPFS hash, creator Wallet address, and video metadata in the token URI
4. WHEN a user queries a Content NFT THEN the Platform SHALL return the IPFS hash for content verification
5. WHEN video metadata is stored in Firestore THEN the Platform SHALL include the IPFS hash for cross-reference validation

### Requirement 9

**User Story:** As a developer, I want clear separation between frontend, backend, and blockchain components, so that the system is maintainable and extensible.

#### Acceptance Criteria

1. WHEN frontend components request video data THEN the Platform SHALL route requests through backend API endpoints
2. WHEN backend services interact with blockchain THEN the Platform SHALL use dedicated smart contract utility modules
3. WHEN smart contracts are deployed THEN the Platform SHALL maintain contract addresses in environment configuration
4. WHEN API endpoints are modified THEN the Platform SHALL maintain backward compatibility or version the API
5. WHEN blockchain transactions fail THEN the Platform SHALL handle errors gracefully and provide user feedback

### Requirement 10

**User Story:** As a creator, I want to add titles and descriptions to my videos, so that viewers can understand the content context.

#### Acceptance Criteria

1. WHEN a creator uploads a video THEN the Platform SHALL provide input fields for title and description
2. WHEN a creator submits a video with an empty title THEN the Platform SHALL prevent submission and display a validation error
3. WHEN a creator submits a video title THEN the Platform SHALL limit the title to 100 characters maximum
4. WHEN a creator submits a video description THEN the Platform SHALL limit the description to 500 characters maximum
5. WHEN video metadata is stored THEN the Platform SHALL include the title and description in the Firestore document
