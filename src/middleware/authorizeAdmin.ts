import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthorizeAdmin implements NestMiddleware {
    constructor() { }

    use(req: Request, res: Response, next: NextFunction) {
        if (req['user'].role !== 1) {
            return res.status(403).json({
                success: false,
                message: `User role ${req['user'].role} is not authorized to access this route`
            });
        }
        next();
    }
}