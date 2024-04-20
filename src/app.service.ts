import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthcheck(): Object {
    return {
      server: "nest-prisma",
      version: "1.0.0",
    }
  }
}
