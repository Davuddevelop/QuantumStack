import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import logger from '../utils/logger';

export const validate = (schema: ZodObject<any>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Validation error: %o', error.issues);
        return res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return next(error);
    }
  };
