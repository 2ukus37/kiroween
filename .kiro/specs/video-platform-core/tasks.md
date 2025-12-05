# Implementation Plan

- [x] 1. Set up project structure and development environment



  - Create monorepo structure with frontend, backend, and contracts directories
  - Initialize package.json files with required dependencies
  - Configure TypeScript for frontend and backend
  - Set up environment variable templates (.env.example files)
  - Configure ESLint and Prettier for code consistency
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 2. Initialize Firebase and configure cloud services


  - Create Firebase project and enable Firestore, Storage, and Authentication
  - Set up Firestore security rules for users, videos, comments, and transactions collections
  - Configure Firebase Storage CORS and access rules
  - Create Firestore indexes for video queries (creator, createdAt, likes)
  - Initialize Firebase Admin SDK in backend with service account
  - _Requirements: 1.2, 1.5, 7.1_

- [x] 3. Develop and deploy smart contracts


- [x] 3.1 Create CreatorToken ERC-20 contract


  - Implement ERC-20 token with OpenZeppelin base
  - Add mint function with onlyOwner access control
  - Set token name to "DeadTrendCreator" and symbol to "DTC"
  - _Requirements: 2.1, 2.2, 2.3, 5.1_

- [x] 3.2 Create ContentNFT ERC-721 contract


  - Implement ERC-721 NFT with OpenZeppelin base
  - Add mintContentNFT function with IPFS hash parameter
  - Implement tokenURI function to return metadata
  - Store IPFS hash in tokenURIs mapping
  - _Requirements: 1.4, 8.2, 8.3, 8.4_

- [x] 3.3 Create RewardPool contract


  - Implement claimEngagementReward function with engagement parameters
  - Add reward calculation logic (0.1 DTC per like, 0.5 per share, 0.2 per comment)
  - Implement viral bonus logic (50 DTC at 1000 likes)
  - Add rewardClaimed mapping to prevent duplicate claims
  - Emit RewardClaimed events
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3.4 Write property test for reward calculation


  - **Property 6: Like reward calculation**
  - **Property 7: Share reward calculation**
  - **Property 8: Comment reward calculation**
  - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 3.5 Write property test for viral bonus

  - **Property 9: Viral bonus threshold**
  - **Validates: Requirements 2.4**

- [x] 3.6 Write property test for reward claim idempotence

  - **Property 10: Reward claim idempotence**
  - **Validates: Requirements 2.5**

- [x] 3.7 Deploy contracts to Polygon Mumbai testnet


  - Configure Hardhat for Mumbai network
  - Deploy CreatorToken, ContentNFT, and RewardPool contracts
  - Verify contracts on PolygonScan
  - Save contract addresses to environment configuration
  - _Requirements: 9.3_

- [x] 3.8 Write unit tests for smart contracts


  - Test CreatorToken minting and transfers
  - Test ContentNFT minting and metadata retrieval
  - Test RewardPool claim functionality and access control
  - Test error cases (duplicate claims, invalid parameters)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 1.4_

- [x] 4. Implement backend API foundation



- [x] 4.1 Set up Express server with middleware


  - Create Express app with CORS, body-parser, and error handling middleware
  - Configure Socket.io for WebSocket support
  - Set up request logging with Morgan
  - Implement global error handler
  - _Requirements: 9.1, 9.5_

- [x] 4.2 Create blockchain utility modules


  - Implement Web3 provider connection to Polygon
  - Create contract instance helpers for CreatorToken, ContentNFT, and RewardPool
  - Implement transaction signing and gas estimation utilities
  - Add error handling for blockchain operations
  - _Requirements: 9.2, 9.5_

- [x] 4.3 Write property test for blockchain error handling

  - **Property 33: Blockchain error handling**
  - **Validates: Requirements 9.5**

- [x] 4.4 Create IPFS integration module


  - Set up Pinata SDK with API keys
  - Implement pinFileToIPFS function for video uploads
  - Implement pinJSONToIPFS for metadata
  - Add IPFS hash validation function
  - _Requirements: 1.3, 8.1_

- [x] 4.5 Write property test for IPFS hash generation

  - **Property 3: IPFS hash generation**
  - **Validates: Requirements 1.3, 8.1**

- [x] 5. Implement video upload functionality


- [x] 5.1 Create video validation utilities


  - Implement validateVideoDuration function (6-60 seconds check)
  - Implement validateTitle function (non-empty, max 100 chars)
  - Implement validateDescription function (max 500 chars)
  - Add file type validation (mp4, webm, mov)
  - _Requirements: 1.1, 10.2, 10.3, 10.4_

- [x] 5.2 Write property tests for validation


  - **Property 1: Video duration validation**
  - **Property 34: Empty title rejection**
  - **Property 35: Title length validation**
  - **Property 36: Description length validation**
  - **Validates: Requirements 1.1, 10.2, 10.3, 10.4**

