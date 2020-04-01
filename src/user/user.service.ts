import { Injectable } from '@nestjs/common';
import { Repository, InsertResult, FindConditions } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  findOne(query: FindConditions<User>): Promise<User> {
    return this.userRepository.findOne(query);
  }

  findById(userId: number): Promise<User> {
    return this.userRepository.findOne({ id: userId });
  }

  async create(user: User): Promise<InsertResult> {
    const userEntity = this.userRepository.create(user);

    const res = await this.userRepository.insert(userEntity);

    return res;
  }

  async usernameExists(username: string): Promise<boolean> {
    const user = await this.findOne({ username });

    return !!user;
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.findOne({ email });

    return !!user;
  }
}