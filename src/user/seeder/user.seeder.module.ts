import { Module, Logger } from '@nestjs/common';
import { UserSeederService } from './user.seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Seeder } from './user.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeederService, Logger, Seeder],
  exports: [UserSeederService]
})
export class UserSeederModule {}