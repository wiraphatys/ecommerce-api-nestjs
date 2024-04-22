import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class Authenticated implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private databaseService: DatabaseService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies['access_token'];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized' 
            });
        }

        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.databaseService.user.findUnique({
                where: {
                    id: decoded.id
                },
            })
            delete user.password;

            // set user data into req
            req['user'] = user;

            // logger
            const date = new Date()
            console.log(date.toLocaleDateString(), date.toLocaleTimeString(), { id: user.id, email: user.email })

            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
    }
}