import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiBearerAuth, DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Transport } from '@nestjs/microservices'
import { checkAuth } from "./middlewares/checkAuth.middleware";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE, PATCH',
  });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  /**
   * @description this middleware is responsible for authorization and verification of tokens
   */
  app.use(checkAuth);
  /**
   * @description swagger creation
   */
  const options = new DocumentBuilder()
    .setTitle('pay dhfi API V1')
    .setDescription('pay dhfi project api')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, 'Bearer')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);
  await app.listen(3001);
}
bootstrap();
