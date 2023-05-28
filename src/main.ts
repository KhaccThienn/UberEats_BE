/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);

  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });
  // app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets('./src/public');
  const config = new DocumentBuilder()
    .setTitle('UberEats example')
    .setDescription('All API Of UberEats Project')
    .setVersion('1.0')
    .addTag('UberEats Documentation')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
}
bootstrap();
