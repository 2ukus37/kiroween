import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.code === 'storage/unauthorized') {
    return res.status(403).json({ error: 'Unauthorized upload' });
  }

  if (err.code === 'IPFS_TIMEOUT') {
    return res.status(504).json({ error: 'IPFS upload timeout' });
  }

  if (err.message?.includes('revert')) {
    return res.status(400).json({ 
      error: 'Blockchain transaction failed', 
      details: err.message 
    });
  }

  if (err.code === 'INSUFFICIENT_FUNDS') {
    return res.status(400).json({ error: 'Insufficient MATIC for gas fees' });
  }

  if (err.code === 'NETWORK_ERROR') {
    return res.status(503).json({ error: 'Network connection failed. Please try again.' });
  }

  // Generic error response
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
