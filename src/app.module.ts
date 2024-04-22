import { MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { Authenticated } from './middleware/authenticated';
import { APP_PIPE } from '@nestjs/core';
import { AuthorizeAdmin } from './middleware/authorizeAdmin';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule, ProductsModule, OrdersModule, AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE
      }
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Authenticated,
    AuthorizeAdmin,
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
          { path: "users/address", method: RequestMethod.POST },
          { path: "users/me", method: RequestMethod.GET }
        )
        .apply(Authenticated, AuthorizeAdmin)
        .forRoutes(
          // enter the route that we want to apply middleware on
          { path: "users", method: RequestMethod.GET }
        )
  }
}