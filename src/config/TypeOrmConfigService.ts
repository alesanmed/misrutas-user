import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory{
  constructor(private configService: ConfigService) { }
  
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('POSTGRES_DB_HOST') || '',
      port: this.configService.get<number>('POSTGRES_DB_PORT') || 1,
      username: this.configService.get<string>('POSTGRES_USERNAME') || '',
      password: this.configService.get<string>('POSTGRES_PASSWORD') || '',
      database: this.configService.get<string>('POSTGRES_DATABASE') || '',
      synchronize: true,
      entities: [User]
    };
  };
}
