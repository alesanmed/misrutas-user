import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  findOne(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  findById(userId: number): Promise<User> {
    return this.userRepository.findOne({ id: userId });
  }
}