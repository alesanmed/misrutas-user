import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Observable } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";

export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USER_SERVICE')
    private readonly client: ClientProxy
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    return this.client.send(
      { role: 'auth', cmd: 'check' },
      { jwt: req.headers['authorization']?.split(' ')[1]})
      .toPromise<boolean>();
  }
}