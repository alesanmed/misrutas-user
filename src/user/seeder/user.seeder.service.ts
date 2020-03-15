import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { users } from './user.data';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async seed(): Promise<Array<User>> {
    await this.userRepository.clear();
    const userEntities = this.userRepository.create(users);

    return this.userRepository.save(userEntities);
  }
}