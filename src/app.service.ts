import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthcheck(): Object {
    return {
      server: "ecommerce-api-nestjs",
      version: "1.0.0",
    }
  }
}
