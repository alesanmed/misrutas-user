import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { Transport } from '@nestjs/microservices';
import './config';
import { AppModule } from './app.module';
import NatsConfig from './config/nats';
import { TimeoutInterceptor } from './interceptors/TimeoutInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      ...NatsConfig
    }
  });
  app.use(helmet());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.startAllMicroservicesAsync();
  await app.listen(3010);
}
bootstrap();
