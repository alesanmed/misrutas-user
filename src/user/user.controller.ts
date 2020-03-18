import { Controller, Get, Param, Inject, UseGuards, NotFoundException } from "@nestjs/common";
import { UserService } from "./user.service";
import { MessagePattern, ClientProxy } from "@nestjs/microservices";
import { User } from "./user.entity";
import { AuthGuard } from "../guards/AuthGuard";

@Controller()
export class UserController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly client: ClientProxy,
    private readonly userService: UserService
  ) {}

  @MessagePattern({ role: 'user', cmd: 'get' })
  getUser(data: any): Promise<User> {
    if(data.username) {
      return this.userService.findOne(data.username);
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
}