- [x] 5.3 Implement POST /api/videos/upload endpoint


  - Set up multer for multipart file upload
  - Validate video file and metadata
  - Upload video to Firebase Storage
  - Generate IPFS hash via Pinata
  - Call moderation API
  - Mint Content NFT via smart contract
  - Store video metadata in Firestore with all required fields
  - Return video ID, IPFS hash, and NFT token ID
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 10.1, 10.5_

- [x] 5.4 Write property tests for upload flow

  - **Property 2: Unique video identifiers**
  - **Property 4: NFT ownership assignment**
  - **Property 5: Complete metadata storage**
  - **Validates: Requirements 1.2, 1.4, 1.5, 8.5, 10.5**

- [x] 5.5 Write unit tests for upload endpoint

  - Test successful upload with valid video
  - Test rejection of invalid duration
  - Test rejection of empty title
  - Test Firebase Storage upload
  - Test IPFS pinning
  - Test NFT minting
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 6. Implement content moderation system

- [x] 6.1 Create Gemini API moderation module

  - Set up Google Generative AI SDK
  - Implement moderateContent function with title and description parameters
  - Parse Gemini response for safety classification
  - Return moderation result with safe flag, reason, and category
  - Add fallback to manual review on API failure
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6.2 Write property tests for moderation

  - **Property 12: Moderation invocation**
  - **Property 13: Unsafe content blocking**
  - **Property 14: Safe content availability**
  - **Property 15: Violation categorization**
  - **Property 16: Flagging notification**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [x] 6.3 Integrate moderation into upload flow

  - Call moderateContent before making video public
  - Set moderation status in Firestore (pending/approved/flagged)
  - Create notification for creator if content is flagged
  - Filter flagged videos from feed queries
  - _Requirements: 4.2, 4.3, 4.5_

- [x] 7. Implement video retrieval and feed endpoints

- [x] 7.1 Create GET /api/videos/:id endpoint

  - Query Firestore for video metadata by ID
  - Retrieve Firebase Storage URL for video playback
  - Return complete video object with engagement metrics
  - Handle 404 for non-existent videos
  - _Requirements: 7.5_

- [x] 7.2 Create GET /api/videos/feed endpoint

  - Implement pagination with offset and limit parameters
  - Query Firestore for approved videos only
  - Sort by createdAt in descending order
  - Return batches of 10 videos
  - Include thumbnail, title, creator name, and engagement metrics
  - _Requirements: 7.1, 7.2, 7.4_

- [x] 7.3 Write property tests for feed functionality

  - **Property 25: Feed recency ordering**
  - **Property 26: Pagination batch size**
  - **Property 28: Feed item completeness**
  - **Validates: Requirements 7.1, 7.2, 7.4**

- [x] 7.3 Implement view count tracking

  - Create POST /api/videos/:id/view endpoint
  - Increment view count in Firestore by 1
  - Return updated view count
  - _Requirements: 7.3_

- [x] 7.4 Write property test for view counting

  - **Property 27: View count increment**
  - **Validates: Requirements 7.3**

- [x] 8. Implement real-time engagement system

- [x] 8.1 Set up Socket.io event handlers

  - Implement watch_video event to join video room
  - Implement leave_video event to leave room
  - Create video room management logic
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [x] 8.2 Implement like functionality

  - Create POST /api/videos/:id/like endpoint
  - Increment like count in Firestore
  - Emit like_update event to video room via Socket.io
  - Trigger reward allocation (0.1 DTC)
  - Return updated like count
  - _Requirements: 2.1, 3.1_

- [x] 8.3 Implement share functionality

  - Create POST /api/videos/:id/share endpoint
  - Increment share count in Firestore
  - Emit share_update event to video room
  - Trigger reward allocation (0.5 DTC)
  - Return updated share count
  - _Requirements: 2.2, 3.2_

- [x] 8.4 Implement comment functionality

  - Create POST /api/videos/:id/comment endpoint
  - Store comment in Firestore comments collection
  - Emit new_comment event to video room
  - Trigger reward allocation (0.2 DTC)
  - Return comment ID and timestamp
  - _Requirements: 2.3, 3.3_

- [x] 8.5 Implement engagement state synchronization

  - Send current engagement metrics when user joins video room
  - Query Firestore for current likes, shares, comments, views
  - Emit initial_state event to joining user
  - _Requirements: 3.5_

- [x] 8.6 Write property test for engagement synchronization

  - **Property 11: Engagement state synchronization**
  - **Validates: Requirements 3.5**

- [x] 8.7 Write unit tests for engagement endpoints

  - Test like endpoint increments count
  - Test share endpoint increments count
  - Test comment endpoint stores comment
  - Test Socket.io event emissions
  - Test reward allocation triggers
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

