import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      Logger.log(`${context.switchToHttp().getRequest().method} - ${context.switchToHttp().getRequest().originalUrl}`);

      return next.handle().pipe(
        tap(() => {
          Logger.log(context.switchToHttp().getResponse().statusCode);
        }),
      );
    }
  };
};