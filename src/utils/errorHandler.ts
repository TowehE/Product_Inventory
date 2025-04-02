import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// Create logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  defaultMeta: { service: 'api-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.message}`, {
    method: req.method,
    url: req.url,
    body: req.body,
    error: err.stack
  });
  
  res.status(500).json({
    error: 'Internal Server Error'
  });
};