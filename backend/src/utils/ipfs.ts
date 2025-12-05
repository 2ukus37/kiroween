import pinataSDK from '@pinata/sdk';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
});

/**
 * Pin a file to IPFS via Pinata
 */
export const pinFileToIPFS = async (
  fileBuffer: Buffer,
  filename: string
): Promise<{ success: boolean; ipfsHash?: string; error?: string }> => {
  try {
    const stream = Readable.from(fileBuffer);
    
    const result = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: filename,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });

    return {
      success: true,
      ipfsHash: result.IpfsHash,
    };
  } catch (error: any) {
    console.error('IPFS pinning error:', error);
    return {
      success: false,
      error: error.message || 'Failed to pin file to IPFS',
    };
  }
};

/**
 * Pin JSON metadata to IPFS
 */
export const pinJSONToIPFS = async (
  jsonData: any,
  name: string
): Promise<{ success: boolean; ipfsHash?: string; error?: string }> => {
  try {
    const result = await pinata.pinJSONToIPFS(jsonData, {
      pinataMetadata: {
        name,
      },
    });

    return {
      success: true,
      ipfsHash: result.IpfsHash,
    };
  } catch (error: any) {
    console.error('IPFS JSON pinning error:', error);
    return {
      success: false,
      error: error.message || 'Failed to pin JSON to IPFS',
    };
  }
};

/**
 * Validate IPFS hash format
 */
export const validateIPFSHash = (hash: string): boolean => {
  // CIDv0 starts with "Qm" and is 46 characters
  // CIDv1 starts with "bafy" and varies in length
  const cidv0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  const cidv1Regex = /^bafy[a-z0-9]{50,}$/;
  
  return cidv0Regex.test(hash) || cidv1Regex.test(hash);
};

/**
 * Get IPFS gateway URL
 */
export const getIPFSUrl = (hash: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

/**
 * Test Pinata connection
 */
export const testPinataConnection = async (): Promise<boolean> => {
  try {
    await pinata.testAuthentication();
    return true;
  } catch (error) {
    console.error('Pinata authentication failed:', error);
    return false;
  }
};
