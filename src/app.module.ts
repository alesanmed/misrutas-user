import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserSeederModule } from './user/seeder/user.seeder.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './config/TypeOrmConfigService';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
  TypeOrmModule.forRootAsync({
    useClass: TypeOrmConfigService,
  }), UserModule, UserSeederModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
