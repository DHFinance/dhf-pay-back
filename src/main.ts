import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // const app = await NestFactory.createMicroservice(AppModule, {
  //   cors: true,
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://localhost:5672'],
  //     queue: 'cats_queue',
  //     queueOptions: {
  //       durable: false
  //     },
  //   },
  // });
  app.setGlobalPrefix('api');
  await app.listen(3001);
}
bootstrap();
