import { Controller, Get, Param, Inject, UseGuards, NotFoundException, Post, Logger, Body, Head, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';
import { User } from './user.entity';
import { AuthGuard } from '../guards/AuthGuard';
import Errors from '../errors';

@Controller()
export class UserController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly client: ClientProxy,
    private readonly userService: UserService
  ) {}

  @MessagePattern({ role: 'user', cmd: 'exists' })
  async userExists(data: any): Promise<boolean> {
    return this.userService.usernameExists(data.username);
  }

  @Head('users/:username')
  async userExistsAPI(@Param('username') username: string): Promise<any> {
    const exists = await this.client.send({ role: 'user', cmd: 'exists'}, { username }).toPromise<boolean>();

    if(!exists) {
      throw new NotFoundException();
    }
  }

  @MessagePattern({ role: 'user', cmd: 'get' })
  getUser(data: any): Promise<User> {
    if(data.username) {
      return this.userService.findOne({ username: data.username });
    } else if(data.userId) {
      return this.userService.findById(data.userId);
    }

    return Promise.resolve(null);
  }

  @UseGuards(AuthGuard)
  @Get('users/:id') 
  async getUserAPI(@Param('id') userId: string): Promise<any> {
    const user = await this.client.send({ role: 'user', cmd: 'get'}, { userId }).toPromise<User>();

    if(!user) {
      throw new NotFoundException('User not found');
    }

    delete user.password;

    return { user };
  }

  @MessagePattern({ role: 'user', cmd: 'insert' })
  async createUser(data: any): Promise<any> {
    try {
      let hasErrors = false;

      const emailPattern = /(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gm;
      const userClean= {} as User;
      const user = {...data.user };

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

      const usernameExists = await this.userService.usernameExists(user.username.value);

      if(usernameExists) {
        hasErrors = true;
        user.username.errors.push('El nombre de usuario ya existe');
      }

      if(!user.username.value.length) {
        hasErrors = true;
        user.username.errors.push('El nombre de usuario no es válido');
      }

      const emailExists = await this.userService.emailExists(user.email.value);

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

      const newUser = await this.userService.create(userClean);

      Logger.log('createUser - Created user');

      return {
        success: true,
        data: newUser
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

  @Post('users')
  async creteUserAPI(@Body() user: any): Promise<any> {
    const result = await this.client.send({ role: 'user', cmd: 'insert'}, user).toPromise<any>();

    if(!result.success) {
      throw new UnprocessableEntityException({ code: result.error, data: result.data });
    } else {
      return result.data;
    }
  }
}