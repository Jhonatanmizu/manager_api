import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimingConnectionInterceptor.name);
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const end = Date.now();
        this.logger.log(`Elapsed time: ${end - start}ms`);
      }),
    );
  }
}