- [x] 9. Implement blockchain reward claiming

- [x] 9.1 Create POST /api/blockchain/claim-rewards endpoint

  - Verify video ownership by creator
  - Check if rewards already claimed in Firestore
  - Fetch engagement metrics (likes, shares, comments)
  - Call RewardPool.claimEngagementReward with engagement data
  - Mark rewards as claimed in Firestore
  - Store transaction hash
  - Return success status and transaction hash
  - _Requirements: 2.5_

- [x] 9.2 Create GET /api/blockchain/balance/:address endpoint

  - Query CreatorToken.balanceOf for wallet address
  - Return balance with decimals
  - Handle blockchain query errors
  - _Requirements: 5.1_

- [x] 9.3 Write property test for token balance accuracy

  - **Property 17: Token balance accuracy**
  - **Validates: Requirements 5.1**

- [x] 9.4 Implement NFT minting in upload flow

  - Call ContentNFT.mintContentNFT after IPFS upload
  - Pass creator wallet address and IPFS hash
  - Wait for transaction confirmation
  - Store NFT token ID in Firestore
  - _Requirements: 1.4, 8.2, 8.3_

- [x] 9.5 Write property tests for NFT metadata

  - **Property 30: NFT metadata IPFS inclusion**
  - **Property 31: NFT token URI completeness**
  - **Property 32: NFT IPFS query**
  - **Validates: Requirements 8.2, 8.3, 8.4**

- [x] 10. Checkpoint - Ensure all backend tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement frontend wallet connection


- [x] 11.1 Create WalletConnect component

  - Implement connectWallet function using Web3.js and window.ethereum
  - Add network validation for Polygon (chain ID 137/80001)
  - Implement switchNetwork function to prompt network change
  - Display connected wallet address
  - Implement disconnect functionality
  - Store wallet address in React state and local storage
  - _Requirements: 6.1, 6.3, 6.5_


- [ ] 11.2 Write property tests for wallet functionality
  - **Property 21: Wallet address persistence**
  - **Property 22: Network validation**
  - **Property 24: Session cleanup on disconnect**
  - **Validates: Requirements 6.2, 6.3, 6.5**


- [ ] 11.3 Create useWeb3 custom hook
  - Manage wallet connection state
  - Provide connectWallet, disconnectWallet, and switchNetwork functions
  - Listen for account and network changes
  - Return connected address, network ID, and connection status

  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [ ] 11.4 Write unit tests for WalletConnect component
  - Test wallet connection flow
  - Test network validation

  - Test disconnect functionality

  - Test error handling for rejected connections
  - _Requirements: 6.1, 6.3, 6.5_

- [ ] 12. Implement frontend video upload
- [ ] 12.1 Create VideoUpload component
  - Add file input for video selection
  - Implement client-side duration validation (6-60 seconds)
  - Add input fields for title (max 100 chars) and description (max 500 chars)
  - Display upload progress bar
  - Show validation errors

  - Require wallet connection before upload
  - Call POST /api/videos/upload on submit
  - Display success message with video ID

  - _Requirements: 1.1, 6.4, 10.1, 10.2, 10.3, 10.4_

- [ ] 12.2 Write property test for upload wallet requirement
  - **Property 23: Upload wallet requirement**
  - **Validates: Requirements 6.4**


- [ ] 12.3 Implement video thumbnail generation
  - Use canvas API to extract frame from video
  - Generate thumbnail at 2-second mark
  - Upload thumbnail to Firebase Storage
  - Store thumbnail URL in video metadata
  - _Requirements: 7.4_



- [ ] 12.4 Write unit tests for VideoUpload component
  - Test file selection
  - Test duration validation
  - Test title/description validation
  - Test upload progress display
  - Test wallet requirement enforcement
  - _Requirements: 1.1, 6.4, 10.2, 10.3, 10.4_


- [ ] 13. Implement frontend video feed
- [ ] 13.1 Create VideoFeed component
  - Fetch videos from GET /api/videos/feed
  - Display videos in grid layout with thumbnails
  - Implement infinite scroll with intersection observer
  - Load 10 videos per batch

  - Show video title, creator name, and engagement metrics
  - Handle loading and empty states
  - _Requirements: 7.1, 7.2, 7.4_


- [ ] 13.2 Create VideoCard component
  - Display video thumbnail
  - Show title, creator name, and engagement counts
  - Handle click to navigate to video player
  - Apply spooky theme styling

  - _Requirements: 7.4_


- [ ] 13.3 Write property test for video playback
  - **Property 29: Video playback initiation**
  - **Validates: Requirements 7.5**

