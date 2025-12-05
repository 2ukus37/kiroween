import Web3 from 'web3';
import * as dotenv from 'dotenv';
import CreatorTokenABI from '../../artifacts/contracts/CreatorToken.sol/CreatorToken.json' assert { type: 'json' };
import ContentNFTABI from '../../artifacts/contracts/ContentNFT.sol/ContentNFT.json' assert { type: 'json' };
import RewardPoolABI from '../../artifacts/contracts/RewardPool.sol/RewardPool.json' assert { type: 'json' };

dotenv.config();

// Initialize Web3
const web3 = new Web3(process.env.POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com');

// Add account from private key
if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length > 10) {
  try {
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
  } catch (error) {
    console.warn('Invalid private key provided, skipping wallet setup');
  }
}

// Contract instances
export const getCreatorTokenContract = () => {
  if (!process.env.CREATOR_TOKEN_ADDRESS) {
    throw new Error('CREATOR_TOKEN_ADDRESS not set in environment');
  }
  return new web3.eth.Contract(
    CreatorTokenABI.abi as any,
    process.env.CREATOR_TOKEN_ADDRESS
  );
};

export const getContentNFTContract = () => {
  if (!process.env.CONTENT_NFT_ADDRESS) {
    throw new Error('CONTENT_NFT_ADDRESS not set in environment');
  }
  return new web3.eth.Contract(
    ContentNFTABI.abi as any,
    process.env.CONTENT_NFT_ADDRESS
  );
};

export const getRewardPoolContract = () => {
  if (!process.env.REWARD_POOL_ADDRESS) {
    throw new Error('REWARD_POOL_ADDRESS not set in environment');
  }
  return new web3.eth.Contract(
    RewardPoolABI.abi as any,
    process.env.REWARD_POOL_ADDRESS
  );
};

/**
 * Execute a blockchain transaction with error handling
 */
export const executeBlockchainTx = async (
  txFunction: any,
  params: any[],
  fromAddress?: string
): Promise<{ success: boolean; hash?: string; error?: string }> => {
  try {
    const from = fromAddress || web3.eth.defaultAccount;
    if (!from) {
      throw new Error('No account available for transaction');
    }

    // Estimate gas
    const gasEstimate = await txFunction(...params).estimateGas({ from });
    const gasLimit = Math.floor(Number(gasEstimate) * 1.2); // Add 20% buffer

    // Send transaction
    const tx = await txFunction(...params).send({
      from,
      gas: gasLimit,
    });

    return {
      success: true,
      hash: tx.transactionHash,
    };
  } catch (error: any) {
    console.error('Blockchain transaction error:', error);

    if (error.message?.includes('insufficient funds')) {
      return {
        success: false,
        error: 'Insufficient MATIC for gas fees',
      };
    }

    if (error.message?.includes('revert')) {
      return {
        success: false,
        error: `Transaction would fail: ${error.message}`,
      };
    }

    if (error.code === 'NETWORK_ERROR') {
      return {
        success: false,
        error: 'Network connection failed. Please try again.',
      };
    }

    return {
      success: false,
      error: error.message || 'Blockchain transaction failed',
    };
  }
};

/**
 * Mint a Content NFT
 */
export const mintContentNFT = async (
  creatorAddress: string,
  ipfsHash: string
): Promise<{ success: boolean; tokenId?: number; hash?: string; error?: string }> => {
  try {
    const contentNFT = getContentNFTContract();
    const result = await executeBlockchainTx(
      contentNFT.methods.mintContentNFT,
      [creatorAddress, ipfsHash]
    );

    if (!result.success) {
      return result;
    }

    // Get the token ID from the transaction receipt
    const receipt = await web3.eth.getTransactionReceipt(result.hash!);
    const tokenCounter = await contentNFT.methods.tokenCounter().call();
    const tokenId = Number(tokenCounter) - 1; // Last minted token

    return {
      success: true,
      tokenId,
      hash: result.hash,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get Creator Token balance
 */
export const getTokenBalance = async (address: string): Promise<string> => {
  const creatorToken = getCreatorTokenContract();
  const balance = await creatorToken.methods.balanceOf(address).call();
  return web3.utils.fromWei(balance as string, 'ether');
};

/**
 * Claim engagement rewards
 */
export const claimRewards = async (
  videoId: number,
  likes: number,
  shares: number,
  comments: number,
  creatorAddress: string
): Promise<{ success: boolean; amount?: string; hash?: string; error?: string }> => {
  try {
    const rewardPool = getRewardPoolContract();
    
    // Check if already claimed
    const claimed = await rewardPool.methods.hasClaimedReward(videoId).call();
    if (claimed) {
      return {
        success: false,
        error: 'Rewards already claimed for this video',
      };
    }

    const result = await executeBlockchainTx(
      rewardPool.methods.claimEngagementReward,
      [videoId, likes, shares, comments],
      creatorAddress
    );

    if (!result.success) {
      return result;
    }

    // Calculate reward amount
    const rewardAmount = await rewardPool.methods
      .calculateReward(videoId, likes, shares, comments)
      .call();
    const amountInEther = web3.utils.fromWei(rewardAmount as string, 'ether');

    return {
      success: true,
      amount: amountInEther,
      hash: result.hash,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export { web3 };
