import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // middleware
  app.use(cookieParser());
  app.use(helmet());

  // listen on port 3000 and set global prefix
  app.setGlobalPrefix("api/v1");
  await app.listen(3000);
}
bootstrap();
