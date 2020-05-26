import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { TimeoutInterceptor } from './interceptors/TimeoutInterceptor';
import { NATSConfigService } from './config/NATSConfigService';
import { LoggingInterceptor } from './interceptors/LoggingInterceptor';
import { AllExceptionsFilter } from './filters/ExceptionsFilter';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const natsConfigService : NATSConfigService = app.get(NATSConfigService);
  const configService : ConfigService = app.get<ConfigService>(ConfigService);

  app.use(helmet());
  app.useGlobalInterceptors(new TimeoutInterceptor(), new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter);

  app.connectMicroservice({
    ...natsConfigService.getNATSConfig
  });
  app.startAllMicroservicesAsync();
  await app.listen(configService.get<number>('PORT') || 3000, () => Logger.log('Microservice running'));
}
bootstrap();