- [ ] 13.4 Write unit tests for VideoFeed component
  - Test video fetching
  - Test pagination

  - Test infinite scroll
  - Test empty state
  - Test loading state
  - _Requirements: 7.1, 7.2, 7.4_

- [x] 14. Implement frontend video player with real-time engagement

- [x] 14.1 Create VideoPlayer component

  - Implement video playback using HTML5 video element
  - Add like, share, and comment buttons
  - Display current engagement counts
  - Connect to Socket.io on component mount
  - Join video room via watch_video event
  - Leave room on component unmount

  - _Requirements: 7.5, 3.5_


- [ ] 14.2 Implement real-time engagement updates
  - Subscribe to like_update, share_update, and new_comment events
  - Update engagement counts in real-time
  - Trigger ghost animation on engagement updates
  - Display new comments as they arrive

  - _Requirements: 3.1, 3.2, 3.3, 3.5_


- [ ] 14.3 Implement engagement actions
  - Call POST /api/videos/:id/like on like button click
  - Call POST /api/videos/:id/share on share button click
  - Call POST /api/videos/:id/comment on comment submit
  - Update local state optimistically
  - Handle errors and revert on failure

  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 14.4 Write unit tests for VideoPlayer component
  - Test video playback
  - Test engagement button clicks

  - Test Socket.io connection
  - Test real-time updates
  - Test comment display
  - _Requirements: 7.5, 3.1, 3.2, 3.3, 3.5_

- [ ] 15. Implement creator dashboard
- [x] 15.1 Create CreatorDashboard component

  - Fetch creator's videos from backend
  - Display token balance from GET /api/blockchain/balance/:address
  - Calculate and display total earnings
  - Show list of videos with engagement metrics
  - Display NFT token IDs for each video
  - Add claim rewards button for each video
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 15.2 Write property tests for dashboard data
  - **Property 18: Earnings aggregation**
  - **Property 19: Complete engagement display**
  - **Property 20: NFT ID display completeness**
  - **Validates: Requirements 5.2, 5.3, 5.4**

- [x] 15.3 Implement reward claiming UI


  - Add claim button for videos with unclaimed rewards
  - Call POST /api/blockchain/claim-rewards on click
  - Show transaction pending state
  - Display transaction hash on success
  - Update claimed status in UI
  - _Requirements: 2.5_

- [x] 15.4 Write unit tests for CreatorDashboard component


  - Test token balance display
  - Test earnings calculation
  - Test video list display
  - Test NFT ID display
  - Test claim rewards flow
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 2.5_

- [ ] 16. Implement spooky UI theme
- [ ] 16.1 Create custom Tailwind theme configuration
  - Define color palette (dark backgrounds, purple/green accents)
  - Add custom animations (ghost-float, fade-in)
  - Configure font families (monospace for stats)
  - Add custom shadows and glows
  - _Requirements: All UI requirements_

- [ ] 16.2 Apply spooky styling to components
  - Style VideoCard with ghost-float animation
  - Add glow effects to engagement buttons
  - Style dashboard with dark theme
  - Add particle effects or ghost overlays
  - Ensure responsive design for mobile
  - _Requirements: All UI requirements_

- [ ] 17. Implement routing and navigation
- [ ] 17.1 Set up React Router
  - Create routes for Home, Creator Dashboard, Video Player, and Explore
  - Implement navigation bar with wallet connection
  - Add protected routes requiring wallet connection
  - Handle 404 page
  - _Requirements: 6.4_

- [ ] 17.2 Create navigation components
  - Build header with logo and wallet connect button
  - Add navigation links to main pages
  - Display connected wallet address in header
  - Add mobile-responsive menu
  - _Requirements: 6.1, 6.5_

- [ ] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Integration testing and deployment preparation
- [ ] 19.1 Test end-to-end video upload flow
  - Test complete flow from upload to NFT minting
  - Verify IPFS hash storage
  - Verify Firestore metadata
  - Verify NFT ownership on blockchain
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 19.2 Test end-to-end engagement flow
  - Test like, share, comment actions
  - Verify real-time updates via Socket.io
  - Verify reward allocation
  - Test reward claiming
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3_

- [ ] 19.3 Test moderation flow
  - Upload videos with various content
  - Verify moderation API calls
  - Verify flagged content is hidden
  - Verify approved content appears in feed
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 19.4 Prepare deployment configuration
  - Create production environment variables
  - Configure Firebase for production
  - Deploy smart contracts to Polygon mainnet
  - Set up backend hosting (Vercel/Railway)
  - Set up frontend hosting (Vercel)
  - Configure custom domain
  - _Requirements: 9.3_

- [ ] 19.5 Create deployment documentation
  - Write README with setup instructions
  - Document environment variables
  - Document API endpoints
  - Document smart contract addresses
  - Add troubleshooting guide
  - _Requirements: All requirements_
