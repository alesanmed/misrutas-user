import { Controller, Get, Param, Inject, 
        UseGuards, NotFoundException, Post,
        Body, Head, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';
import { User } from './user.entity';
import { AuthGuard } from '../guards/AuthGuard';

@Controller()
export class UserController {
  constructor(
    @Inject('USER_CLIENT')
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
    return this.userService.createUser(data.user);
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