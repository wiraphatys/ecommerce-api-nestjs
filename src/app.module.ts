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
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule, 
    DatabaseModule, 
    AuthModule,
    JwtModule,
    UsersModule, 
    ProductsModule, 
    OrdersModule, 
    CategoriesModule,
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
          // users
          { path: "users/address", method: RequestMethod.POST },
          { path: "users/me", method: RequestMethod.GET },
          { path: "users/:id", method: RequestMethod.PATCH },
          { path: "users/:id", method: RequestMethod.DELETE },
          { path: "users/address/:id", method: RequestMethod.PATCH },
          { path: "users/address/:id", method: RequestMethod.DELETE }
        )
        .apply(Authenticated, AuthorizeAdmin)
        .forRoutes(
          // users
          { path: "users", method: RequestMethod.GET },

          // products
          { path: "products", method: RequestMethod.POST },
          { path: "products/:id", method: RequestMethod.PATCH },
          { path: "products/:id", method: RequestMethod.DELETE },

          // categories
          { path: "categories", method: RequestMethod.POST },
          { path: "categories/:id", method: RequestMethod.PATCH },
        )
  }
}