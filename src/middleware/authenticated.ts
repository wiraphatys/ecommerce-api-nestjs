import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Authenticated implements NestMiddleware {
    constructor(private jwtService: JwtService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies['access_token'];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const decoded = this.jwtService.verify(token);
            req['user'] = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
}