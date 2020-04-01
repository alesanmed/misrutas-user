import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException, Logger } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    Logger.log(`URL called: ${context.switchToHttp().getRequest().method} ${context.switchToHttp().getRequest().originalUrl}`);
    return next.handle().pipe(
      timeout(50000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
    );
  };
};