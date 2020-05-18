import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions } from 'typeorm';
import { User } from './user.entity';
import Errors from '../errors';

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

  async usernameExists(username: string): Promise<boolean> {
    const user = await this.findOne({ username });

    return !!user;
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.findOne({ email });

    return !!user;
  }

  async createUser(user: any): Promise<any> {
    try {
      let hasErrors = false;

      const emailPattern = /(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gm;
      const userClean= {} as User;

      if(!user.username) {
        user.username = {
          value: '',
          errors: [],
        };
      }

      if(!user.name) {
        user.name = {
          value: '',
          errors: [],
        };
      }

      if(!user.email) {
        user.email = {
          value: '',
          errors: [],
        };
      }

      if(!user.password) {
        user.password = {
          value: '',
          errors: [],
        };
      }

      const usernameExists = await this.usernameExists(user.username.value);

      if(usernameExists) {
        hasErrors = true;
        user.username.errors.push('El nombre de usuario ya existe');
      }

      if(!user.username.value.length) {
        hasErrors = true;
        user.username.errors.push('El nombre de usuario no es válido');
      }

      const emailExists = await this.emailExists(user.email.value);

      if(emailExists) {
        hasErrors = true;
        user.email.errors.push('El email ya existe');
      }

      if(!user.email.value.length || !emailPattern.test(user.email.value)) {
        hasErrors = true;
        user.email.errors.push('El email no es válido');
      }

      if(user.password.value.length < 8) {
        hasErrors = true;
        user.password.errors.push('La longitud mínima de contraseña son 8 caracteres');
      }

      Object.keys(user).forEach(key => {
        userClean[key] = user[key].value;
      });

      if(hasErrors) {
        Logger.error('createUser - User has errors');
        return {
          success: false,
          error: Errors.USER_WITH_ERRORS,
          data: user,
        };
      }

      const userEntity = this.userRepository.create(userClean);

      const res = await this.userRepository.insert(userEntity);

      Logger.log('createUser - Created user');

      return {
        success: true,
        data: res
      };
    } catch(e) {
      Logger.log(e);
      return {
        success: false,
        error: Errors.GENERIC_ERROR,
        data: e.code,
      };
    }
  }
}