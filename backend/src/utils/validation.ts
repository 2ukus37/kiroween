/**
 * Validation utilities for video uploads and metadata
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate video duration is between 6 and 60 seconds
 */
export const validateVideoDuration = (duration: number): ValidationResult => {
  if (duration < 6) {
    return { valid: false, error: 'Video must be at least 6 seconds long' };
  }
  if (duration > 60) {
    return { valid: false, error: 'Video must be no longer than 60 seconds' };
  }
  return { valid: true };
};

/**
 * Validate video title
 */
export const validateTitle = (title: string): ValidationResult => {
  const trimmed = title.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }
  
  if (trimmed.length > 100) {
    return { valid: false, error: 'Title must be 100 characters or less' };
  }
  
  return { valid: true };
};

/**
 * Validate video description
 */
export const validateDescription = (description: string): ValidationResult => {
  if (description.length > 500) {
    return { valid: false, error: 'Description must be 500 characters or less' };
  }
  
  return { valid: true };
};

/**
 * Validate file type
 */
export const validateFileType = (mimetype: string): ValidationResult => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  
  if (!allowedTypes.includes(mimetype)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Allowed types: MP4, WebM, MOV' 
    };
  }
  
  return { valid: true };
};

/**
 * Validate file size (max 100MB)
 */
export const validateFileSize = (size: number): ValidationResult => {
  const maxSize = 100 * 1024 * 1024; // 100MB in bytes
  
  if (size > maxSize) {
    return { 
      valid: false, 
      error: 'File size must be less than 100MB' 
    };
  }
  
  return { valid: true };
};

/**
 * Validate wallet address format
 */
export const validateWalletAddress = (address: string): ValidationResult => {
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  
  if (!ethereumAddressRegex.test(address)) {
    return { valid: false, error: 'Invalid wallet address format' };
  }
  
  return { valid: true };
};

/**
 * Validate all video upload data
 */
export interface VideoUploadData {
  title: string;
  description: string;
  duration: number;
  fileSize: number;
  mimetype: string;
  walletAddress: string;
}

export const validateVideoUpload = (data: VideoUploadData): ValidationResult => {
  const titleValidation = validateTitle(data.title);
  if (!titleValidation.valid) return titleValidation;
  
  const descriptionValidation = validateDescription(data.description);
  if (!descriptionValidation.valid) return descriptionValidation;
  
  const durationValidation = validateVideoDuration(data.duration);
  if (!durationValidation.valid) return durationValidation;
  
  const fileSizeValidation = validateFileSize(data.fileSize);
  if (!fileSizeValidation.valid) return fileSizeValidation;
  
  const fileTypeValidation = validateFileType(data.mimetype);
  if (!fileTypeValidation.valid) return fileTypeValidation;
  
  const walletValidation = validateWalletAddress(data.walletAddress);
  if (!walletValidation.valid) return walletValidation;
  
  return { valid: true };
};
