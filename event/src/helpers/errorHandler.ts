import { Response } from 'express';

export const handleError = (error: unknown, res: Response, customMessage?: string): Response => {
  if (error instanceof Error) {
    const message = customMessage || error.message;
    return res.status(500).json({ error: message });
  }
  return res.status(500).json({ error: 'An unknown error occurred' });
};
