import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONFIG } from 'src/config/transport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([{
      name: 'USER_SERVICE',
      transport: Transport.NATS,
      options: {
        ...CONFIG.NATS
      }
    }])
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}