import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const UPLOADS_DIR = path.join(__dirname, '../../uploads/videos');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface LocalStorageResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Save video file to local storage
 */
export const saveVideoLocally = async (
  buffer: Buffer,
  filename: string,
  userId: string
): Promise<LocalStorageResult> => {
  try {
    // Create user directory if it doesn't exist
    const userDir = path.join(UPLOADS_DIR, userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(userDir, filename);
    fs.writeFileSync(filePath, buffer);

    // Generate URL (will be served by Express static middleware)
    const url = `/uploads/videos/${userId}/${filename}`;

    return {
      success: true,
      url,
      path: filePath,
    };
  } catch (error: any) {
    console.error('Local storage error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete video file from local storage
 */
export const deleteVideoLocally = async (filePath: string): Promise<boolean> => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get video file stats
 */
export const getVideoStats = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      return fs.statSync(filePath);
    }
    return null;
  } catch (error) {
    console.error('Error getting file stats:', error);
    return null;
  }
};
