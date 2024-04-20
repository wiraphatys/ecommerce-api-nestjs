import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class Authorize implements NestMiddleware {
    constructor(private roles: number[]) { }

    use(req: Request, res: Response, next: NextFunction) {
        if (!this.roles.includes(req['user'].role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req['user'].role} is not authorized to access this route`
            });
        }
        next();
    }
}