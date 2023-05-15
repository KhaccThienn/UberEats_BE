/* eslint-disable prettier/prettier */
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets('./src/public')
  await app.listen(8000);
}
bootstrap();
