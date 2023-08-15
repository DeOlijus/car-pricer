import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // If you want to run something before a request is handled by the request handler
    // Put it here...

    return handler.handle().pipe(
      map((data: any) => {
        // If you want to run something before the response is sent out.
        // Put it here...
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
