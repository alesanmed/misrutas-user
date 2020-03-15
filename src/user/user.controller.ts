import { Controller, Get, Param, Inject, UseGuards } from "@nestjs/common";
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
    return this.userService.findOne(data.username);
  }

  @UseGuards(AuthGuard)
  @Get('users/:username')
  getUserAPI(@Param('username') username: string): Promise<User> {
    return this.client.send({ role: 'user', cmd: 'get'}, { username }).toPromise<User>();
  }
}