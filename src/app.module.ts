import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { Authenticated } from './middleware/authenticated';
import { APP_PIPE } from '@nestjs/core';
import { Authorize } from './middleware/authorize';

@Module({
  imports: [DatabaseModule, UsersModule, ProductsModule, OrdersModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    Authenticated,
    Authorize,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(Authenticated)
        .forRoutes(
          // enter the route that we want to apply middleware on
        )
        .apply(Authenticated, () => new Authorize([1]))           // authorize: admin
        .forRoutes(
          // enter the route that we want to apply middleware on
        )
  }
}