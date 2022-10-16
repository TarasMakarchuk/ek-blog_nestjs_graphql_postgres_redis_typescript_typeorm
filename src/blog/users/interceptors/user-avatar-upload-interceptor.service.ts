import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class UserAvatarUploadInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => {
      const { items } = data;
      const url = `http://${process.env.TYPEORM_HOST}:${process.env.PORT}/uploads/images`;
      items.forEach(item => {
        if (item.userAvatar) {
          item.userAvatar = `${url}/${item.userAvatar}`;
        }
      })
      return data;
    }));
  };
}
