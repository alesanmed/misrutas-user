import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { NATSConfigService } from 'src/config/NATSConfigService';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, NATSConfigService, {
    provide: 'USER_CLIENT',
    useFactory: (natsConfigService: NATSConfigService) => ({
      ...natsConfigService.getNATSConfig
    }),
    inject: [NATSConfigService]
  }],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}