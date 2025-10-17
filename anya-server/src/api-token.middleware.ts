import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import "reflect-metadata";
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ApiTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.header('X-API-KEY');

    if (!token || token !== process.env.API_TOKEN) {
      throw new UnauthorizedException('Invalid API Token');
    }

    next();
  }
}